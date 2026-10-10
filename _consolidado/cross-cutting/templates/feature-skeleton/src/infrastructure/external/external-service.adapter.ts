/**
 * External service adapter template — injects dependencies, timeouts,
 * and retry-safe config. No hard-coded secrets (ADR-007/010).
 */
export interface ExternalServiceConfig {
  baseUrl: string;
  apiKey: string;
  timeoutMs?: number;
  maxRetries?: number;
  metricPrefix?: string;
}

export class ExternalServiceAdapter {
  private readonly timeoutMs: number;
  private readonly maxRetries: number;

  constructor(private readonly config: ExternalServiceConfig) {
    if (!config.baseUrl) {
      throw new Error('ExternalServiceAdapter: baseUrl is required');
    }
    if (!config.apiKey) {
      throw new Error('ExternalServiceAdapter: apiKey is required (from env, never hardcoded)');
    }
    this.timeoutMs = config.timeoutMs ?? 5_000;
    this.maxRetries = config.maxRetries ?? 3;
  }

  getBaseUrl(): string {
    return this.config.baseUrl;
  }

  getTimeoutMs(): number {
    return this.timeoutMs;
  }

  getMaxRetries(): number {
    return this.maxRetries;
  }

  buildHeaders(correlationId?: string): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.config.apiKey}`,
      ...(correlationId ? { 'X-Correlation-Id': correlationId } : {}),
    };
  }
}
