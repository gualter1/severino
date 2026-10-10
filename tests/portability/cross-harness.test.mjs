/**
 * Portability Test Suite — validates CapabilityDetector, SkillCore, and ShapeAdapters A, B, C
 * across simulated harness / capabilities combinations.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { CapabilityDetector, MIN_FEATURES, FULL_FEATURES } from '../../src/capability/index.ts';
import { SkillCore } from '../../src/core/index.ts';
import { ShapeAdapterA, ShapeAdapterB, ShapeAdapterC } from '../../src/shape/index.ts';
import { createCounterSkill } from '../../examples/counter-skill.ts';
import { createFileOpSkill } from '../../examples/file-op-skill.ts';
import { createSandboxAgentSkill } from '../../examples/sandbox-agent-skill.ts';

test('CapabilityDetector defaults and overrides', () => {
  const detDefault = new CapabilityDetector({ env: {} });
  assert.ok(detDefault.hasFeature('fileSystem'));

  const detMin = new CapabilityDetector({ level: 'min' });
  assert.equal(detMin.getLevel(), 'min');
  assert.ok(detMin.hasFeature('toolUse'));
  assert.equal(detMin.hasFeature('workspaceEdit'), false);

  const detFull = new CapabilityDetector({ level: 'full' });
  assert.equal(detFull.getLevel(), 'full');
  assert.ok(detFull.hasFeature('workspaceEdit'));
  assert.ok(detFull.hasFeature('streaming'));

  // supports alias
  assert.equal(detFull.supports('streaming'), true);

  // when helper
  const val = detFull.when(
    'streaming',
    () => 'stream-ok',
    () => 'fallback-ok'
  );
  assert.equal(val, 'stream-ok');
});

test('ShapeAdapterA translation', async () => {
  const adapter = new ShapeAdapterA();
  const coreInput = adapter.toCore({
    event: 'on_message',
    payload: JSON.stringify({ action: 'increment' }),
    cwd: '/tmp',
  });
  assert.deepEqual(coreInput.payload, { action: 'increment' });
  assert.equal(coreInput.correlationId, 'on_message:/tmp');

  const harnessRes = adapter.fromCore({ ok: true, data: { count: 1 } });
  assert.equal(harnessRes.exitCode, 0);
  assert.ok(harnessRes.stdout?.includes('count'));
});

test('ShapeAdapterB translation', async () => {
  const adapter = new ShapeAdapterB();
  const coreInput = adapter.toCore({ opencodeContext: {}, input: { test: true } });
  assert.deepEqual(coreInput.payload, { test: true });

  const res = adapter.fromCore({ ok: true, data: 'ok' });
  assert.equal(res.value, 'ok');
});

test('ShapeAdapterC translation', async () => {
  const adapter = new ShapeAdapterC();
  const coreInput = adapter.toCore({
    instructionsPath: 'skill.md',
    variables: { foo: 'bar' },
    cwd: '/tmp',
  });
  assert.deepEqual(coreInput.payload, { path: 'skill.md', variables: { foo: 'bar' } });

  const res = adapter.fromCore({ ok: true });
  assert.equal(res.ok, true);
  assert.equal(res.outputPath, 'success.json');
});

test('End-to-end Counter Skill with adapters', async () => {
  const detector = new CapabilityDetector({ level: 'min' });
  const skill = createCounterSkill(detector);
  skill.initialize();

  const out = await skill.run({ payload: { action: 'increment', amount: 5 } });
  assert.equal(out.ok, true);
  assert.equal(out.data?.count, 5);
  assert.equal(out.data?.persisted, false); // min caps -> no workspaceEdit

  skill.shutdown();
  assert.equal(skill.isInitialized, false);
});

test('End-to-end FileOp Skill with full caps', async () => {
  const detector = new CapabilityDetector({ level: 'full' });
  const skill = createFileOpSkill(detector);
  skill.initialize();

  const writeRes = await skill.run({ payload: { path: 'test.txt', content: 'hello cross-harness', mode: 'write' } });
  assert.equal(writeRes.ok, true);

  const readRes = await skill.run({ payload: { path: 'test.txt', mode: 'read' } });
  assert.equal(readRes.ok, true);
  assert.equal(readRes.data?.content, 'hello cross-harness');
});

test('End-to-end Sandbox Agent Skill', async () => {
  const detector = new CapabilityDetector({ level: 'min' });
  const skill = createSandboxAgentSkill(detector);
  skill.initialize();

  const out = await skill.run({ payload: { task: 'compile', code: 'console.log(1)' } });
  assert.equal(out.ok, true);
  assert.equal(out.data?.sandboxUsed, false);
  assert.ok(out.data?.result.includes('INLINE-FALLBACK'));
});
