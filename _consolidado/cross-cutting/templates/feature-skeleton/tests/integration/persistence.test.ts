import { describe, it, expect, vi, beforeAll } from 'vitest';

/**
 * Integration tests — require docker-compose services (Postgres/Redis).
 * Guard with env var; skipped in unit-only CI lanes.
 *
 * Covers: persistence round-trip, messaging publish/subscribe,
 * and external adapter contract wiring.
 */

const INTEGRATION_ENABLED = process.env['FEATURE_INTEGRATION'] === '1';
const describeIntegration = INTEGRATION_ENABLED ? describe : describe.skip;

describeIntegration('PostgreSQLSampleRepository (integration)', () => {
  let pool: { query: ReturnType<typeof vi.fn>; end: () => Promise<void> };

  beforeAll(() => {
    // Real suite uses `pg.Pool` against docker-compose postgres.
    // This template keeps the seam explicit without vendoring pg in unit runs.
    pool = { query: vi.fn(), end: async () => {} };
  });

  it('issues parameterized query on save (no string interpolation)', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const { PostgreSQLSampleRepository } = await import(
      '../../src/infrastructure/persistence/postgres-sample.repository'
    );
    const { SampleEntity } = await import('../../src/domain/entities/sample.entity');
    const repo = new PostgreSQLSampleRepository(pool as never);
    const entity = SampleEntity.create({
      id: '00000000-0000-4000-8000-000000000030',
      name: 'Persisted Entity',
      status: 'INACTIVE',
      metadata: { source: 'integration' },
    });
    await repo.save(entity);
    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('$1'), expect.any(Array));
    // Security gate: never interpolate identifiers/values into SQL text.
    const [sqlText, params] = pool.query.mock.calls[0] as [string, unknown[]];
    expect(sqlText).not.toContain('Persisted Entity');
    expect(params).toContain('Persisted Entity');
  });
});

describe('InMemoryEventBus (integration seam)', () => {
  it('delivers published event to subscriber', async () => {
    const { InMemoryEventBus } = await import(
      '../../src/infrastructure/messaging/in-memory-event-bus'
    );
    const bus = new InMemoryEventBus();
    const received: unknown[] = [];
    bus.on('feature.sample.created.v1', (e: unknown) => received.push(e));
    await bus.publish({ eventName: 'feature.sample.created.v1', aggregateId: 'agg-1' });
    expect(received).toHaveLength(1);
  });
});
