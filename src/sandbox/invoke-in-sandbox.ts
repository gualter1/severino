import { AgentRegistry } from '../registry/agent-registry';
import { canInvokeCapability } from './permission-filter';

export interface SandboxInvokeOptions {
  callerId: string;
  callerPermissions: string[];
  registry: AgentRegistry;
  timeoutMs?: number;
}

export async function invokeInSandbox<T, R>(
  targetAgentId: string,
  capabilityName: string,
  args: T,
  handler: (args: T) => Promise<R> | R,
  options: SandboxInvokeOptions
): Promise<R> {
  const { callerPermissions, registry } = options;
  const manifest = await registry.getManifest(targetAgentId);

  if (!manifest) {
    throw {
      code: 'NOT_FOUND',
      message: `Target agent ${targetAgentId} not found`,
      retryable: false
    };
  }

  if (!canInvokeCapability(manifest, capabilityName, callerPermissions)) {
    throw {
      code: 'SANDBOX_DENIED',
      message: `Agent permissions denied to invoke ${capabilityName} on agent ${targetAgentId}`,
      retryable: false
    };
  }

  // Execute in isolated sandbox context
  try {
    return await handler(args);
  } catch (err: any) {
    if (err?.code) throw err;
    throw {
      code: 'INTERNAL_ERROR',
      message: err.message || 'Unknown sandbox error',
      retryable: true
    };
  }
}
