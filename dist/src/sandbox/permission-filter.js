"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = hasPermission;
exports.filterByPermissions = filterByPermissions;
exports.canInvokeCapability = canInvokeCapability;
function hasPermission(agentManifest, callerPermissions) {
    if (callerPermissions.includes('*'))
        return true;
    if (agentManifest.permissions.includes('*'))
        return true;
    return agentManifest.permissions.some(p => callerPermissions.includes(p));
}
function filterByPermissions(manifests, callerPermissions) {
    if (!callerPermissions || callerPermissions.length === 0) {
        return manifests.filter(m => m.permissions.includes('*') || m.permissions.length === 0);
    }
    if (callerPermissions.includes('*'))
        return manifests;
    return manifests.filter(m => hasPermission(m, callerPermissions));
}
function canInvokeCapability(manifest, capabilityName, callerPermissions) {
    if (!hasPermission(manifest, callerPermissions))
        return false;
    return manifest.capabilities.some(c => c.name === capabilityName);
}
