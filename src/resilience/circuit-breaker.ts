export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold: number = 3,
    private resetTimeoutMs: number = 1000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
        this.failures = 0; // Reset failures for half-open trial
      } else {
        throw new Error('CircuitBreaker is OPEN');
      }
    }

    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') {
        this.reset();
      }
      return result;
    } catch (err) {
      this.recordFailure();
      throw err;
    }
  }

  private recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.threshold || this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
    }
  }

  private reset() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  getState(): string {
    return this.state;
  }
}
