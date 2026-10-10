/**
 * Capability types for cross-harness portability (ADR-025).
 * @module capability/types
 */

/** All features a harness may expose. Detected at runtime. */
export type Feature =
  | 'workspaceEdit'
  | 'shellHook'
  | 'inProcess'
  | 'instructionsFile'
  | 'sandbox'
  | 'network'
  | 'fileSystem'
  | 'toolUse'
  | 'streaming'
  | 'cancellation';

export type CapabilityLevel = 'min' | 'full';

export type RuntimeVersion = 'v1' | 'v2' | 'unknown';

export interface CapabilitySet {
  features: Feature[];
  level: CapabilityLevel;
  runtimeHint?: RuntimeVersion;
}

export interface DetectorOptions {
  /** Explicit feature override (e.g. from CI matrix --caps flag). Wins over env. */
  features?: Feature[];
  /** Override runtime version. */
  runtimeVersion?: RuntimeVersion;
  /** Extra env to inspect (default: process.env). Injected for testability. */
  env?: Record<string, string | undefined>;
  /** Capability level hint (min = degraded, full = everything). */
  level?: CapabilityLevel;
}
