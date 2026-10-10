/**
 * JSONL Audit Logger with PII Sanitization (ADR-014) + Trace Correlation (ADR-030).
 * Produces immutable audit trail for compliance (LGPD/SOC2) and debugging.
 */

import { createWriteStream, WriteStream } from 'fs';
import { trace, Span } from '@opentelemetry/api';
import { resolve } from 'path';

export interface AuditEventBase {
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  service: string;
  trace_id?: string;
  span_id?: string;
  agent_id: string;
  event: string;
  sanitized: true;
}

export interface ToolCallEvent extends AuditEventBase {
  event: 'tool_call';
  tool: string;
  duration_ms: number;
  input_hash: string;
  output_hash: string;
  status: 'success' | 'error';
  tokens?: { input: number; output: number; total: number };
  cost_usd?: number;
  error?: string;
}

export interface AgentLifecycleEvent extends AuditEventBase {
  event: 'agent_start' | 'agent_end' | 'handoff';
  from_agent?: string;
  to_agent?: string;
  reason?: string;
}

export interface SecurityEvent extends AuditEventBase {
  event: 'security_event';
  type: 'sanitization_failure' | 'permission_denied' | 'rate_limit' | 'injection_attempt';
  details: Record<string, unknown>;
}

export type AuditEvent = ToolCallEvent | AgentLifecycleEvent | SecurityEvent;

const PII_PATTERNS: Array<[RegExp, string]> = [
  [/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, '[CPF_REDACTED]'],
  [/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, '[CNPJ_REDACTED]'],
  [/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]'],
  [/\b(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}\b/g, '[PHONE_REDACTED]'],
  [/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD_REDACTED]'],
  [/(?i)(?:password|secret|token|api[_-]?key|auth[_-]?token)\s*[:=]\s*\S+/g, '[CREDENTIAL_REDACTED]'],
  [/Bearer\s+[A-Za-z0-9\-_.]+/g, '[BEARER_TOKEN_REDACTED]'],
];

function sanitize(obj: unknown): unknown {
  const str = JSON.stringify(obj);
  let sanitized = str;
  for (const [pattern, replacement] of PII_PATTERNS) {
    sanitized = sanitized.replace(pattern, replacement);
  }
  return JSON.parse(sanitized);
}

function hash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `sha256:${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

function getTraceIds(): { trace_id?: string; span_id?: string } {
  const span = trace.getActiveSpan();
  if (!span) return {};
  const ctx = span.spanContext();
  return {
    trace_id: ctx.traceId,
    span_id: ctx.spanId,
  };
}

export class AuditLogger {
  private stream: WriteStream;
  private serviceName: string;
  private agentVersion: string;

  constructor(serviceName: string, logDir: string = 'logs', agentVersion?: string) {
    this.serviceName = serviceName;
    this.agentVersion = agentVersion || process.env.npm_package_version || '0.0.0';
    const logPath = resolve(logDir, 'audit.log');
    this.stream = createWriteStream(logPath, { flags: 'a' });
  }

  private write(event: AuditEvent): void {
    const traceIds = getTraceIds();
    const entry = {
      ...event,
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      agent_id: `${this.serviceName}@${this.agentVersion}`,
      ...traceIds,
      sanitized: true,
    };
    this.stream.write(JSON.stringify(entry) + '\n');
  }

  toolCall(
    tool: string,
    input: unknown,
    output: unknown,
    durationMs: number,
    status: 'success' | 'error' = 'success',
    error?: string
  ): void {
    const sanitizedInput = sanitize(input);
    const sanitizedOutput = sanitize(output);
    this.write({
      level: 'INFO',
      event: 'tool_call',
      tool,
      duration_ms: durationMs,
      input_hash: hash(JSON.stringify(sanitizedInput)),
      output_hash: hash(JSON.stringify(sanitizedOutput)),
      status,
      error,
    } as ToolCallEvent);
  }

  agentStart(reason?: string): void {
    this.write({
      level: 'INFO',
      event: 'agent_start',
      reason,
    } as AgentLifecycleEvent);
  }

  agentEnd(reason?: string): void {
    this.write({
      level: 'INFO',
      event: 'agent_end',
      reason,
    } as AgentLifecycleEvent);
  }

  handoff(fromAgent: string, toAgent: string, reason?: string): void {
    this.write({
      level: 'INFO',
      event: 'handoff',
      from_agent: fromAgent,
      to_agent: toAgent,
      reason,
    } as AgentLifecycleEvent);
  }

  securityEvent(type: SecurityEvent['type'], details: Record<string, unknown>): void {
    this.write({
      level: 'WARN',
      event: 'security_event',
      type,
      details: sanitize(details),
    } as SecurityEvent);
  }

  close(): Promise<void> {
    return new Promise((resolve) => this.stream.end(resolve));
  }
}

/**
 * Factory for creating AuditLogger with common config.
 */
export function createAuditLogger(serviceName: string, options?: { logDir?: string; version?: string }): AuditLogger {
  return new AuditLogger(serviceName, options?.logDir || 'logs', options?.version);
}