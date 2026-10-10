import { describe, it, expect } from 'vitest';
import { InMemoryEventStore, ConcurrencyError } from '../src/events/event-store';

const evt = (type: string) => ({
  aggregateId: 'agg-1',
  aggregateType: 'Order',
  eventType: type,
  payload: { v: 1 },
});

describe('InMemoryEventStore', () => {
  it('happy path: appends events with incrementing versions', async () => {
    const store = new InMemoryEventStore();
    const persisted = await store.append('agg-1', 0, [evt('OrderCreated'), evt('OrderPaid')]);
    expect(persisted).toHaveLength(2);
    expect(persisted[0]!.version).toBe(1);
    expect(persisted[1]!.version).toBe(2);
    expect(persisted[0]!.eventId).toBeTruthy();
  });

  it('edge case: first append on new aggregate accepts expectedVersion 0 or -1', async () => {
    const store = new InMemoryEventStore();
    await expect(store.append('new-agg', 0, [evt('Created')])).resolves.toHaveLength(1);
    await expect(store.append('other-agg', -1, [evt('Created')])).resolves.toHaveLength(1);
  });

  it('error handling: rejects on version conflict (optimistic concurrency)', async () => {
    const store = new InMemoryEventStore();
    await store.append('agg-1', 0, [evt('OrderCreated')]);
    await expect(store.append('agg-1', 0, [evt('OrderPaid')])).rejects.toBeInstanceOf(ConcurrencyError);
  });

  it('returns events ordered by version per aggregate', async () => {
    const store = new InMemoryEventStore();
    await store.append('agg-1', 0, [evt('A'), evt('B')]);
    await store.append('agg-2', 0, [evt('X')]);
    const events = await store.getEventsForAggregate('agg-1');
    expect(events.map((e) => e.eventType)).toEqual(['A', 'B']);
  });
});
