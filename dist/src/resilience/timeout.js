"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimeoutError = createTimeoutError;
exports.withTimeout = withTimeout;
function createTimeoutError(timeoutMs) {
    return {
        code: 'TIMEOUT',
        message: `Operation timed out after ${timeoutMs}ms`,
        retryable: true
    };
}
async function withTimeout(promise, ms, abortSignal) {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(createTimeoutError(ms));
        }, ms);
    });
    const abortPromise = abortSignal
        ? new Promise((_, reject) => {
            if (abortSignal.aborted) {
                reject(createTimeoutError(ms));
                return;
            }
            abortSignal.addEventListener('abort', () => {
                reject(createTimeoutError(ms));
            });
        })
        : null;
    try {
        const promises = [promise, timeoutPromise];
        if (abortPromise)
            promises.push(abortPromise);
        const result = await Promise.race(promises);
        return result;
    }
    finally {
        clearTimeout(timeoutId);
    }
}
