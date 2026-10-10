"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExponentialBackoffRetry = void 0;
exports.isRetryableError = isRetryableError;
exports.withRetry = withRetry;
const RETRYABLE_ERRORS = ['TIMEOUT', 'RATE_LIMITED', 'INTERNAL_ERROR'];
function isRetryableError(error) {
    return error?.retryable === true || RETRYABLE_ERRORS.includes(error?.code);
}
async function withRetry(fn, options = {}) {
    const { maxRetries = 3, baseDelayMs = 100, maxDelayMs = 5000, jitter = true } = options;
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (err) {
            lastError = err;
            if (attempt === maxRetries || !isRetryableError(err)) {
                throw err;
            }
            // Check retryAfter hint
            let delay = err?.retryAfter
                ? err.retryAfter * 1000
                : Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
            if (jitter) {
                delay = delay * (0.5 + Math.random() * 0.5);
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}
class ExponentialBackoffRetry {
    options;
    constructor(options = {}) {
        this.options = options;
    }
    async execute(fn) {
        return withRetry(fn, this.options);
    }
}
exports.ExponentialBackoffRetry = ExponentialBackoffRetry;
