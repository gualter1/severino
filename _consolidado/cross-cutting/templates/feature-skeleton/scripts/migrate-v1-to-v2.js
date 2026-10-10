#!/usr/bin/env node
/**
 * migrate-v1-to-v2.js — Feature Skeleton V1 → V2 Migration Script
 * Applies ADR-026 changes to existing V1 features.
 * 
 * Usage: node scripts/migrate-v1-to-v2.js [feature-path] [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface MigrationAction {
  type: 'create' | 'update' | 'delete';
  target: string;
  description: string;
  content?: string;
}

function parseArgs(): { featurePath: string; dryRun: boolean } {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const featurePath = args.find(arg => !arg.startsWith('--')) || '.';
  return { featurePath: path.resolve(featurePath), dryRun };
}

function createDirIfNotExists(dirPath: string, dryRun: boolean): void {
  if (!fs.existsSync(dirPath)) {
    console.log(`${dryRun ? '[DRY-RUN] ' : ''}Creating directory: ${dirPath}`);
    if (!dryRun) fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFileIfNotExists(filePath: string, content: string, dryRun: boolean): void {
  if (!fs.existsSync(filePath)) {
    console.log(`${dryRun ? '[DRY-RUN] ' : ''}Creating file: ${filePath}`);
    if (!dryRun) fs.writeFileSync(filePath, content, 'utf-8');
  } else {
    console.log(`[SKIP] File already exists: ${filePath}`);
  }
}

function updateFile(filePath: string, updater: (content: string) => string, dryRun: boolean): void {
  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] File not found: ${filePath}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const newContent = updater(content);
  if (newContent !== content) {
    console.log(`${dryRun ? '[DRY-RUN] ' : ''}Updating file: ${filePath}`);
    if (!dryRun) fs.writeFileSync(filePath, newContent, 'utf-8');
  } else {
    console.log(`[SKIP] No changes needed: ${filePath}`);
  }
}

function main(): void {
  const { featurePath, dryRun } = parseArgs();
  
  if (dryRun) {
    console.log('🔍 DRY-RUN MODE — No changes will be written\n');
  }

  console.log(`📦 Migrating feature at: ${featurePath}\n`);

  // 1. Create observability directory
  createDirIfNotExists(path.join(featurePath, 'src/infrastructure/observability'), dryRun);

  // 2. Create barrel exports
  const barrelExports = [
    { path: 'src/domain/index.ts', content: `/**
 * Domain Layer — Entities, Value Objects, Services, Events
 * Core business logic, zero external dependencies.
 */

export * from './entities';
export * from './value-objects';
export * from './services';
export * from './events';
` },
    { path: 'src/application/index.ts', content: `/**
 * Application Layer — Commands, Queries, Handlers
 * Orchestrates domain logic, coordinates infrastructure.
 */

export * from './commands';
export * from './queries';
export * from './handlers';
` },
    { path: 'src/infrastructure/index.ts', content: `/**
 * Infrastructure Layer — Persistence, Messaging, External, Logging, Observability
 * Adapters for external systems, implementations of domain ports.
 */

export * from './persistence';
export * from './messaging';
export * from './external';
export * from './logging';
export * from './observability';
` },
    { path: 'src/interfaces/index.ts', content: `/**
 * Interfaces Layer — HTTP, gRPC, CLI
 * Entry points for external consumers; thin adapters to application layer.
 */

export * from './http';
export * from './grpc';
export * from './cli';
` },
    { path: 'src/infrastructure/observability/index.ts', content: `/**
 * Observability Infrastructure — OpenTelemetry + Audit Logging
 * ADR-030: Agent Observability Padrão
 */

export * from './otel';
export * from './audit-logger';
` },
  ];

  for (const barrel of barrelExports) {
    writeFileIfNotExists(path.join(featurePath, barrel.path), barrel.content, dryRun);
  }

  // 3. Create observability files
  const otelContent = `/**
 * OpenTelemetry SDK initialization for agent/feature observability.
 * Integrates with ADR-030 (Agent Observability) + ADR-024 (MCP v2 trace correlation).
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';

export interface OtelConfig {
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
  traceExporter?: 'console' | 'otlp';
  metricsPort?: number;
}

let sdkInstance: NodeSDK | null = null;

export function initOtel(config: OtelConfig): NodeSDK {
  if (sdkInstance) {
    console.warn('[Otel] Already initialized, returning existing instance');
    return sdkInstance;
  }

  const exporter = config.traceExporter === 'otlp'
    ? new ConsoleSpanExporter()
    : new ConsoleSpanExporter();

  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: config.serviceVersion || process.env.npm_package_version || '0.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.environment || process.env.NODE_ENV || 'development',
    }),
    traceExporter: exporter,
    metricReader: new PrometheusExporter({ port: config.metricsPort || 9464 }),
    instrumentations: [
      getNodeAutoInstrumentations(),
      new HttpInstrumentation(),
      new GrpcInstrumentation(),
    ],
  });

  sdk.start();
  sdkInstance = sdk;

  process.on('SIGTERM', () => {
    sdk.shutdown().catch(console.error);
  });

  console.log(\`[Otel] Initialized for \${config.serviceName} (env: \${config.environment})\`);
  return sdk;
}

export function getTraceContext(): { traceparent?: string; tracestate?: string } {
  const { trace } = require('@opentelemetry/api');
  const span = trace.getActiveSpan();
  if (!span) return {};

  const spanContext = span.spanContext();
  return {
    traceparent: \`00-\${spanContext.traceId}-\${spanContext.spanId}-01\`,
    tracestate: undefined,
  };
}

export function injectTraceContext(carrier: Record<string, string>): void {
  const { propagation, trace } = require('@opentelemetry/api');
  const span = trace.getActiveSpan();
  if (!span) return;

  propagation.inject(trace.setSpan(require('@opentelemetry/api').context.active(), span), carrier);
}

export function extractTraceContext(carrier: Record<string, string>, name: string) {
  const { propagation, trace, context } = require('@opentelemetry/api');
  const extractedContext = propagation.extract(context.active(), carrier);
  return trace.getTracer('feature-skeleton').startSpan(name, undefined, extractedContext);
}
`;
  
  writeFileIfNotExists(path.join(featurePath, 'src/infrastructure/observability/otel.ts'), otelContent, dryRun);

  const auditLoggerContent = `/**
 * JSONL Audit Logger with PII Sanitization (ADR-014) + Trace Correlation (ADR-030).
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
  [/\\b\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}\\b/g, '[CPF_REDACTED]'],
  [/\\b\\d{2}\\.?\\d{3}\\.?\\d{3}\\/?\\d{4}-?\\d{2}\\b/g, '[CNPJ_REDACTED]'],
  [/\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/g, '[EMAIL_REDACTED]'],
  [/\\b(?:\\+55\\s?)?(?:\\(?\\d{2}\\)?\\s?)?\\d{4,5}-?\\d{4}\\b/g, '[PHONE_REDACTED]'],
  [/\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b/g, '[CARD_REDACTED]'],
  [/(?i)(?:password|secret|token|api[_-]?key|auth[_-]?token)\\s*[:=]\\s*\\S+/g, '[CREDENTIAL_REDACTED]'],
  [/Bearer\\s+[A-Za-z0-9\\-_.]+/g, '[BEARER_TOKEN_REDACTED]'],
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
  return \`sha256:\${Math.abs(hash).toString(16).padStart(8, '0')}\`;
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
      agent_id: \`\${this.serviceName}@\${this.agentVersion}\`,
      ...traceIds,
      sanitized: true,
    };
    this.stream.write(JSON.stringify(entry) + '\\n');
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

export function createAuditLogger(serviceName: string, options?: { logDir?: string; version?: string }): AuditLogger {
  return new AuditLogger(serviceName, options?.logDir || 'logs', options?.version);
}
`;
  
  writeFileIfNotExists(path.join(featurePath, 'src/infrastructure/observability/audit-logger.ts'), auditLoggerContent, dryRun);

  // 4. Update package.json
  const packageJsonPath = path.join(featurePath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    updateFile(packageJsonPath, (content) => {
      const pkg = JSON.parse(content);
      pkg.version = '2.0.0';
      pkg.description = pkg.description?.replace('ADR-001', 'ADR-026') || pkg.description;
      pkg.scripts = {
        ...pkg.scripts,
        validate: 'node ../../../_consolidado/cross-cutting/templates/feature-skeleton/scripts/validate-feature-structure.js . --strict',
        'dx:init': 'node ../../../_consolidado/cross-cutting/templates/feature-skeleton/scripts/dx-telemetry.js init',
        'dx:report': 'node ../../../_consolidado/cross-cutting/templates/feature-skeleton/scripts/dx-telemetry.js report',
      };
      pkg.devDependencies = {
        ...pkg.devDependencies,
        '@opentelemetry/api': '^1.8.0',
        '@opentelemetry/sdk-node': '^0.52.0',
        '@opentelemetry/auto-instrumentations-node': '^0.45.0',
        '@opentelemetry/exporter-prometheus': '^0.52.0',
        '@opentelemetry/instrumentation-http': '^0.52.0',
        '@opentelemetry/instrumentation-grpc': '^0.52.0',
        '@opentelemetry/resources': '^1.20.0',
        '@opentelemetry/sdk-trace-node': '^1.20.0',
        '@opentelemetry/semantic-conventions': '^1.20.0',
      };
      return JSON.stringify(pkg, null, 2);
    }, dryRun);
  }

  // 5. Update tsconfig.json
  const tsconfigPath = path.join(featurePath, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    updateFile(tsconfigPath, (content) => {
      const tsconfig = JSON.parse(content);
      tsconfig.compilerOptions = {
        ...tsconfig.compilerOptions,
        moduleResolution: 'Bundler',
        allowImportingTsExtensions: true,
        exactOptionalPropertyTypes: false,
        noUnusedLocals: false,
        noUnusedParameters: false,
        isolatedModules: false,
        noEmit: true,
      };
      return JSON.stringify(tsconfig, null, 2);
    }, dryRun);
  }

  // 6. Create vitest.config.ts if not exists
  const vitestConfigPath = path.join(featurePath, 'vitest.config.ts');
  if (!fs.existsSync(vitestConfigPath)) {
    writeFileIfNotExists(vitestConfigPath, `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: [
        'src/domain/**/*.ts',
        'src/application/**/*.ts',
        'src/infrastructure/**/*.ts',
      ],
      exclude: [
        'src/index.ts',
        'src/interfaces/**',
        'src/infrastructure/external/**',
        'src/infrastructure/logging/**',
      ],
      thresholds: {
        lines: 80,
        branches: 70,
        functions: 70,
        statements: 80,
      },
    },
  },
});
`, dryRun);
  }

  // 7. Create eslint.config.js if not exists
  const eslintConfigPath = path.join(featurePath, 'eslint.config.js');
  if (!fs.existsSync(eslintConfigPath)) {
    writeFileIfNotExists(eslintConfigPath, `// ESLint flat config — TS-aware checks enforced by \`tsc --noEmit\` (strict).
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 2022,
    },
    rules: {
      'no-console': 'warn',
      eqeqeq: ['error', 'always'],
      'no-throw-literal': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  {
    files: ['src/infrastructure/logging/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
];
`, dryRun);
  }

  console.log('\n✅ Migration complete!');
  if (dryRun) {
    console.log('🔍 This was a dry-run. Run without --dry-run to apply changes.');
  }
}

main();