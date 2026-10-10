// MCP v2 Core Types — Agent-to-Agent Protocol (ADR-024)
// Zero-dependency core types using Zod for validation

import { z } from 'zod';

// ============================================
// JSON-RPC 2.0 Base Types
// ============================================

export const JSONRPC_VERSION = '2.0' as const;

export const JsonRpcRequestSchema = z.object({
  jsonrpc: z.literal(JSONRPC_VERSION),
  id: z.union([z.string(), z.number(), z.null()]),
  method: z.string(),
  params: z.unknown().optional(),
});

export const JsonRpcResponseSchema = z.object({
  jsonrpc: z.literal(JSONRPC_VERSION),
  id: z.union([z.string(), z.number(), z.null()]),
  result: z.unknown().optional(),
  error: z.object({
    code: z.number(),
    message: z.string(),
    data: z.unknown().optional(),
  }).optional(),
});

export const JsonRpcNotificationSchema = z.object({
  jsonrpc: z.literal(JSONRPC_VERSION),
  method: z.string(),
  params: z.unknown().optional(),
});

export type JsonRpcRequest = z.infer<typeof JsonRpcRequestSchema>;
export type JsonRpcResponse = z.infer<typeof JsonRpcResponseSchema>;
export type JsonRpcNotification = z.infer<typeof JsonRpcNotificationSchema>;
export type JsonRpcMessage = JsonRpcRequest | JsonRpcResponse | JsonRpcNotification;

// ============================================
// Agent Card (Identity & Capabilities)
// ============================================

export const AgentRoleSchema = z.enum(['orchestrator', 'worker', 'specialist', 'gateway']);
export type AgentRole = z.infer<typeof AgentRoleSchema>;

export const AgentPermissionSchema = z.enum([
  'fs:read',
  'fs:write',
  'fs:execute',
  'net:http',
  'net:https',
  'net:websocket',
  'net:grpc',
  'proc:spawn',
  'env:read',
  'env:write',
]);
export type AgentPermission = z.infer<typeof AgentPermissionSchema>;

export const AgentCardSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/), // SemVer
  role: AgentRoleSchema,
  description: z.string().optional(),
  skills: z.array(z.string()).min(1),
  models: z.array(z.string()).optional(),
  permissions: z.array(AgentPermissionSchema).default([]),
  endpoints: z.object({
    websocket: z.string().url().optional(),
    stdio: z.boolean().default(true),
    http: z.string().url().optional(),
  }).optional(),
  metadata: z.record(z.unknown()).optional(),
  traceContext: z.object({
    traceparent: z.string().optional(),
    tracestate: z.string().optional(),
  }).optional(),
});

export type AgentCard = z.infer<typeof AgentCardSchema>;

// ============================================
// Capability Negotiation
// ============================================

export const CapabilitySchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
  inputSchema: z.record(z.unknown()).optional(), // JSON Schema
  outputSchema: z.record(z.unknown()).optional(), // JSON Schema
  permissions: z.array(AgentPermissionSchema).default([]),
  streaming: z.boolean().default(false),
  idempotent: z.boolean().default(false),
  timeoutMs: z.number().positive().default(30000),
  retryPolicy: z.object({
    maxRetries: z.number().int().min(0).default(3),
    backoffMs: z.number().int().positive().default(1000),
    backoffMultiplier: z.number().positive().default(2),
    maxBackoffMs: z.number().positive().default(30000),
  }).optional(),
});

export type Capability = z.infer<typeof CapabilitySchema>;

export const CapabilityNegotiationRequestSchema = z.object({
  agentCard: AgentCardSchema,
  requestedCapabilities: z.array(z.string()).optional(),
});

export const CapabilityNegotiationResponseSchema = z.object({
  accepted: z.boolean(),
  negotiatedCapabilities: z.array(CapabilitySchema).optional(),
  rejectionReason: z.string().optional(),
  protocolVersion: z.string().default('2.0'),
});

export type CapabilityNegotiationRequest = z.infer<typeof CapabilityNegotiationRequestSchema>;
export type CapabilityNegotiationResponse = z.infer<typeof CapabilityNegotiationResponseSchema>;

// ============================================
// Tool Invocation
// ============================================

export const ToolInvocationRequestSchema = z.object({
  method: z.string(),
  params: z.unknown(),
  traceparent: z.string().optional(), // W3C TraceContext
  tracestate: z.string().optional(),
  timeoutMs: z.number().positive().optional(),
  retries: z.number().int().min(0).optional(),
});

export const ToolInvocationResponseSchema = z.object({
  result: z.unknown().optional(),
  error: z.object({
    code: z.number(),
    message: z.string(),
    data: z.unknown().optional(),
    retryable: z.boolean().default(false),
  }).optional(),
  traceparent: z.string().optional(),
  tracestate: z.string().optional(),
});

export type ToolInvocationRequest = z.infer<typeof ToolInvocationRequestSchema>;
export type ToolInvocationResponse = z.infer<typeof ToolInvocationResponseSchema>;

// ============================================
// Streaming
// ============================================

export const StreamChunkSchema = z.object({
  type: z.enum(['data', 'end', 'error']),
  data: z.unknown().optional(),
  error: z.object({
    code: z.number(),
    message: z.string(),
  }).optional(),
  traceparent: z.string().optional(),
  tracestate: z.string().optional(),
});

export type StreamChunk = z.infer<typeof StreamChunkSchema>;

// ============================================
// Audit Log (ADR-030)
// ============================================

export const AuditEventTypeSchema = z.enum([
  'tool_call',
  'tool_result',
  'agent_start',
  'agent_end',
  'handoff',
  'security_event',
  'error',
]);

export const AuditEventSchema = z.object({
  timestamp: z.string().datetime(),
  level: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']),
  service: z.string(),
  trace_id: z.string().optional(),
  span_id: z.string().optional(),
  agent_id: z.string(),
  event: AuditEventTypeSchema,
  sanitized: z.literal(true),

  // Tool call fields
  tool: z.string().optional(),
  duration_ms: z.number().optional(),
  input_hash: z.string().optional(),
  output_hash: z.string().optional(),
  status: z.enum(['success', 'error']).optional(),
  tokens: z.object({
    input: z.number(),
    output: z.number(),
    total: z.number(),
  }).optional(),
  cost_usd: z.number().optional(),
  error: z.string().optional(),

  // Lifecycle fields
  from_agent: z.string().optional(),
  to_agent: z.string().optional(),
  reason: z.string().optional(),

  // Security fields
  security_type: z.enum(['sanitization_failure', 'permission_denied', 'rate_limit', 'injection_attempt']).optional(),
  details: z.record(z.unknown()).optional(),
});

export type AuditEvent = z.infer<typeof AuditEventSchema>;

// ============================================
// MCP Manifest (ADR-025)
// ============================================

export const MCPManifestSchema = z.object({
  schemaVersion: z.literal('2.0'),
  agent: AgentCardSchema,
  capabilities: z.array(CapabilitySchema),
  transports: z.array(z.enum(['websocket', 'stdio', 'http'])).min(1),
  security: z.object({
    mtls: z.boolean().default(false),
    jwtRequired: z.boolean().default(true),
    permissions: z.array(AgentPermissionSchema),
  }).optional(),
  compliance: z.object({
    lgpd: z.boolean().default(false),
    soc2: z.boolean().default(false),
    dataResidency: z.string().optional(),
  }).optional(),
});

export type MCPManifest = z.infer<typeof MCPManifestSchema>;

// ============================================
// Transport Types
// ============================================

export type TransportType = 'websocket' | 'stdio' | 'http';

export const TransportConfigSchema = z.object({
  type: z.enum(['websocket', 'stdio', 'http']),
  websocket: z.object({
    url: z.string().url(),
    protocols: z.array(z.string()).optional(),
    headers: z.record(z.string()).optional(),
    reconnect: z.object({
      enabled: z.boolean().default(true),
      maxAttempts: z.number().int().positive().default(10),
      baseDelayMs: z.number().positive().default(1000),
      maxDelayMs: z.number().positive().default(30000),
    }).optional(),
    tls: z.object({
      ca: z.string().optional(),
      cert: z.string().optional(),
      key: z.string().optional(),
      rejectUnauthorized: z.boolean().default(true),
    }).optional(),
  }).optional(),
  stdio: z.object({
    command: z.string(),
    args: z.array(z.string()).default([]),
    env: z.record(z.string()).optional(),
  }).optional(),
  http: z.object({
    baseUrl: z.string().url(),
    pollingIntervalMs: z.number().positive().default(1000),
    headers: z.record(z.string()).optional(),
    tls: z.object({
      ca: z.string().optional(),
      cert: z.string().optional(),
      key: z.string().optional(),
      rejectUnauthorized: z.boolean().default(true),
    }).optional(),
  }).optional(),
});

export type TransportConfig = z.infer<typeof TransportConfigSchema>;

// ============================================
// Error Codes (MCP v2 Specific)
// ============================================

export const MCPErrorCodes = {
  // JSON-RPC Standard
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,

  // MCP v2 Specific
  CAPABILITY_NOT_FOUND: -32000,
  CAPABILITY_REJECTED: -32001,
  PERMISSION_DENIED: -32002,
  TIMEOUT: -32003,
  RATE_LIMITED: -32004,
  AGENT_UNAVAILABLE: -32005,
  PROTOCOL_VERSION_MISMATCH: -32006,
  TRACE_CONTEXT_INVALID: -32007,
  SANITIZATION_FAILED: -32008,
  HANDOFF_FAILED: -32009,
} as const;

export type MCPErrorCode = typeof MCPErrorCodes[keyof typeof MCPErrorCodes];

// ============================================
// Utility Types
// ============================================

export type AgentId = string & { readonly __brand: unique symbol };
export type CorrelationId = string & { readonly __brand: unique symbol };
export type TraceId = string & { readonly __brand: unique symbol };
export type SpanId = string & { readonly __brand: unique symbol };

export function createAgentId(id: string): AgentId {
  return id as AgentId;
}

export function createCorrelationId(): CorrelationId {
  return `corr_${Date.now()}_${Math.random().toString(36).slice(2, 11)}` as CorrelationId;
}

export function createTraceId(): TraceId {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('') as TraceId;
}

export function createSpanId(): SpanId {
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('') as SpanId;
}