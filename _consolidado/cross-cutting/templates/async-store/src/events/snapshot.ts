import type { DomainEvent, IEventStore } from './event-store';

export interface Snapshot<TState = any> {
  aggregateId: string;
  aggregateType: string;
  version: number;
  state: TState;
  timestamp: number;
}

export interface ISnapshotStore {
  save(snapshot: Snapshot): Promise<void>;
  get(aggregateId: string): Promise<Snapshot | null>;
}

export class InMemorySnapshotStore implements ISnapshotStore {
  private snapshots = new Map<string, Snapshot>();

  async save(snapshot: Snapshot): Promise<void> {
    this.snapshots.set(snapshot.aggregateId, structuredClone(snapshot));
  }

  async get(aggregateId: string): Promise<Snapshot | null> {
    const snap = this.snapshots.get(aggregateId);
    return snap ? structuredClone(snap) : null;
  }
}

export interface SnapshotConfig {
  snapshotInterval: number; // e.g., every 50 events
}

export class SnapshotManager {
  constructor(
    private readonly snapshotStore: ISnapshotStore,
    private readonly eventStore: IEventStore,
    private readonly config: SnapshotConfig = { snapshotInterval: 50 }
  ) {}

  async shouldSnapshot(aggregateId: string, currentVersion: number): Promise<boolean> {
    const latest = await this.snapshotStore.get(aggregateId);
    const lastVersion = latest ? latest.version : 0;
    return currentVersion - lastVersion >= this.config.snapshotInterval;
  }

  async createSnapshot<TState>(
    aggregateId: string,
    aggregateType: string,
    state: TState,
    version: number
  ): Promise<void> {
    await this.snapshotStore.save({
      aggregateId,
      aggregateType,
      version,
      state,
      timestamp: Date.now(),
    });
  }

  async hydrate<TState>(
    aggregateId: string,
    applyEvent: (state: TState, event: DomainEvent) => TState,
    initialState: TState
  ): Promise<{ state: TState; version: number }> {
    const snapshot = await this.snapshotStore.get(aggregateId);
    let state: TState = snapshot ? snapshot.state : structuredClone(initialState);
    const fromVersion = snapshot ? snapshot.version : 0;

    const events = await this.eventStore.getEventsForAggregate(aggregateId);
    const relevantEvents = events.filter(e => e.version > fromVersion);

    for (const event of relevantEvents) {
      state = applyEvent(state, event);
    }

    const finalVersion = events.length > 0 ? events[events.length - 1].version : 0;
    return { state, version: finalVersion };
  }
}
