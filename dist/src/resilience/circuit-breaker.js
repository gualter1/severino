"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
class CircuitBreaker {
    threshold;
    resetTimeoutMs;
    failures = 0;
    lastFailureTime = 0;
    state = 'CLOSED';
    constructor(threshold = 3, resetTimeoutMs = 1000) {
        this.threshold = threshold;
        this.resetTimeoutMs = resetTimeoutMs;
    }
    async execute(fn) {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
                this.state = 'HALF_OPEN';
                this.failures = 0; // Reset failures for half-open trial
            }
            else {
                throw new Error('CircuitBreaker is OPEN');
            }
        }
        try {
            const result = await fn();
            if (this.state === 'HALF_OPEN') {
                this.reset();
            }
            return result;
        }
        catch (err) {
            this.recordFailure();
            throw err;
        }
    }
    recordFailure() {
        this.failures++;
        this.lastFailureTime = Date.now();
        if (this.failures >= this.threshold || this.state === 'HALF_OPEN') {
            this.state = 'OPEN';
        }
    }
    reset() {
        this.failures = 0;
        this.state = 'CLOSED';
    }
    getState() {
        return this.state;
    }
}
exports.CircuitBreaker = CircuitBreaker;
