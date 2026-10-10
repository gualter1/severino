"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpClient = void 0;
const circuit_breaker_1 = require("../resilience/circuit-breaker");
const retry_policy_1 = require("../resilience/retry-policy");
const timeout_1 = require("../resilience/timeout");
const permission_filter_1 = require("../sandbox/permission-filter");
const invoke_in_sandbox_1 = require("../sandbox/invoke-in-sandbox");
const sanitize_1 = require("../logging/sanitize");
class McpClient {
    options;
    circuitBreaker;
    errorHandler;
    constructor(options) {
        this.options = options;
        this.circuitBreaker = new circuit_breaker_1.CircuitBreaker(3, 2000);
    }
    onError(handler) {
        this.errorHandler = handler;
    }
    handleError(err) {
        const agentErr = {
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
    async discover(query) {
        try {
            const allManifests = await this.options.registry.discovery(query, this.options.permissions);
            return (0, permission_filter_1.filterByPermissions)(allManifests, this.options.permissions);
        }
        catch (err) {
            throw this.handleError(err);
        }
    }
    async invoke(targetAgentId, capability, args) {
        const sanitizedArgs = (0, sanitize_1.sanitizeArgs)(args);
        const timeoutMs = this.options.timeoutMs || 5000;
        const maxRetries = this.options.maxRetries || 3;
        try {
            return await this.circuitBreaker.execute(async () => {
                return await (0, retry_policy_1.withRetry)(async () => {
                    return await (0, timeout_1.withTimeout)((0, invoke_in_sandbox_1.invokeInSandbox)(targetAgentId, capability, sanitizedArgs, async (cleanArgs) => {
                        // In production, transport layer handles invocation over IPC/RPC.
                        // Here we simulate successful invocation or call a registered local handler.
                        return { success: true, data: cleanArgs };
                    }, {
                        callerId: this.options.agentId,
                        callerPermissions: this.options.permissions,
                        registry: this.options.registry
                    }), timeoutMs);
                }, { maxRetries });
            });
        }
        catch (err) {
            const formattedErr = this.handleError(err);
            throw formattedErr;
        }
    }
    async *stream(targetAgentId, capability, args) {
        const sanitizedArgs = (0, sanitize_1.sanitizeArgs)(args);
        // Validate capability & permissions first
        try {
            const manifest = await this.options.registry.getManifest(targetAgentId);
            if (!manifest) {
                throw { code: 'NOT_FOUND', message: `Agent ${targetAgentId} not found`, retryable: false };
            }
            // Simulate streaming chunks
            const chunks = [
                { chunkIndex: 1, status: 'streaming', args: sanitizedArgs },
                { chunkIndex: 2, status: 'completed', args: sanitizedArgs }
            ];
            for (const chunk of chunks) {
                yield (0, sanitize_1.sanitizeResult)(chunk);
                await new Promise(r => setTimeout(r, 50));
            }
        }
        catch (err) {
            const formattedErr = this.handleError(err);
            throw formattedErr;
        }
    }
}
exports.McpClient = McpClient;
