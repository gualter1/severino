import { AgentManifest } from '../registry/agent-registry';

export function hasPermission(agentManifest: AgentManifest, callerPermissions: string[]): boolean {
  if (callerPermissions.includes('*')) return true;
  if (agentManifest.permissions.includes('*')) return true;
  return agentManifest.permissions.some(p => callerPermissions.includes(p));
}

export function filterByPermissions(
  manifests: AgentManifest[],
  callerPermissions: string[]
): AgentManifest[] {
  if (!callerPermissions || callerPermissions.length === 0) {
    return manifests.filter(m => m.permissions.includes('*') || m.permissions.length === 0);
  }
  if (callerPermissions.includes('*')) return manifests;
  return manifests.filter(m => hasPermission(m, callerPermissions));
}

export function canInvokeCapability(
  manifest: AgentManifest,
  capabilityName: string,
  callerPermissions: string[]
): boolean {
  if (!hasPermission(manifest, callerPermissions)) return false;
  return manifest.capabilities.some(c => c.name === capabilityName);
}
