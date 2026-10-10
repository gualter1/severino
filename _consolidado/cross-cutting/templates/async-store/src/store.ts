/**
 * AsyncStore — façade canônica do template async-store (ADR-002).
 *
 * Agrega EventStore, SnapshotManager, CommandBus, Projections,
 * SubscriptionManager e Outbox em uma API coesa.
 * Cross-refs: ADR-001 (packaging), ADR-003 (multi-agent consumers), ADR-014 (logging).
 */
import { InMemoryEventStore, type IEventStore, type DomainEvent } from './events/event-store';
import { InMemorySnapshotStore, SnapshotManager, type ISnapshotStore } from './events/snapshot';
import { InMemoryCheckpointStore, Projection, type ICheckpointStore } from './events/projection';
import { CommandBus } from './commands/command-bus';
import { SubscriptionManager } from './subscriptions/subscription-manager';
import { InMemoryOutboxStore, OutboxProcessor } from './middleware/outbox';
import { InMemoryIdempotencyStore } from './middleware/idempotency';

export interface AsyncStoreConfig {
  snapshotInterval?: number;
  outboxPollIntervalMs?: number;
}

export class AsyncStore {
  readonly eventStore: IEventStore;
  readonly snapshotStore: ISnapshotStore;
  readonly snapshotManager: SnapshotManager;
  readonly checkpointStore: ICheckpointStore;
  readonly commandBus: CommandBus;
  readonly subscriptions: SubscriptionManager;
  readonly outboxStore: InMemoryOutboxStore;
  readonly outboxProcessor: OutboxProcessor;
  readonly idempotencyStore: InMemoryIdempotencyStore;

  private projections = new Map<string, Projection<unknown>>();

  constructor(config: AsyncStoreConfig = {}) {
    this.eventStore = new InMemoryEventStore();
    this.snapshotStore = new InMemorySnapshotStore();
    this.snapshotManager = new SnapshotManager(
      this.snapshotStore,
      this.eventStore,
      { snapshotInterval: config.snapshotInterval ?? 50 },
    );
    this.checkpointStore = new InMemoryCheckpointStore();
    this.subscriptions = new SubscriptionManager();
    this.outboxStore = new InMemoryOutboxStore();
    this.outboxProcessor = new OutboxProcessor(
      this.outboxStore,
      async (entry) => {
        // Default publish: fan-out via SubscriptionManager
        // Override via outboxProcessor.setPublisher() for external brokers
        const event = JSON.parse(entry.payload) as DomainEvent<Record<string, unknown>>;
        await this.subscriptions.publish(event);
      },
      { pollIntervalMs: config.outboxPollIntervalMs ?? 1000 },
    );
    this.idempotencyStore = new InMemoryIdempotencyStore();
    this.commandBus = new CommandBus(
      this.eventStore,
      (key) => this.idempotencyStore.get(key),
      (key, result) => this.idempotencyStore.set(key, result),
    );
  }

  registerProjection<TState>(projection: Projection<TState>): void {
    if (this.projections.has(projection.name)) {
      throw new Error(`Projection already registered: ${projection.name}`);
    }
    this.projections.set(projection.name, projection);
  }

  getProjection<TState>(name: string): Projection<TState> | undefined {
    return this.projections.get(name) as Projection<TState> | undefined;
  }

  startOutbox(): void {
    this.outboxProcessor.start();
  }

  stopOutbox(): void {
    this.outboxProcessor.stop();
  }
}

/** Factory — prefer over `new AsyncStore()` in tests for DI. */
export function createAsyncStore(config?: AsyncStoreConfig): AsyncStore {
  return new AsyncStore(config);
}
