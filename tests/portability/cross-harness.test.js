/**
 * Portability Test Suite — validates CapabilityDetector, SkillCore, and ShapeAdapters A, B, C
 * across simulated harness / capabilities combinations.
 */

import test from 'node:test';
import assert from 'node:assert';
import { CapabilityDetector, MIN_FEATURES, FULL_FEATURES } from '../src/capability';
import { SkillCore } from '../src/core';
import { ShapeAdapterA, ShapeAdapterB, ShapeAdapterC } from '../src/shape';
import { createCounterSkill } from '../examples/counter-skill';
import { createFileOpSkill } from '../examples/file-op-skill';
import { createSandboxAgentSkill } from '../examples/sandbox-agent-skill';

test('CapabilityDetector defaults and overrides', () => {
  const detDefault = new CapabilityDetector({ env: {} });
  assert.ok(detDefault.hasFeature('fileSystem'));

  const detMin = new CapabilityDetector({ level: 'min' });
  assert.strictEqual(detMin.getLevel(), 'min');
  assert.ok(detMin.hasFeature('toolUse'));
  assert.strictEqual(detMin.hasFeature('workspaceEdit'), false);

  const detFull = new CapabilityDetector({ level: 'full' });
  assert.strictEqual(detFull.getLevel(), 'full');
  assert.ok(detFull.hasFeature('workspaceEdit'));
  assert.ok(detFull.hasFeature('streaming'));

  // supports alias
  assert.strictEqual(detFull.supports('streaming'), true);

  // when helper
  const val = detFull.when(
    'streaming',
    () => 'stream-ok',
    () => 'fallback-ok'
  );
  assert.strictEqual(val, 'stream-ok');
});

test('ShapeAdapterA translation', async () => {
  const adapter = new ShapeAdapterA();
  const coreInput = adapter.toCore({
    event: 'on_message',
    payload: JSON.stringify({ action: 'increment' }),
    cwd: '/tmp',
  });
  assert.deepStrictEqual(coreInput.payload, { action: 'increment' });
  assert.strictEqual(coreInput.correlationId, 'on_message:/tmp');

  const harnessRes = adapter.fromCore({ ok: true, data: { count: 1 } });
  assert.strictEqual(harnessRes.exitCode, 0);
  assert.ok(harnessRes.stdout?.includes('count'));
});

test('ShapeAdapterB translation', async () => {
  const adapter = new ShapeAdapterB();
  const coreInput = adapter.toCore({ opencodeContext: {}, input: { test: true } });
  assert.deepStrictEqual(coreInput.payload, { test: true });

  const res = adapter.fromCore({ ok: true, data: 'ok' });
  assert.strictEqual(res.value, 'ok');
});

test('ShapeAdapterC translation', async () => {
  const adapter = new ShapeAdapterC();
  const coreInput = adapter.toCore({
    instructionsPath: 'skill.md',
    variables: { foo: 'bar' },
    cwd: '/tmp',
  });
  assert.deepStrictEqual(coreInput.payload, { path: 'skill.md', variables: { foo: 'bar' } });

  const res = adapter.fromCore({ ok: true });
  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.outputPath, 'success.json');
});

test('End-to-end Counter Skill with adapters', async () => {
  const detector = new CapabilityDetector({ level: 'min' });
  const skill = createCounterSkill(detector);
  skill.initialize();

  const out = await skill.run({ payload: { action: 'increment', amount: 5 } });
  assert.strictEqual(out.ok, true);
  assert.strictEqual(out.data?.count, 5);
  assert.strictEqual(out.data?.persisted, false); // min caps -> no workspaceEdit

  skill.shutdown();
  assert.strictEqual(skill.isInitialized, false);
});

test('End-to-end FileOp Skill with full caps', async () => {
  const detector = new CapabilityDetector({ level: 'full' });
  const skill = createFileOpSkill(detector);
  skill.initialize();

  const writeRes = await skill.run({ payload: { path: 'test.txt', content: 'hello cross-harness', mode: 'write' } });
  assert.strictEqual(writeRes.ok, true);

  const readRes = await skill.run({ payload: { path: 'test.txt', mode: 'read' } });
  assert.strictEqual(readRes.ok, true);
  assert.strictEqual(readRes.data?.content, 'hello cross-harness');
});

test('End-to-end Sandbox Agent Skill', async () => {
  const detector = new CapabilityDetector({ level: 'min' });
  const skill = createSandboxAgentSkill(detector);
  skill.initialize();

  const out = await skill.run({ payload: { task: 'compile', code: 'console.log(1)' } });
  assert.strictEqual(out.ok, true);
  assert.strictEqual(out.data?.sandboxUsed, false);
  assert.ok(out.data?.result.includes('INLINE-FALLBACK'));
});
