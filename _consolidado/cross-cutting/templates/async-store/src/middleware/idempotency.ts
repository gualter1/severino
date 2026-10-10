/**
 * idempotency.ts — deduplicação via idempotency keys (ADR-002 §4).
 * Inspiração: distilly version-manager retention + oh-my-openagent resume-state.
 */
import type { CommandResult } from '../commands/command-bus';

export interface IdempotencyRecord {
  key: string;
  result: CommandResult;
  createdAt: number;
  expiresAt: number;
}

export interface IIdempotencyStore {
  get(key: string): Promise<CommandResult | null>;
  set(key: string, result: CommandResult, ttlMs?: number): Promise<void>;
}

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24h

export class InMemoryIdempotencyStore implements IIdempotencyStore {
  private records = new Map<string, IdempotencyRecord>();

  async get(key: string): Promise<CommandResult | null> {
    const rec = this.records.get(key);
    if (!rec) return null;
    if (Date.now() > rec.expiresAt) {
      this.records.delete(key);
      return null;
    }
    return structuredClone(rec.result);
  }

  async set(key: string, result: CommandResult, ttlMs: number = DEFAULT_TTL_MS): Promise<void> {
    const now = Date.now();
    this.records.set(key, {
      key,
      result: structuredClone(result),
      createdAt: now,
      expiresAt: now + ttlMs,
    });
  }

  /** Suporte a testes / GC manual. */
  async purgeExpired(): Promise<number> {
    const now = Date.now();
    let purged = 0;
    for (const [k, v] of this.records) {
      if (now > v.expiresAt) {
        this.records.delete(k);
        purged++;
      }
    }
    return purged;
  }
}
