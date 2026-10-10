import { describe, it, expect } from 'vitest';
import { InMemoryEventStore } from '../src/events/event-store';
import { Projection, InMemoryCheckpointStore } from '../src/events/projection';

interface Counter { count: number; }

describe('Projection', () => {
  const setup = () => {
    const store = new InMemoryEventStore();
    const checkpoints = new InMemoryCheckpointStore();
    const projection = new Projection<Counter>(
      'counter',
      { count: 0 },
      {
        Incremented: (s) => ({ count: s.count + 1 }),
        Reset: () => ({ count: 0 }),
      },
      store,
      checkpoints,
    );
    return { store, projection };
  };

  it('happy path: rebuild folds all events in order', async () => {
    const { store, projection } = setup();
    await store.append('a', 0, [
      { aggregateId: 'a', aggregateType: 'T', eventType: 'Incremented', payload: {} },
      { aggregateId: 'a', aggregateType: 'T', eventType: 'Incremented', payload: {} },
    ]);
    const state = await projection.rebuild();
    expect(state.count).toBe(2);
  });

  it('edge case: unknown event types are ignored', async () => {
    const { store, projection } = setup();
    await store.append('a', 0, [
      { aggregateId: 'a', aggregateType: 'T', eventType: 'SomethingElse', payload: {} },
    ]);
    const state = await projection.rebuild();
    expect(state.count).toBe(0);
  });

  it('catchUp processes only new events after checkpoint', async () => {
    const { store, projection } = setup();
    await store.append('a', 0, [
      { aggregateId: 'a', aggregateType: 'T', eventType: 'Incremented', payload: {} },
    ]);
    await projection.rebuild();
    await store.append('a', 1, [
      { aggregateId: 'a', aggregateType: 'T', eventType: 'Incremented', payload: {} },
    ]);
    const state = await projection.catchUp();
    expect(state.count).toBe(2);
  });
});
