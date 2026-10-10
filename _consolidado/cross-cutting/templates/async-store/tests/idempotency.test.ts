import { describe, it, expect } from 'vitest';
import { InMemoryIdempotencyStore } from '../src/middleware/idempotency';

describe('InMemoryIdempotencyStore', () => {
  it('happy path: stores and retrieves result', async () => {
    const store = new InMemoryIdempotencyStore();
    const result = { success: true, events: [{}] as any };
    await store.set('key-1', result);
    const got = await store.get('key-1');
    expect(got).toEqual(result);
  });

  it('edge case: missing key returns null', async () => {
    const store = new InMemoryIdempotencyStore();
    const got = await store.get('missing');
    expect(got).toBeNull();
  });

  it('error handling: expired entries are purged on get', async () => {
    const store = new InMemoryIdempotencyStore();
    await store.set('key-1', { success: true }, 1); // 1ms TTL
    await new Promise((r) => setTimeout(r, 5));
    const got = await store.get('key-1');
    expect(got).toBeNull();
  });

  it('purgeExpired removes all expired entries', async () => {
    const store = new InMemoryIdempotencyStore();
    await store.set('k1', { success: true }, 1);
    await store.set('k2', { success: true }, 1000);
    await new Promise((r) => setTimeout(r, 5));
    const purged = await store.purgeExpired();
    expect(purged).toBe(1);
    expect(await store.get('k1')).toBeNull();
    expect(await store.get('k2')).toBeTruthy();
  });
});