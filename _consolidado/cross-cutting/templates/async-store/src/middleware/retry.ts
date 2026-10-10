/**
 * retry.ts — retry com backoff exponencial + jitter (ADR-002 §7).
 * Por que jitter: evita thundering-herd quando outbox/projection retomam juntos.
 */

export interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
  retryable?: (err: unknown) => boolean;
}

export class RetryExhaustedError extends Error {
  constructor(
    message: string,
    public readonly attempts: number,
    public readonly lastError: unknown,
  ) {
    super(message);
    this.name = 'RetryExhaustedError';
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function computeDelay(attempt: number, base: number, max: number, jitter: boolean): number {
  const exp = Math.min(base * 2 ** attempt, max);
  if (!jitter) return exp;
  return Math.floor(exp * (0.5 + Math.random() * 0.5));
}

export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelayMs = 200,
    maxDelayMs = 10_000,
    jitter = true,
    retryable = () => true,
  } = opts;

  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const isLast = attempt === maxAttempts - 1;
      if (isLast || !retryable(err)) break;
      await sleep(computeDelay(attempt, baseDelayMs, maxDelayMs, jitter));
    }
  }
  throw new RetryExhaustedError(
    `Operation failed after ${maxAttempts} attempts`,
    maxAttempts,
    lastError,
  );
}
