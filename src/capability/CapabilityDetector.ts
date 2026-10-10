/**
 * CapabilityDetector — runtime feature detection (<1ms).
 * ADR-025: pure, zero harness dependency. Never touches globalThis.opencode directly.
 * Why: skills must degrade gracefully on harnesses that lack features.
 */

import type {
  CapabilityLevel,
  DetectorOptions,
  Feature,
  RuntimeVersion,
} from './types';

const FEATURE_BY_ENV: ReadonlyArray<{ env: string; feature: Feature }> = [
  { env: 'OPENCODE_CAP_WORKSPACE_EDIT', feature: 'workspaceEdit' },
  { env: 'OPENCODE_CAP_SHELL_HOOK', feature: 'shellHook' },
  { env: 'OPENCODE_CAP_IN_PROCESS', feature: 'inProcess' },
  { env: 'OPENCODE_CAP_INSTRUCTIONS_FILE', feature: 'instructionsFile' },
  { env: 'OPENCODE_CAP_SANDBOX', feature: 'sandbox' },
  { env: 'OPENCODE_CAP_NETWORK', feature: 'network' },
  { env: 'OPENCODE_CAP_FILE_SYSTEM', feature: 'fileSystem' },
  { env: 'OPENCODE_CAP_TOOL_USE', feature: 'toolUse' },
  { env: 'OPENCODE_CAP_STREAMING', feature: 'streaming' },
  { env: 'OPENCODE_CAP_CANCELLATION', feature: 'cancellation' },
];

export const MIN_FEATURES: ReadonlyArray<Feature> = ['fileSystem', 'toolUse'];

export const FULL_FEATURES: ReadonlyArray<Feature> = [
  'workspaceEdit',
  'shellHook',
  'inProcess',
  'instructionsFile',
  'sandbox',
  'network',
  'fileSystem',
  'toolUse',
  'streaming',
  'cancellation',
];

function readEnv(
  options: DetectorOptions,
): Record<string, string | undefined> {
  if (options.env) return options.env;
  if (typeof process !== 'undefined' && process.env) {
    return process.env as Record<string, string | undefined>;
  }
  return {};
}

export class CapabilityDetector {
  private readonly features: Set<Feature>;
  private readonly level: CapabilityLevel;
  private readonly runtime: RuntimeVersion;

  constructor(options: DetectorOptions = {}) {
    const env = readEnv(options);
    const detected = CapabilityDetector.resolveFeatures(options, env);
    this.features = new Set(detected);
    this.level =
      options.level ??
      (this.features.size >= FULL_FEATURES.length - 2 ? 'full' : 'min');
    this.runtime =
      options.runtimeVersion ?? CapabilityDetector.inferRuntime(env, this.features);
  }

  private static resolveFeatures(
    options: DetectorOptions,
    env: Record<string, string | undefined>,
  ): Feature[] {
    // 1. Explicit override wins (CI matrix passes --caps).
    if (options.features) return [...options.features];

    // 2. SKILL_CAPS=min|full or SKILL_FEATURES=a,b,c.
    if (env['SKILL_CAPS'] === 'min' || env['SKILL_CAPS'] === 'full') {
      if (env['SKILL_FEATURES']) {
        return CapabilityDetector.parseFeatureList(env['SKILL_FEATURES']);
      }
      return env['SKILL_CAPS'] === 'full' ? [...FULL_FEATURES] : [...MIN_FEATURES];
    }
    if (env['SKILL_FEATURES']) {
      return CapabilityDetector.parseFeatureList(env['SKILL_FEATURES']);
    }

    // 3. Level hint without features.
    if (options.level) {
      return options.level === 'full' ? [...FULL_FEATURES] : [...MIN_FEATURES];
    }

    // 4. Per-feature env flags.
    const fromEnv: Feature[] = [];
    for (const { env: key, feature } of FEATURE_BY_ENV) {
      if (env[key] === '1' || env[key] === 'true') fromEnv.push(feature);
    }
    if (fromEnv.length > 0) return fromEnv;

    // 5. Safe global probing — never imports harness SDKs.
    return CapabilityDetector.inferFromGlobals();
  }

  private static parseFeatureList(raw: string): Feature[] {
    const valid = new Set<string>(FULL_FEATURES);
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => valid.has(s)) as Feature[];
  }

  private static inferFromGlobals(): Feature[] {
    try {
      const g = globalThis as Record<string, unknown>;
      if (g['opencode'] !== undefined && typeof g['opencode'] === 'object') {
        return [...FULL_FEATURES];
      }
      if (g['__CLAUDE_CODE__']) {
        return ['shellHook', 'fileSystem', 'toolUse', 'workspaceEdit'];
      }
    } catch {
      // Non-obvious: some sandboxes throw on globalThis access — default to min.
    }
    return [...MIN_FEATURES];
  }

  private static inferRuntime(
    env: Record<string, string | undefined>,
    features: Set<Feature>,
  ): RuntimeVersion {
    if (env['MCP_V2'] === '1' || env['OPENCODE_RUNTIME'] === 'v2') return 'v2';
    if (env['MCP_V1'] === '1' || env['OPENCODE_RUNTIME'] === 'v1') return 'v1';
    try {
      const g = globalThis as Record<string, unknown>;
      if (g['__MCP_V2__']) return 'v2';
      if (g['__MCP_V1__']) return 'v1';
    } catch {
      // ignore — fall through to heuristic
    }
    if (features.has('streaming') && features.has('cancellation')) return 'v2';
    if (features.size > 0) return 'v1';
    return 'unknown';
  }

  /** O(1) feature check. Performance: Set lookup, well under 1ms. */
  hasFeature(feature: string): boolean {
    return this.features.has(feature as Feature);
  }

  /** Alias required by ADR spec — capability-oriented naming. */
  supports(capability: string): boolean {
    return this.hasFeature(capability);
  }

  getAvailableFeatures(): Feature[] {
    return [...this.features];
  }

  getLevel(): CapabilityLevel {
    return this.level;
  }

  detectRuntime(): RuntimeVersion {
    return this.runtime;
  }

  /**
   * Degraded-fallback helper: encourages `hasFeature(x) ? edit() : fallback()`.
   */
  when<T>(feature: Feature, onAvailable: () => T, onFallback: () => T): T {
    return this.hasFeature(feature) ? onAvailable() : onFallback();
  }
}
