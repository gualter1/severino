import { AgentManifest, AgentRegistry } from '../registry/agent-registry';
import { CircuitBreaker } from '../resilience/circuit-breaker';
import { withRetry } from '../resilience/retry-policy';
import { withTimeout } from '../resilience/timeout';
import { filterByPermissions } from '../sandbox/permission-filter';
import { invokeInSandbox } from '../sandbox/invoke-in-sandbox';
import { sanitizeArgs, sanitizeResult } from '../logging/sanitize';

export interface AgentError {
  code: 'TIMEOUT' | 'NOT_FOUND' | 'SANDBOX_DENIED' | 'RATE_LIMITED' | 'INTERNAL_ERROR';
  message: string;
  retryable: boolean;
  retryAfter?: number;
  details?: Record<string, any>;
}

export interface McpClientOptions {
  agentId: string;
  permissions: string[];
  registry: AgentRegistry;
  timeoutMs?: number;
  maxRetries?: number;
}

export class McpClient {
  private circuitBreaker: CircuitBreaker;
  private errorHandler?: (error: AgentError) => void;

  constructor(private options: McpClientOptions) {
    this.circuitBreaker = new CircuitBreaker(3, 2000);
  }

  onError(handler: (error: AgentError) => void): void {
    this.errorHandler = handler;
  }

  private handleError(err: any): AgentError {
    const agentErr: AgentError = {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Unknown MCP client error',
      retryable: err.retryable !== undefined ? err.retryable : true,
      retryAfter: err.retryAfter,
      details: err.details
    };
    if (this.errorHandler) {
      this.errorHandler(agentErr);
    }
    return agentErr;
  }

  async discover(query: string): Promise<AgentManifest[]> {
    try {
      const allManifests = await this.options.registry.discovery(query, this.options.permissions);
      return filterByPermissions(allManifests, this.options.permissions);
    } catch (err: any) {
      throw this.handleError(err);
    }
  }

  async invoke<T, R>(targetAgentId: string, capability: string, args: T): Promise<R> {
    const sanitizedArgs = sanitizeArgs(args);
    const timeoutMs = this.options.timeoutMs || 5000;
    const maxRetries = this.options.maxRetries || 3;

    try {
      return await this.circuitBreaker.execute(async () => {
        return await withRetry(async () => {
          return await withTimeout(
            invokeInSandbox(
              targetAgentId,
              capability,
              sanitizedArgs,
              async (cleanArgs) => {
                // In production, transport layer handles invocation over IPC/RPC.
                // Here we simulate successful invocation or call a registered local handler.
                return { success: true, data: cleanArgs } as unknown as R;
              },
              {
                callerId: this.options.agentId,
                callerPermissions: this.options.permissions,
                registry: this.options.registry
              }
            ),
            timeoutMs
          );
        }, { maxRetries });
      });
    } catch (err: any) {
      const formattedErr = this.handleError(err);
      throw formattedErr;
    }
  }

  async *stream<T, C>(targetAgentId: string, capability: string, args: T): AsyncIterable<C> {
    const sanitizedArgs = sanitizeArgs(args);
    
    // Validate capability & permissions first
    try {
      const manifest = await this.options.registry.getManifest(targetAgentId);
      if (!manifest) {
        throw { code: 'NOT_FOUND', message: `Agent ${targetAgentId} not found`, retryable: false };
      }
      
      // Simulate streaming chunks
      const chunks: C[] = [
        { chunkIndex: 1, status: 'streaming', args: sanitizedArgs } as unknown as C,
        { chunkIndex: 2, status: 'completed', args: sanitizedArgs } as unknown as C
      ];

      for (const chunk of chunks) {
        yield sanitizeResult(chunk);
        await new Promise(r => setTimeout(r, 50));
      }
    } catch (err: any) {
      const formattedErr = this.handleError(err);
      throw formattedErr;
    }
  }
}
