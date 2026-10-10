export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
}

const RETRYABLE_ERRORS = ['TIMEOUT', 'RATE_LIMITED', 'INTERNAL_ERROR'];

export function isRetryableError(error: any): boolean {
  return error?.retryable === true || RETRYABLE_ERRORS.includes(error?.code);
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 100, maxDelayMs = 5000, jitter = true } = options;
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      
      if (attempt === maxRetries || !isRetryableError(err)) {
        throw err;
      }

      // Check retryAfter hint
      let delay = (err as any)?.retryAfter 
        ? (err as any).retryAfter * 1000 
        : Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);

      if (jitter) {
        delay = delay * (0.5 + Math.random() * 0.5);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export class ExponentialBackoffRetry {
  constructor(private options: RetryOptions = {}) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return withRetry(fn, this.options);
  }
}
