/**
 * outbox.ts — transactional outbox para delivery confiável (ADR-002 §5).
 * Evita dual-write: persiste outbox entries na mesma transação lógica dos eventos.
 */
import type { DomainEvent } from '../events/event-store';

export interface OutboxEntry {
  id: string;
  aggregateId: string;
  eventType: string;
  payload: string; // serialized DomainEvent
  status: 'pending' | 'published' | 'failed';
  attempts: number;
  createdAt: number;
  nextRetryAt: number;
}

export interface IOutboxStore {
  add(event: DomainEvent): Promise<OutboxEntry>;
  claimBatch(limit: number): Promise<OutboxEntry[]>;
  markPublished(id: string): Promise<void>;
  markFailed(id: string, nextRetryAt: number): Promise<void>;
}

function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export class InMemoryOutboxStore implements IOutboxStore {
  private entries: OutboxEntry[] = [];

  async add(event: DomainEvent): Promise<OutboxEntry> {
    const entry: OutboxEntry = {
      id: newId('outbox'),
      aggregateId: event.aggregateId,
      eventType: event.eventType,
      payload: JSON.stringify(event),
      status: 'pending',
      attempts: 0,
      createdAt: Date.now(),
      nextRetryAt: Date.now(),
    };
    this.entries.push(entry);
    return structuredClone(entry);
  }

  async claimBatch(limit: number): Promise<OutboxEntry[]> {
    const now = Date.now();
    return this.entries
      .filter((e) => e.status === 'pending' && e.nextRetryAt <= now)
      .slice(0, limit)
      .map((e) => structuredClone(e));
  }

  async markPublished(id: string): Promise<void> {
    const e = this.entries.find((x) => x.id === id);
    if (e) e.status = 'published';
  }

  async markFailed(id: string, nextRetryAt: number): Promise<void> {
    const e = this.entries.find((x) => x.id === id);
    if (e) {
      e.status = 'pending';
      e.attempts += 1;
      e.nextRetryAt = nextRetryAt;
      if (e.attempts >= 10) e.status = 'failed';
    }
  }

  pendingCount(): number {
    return this.entries.filter((e) => e.status === 'pending').length;
  }
}

export type OutboxPublisher = (entry: OutboxEntry) => Promise<void>;

export class OutboxProcessor {
  private timer: ReturnType<typeof setInterval> | null = null;
  private publisher: OutboxPublisher;

  constructor(
    private readonly store: IOutboxStore,
    publisher: OutboxPublisher,
    private readonly opts: { pollIntervalMs?: number; batchSize?: number } = {},
  ) {
    this.publisher = publisher;
  }

  setPublisher(p: OutboxPublisher): void {
    this.publisher = p;
  }

  start(): void {
    if (this.timer) return;
    this.timer = setInterval(() => void this.drain(), this.opts.pollIntervalMs ?? 1000);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  async drain(): Promise<{ published: number; failed: number }> {
    const batch = await this.store.claimBatch(this.opts.batchSize ?? 50);
    let published = 0;
    let failed = 0;
    for (const entry of batch) {
      try {
        await this.publisher(entry);
        await this.store.markPublished(entry.id);
        published++;
      } catch {
        // exponential backoff: 2^attempts seconds, cap 5min
        const delayMs = Math.min(2 ** entry.attempts * 1000, 5 * 60 * 1000);
        await this.store.markFailed(entry.id, Date.now() + delayMs);
        failed++;
      }
    }
    return { published, failed };
  }
}
