import { describe, it, expect } from 'vitest';
import { InMemoryEventStore } from '../src/events/event-store';
import { CommandBus } from '../src/commands/command-bus';
import { ValidationError, AuthorizationError } from '../src/commands/command-handler';
import { InMemoryIdempotencyStore } from '../src/middleware/idempotency';

const cmd = (id: string, type: string, aggregateId = 'agg-1') => ({
  commandId: id,
  commandType: type,
  aggregateId,
  aggregateType: 'Order',
  payload: { foo: 'bar', id: 'x-1' },
});

function setup() {
  const eventStore = new InMemoryEventStore();
  const idem = new InMemoryIdempotencyStore();
  const bus = new CommandBus(
    eventStore,
    (k) => idem.get(k),
    (k, r) => idem.set(k, r),
  );
  return { eventStore, bus, idem };
}

describe('CommandBus', () => {
  it('happy path: validates → authorizes → handles → persists events', async () => {
    const { bus, eventStore } = setup();
    bus.register({
      commandType: 'CreateOrder',
      validate: (c) => { if (!c.payload.id) throw new ValidationError('missing id'); },
      authorize: () => {},
      handle: async (c) => [{
        aggregateId: c.aggregateId,
        aggregateType: c.aggregateType,
        eventType: 'OrderCreated',
        payload: c.payload,
      }],
    });

    const res = await bus.dispatch(cmd('cmd-1', 'CreateOrder'));
    expect(res.success).toBe(true);
    expect(res.events).toHaveLength(1);
    const stored = await eventStore.getEventsForAggregate('agg-1');
    expect(stored[0]!.eventType).toBe('OrderCreated');
  });

  it('validation error returns failure without persisting', async () => {
    const { bus, eventStore } = setup();
    bus.register({
      commandType: 'CreateOrder',
      validate: (c) => { if (!c.payload.id) throw new ValidationError('missing id'); },
      authorize: () => {},
      handle: async () => [{ aggregateId: 'x', aggregateType: 'X', eventType: 'X', payload: {} }],
    });

    const res = await bus.dispatch({ ...cmd('cmd-1', 'CreateOrder'), payload: {} as any });
    expect(res.success).toBe(false);
    expect(res.error).toContain('missing id');
    const stored = await eventStore.getEventsForAggregate('agg-1');
    expect(stored).toHaveLength(0);
  });

  it('authorization error returns failure', async () => {
    const { bus } = setup();
    bus.register({
      commandType: 'CreateOrder',
      validate: () => {},
      authorize: () => { throw new AuthorizationError('not allowed'); },
      handle: async () => [{ aggregateId: 'x', aggregateType: 'X', eventType: 'X', payload: {} }],
    });

    const res = await bus.dispatch(cmd('cmd-1', 'CreateOrder'));
    expect(res.success).toBe(false);
    expect(res.error).toContain('not allowed');
  });

  it('optimistic concurrency: rejects on version mismatch', async () => {
    const { bus } = setup();
    bus.register({
      commandType: 'CreateOrder',
      validate: () => {},
      authorize: () => {},
      handle: async (c) => [{
        aggregateId: c.aggregateId,
        aggregateType: c.aggregateType,
        eventType: 'OrderCreated',
        payload: c.payload,
      }],
    });

    await bus.dispatch(cmd('cmd-1', 'CreateOrder', 'agg-1'));
    const res = await bus.dispatch({ ...cmd('cmd-2', 'CreateOrder', 'agg-1'), payload: { id: 'x-2', foo: 'bar' } }, 0);
    expect(res.success).toBe(false);
    expect(res.error).toContain('Concurrency conflict');
  });
});

describe('Idempotency via CommandBus', () => {
  it('returns cached result on duplicate idempotencyKey', async () => {
    const { bus } = setup();
    bus.register({
      commandType: 'CreateOrder',
      validate: () => {},
      authorize: () => {},
      handle: async (c) => [{
        aggregateId: c.aggregateId,
        aggregateType: c.aggregateType,
        eventType: 'OrderCreated',
        payload: c.payload,
      }],
    });

    const first = await bus.dispatch({ ...cmd('cmd-1', 'CreateOrder'), idempotencyKey: 'idem-1' });
    const second = await bus.dispatch({ ...cmd('cmd-2', 'CreateOrder'), idempotencyKey: 'idem-1' });

    expect(second.success).toBe(true);
    expect(second.events).toEqual(first.events);
    expect(second.events![0]!.eventId).toBe(first.events![0]!.eventId);
  });
});
