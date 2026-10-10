import type { DomainEvent, IEventStore } from './event-store';

export interface ProjectionCheckpoint {
  projectionName: string;
  lastProcessedSequence: number;
  updatedAt: number;
}

export interface ICheckpointStore {
  getCheckpoint(projectionName: string): Promise<ProjectionCheckpoint | null>;
  saveCheckpoint(checkpoint: ProjectionCheckpoint): Promise<void>;
}

export class InMemoryCheckpointStore implements ICheckpointStore {
  private checkpoints = new Map<string, ProjectionCheckpoint>();

  async getCheckpoint(name: string): Promise<ProjectionCheckpoint | null> {
    return this.checkpoints.get(name) ?? null;
  }

  async saveCheckpoint(cp: ProjectionCheckpoint): Promise<void> {
    this.checkpoints.set(cp.projectionName, cp);
  }
}

export type ProjectorFn<TState> = (
  state: TState,
  event: DomainEvent
) => TState | Promise<TState>;

/**
 * Replayable async projection with checkpointing.
 * Supports full rebuild and incremental catch-up.
 */
export class Projection<TState> {
  private state: TState;

  constructor(
    public readonly name: string,
    private readonly initialState: TState,
    private readonly projectors: Record<string, ProjectorFn<TState>>,
    private readonly eventStore: IEventStore,
    private readonly checkpointStore: ICheckpointStore
  ) {
    this.state = structuredClone(initialState);
  }

  getState(): TState {
    return structuredClone(this.state);
  }

  async rebuild(): Promise<TState> {
    this.state = structuredClone(this.initialState);
    const events = await this.eventStore.getAllEvents(0, Number.MAX_SAFE_INTEGER);
    for (const event of events) {
      await this.apply(event);
    }
    await this.checkpointStore.saveCheckpoint({
      projectionName: this.name,
      lastProcessedSequence: events.length,
      updatedAt: Date.now(),
    });
    return this.getState();
  }

  async catchUp(): Promise<TState> {
    const cp = await this.checkpointStore.getCheckpoint(this.name);
    const from = cp ? cp.lastProcessedSequence : 0;
    const events = await this.eventStore.getAllEvents(from, Number.MAX_SAFE_INTEGER);
    for (const event of events) {
      await this.apply(event);
    }
    await this.checkpointStore.saveCheckpoint({
      projectionName: this.name,
      lastProcessedSequence: from + events.length,
      updatedAt: Date.now(),
    });
    return this.getState();
  }

  private async apply(event: DomainEvent): Promise<void> {
    const projector = this.projectors[event.eventType];
    if (projector) {
      this.state = await projector(this.state, event);
    }
  }
}
