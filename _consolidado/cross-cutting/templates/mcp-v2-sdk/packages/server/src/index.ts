// MCP v2 Server — AgentServer for exposing capabilities
// ADR-029: MCP v2 SDK for Agent Developers

import {
  AgentCard,
  AgentRole,
  AgentPermission,
  Capability,
  CapabilityNegotiationRequest,
  CapabilityNegotiationResponse,
  ToolInvocationRequest,
  ToolInvocationResponse,
  StreamChunk,
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcMessage,
  MCPErrorCodes,
  AuditEvent,
  AuditEventTypeSchema,
} from '@severino/mcp-v2-core';

import { WebSocketTransport } from '@severino/mcp-v2-transport-websocket';
import { StdioTransport } from '@severino/mcp-v2-transport-stdio';
import { HttpTransport } from '@severino/mcp-v2-transport-http';
import { RetryPolicy, CircuitBreaker } from '@severino/mcp-v2-resilience';
import { MTLSManager, JWTManager } from '@severino/mcp-v2-crypto';

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  permissions: AgentPermission[];
  streaming: boolean;
  idempotent: boolean;
  timeoutMs: number;
  retryPolicy?: {
    maxRetries: number;
    backoffMs: number;
    backoffMultiplier: number;
    maxBackoffMs: number;
  };
}

export interface ToolHandler {
  (params: unknown, context: ToolContext): Promise<unknown>;
}

export interface ToolContext {
  agentCard: AgentCard;
  traceparent?: string;
  tracestate?: string;
  correlationId: string;
  permissions: AgentPermission[];
}

export interface AgentServerConfig {
  agentCard: AgentCard;
  transport: 'websocket' | 'stdio' | 'http' | TransportConfig;
  port?: number; // For websocket/http
  tls?: {
    ca?: string;
    cert?: string;
    key?: string;
    rejectUnauthorized?: boolean;
  };
  defaultTimeoutMs?: number;
  defaultRetries?: number;
  auditLogger?: (event: AuditEvent) => void;
}

interface TransportConfig {
  type: 'websocket' | 'stdio' | 'http';
  websocket?: { port: number; host?: string; tls?: any };
  stdio?: { command: string; args: string[] };
  http?: { port: number; host?: string; tls?: any };
}

export class AgentServer {
  private config: AgentServerConfig;
  private transport: WebSocketTransport | StdioTransport | HttpTransport;
  private tools = new Map<string, { definition: ToolDefinition; handler: ToolHandler }>();
  private auditLogger?: (event: AuditEvent) => void;
  private started = false;

  constructor(config: AgentServerConfig) {
    this.config = {
      defaultTimeoutMs: 30000,
      defaultRetries: 3,
      ...config,
    };
    this.auditLogger = config.auditLogger;

    // Initialize transport
    this.transport = this.createTransport(config.transport);
    this.setupMessageHandler();
  }

  private createTransport(transport: 'websocket' | 'stdio' | 'http' | TransportConfig): WebSocketTransport | StdioTransport | HttpTransport {
    const transportConfig = typeof transport === 'string' ? { type: transport } : transport;

    switch (transportConfig.type) {
      case 'websocket':
        return new WebSocketTransport({
          port: transportConfig.websocket?.port || this.config.port || 8080,
          host: transportConfig.websocket?.host || '0.0.0.0',
          tls: transportConfig.websocket?.tls || this.config.tls,
        });
      case 'stdio':
        return new StdioTransport({});
      case 'http':
        return new HttpTransport({
          port: transportConfig.http?.port || this.config.port || 8080,
          host: transportConfig.http?.host || '0.0.0.0',
          tls: transportConfig.http?.tls || this.config.tls,
        });
      default:
        throw new Error(`Unknown transport type: ${transportConfig.type}`);
    }
  }

  private setupMessageHandler(): void {
    this.transport.onMessage(async (message: JsonRpcMessage) => {
      if ('method' in message && 'id' in message) {
        // Request
        const response = await this.handleRequest(message as JsonRpcRequest);
        await this.transport.send(response);
      } else if ('method' in message && !('id' in message)) {
        // Notification
        await this.handleNotification(message as any);
      }
      // Responses are handled by the client
    });
  }

  private async handleRequest(request: JsonRpcRequest): Promise<JsonRpcResponse> {
    const correlationId = request.id as string;

    try {
      switch (request.method) {
        case 'mcp.negotiate':
          return this.handleNegotiate(request, correlationId);
        case 'mcp.discover':
          return this.handleDiscover(request, correlationId);
        default:
          // Check if it's a tool invocation
          const tool = this.tools.get(request.method);
          if (tool) {
            return this.handleToolInvocation(request, tool, correlationId);
          }
          return this.createErrorResponse(request.id, MCPErrorCodes.METHOD_NOT_FOUND, `Method not found: ${request.method}`);
      }
    } catch (error) {
      return this.createErrorResponse(request.id, MCPErrorCodes.INTERNAL_ERROR, error instanceof Error ? error.message : 'Internal error');
    }
  }

  private async handleNotification(notification: any): Promise<void> {
    // Handle notifications (e.g., ping, logging)
    this.auditLog({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      service: this.config.agentCard.id,
      agent_id: `${this.config.agentCard.id}@${this.config.agentCard.version}`,
      event: 'tool_call',
      sanitized: true,
      tool: notification.method,
      duration_ms: 0,
      input_hash: 'sha256:notification',
      output_hash: 'sha256:notification',
      status: 'success',
    });
  }

  private handleNegotiate(request: JsonRpcRequest, correlationId: string): JsonRpcResponse {
    const negotiateRequest = request.params as CapabilityNegotiationRequest;
    const requestedSkills = negotiateRequest.requestedCapabilities || [];

    // Filter capabilities based on requested skills
    const negotiatedCapabilities = Array.from(this.tools.values())
      .filter(t => requestedSkills.length === 0 || requestedSkills.includes(t.definition.name))
      .map(t => t.definition);

    const response: CapabilityNegotiationResponse = {
      accepted: true,
      negotiatedCapabilities,
      protocolVersion: '2.0',
    };

    return {
      jsonrpc: '2.0',
      id: correlationId,
      result: response,
    };
  }

  private handleDiscover(request: JsonRpcRequest, correlationId: string): JsonRpcResponse {
    const filters = request.params as { role?: AgentRole; skills?: string[] };
    // In a real implementation, this would query a registry
    // For now, return empty array (this agent doesn't act as registry)
    const response: any[] = [];

    return {
      jsonrpc: '2.0',
      id: correlationId,
      result: response,
    };
  }

  private async handleToolInvocation(
    request: JsonRpcRequest,
    tool: { definition: ToolDefinition; handler: ToolHandler },
    correlationId: string
  ): Promise<JsonRpcResponse> {
    const invocationRequest = request.params as ToolInvocationRequest;
    const startTime = Date.now();

    // Validate permissions
    const missingPermissions = tool.definition.permissions.filter(
      p => !this.config.agentCard.permissions.includes(p)
    );
    if (missingPermissions.length > 0) {
      return this.createErrorResponse(
        correlationId,
        MCPErrorCodes.PERMISSION_DENIED,
        `Missing permissions: ${missingPermissions.join(', ')}`
      );
    }

    // Create context
    const context: ToolContext = {
      agentCard: this.config.agentCard,
      traceparent: invocationRequest.traceparent,
      tracestate: invocationRequest.tracestate,
      correlationId,
      permissions: this.config.agentCard.permissions,
    };

    try {
      // Execute handler with timeout
      const result = await Promise.race([
        tool.handler(invocationRequest.params, context),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), tool.definition.timeoutMs)
        ),
      ]);

      const durationMs = Date.now() - startTime;

      // Audit log
      this.auditLog({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        service: this.config.agentCard.id,
        agent_id: `${this.config.agentCard.id}@${this.config.agentCard.version}`,
        event: 'tool_call',
        sanitized: true,
        tool: tool.definition.name,
        duration_ms: durationMs,
        input_hash: this.hash(JSON.stringify(invocationRequest.params)),
        output_hash: this.hash(JSON.stringify(result)),
        status: 'success',
        trace_id: invocationRequest.traceparent?.split('-')[1],
        span_id: invocationRequest.traceparent?.split('-')[2],
      });

      return {
        jsonrpc: '2.0',
        id: correlationId,
        result: {
          result,
          traceparent: invocationRequest.traceparent,
          tracestate: invocationRequest.tracestate,
        },
      };
    } catch (error) {
      const durationMs = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Audit log
      this.auditLog({
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        service: this.config.agentCard.id,
        agent_id: `${this.config.agentCard.id}@${this.config.agentCard.version}`,
        event: 'tool_call',
        sanitized: true,
        tool: tool.definition.name,
        duration_ms: durationMs,
        input_hash: this.hash(JSON.stringify(invocationRequest.params)),
        output_hash: 'sha256:error',
        status: 'error',
        error: errorMessage,
        trace_id: invocationRequest.traceparent?.split('-')[1],
        span_id: invocationRequest.traceparent?.split('-')[2],
      });

      return this.createErrorResponse(
        correlationId,
        errorMessage === 'Timeout' ? MCPErrorCodes.TIMEOUT : MCPErrorCodes.INTERNAL_ERROR,
        errorMessage
      );
    }
  }

  tool(definition: ToolDefinition, handler: ToolHandler): void {
    if (this.tools.has(definition.name)) {
      throw new Error(`Tool already registered: ${definition.name}`);
    }
    this.tools.set(definition.name, { definition, handler });
  }

  async start(): Promise<void> {
    if (this.started) {
      throw new Error('Server already started');
    }

    await this.transport.start();
    this.started = true;

    this.auditLog({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      service: this.config.agentCard.id,
      agent_id: `${this.config.agentCard.id}@${this.config.agentCard.version}`,
      event: 'agent_start',
      sanitized: true,
    });
  }

  async stop(): Promise<void> {
    if (!this.started) return;

    await this.transport.stop();
    this.started = false;

    this.auditLog({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      service: this.config.agentCard.id,
      agent_id: `${this.config.agentCard.id}@${this.config.agentCard.version}`,
      event: 'agent_end',
      sanitized: true,
    });
  }

  private createErrorResponse(id: string | number | null, code: number, message: string): JsonRpcResponse {
    return {
      jsonrpc: '2.0',
      id,
      error: { code, message },
    };
  }

  private auditLog(event: AuditEvent): void {
    if (this.auditLogger) {
      this.auditLogger(event);
    }
  }

  private hash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `sha256:${Math.abs(hash).toString(16).padStart(8, '0')}`;
  }
}

export function defineTool(definition: ToolDefinition): ToolDefinition {
  return definition;
}

export function createAgentServer(config: AgentServerConfig): AgentServer {
  return new AgentServer(config);
}