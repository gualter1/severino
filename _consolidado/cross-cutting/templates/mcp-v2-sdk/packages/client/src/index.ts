// MCP v2 Client — AgentClient for connecting to other agents
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
  TransportConfig,
  TransportType,
  MCPErrorCodes,
  JsonRpcRequest,
  JsonRpcResponse,
  createCorrelationId,
  createTraceId,
  createSpanId,
} from '@severino/mcp-v2-core';

import { WebSocketTransport } from '@severino/mcp-v2-transport-websocket';
import { StdioTransport } from '@severino/mcp-v2-transport-stdio';
import { HttpTransport } from '@severino/mcp-v2-transport-http';
import { RetryPolicy, CircuitBreaker, TimeoutController } from '@severino/mcp-v2-resilience';
import { MTLSManager, JWTManager } from '@severino/mcp-v2-crypto';

export interface AgentClientConfig {
  agentCard: AgentCard;
  transport: TransportType | TransportConfig;
  endpoint?: string; // For websocket/http
  tls?: {
    ca?: string;
    cert?: string;
    key?: string;
    rejectUnauthorized?: boolean;
  };
  defaultTimeoutMs?: number;
  defaultRetries?: number;
  resilience?: {
    retry?: Partial<RetryPolicy>;
    circuitBreaker?: Partial<CircuitBreaker>;
    timeoutMs?: number;
  };
}

export interface InvokeOptions {
  timeoutMs?: number;
  retries?: number;
  traceparent?: string;
  tracestate?: string;
}

export interface DiscoveredAgent {
  card: AgentCard;
  capabilities: Capability[];
  endpoint: string;
  transport: TransportType;
}

export class AgentClient {
  private config: AgentClientConfig;
  private transport: WebSocketTransport | StdioTransport | HttpTransport;
  private retryPolicy: RetryPolicy;
  private circuitBreaker: CircuitBreaker;
  private timeoutController: TimeoutController;
  private mtlsManager?: MTLSManager;
  private jwtManager?: JWTManager;
  private connected = false;
  private negotiatedCapabilities: Capability[] = [];
  private pendingRequests = new Map<string, { resolve: (value: any) => void; reject: (error: Error) => void }>();

  constructor(config: AgentClientConfig) {
    this.config = {
      defaultTimeoutMs: 30000,
      defaultRetries: 3,
      ...config,
    };

    // Initialize transport
    this.transport = this.createTransport(config.transport);

    // Initialize resilience
    this.retryPolicy = new RetryPolicy({
      maxRetries: this.config.defaultRetries,
      backoffMs: 1000,
      backoffMultiplier: 2,
      maxBackoffMs: 30000,
      ...this.config.resilience?.retry,
    });

    this.circuitBreaker = new CircuitBreaker({
      threshold: 5,
      timeout: 60000,
      ...this.config.resilience?.circuitBreaker,
    });

    this.timeoutController = new TimeoutController(this.config.defaultTimeoutMs);

    // Initialize crypto if mTLS/JWT configured
    if (this.config.tls?.cert && this.config.tls?.key) {
      this.mtlsManager = new MTLSManager(this.config.tls);
    }
    this.jwtManager = new JWTManager();
  }

  private createTransport(transport: TransportType | TransportConfig): WebSocketTransport | StdioTransport | HttpTransport {
    const transportConfig = typeof transport === 'string' ? { type: transport } : transport;

    switch (transportConfig.type) {
      case 'websocket':
        return new WebSocketTransport({
          ...transportConfig.websocket,
          url: transportConfig.websocket?.url || this.config.endpoint!,
          tls: transportConfig.websocket?.tls || this.config.tls,
        });
      case 'stdio':
        return new StdioTransport({
          ...transportConfig.stdio,
        });
      case 'http':
        return new HttpTransport({
          ...transportConfig.http,
          baseUrl: transportConfig.http?.baseUrl || this.config.endpoint!,
          tls: transportConfig.http?.tls || this.config.tls,
        });
      default:
        throw new Error(`Unknown transport type: ${transportConfig.type}`);
    }
  }

  async connect(): Promise<CapabilityNegotiationResponse> {
    if (this.connected) {
      throw new Error('Already connected');
    }

    await this.transport.connect();

    // Perform capability negotiation
    const negotiationRequest: CapabilityNegotiationRequest = {
      agentCard: this.config.agentCard,
      requestedCapabilities: this.config.agentCard.skills,
    };

    const response = await this.sendRequest<CapabilityNegotiationResponse>({
      method: 'mcp.negotiate',
      params: negotiationRequest,
      traceparent: `00-${createTraceId()}-${createSpanId()}-01`,
    });

    if (response.accepted && response.negotiatedCapabilities) {
      this.negotiatedCapabilities = response.negotiatedCapabilities;
      this.connected = true;
    }

    return response;
  }

  async disconnect(): Promise<void> {
    if (!this.connected) return;

    await this.transport.disconnect();
    this.connected = false;
    this.negotiatedCapabilities = [];
  }

  async invoke(tool: string, params: unknown, options: InvokeOptions = {}): Promise<any> {
    if (!this.connected) {
      throw new Error('Not connected. Call connect() first.');
    }

    const capability = this.negotiatedCapabilities.find(c => c.name === tool);
    if (!capability) {
      throw new Error(`Capability not found: ${tool}`);
    }

    const request: ToolInvocationRequest = {
      method: tool,
      params,
      traceparent: options.traceparent || `00-${createTraceId()}-${createSpanId()}-01`,
      tracestate: options.tracestate,
      timeoutMs: options.timeoutMs || capability.timeoutMs,
      retries: options.retries ?? capability.retryPolicy?.maxRetries,
    };

    return this.executeWithResilience(async () => {
      const response = await this.sendRequest<ToolInvocationResponse>(request);
      if (response.error) {
        const error = new Error(response.error.message);
        (error as any).code = response.error.code;
        (error as any).retryable = response.error.retryable;
        throw error;
      }
      return response.result;
    }, request);
  }

  async *stream(tool: string, params: unknown, options: InvokeOptions = {}): AsyncGenerator<any> {
    if (!this.connected) {
      throw new Error('Not connected. Call connect() first.');
    }

    const capability = this.negotiatedCapabilities.find(c => c.name === tool);
    if (!capability || !capability.streaming) {
      throw new Error(`Streaming not supported for: ${tool}`);
    }

    const request: ToolInvocationRequest = {
      method: tool,
      params,
      traceparent: options.traceparent || `00-${createTraceId()}-${createSpanId()}-01`,
      tracestate: options.tracestate,
    };

    const stream = await this.transport.stream(request);
    for await (const chunk of stream) {
      if (chunk.type === 'error') {
        throw new Error(chunk.error?.message || 'Stream error');
      }
      if (chunk.type === 'data') {
        yield chunk.data;
      }
      if (chunk.type === 'end') {
        break;
      }
    }
  }

  async discover(filters?: { role?: AgentRole; skills?: string[] }): Promise<DiscoveredAgent[]> {
    const response = await this.sendRequest<DiscoveredAgent[]>({
      method: 'mcp.discover',
      params: filters,
    });
    return response || [];
  }

  getNegotiatedCapabilities(): Capability[] {
    return [...this.negotiatedCapabilities];
  }

  isConnected(): boolean {
    return this.connected;
  }

  private async sendRequest<T>(request: JsonRpcRequest): Promise<T> {
    const id = createCorrelationId();
    const message: JsonRpcRequest = { ...request, id };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve: resolve as any, reject });

      this.transport.send(message).catch(reject);

      // Timeout fallback
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, this.config.defaultTimeoutMs);
    });
  }

  private async executeWithResilience<T>(fn: () => Promise<T>, request: ToolInvocationRequest): Promise<T> {
    return this.circuitBreaker.execute(async () => {
      return this.retryPolicy.execute(async () => {
        return this.timeoutController.execute(fn);
      });
    });
  }
}

export function createAgentClient(config: AgentClientConfig): AgentClient {
  return new AgentClient(config);
}