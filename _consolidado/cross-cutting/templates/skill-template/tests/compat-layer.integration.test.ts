/**
 * compat-layer.integration.test.ts — Test Suite Parametrizada (V1 + V2)
 * Valida o Bridge Pattern garantindo comportamento idêntico em ambos os runtimes.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createPluginCore, detectVersion, getAdapter, V1Adapter, V2Adapter } from '../src/compat-layer';
import { MockV1Harness } from './mocks/mock-v1-harness';
import { MockV2Harness } from './mocks/mock-v2-harness';

describe('CompatLayer Integration Suite', () => {
  // ============================================================
  // TESTE 1: Runtime Detection Performance (<1ms)
  // ============================================================
  describe('Runtime Feature Detection (<1ms)', () => {
     afterEach(() => {
       delete (globalThis as any).opencode;
     });

     it('detecta V1 corretamente em <1ms', () => {
       const v1 = new MockV1Harness();
       v1.install();

       const start = performance.now();
       const version = detectVersion();
       const duration = performance.now() - start;

       expect(version).toBe('v1');
       expect(duration).toBeLessThan(1);
       v1.uninstall();
     });

     it('detecta V2 corretamente em <1ms', () => {
       const v2 = new MockV2Harness();
       v2.install();

       const start = performance.now();
       const version = detectVersion();
       const duration = performance.now() - start;

       expect(version).toBe('v2');
       expect(duration).toBeLessThan(1);
       v2.uninstall();
     });
  });

  // ============================================================
  // TESTE PARAMETRIZADO: Roda exatos mesmos testes para V1 e V2
  // ============================================================
  const runtimes: Array<{ name: 'v1' | 'v2'; setup: () => { install: () => void; uninstall: () => void } }> = [
    { name: 'v1', setup: () => new MockV1Harness() },
    { name: 'v2', setup: () => new MockV2Harness() },
  ];

  runtimes.forEach(({ name: runtimeName, setup }) => {
    describe(`Runtime: OpenCode ${runtimeName.toUpperCase()}`, () => {
      let harness: any;
      let plugin: ReturnType<typeof createPluginCore>;

      beforeEach(() => {
        harness = setup();
        harness.install();
        // Força recriação do adapter singleton limpando módulo ou passando adapter
        plugin = createPluginCore();
      });

      afterEach(() => {
        harness.uninstall();
      });

      it(`[${runtimeName}] inicializa com sucesso`, async () => {
        await expect(plugin.initialize({ testMode: true })).resolves.not.toThrow();
      });

      it(`[${runtimeName}] executa storage operations (get, set, delete, keys)`, async () => {
        const adapter = getAdapter();

        // set
        await adapter.storage.set('test:key1', { foo: 'bar' });
        await adapter.storage.set('test:key2', 42);

        // get
        const val1 = await adapter.storage.get<{ foo: string }>('test:key1');
        const val2 = await adapter.storage.get<number>('test:key2');
        expect(val1).toEqual({ foo: 'bar' });
        expect(val2).toEqual(42);

        // keys
        const keys = await adapter.storage.keys('test:');
        expect(keys).toContain('test:key1');
        expect(keys).toContain('test:key2');

        // delete
        await adapter.storage.delete('test:key1');
        const deletedVal = await adapter.storage.get('test:key1');
        expect(deletedVal).toBeNull();
      });

      it(`[${runtimeName}] executa host tools (listTools, tool)`, async () => {
        const adapter = getAdapter();

        const tools = await adapter.exec.listTools();
        expect(Array.isArray(tools)).toBe(true);
        expect(tools.length).toBeGreaterThan(0);

        const result = await adapter.exec.tool<{ path: string }, { content: string }>('read_file', { path: 'README.md' });
        expect(result).toBeDefined();
        expect(result.content).toContain('README.md' + (runtimeName === 'v2' ? '' : ''));
      });

      it(`[${runtimeName}] valida network fetch e allowlist`, async () => {
        const adapter = getAdapter();

        const allowed = adapter.network.isAllowed('https://api.github.com/repos/opencode');
        expect(allowed).toBe(true);

        const blocked = adapter.network.isAllowed('https://malicious-site.com/exfiltrate');
        expect(blocked).toBe(false);

        if (runtimeName === 'v1') {
          // V1 usa tool http_fetch via bridge
          const res = await adapter.network.fetch('https://api.github.com/repos/opencode');
          expect(res.status).toBe(200);
        } else {
          // V2 fetch nativo
          const res = await adapter.network.fetch('https://api.github.com/repos/opencode');
          expect(res.status).toBe(200);
        }
      });

      it(`[${runtimeName}] expõe ambiente consistente (env)`, async () => {
        const adapter = getAdapter();
        expect(adapter.env.version).toContain(runtimeName);
        expect(adapter.env.workspaceRoot).toBeDefined();
        expect(adapter.env.tempDir).toBeDefined();
        expect(adapter.env.isV2).toBe(runtimeName === 'v2');
      });

      it(`[${runtimeName}] executa healthCheck com sucesso`, async () => {
        const health = await plugin.healthCheck();
        expect(health.healthy).toBe(true);
        expect(health.version).toContain(runtimeName);
        expect(health.checks.storage).toBe(true);
        expect(health.checks.network).toBe(true);
        expect(health.checks.tools).toBe(true);
      });

      it(`[${runtimeName}] executa plugin run end-to-end`, async () => {
        const output = await plugin.run({ action: 'ping', target: 'integration' });
        expect(output.success).toBe(true);
        expect(output.data).toBeDefined();
        expect(output.metadata?.runId).toBeDefined();
      });

      it(`[${runtimeName}] executa shutdown corretamente`, async () => {
        await expect(plugin.shutdown()).resolves.not.toThrow();
      });
    });
  });
});
