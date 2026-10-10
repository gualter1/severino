"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invokeInSandbox = invokeInSandbox;
const permission_filter_1 = require("./permission-filter");
async function invokeInSandbox(targetAgentId, capabilityName, args, handler, options) {
    const { callerPermissions, registry } = options;
    const manifest = await registry.getManifest(targetAgentId);
    if (!manifest) {
        throw {
            code: 'NOT_FOUND',
            message: `Target agent ${targetAgentId} not found`,
            retryable: false
        };
    }
    if (!(0, permission_filter_1.canInvokeCapability)(manifest, capabilityName, callerPermissions)) {
        throw {
            code: 'SANDBOX_DENIED',
            message: `Agent permissions denied to invoke ${capabilityName} on agent ${targetAgentId}`,
            retryable: false
        };
    }
    // Execute in isolated sandbox context
    try {
        return await handler(args);
    }
    catch (err) {
        if (err?.code)
            throw err;
        throw {
            code: 'INTERNAL_ERROR',
            message: err.message || 'Unknown sandbox error',
            retryable: true
        };
    }
}
