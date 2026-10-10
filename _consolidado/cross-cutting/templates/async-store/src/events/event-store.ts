export interface DomainEvent<T = Record<string, any>> {
  eventId: string;
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  version: number;
  timestamp: number;
  payload: T;
  metadata?: {
    userId?: string;
    correlationId?: string;
    causationId?: string;
    [key: string]: any;
  };
}

export interface IEventStore {
  append(aggregateId: string, expectedVersion: number, events: Omit<DomainEvent, 'eventId' | 'timestamp' | 'version'>[]): Promise<DomainEvent[]>;
  getEventsForAggregate(aggregateId: string): Promise<DomainEvent[]>;
  getAllEvents(fromVersion?: number, limit?: number): Promise<DomainEvent[]>;
}

export class ConcurrencyError extends Error {
  constructor(aggregateId: string, expectedVersion: number, actualVersion: number) {
    super(`Concurrency conflict for aggregate ${aggregateId}: expected version ${expectedVersion}, but found ${actualVersion}`);
    this.name = 'ConcurrencyError';
  }
}

export class InMemoryEventStore implements IEventStore {
  private events: DomainEvent[] = [];

  async append(
    aggregateId: string,
    expectedVersion: number,
    newEvents: Omit<DomainEvent, 'eventId' | 'timestamp' | 'version'>[]
  ): Promise<DomainEvent[]> {
    const existingEvents = await this.getEventsForAggregate(aggregateId);
    const currentVersion = existingEvents.length > 0 ? existingEvents[existingEvents.length - 1].version : 0;

    if (expectedVersion !== -1 && currentVersion !== expectedVersion) {
      throw new ConcurrencyError(aggregateId, expectedVersion, currentVersion);
    }

    const persistedEvents: DomainEvent[] = newEvents.map((e, index) => ({
      ...e,
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      aggregateId,
      version: currentVersion + index + 1,
      timestamp: Date.now(),
    }));

    this.events.push(...persistedEvents);
    return persistedEvents;
  }

  async getEventsForAggregate(aggregateId: string): Promise<DomainEvent[]> {
    return this.events
      .filter(e => e.aggregateId === aggregateId)
      .sort((a, b) => a.version - b.version);
  }

  async getAllEvents(fromSequence: number = 0, limit: number = 100): Promise<DomainEvent[]> {
    return this.events
      .slice(fromSequence, fromSequence + limit);
  }
}
