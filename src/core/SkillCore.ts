/**
 * SkillCore — harness-agnostic skill kernel (ADR-025).
 * Pure methods only. No import of harness SDKs, no globalThis.opencode.
 * All I/O goes through injected ports so the core runs on any harness.
 */

import type { CapabilityDetector } from '../capability/CapabilityDetector';

export interface SkillConfig {
  name: string;
  version: string;
  /** Optional free-form settings; adapters may map harness config into here. */
  settings?: Record<string, unknown>;
}

export interface SkillInput<T = unknown> {
  payload: T;
  /** Correlation id for tracing across adapters. */
  correlationId?: string;
}

export interface SkillOutput<T = unknown> {
  ok: boolean;
  data?: T;
  /** Machine-readable error when ok=false. */
  error?: { code: string; message: string };
  /** Which features were used / which fallbacks engaged. */
  usedFallback?: boolean;
}

export interface Logger {
  info(message: string, fields?: Record<string, unknown>): void;
  warn(message: string, fields?: Record<string, unknown>): void;
  error(message: string, fields?: Record<string, unknown>): void;
}

export interface FilePort {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
}

export interface ShellPort {
  exec(command: string, args: readonly string[]): Promise<{ stdout: string; exitCode: number }>;
}

export interface CorePorts {
  detector: CapabilityDetector;
  logger?: Logger;
  files?: FilePort;
  shell?: ShellPort;
}

export type SkillHandler<TIn = unknown, TOut = unknown> = (
  input: SkillInput<TIn>,
  ports: Required<Pick<CorePorts, 'detector'>> & Partial<CorePorts>,
) => Promise<SkillOutput<TOut>>;

const noopLogger: Logger = {
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
};

export class SkillCore<TIn = unknown, TOut = unknown> {
  private readonly config: SkillConfig;
  private readonly handler: SkillHandler<TIn, TOut>;
  private readonly ports: CorePorts;
  private initialized = false;

  constructor(config: SkillConfig, handler: SkillHandler<TIn, TOut>, ports: CorePorts) {
    if (!config.name) throw new Error('SkillCore: config.name is required');
    this.config = { ...config };
    this.handler = handler;
    this.ports = { logger: noopLogger, ...ports };
  }

  initialize(): void {
    this.initialized = true;
    this.ports.logger?.info('skill initialized', {
      name: this.config.name,
      version: this.config.version,
      runtime: this.ports.detector.detectRuntime(),
      features: this.ports.detector.getAvailableFeatures(),
    });
  }

  async run(input: SkillInput<TIn>): Promise<SkillOutput<TOut>> {
    if (!this.initialized) {
      return {
        ok: false,
        error: { code: 'NOT_INITIALIZED', message: 'call initialize() before run()' },
      };
    }
    try {
      return await this.handler(input, this.ports);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.ports.logger?.error('skill run failed', { message });
      return { ok: false, error: { code: 'HANDLER_THROW', message } };
    }
  }

  shutdown(): void {
    this.initialized = false;
    this.ports.logger?.info('skill shutdown', { name: this.config.name });
  }

  get name(): string {
    return this.config.name;
  }

  get isInitialized(): boolean {
    return this.initialized;
  }
}
