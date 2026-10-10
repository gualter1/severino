export function createTimeoutError(timeoutMs: number): any {
  return {
    code: 'TIMEOUT',
    message: `Operation timed out after ${timeoutMs}ms`,
    retryable: true
  };
}

export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  abortSignal?: AbortSignal
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(createTimeoutError(ms));
    }, ms);
  });

  const abortPromise = abortSignal
    ? new Promise<never>((_, reject) => {
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
    const promises: Promise<any>[] = [promise, timeoutPromise];
    if (abortPromise) promises.push(abortPromise);
    
    const result = await Promise.race(promises);
    return result as T;
  } finally {
    clearTimeout(timeoutId!);
  }
}
