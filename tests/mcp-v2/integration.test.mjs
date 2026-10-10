import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { AgentRegistry } from '../../dist/src/registry/agent-registry.js';
import { CircuitBreaker } from '../../dist/src/resilience/circuit-breaker.js';
import { withRetry, isRetryableError } from '../../dist/src/resilience/retry-policy.js';
import { withTimeout } from '../../dist/src/resilience/timeout.js';
import { filterByPermissions, canInvokeCapability } from '../../dist/src/sandbox/permission-filter.js';
import { invokeInSandbox } from '../../dist/src/sandbox/invoke-in-sandbox.js';
import { sanitizeArgs } from '../../dist/src/logging/sanitize.js';
import { McpClient } from '../../dist/src/client/mcp-client.js';

const TEST_AGENT_ID = 'test-agent-001';
const TEST_CALLER_ID = 'caller-agent';

const makeManifest = (overrides = {}) => ({
  agentId: TEST_AGENT_ID,
  name: 'TestAgent',
  version: '1.0.0',
  description: 'Test agent for MCP v2',
  capabilities: [
    { name: 'echo', version: '1.0', description: 'Echo capability', schema: {} },
    { name: 'compute', version: '1.0', description: 'Compute capability', schema: {} }
  ],
  permissions: ['agent:read', 'agent:invoke'],
  ...overrides
});

describe('MCP v2 — Agent Registry', () => {
  let registry;

  beforeEach(() => {
    registry = new AgentRegistry();
  });

  it('registers and discovers agent by name', async () => {
    const manifest = makeManifest();
    await registry.register(manifest);
    
    const results = await registry.discovery('TestAgent');
    assert.equal(results.length, 1);
    assert.equal(results[0].agentId, TEST_AGENT_ID);
  });

  it('discovers by capability name', async () => {
    const manifest = makeManifest();
    await registry.register(manifest);
    
    const results = await registry.discovery('echo');
    assert.equal(results.length, 1);
    assert.equal(results[0].capabilities[0].name, 'echo');
  });

  it('filters by caller permissions', async () => {
    const manifest = makeManifest({ permissions: ['admin:*'] });
    await registry.register(manifest);
    
    const noPerm = await registry.discovery('TestAgent', ['user:read']);
    assert.equal(noPerm.length, 0);
    
    const withPerm = await registry.discovery('TestAgent', ['admin:*']);
    assert.equal(withPerm.length, 1);
  });

  it('returns empty for unregistered agent', async () => {
    const results = await registry.discovery('nonexistent');
    assert.equal(results.length, 0);
  });
});

describe('MCP v2 — Circuit Breaker', () => {
  it('opens after threshold failures', async () => {
    const cb = new CircuitBreaker(3, 100);
    
    await assert.rejects(() => cb.execute(() => Promise.reject(new Error('fail'))));
    await assert.rejects(() => cb.execute(() => Promise.reject(new Error('fail'))));
    await assert.rejects(() => cb.execute(() => Promise.reject(new Error('fail'))));
    
    assert.equal(cb.getState(), 'OPEN');
    await assert.rejects(() => cb.execute(() => Promise.resolve('success')), /CircuitBreaker is OPEN/);
  });

  it('half-open allows single success to close', async () => {
    const cb = new CircuitBreaker(2, 10);
    
    await assert.rejects(() => cb.execute(() => Promise.reject(new Error('fail'))));
    await assert.rejects(() => cb.execute(() => Promise.reject(new Error('fail'))));
    assert.equal(cb.getState(), 'OPEN');
    
    // Wait for reset timeout - circuit stays OPEN until next execute() transitions it
    await new Promise(r => setTimeout(r, 20));
    
    // Next execute transitions to HALF_OPEN and on success closes
    const result = await cb.execute(() => Promise.resolve('ok'));
    assert.equal(result, 'ok');
    assert.equal(cb.getState(), 'CLOSED');
  });
});

describe('MCP v2 — Retry Policy', () => {
  it('retries on retryable error with exponential backoff', async () => {
    let attempts = 0;
    const err = { code: 'TIMEOUT', retryable: true };
    
    await assert.rejects(
      () => withRetry(() => { attempts++; throw err; }, { maxRetries: 3, baseDelayMs: 10, jitter: false }),
      { code: 'TIMEOUT' }
    );
    assert.equal(attempts, 4);
  });

  it('does not retry non-retryable error', async () => {
    let attempts = 0;
    const err = { code: 'NOT_FOUND', retryable: false };
    
    await assert.rejects(
      () => withRetry(() => { attempts++; throw err; }, { maxRetries: 3, baseDelayMs: 10 }),
      { code: 'NOT_FOUND' }
    );
    assert.equal(attempts, 1);
  });

  it('isRetryableError identifies retryable codes', () => {
    assert.ok(isRetryableError({ code: 'TIMEOUT', retryable: true }));
    assert.ok(isRetryableError({ code: 'RATE_LIMITED', retryable: true }));
    assert.ok(isRetryableError({ code: 'INTERNAL_ERROR', retryable: true }));
    assert.ok(!isRetryableError({ code: 'NOT_FOUND', retryable: false }));
    assert.ok(!isRetryableError({ code: 'SANDBOX_DENIED', retryable: false }));
  });
});

describe('MCP v2 — Timeout', () => {
  it('rejects with TIMEOUT when promise exceeds limit', async () => {
    const slow = new Promise(r => setTimeout(() => r('done'), 100));
    await assert.rejects(
      () => withTimeout(slow, 30),
      { code: 'TIMEOUT', retryable: true }
    );
  });

  it('resolves when promise completes in time', async () => {
    const fast = Promise.resolve('quick');
    const result = await withTimeout(fast, 1000);
    assert.equal(result, 'quick');
  });
});

describe('MCP v2 — Sandbox Permission Filter', () => {
  const manifest = makeManifest();
  
  it('allows when caller has permission', () => {
    assert.ok(canInvokeCapability(manifest, 'echo', ['agent:read', 'agent:invoke']));
  });

  it('denies when caller lacks permission', () => {
    assert.ok(!canInvokeCapability(manifest, 'echo', ['user:read']));
  });

  it('wildcard permission allows all', () => {
    assert.ok(canInvokeCapability(manifest, 'echo', ['*']));
  });

  it('filterByPermissions respects permissions', () => {
    const manifests = [
      makeManifest({ agentId: 'a1', permissions: ['admin:*'] }),
      makeManifest({ agentId: 'a2', permissions: ['*'] }),
      makeManifest({ agentId: 'a3', permissions: ['user:*'] })
    ];
    
    const admin = filterByPermissions(manifests, ['admin:*']);
    assert.equal(admin.length, 2);
    
    const user = filterByPermissions(manifests, ['user:read']);
    assert.equal(user.length, 1);
    assert.equal(user[0].agentId, 'a2');
  });
});

describe('MCP v2 — Sandbox Invoke', () => {
  let registry;

  beforeEach(() => {
    registry = new AgentRegistry();
  });

  it('invokes capability when permissions allow', async () => {
    const manifest = makeManifest();
    await registry.register(manifest);
    
    const result = await invokeInSandbox(
      TEST_AGENT_ID,
      'echo',
      { data: 'test' },
      async (args) => ({ echoed: args.data }),
      {
        callerId: TEST_CALLER_ID,
        callerPermissions: ['agent:read', 'agent:invoke'],
        registry
      }
    );
    assert.equal(result.echoed, 'test');
  });

  it('throws NOT_FOUND for unknown agent', async () => {
    await assert.rejects(
      () => invokeInSandbox('unknown', 'echo', {}, async () => {}, {
        callerId: TEST_CALLER_ID,
        callerPermissions: ['*'],
        registry
      }),
      { code: 'NOT_FOUND' }
    );
  });

  it('throws SANDBOX_DENIED when capability not permitted', async () => {
    const manifest = makeManifest({
      permissions: ['admin:*'],
      capabilities: [{ name: 'secret', version: '1.0' }]
    });
    await registry.register(manifest);
    
    await assert.rejects(
      () => invokeInSandbox(TEST_AGENT_ID, 'secret', {}, async () => {}, {
        callerId: TEST_CALLER_ID,
        callerPermissions: ['agent:read'],
        registry
      }),
      { code: 'SANDBOX_DENIED' }
    );
  });
});

describe('MCP v2 — Logging Sanitization', () => {
  it('redacts sensitive keys in args', () => {
    const args = { password: 'secret123', token: 'abc', normal: 'value' };
    const sanitized = sanitizeArgs(args);
    assert.equal(sanitized.password, '[REDACTED]');
    assert.equal(sanitized.token, '[REDACTED]');
    assert.equal(sanitized.normal, 'value');
  });

  it('redacts in nested objects', () => {
    const args = { outer: { inner: { apiKey: 'key123' } } };
    const sanitized = sanitizeArgs(args);
    assert.equal(sanitized.outer.inner.apiKey, '[REDACTED]');
  });

  it('redacts Bearer tokens', () => {
    const args = { auth: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' };
    const sanitized = sanitizeArgs(args);
    assert.equal(sanitized.auth, '[REDACTED]');
  });

  it('preserves non-sensitive data', () => {
    const args = { id: 123, name: 'test', list: [1,2,3] };
    const sanitized = sanitizeArgs(args);
    assert.deepEqual(sanitized, args);
  });
});

describe('MCP v2 — McpClient Integration', () => {
  let registry;
  let client;
  let errors = [];

  beforeEach(() => {
    registry = new AgentRegistry();
    errors = [];
    client = new McpClient({
      agentId: TEST_CALLER_ID,
      permissions: ['agent:read', 'agent:invoke'],
      registry,
      timeoutMs: 1000,
      maxRetries: 2
    });
    client.onError(e => errors.push(e));
  });

  it('discovers agents with permission filter', async () => {
    const manifest = makeManifest();
    await registry.register(manifest);
    
    const results = await client.discover('TestAgent');
    assert.equal(results.length, 1);
    assert.equal(results[0].agentId, TEST_AGENT_ID);
  });

  it('invoke throws error captured by onError', async () => {
    await assert.rejects(
      () => client.invoke('unknown-agent', 'echo', {}),
      { code: 'NOT_FOUND' }
    );
    assert.equal(errors.length, 1);
    assert.equal(errors[0].code, 'NOT_FOUND');
  });

  it('stream yields sanitized chunks', async () => {
    const manifest = makeManifest();
    await registry.register(manifest);
    
    const chunks = [];
    for await (const chunk of client.stream(TEST_AGENT_ID, 'echo', { msg: 'hi' })) {
      chunks.push(chunk);
    }
    assert.ok(chunks.length >= 2);
  });
});
