"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalRegistry = exports.AgentRegistry = void 0;
class AgentRegistry {
    manifests = new Map();
    async register(manifest) {
        if (!manifest.agentId || !manifest.capabilities) {
            throw new Error("Invalid manifest: missing agentId or capabilities");
        }
        this.manifests.set(manifest.agentId, manifest);
    }
    async unregister(agentId) {
        this.manifests.delete(agentId);
    }
    async getManifest(agentId) {
        return this.manifests.get(agentId) || null;
    }
    async discovery(query, callerPermissions = []) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        for (const manifest of this.manifests.values()) {
            // Check if caller has required permissions for this agent
            const hasPermission = manifest.permissions.some(p => callerPermissions.includes(p) || p === '*' || callerPermissions.includes('*'));
            if (!hasPermission && callerPermissions.length > 0) {
                // Filter out if permissions don't match, unless no caller permissions specified (or public)
                // Let's make permission filtering strict when callerPermissions are provided
                continue;
            }
            const matchesAgent = manifest.name.toLowerCase().includes(lowerQuery) || manifest.agentId.toLowerCase().includes(lowerQuery);
            const matchingCaps = manifest.capabilities.filter(c => c.name.toLowerCase().includes(lowerQuery) ||
                (c.description && c.description.toLowerCase().includes(lowerQuery)));
            if (matchesAgent || matchingCaps.length > 0) {
                // Return manifest with only matching capabilities or full manifest if agent matched
                results.push({
                    ...manifest,
                    capabilities: matchesAgent ? manifest.capabilities : matchingCaps
                });
            }
        }
        return results;
    }
    async getCapabilities(agentId) {
        const manifest = this.manifests.get(agentId);
        return manifest ? manifest.capabilities : [];
    }
}
exports.AgentRegistry = AgentRegistry;
exports.globalRegistry = new AgentRegistry();
