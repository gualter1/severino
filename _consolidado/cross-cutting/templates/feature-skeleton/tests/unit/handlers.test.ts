import { describe, it, expect, vi } from 'vitest';
import { CreateSampleHandler } from '../../src/application/handlers/create-sample.handler';
import { ActivateSampleHandler } from '../../src/application/handlers/activate-sample.handler';
import { CreateSampleCommand, ActivateSampleCommand } from '../../src/application/commands';
import { SampleEntity } from '../../src/domain/entities/sample.entity';
import { InMemoryEventBus } from '../../src/infrastructure/messaging/in-memory-event-bus';

function makeLogger() {
  return { info: vi.fn(), error: vi.fn(), debug: vi.fn() };
}

describe('CreateSampleHandler (unit)', () => {
  it('happy path: creates entity, saves, publishes event', async () => {
    const store = new Map<string, SampleEntity>();
    const bus = new InMemoryEventBus();
    const logger = makeLogger();
    const handler = new CreateSampleHandler({
      repository: {
        save: async (e) => {
          store.set(e.id, e);
        },
        findById: async (id) => store.get(id) ?? null,
      },
      eventBus: bus,
      logger,
      generateId: () => '00000000-0000-4000-8000-000000000010',
    });

    const id = await handler.execute(
      new CreateSampleCommand({ name: '  Checkout Flow  ' }, 'corr-1')
    );

    expect(id).toBe('00000000-0000-4000-8000-000000000010');
    expect(store.get(id)?.name).toBe('Checkout Flow');
    expect(bus.getPublishedEvents()).toHaveLength(1);
    expect(bus.getPublishedEvents()[0]?.eventName).toBe('feature.sample.created.v1');
    expect(logger.info).toHaveBeenCalledWith('feature.sample.created', expect.any(Object));
  });

  it('edge case: rejects short name with validation error', async () => {
    const bus = new InMemoryEventBus();
    const logger = makeLogger();
    const handler = new CreateSampleHandler({
      repository: {
        save: async () => {},
        findById: async () => null,
      },
      eventBus: bus,
      logger,
      generateId: () => 'x',
    });
    await expect(handler.execute(new CreateSampleCommand({ name: 'AB' }))).rejects.toThrow(
      /3–128/
    );
    expect(bus.getPublishedEvents()).toHaveLength(0);
  });
});

describe('ActivateSampleHandler (unit)', () => {
  it('happy path: activates and emits event', async () => {
    const entity = SampleEntity.create({
      id: '00000000-0000-4000-8000-000000000020',
      name: 'Activatable Entity',
      status: 'INACTIVE',
      metadata: {},
    });
    const store = new Map([[entity.id, entity]]);
    const bus = new InMemoryEventBus();
    const logger = makeLogger();
    const handler = new ActivateSampleHandler({
      repository: {
        save: async (e) => {
          store.set(e.id, e);
        },
        findById: async (id) => store.get(id) ?? null,
      },
      eventBus: bus,
      logger,
    });

    await handler.execute(new ActivateSampleCommand({ entityId: entity.id }, 'corr-2'));

    expect(store.get(entity.id)?.status).toBe('ACTIVE');
    expect(bus.getPublishedEvents()[0]?.eventName).toBe('feature.sample.activated.v1');
  });

  it('error handling: throws 404-equivalent on missing entity', async () => {
    const bus = new InMemoryEventBus();
    const logger = makeLogger();
    const handler = new ActivateSampleHandler({
      repository: {
        save: async () => {},
        findById: async () => null,
      },
      eventBus: bus,
      logger,
    });
    await expect(
      handler.execute(new ActivateSampleCommand({ entityId: 'missing-id' }))
    ).rejects.toThrow(/not found/);
  });

  it('error handling: blocks activation of ARCHIVED entity', async () => {
    const entity = SampleEntity.create({
      id: '00000000-0000-4000-8000-000000000021',
      name: 'Archived Entity',
      status: 'ARCHIVED',
      metadata: {},
    });
    const bus = new InMemoryEventBus();
    const logger = makeLogger();
    const handler = new ActivateSampleHandler({
      repository: {
        save: async () => {},
        findById: async () => entity,
      },
      eventBus: bus,
      logger,
    });
    await expect(
      handler.execute(new ActivateSampleCommand({ entityId: entity.id }))
    ).rejects.toThrow(/Cannot transition/);
  });
});
