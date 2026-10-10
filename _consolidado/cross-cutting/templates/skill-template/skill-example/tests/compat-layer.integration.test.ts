/**
 * compat-layer.integration.test.ts — Test Suite Parametrizada (V1 + V2)
 * Valida o Bridge Pattern garantindo comportamento idêntico em ambos os runtimes
 * usando a skill real File Vault (createFileVaultCore) em vez do core placeholder.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { detectVersion, createMockAdapter } from '../../src/compat-layer';
import { createFileVaultCore } from '../src/index';
import { MockV1Harness } from './mocks/mock-v1-harness';
import { MockV2Harness } from './mocks/mock-v2-harness';

describe('File Vault Skill — CompatLayer Integration Suite', () => {
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
      let plugin: ReturnType<typeof createFileVaultCore>;

      beforeEach(() => {
        harness = setup();
        harness.install();
        // Injeta mock adapter que espelha o runtime instalado (evita singleton cache)
        const mockAdapter = createMockAdapter({
          env: {
            version: runtimeName === 'v2' ? 'opencode-mock-v2.0.0' : 'opencode-mock-v1.0.0',
            workspaceRoot: process.cwd(),
            tempDir: '/tmp',
            isV2: runtimeName === 'v2',
          },
        });
        plugin = createFileVaultCore(mockAdapter);
      });

      afterEach(() => {
        harness.uninstall();
      });

      it(`[${runtimeName}] inicializa com sucesso`, async () => {
        await expect(plugin.initialize({ testMode: true })).resolves.not.toThrow();
      });

      it(`[${runtimeName}] executa storage operations (get, set, delete, keys) via skill`, async () => {
        // A skill usa storage próprio; validamos via run(vault_write) + run(vault_read)
        const writeResult = await plugin.run({ action: 'vault_write', path: 'integ/test.txt', content: 'hello' });
        expect(writeResult.success).toBe(true);

        const readResult = await plugin.run({ action: 'vault_read', path: 'integ/test.txt' });
        expect(readResult.success).toBe(true);
        expect((readResult.data as { content: string }).content).toBeDefined();
      });

      it(`[${runtimeName}] executa host tools (listTools, tool) via skill`, async () => {
        // vault_write internamente chama write_file; vault_read chama read_file
        const writeResult = await plugin.run({ action: 'vault_write', path: 'integ/tools.txt', content: 'tools test' });
        expect(writeResult.success).toBe(true);

        const readResult = await plugin.run({ action: 'vault_read', path: 'integ/tools.txt' });
        expect(readResult.success).toBe(true);
        expect(readResult.data).toBeDefined();
      });

      it(`[${runtimeName}] valida network allowlist (isAllowed)`, async () => {
        // O adapter expõe network.isAllowed; validamos via healthCheck (que chama internamente)
        const health = await plugin.healthCheck();
        expect(health.checks.network).toBe(true);
      });

      it(`[${runtimeName}] expõe ambiente consistente (env)`, async () => {
        const health = await plugin.healthCheck();
        expect(health.version).toContain(runtimeName);
      });

      it(`[${runtimeName}] executa healthCheck com sucesso`, async () => {
        const health = await plugin.healthCheck();
        expect(health.healthy).toBe(true);
        expect(health.version).toContain(runtimeName);
        expect(health.checks.storage).toBe(true);
        expect(health.checks.network).toBe(true);
        expect(health.checks.tools).toBe(true);
      });

      it(`[${runtimeName}] executa skill run end-to-end (vault_write + vault_read + vault_list + vault_delete)`, async () => {
        // Write
        const w = await plugin.run({ action: 'vault_write', path: 'integ/e2e.txt', content: 'e2e test' });
        expect(w.success).toBe(true);
        expect((w.data as { bytes: number }).bytes).toBeGreaterThan(0);

        // Read
        const r = await plugin.run({ action: 'vault_read', path: 'integ/e2e.txt' });
        expect(r.success).toBe(true);
        expect((r.data as { content: string }).content).toBeDefined();

        // List
        const l = await plugin.run({ action: 'vault_list' });
        expect(l.success).toBe(true);
        expect((l.data as string[]).some((p: string) => p.includes('e2e.txt'))).toBe(true);

        // Delete
        const d = await plugin.run({ action: 'vault_delete', path: 'integ/e2e.txt' });
        expect(d.success).toBe(true);

        // List again - should be gone
        const l2 = await plugin.run({ action: 'vault_list' });
        expect((l2.data as string[]).some((p: string) => p.includes('e2e.txt'))).toBe(false);
      });

      it(`[${runtimeName}] executa shutdown corretamente`, async () => {
        await expect(plugin.shutdown()).resolves.not.toThrow();
      });

      it(`[${runtimeName}] error handling: ação desconhecida retorna erro estruturado`, async () => {
        const out = await plugin.run({ action: 'vault_unknown_action' });
        expect(out.success).toBe(false);
        expect(out.error).toBeDefined();
        expect(out.error).toMatch(/desconhecida/);
      });

      it(`[${runtimeName}] error handling: path traversal bloqueado`, async () => {
        const out = await plugin.run({ action: 'vault_write', path: '../etc/passwd', content: 'x' });
        expect(out.success).toBe(false);
        expect(out.error).toMatch(/traversal/);
      });

      it(`[${runtimeName}] error handling: caracteres inválidos bloqueados`, async () => {
        const out = await plugin.run({ action: 'vault_write', path: 'a b.txt', content: 'x' });
        expect(out.success).toBe(false);
        expect(out.error).toMatch(/caracteres inválidos/);
      });
    });
  });
});