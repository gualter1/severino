/**
 * compat-layer.unit.test.ts — Unit Tests Rápidos para o Bridge Pattern
 * Foca em casos isolados, erros de construção e guards de comportamento.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPluginCore, createMockAdapter, detectVersion, V1Adapter, V2Adapter } from '../src/compat-layer';
import { MockV1Harness } from './mocks/mock-v1-harness';
import { MockV2Harness } from './mocks/mock-v2-harness';

describe('CompatLayer Unit', () => {
  afterEach(() => {
    delete (globalThis as any).opencode;
    delete process.env.OPENCODE_MOCK;
    delete process.env.OPENCODE_VERSION;
    delete process.env.NODE_ENV;
  });

  // ============================================================
  // DETECÇÃO
  // ============================================================
  describe('Adapter Construction', () => {
    it('lanca erro se opencode global ausente (V1Adapter)', () => {
      delete (globalThis as any).opencode;
      expect(() => new V1Adapter()).toThrow(/V1Adapter/);
    });

    it('lanca erro se opencode.v2 global ausente (V2Adapter)', () => {
      (globalThis as any).opencode = {};
      expect(() => new V2Adapter()).toThrow(/V2Adapter/);
    });

    it('lanca erro se nenhum host detectado e sem mock', () => {
      delete (globalThis as any).opencode;
      delete process.env.OPENCODE_MOCK;
      expect(() => detectVersion()).toThrow(/Nenhuma API OpenCode detectada/);
    });

    it('respeita env mock para desenvolvimento', () => {
      delete (globalThis as any).opencode;
      process.env.OPENCODE_MOCK = 'true';
      process.env.OPENCODE_VERSION = 'v1';
      expect(detectVersion()).toBe('v1');
    });
  });

  // ============================================================
  // PLUGIN CORE LIFECYCLE
  // ============================================================
  describe('PluginCore Lifecycle', () => {
    it('inicializa uma vez (idempotente)', async () => {
      const logSpy = vi.fn();
      const adapter = createMockAdapter({ log: logSpy });
      const core = createPluginCore(adapter);

      await core.initialize({ a: 1 });
      await core.initialize({ b: 2 }); // duplicata — não deve lançar

      expect(logSpy).toHaveBeenCalledWith('warn', expect.stringContaining('já inicializado'), expect.anything());
    });

    it('run auto-inicializa se não inicializado', async () => {
      const adapter = createMockAdapter();
      const core = createPluginCore(adapter);

      const output = await core.run({ hello: 'world' });
      expect(output.success).toBe(true);
    });

    it('run captura excecoes e retorna erro estruturado', async () => {
      const adapter = createMockAdapter({
        storage: {
          get: async () => { throw new Error('storage down'); },
          set: async () => { throw new Error('storage down'); },
          delete: async () => { /* noop */ },
          keys: async () => [],
        },
      });
      const core = createPluginCore(adapter);

      // healthCheck falha — initialize deve lançar
      await expect(core.initialize()).rejects.toThrow(/Health check falhou/);
    });

    it('healthCheck retorna unhealthy quando tools vazias', async () => {
      const adapter = createMockAdapter({
        exec: {
          tool: async () => ({}) as any,
          listTools: async () => [],
        },
      });
      const core = createPluginCore(adapter);
      const health = await core.healthCheck();

      expect(health.checks.tools).toBe(false);
      expect(health.healthy).toBe(false);
      expect(health.uptime).toBeGreaterThanOrEqual(0);
    });

    it('shutdown reseta estado (permite re-inicializacao)', async () => {
      const logSpy = vi.fn();
      const adapter = createMockAdapter({ log: logSpy });
      const core = createPluginCore(adapter);

      await core.initialize();
      await core.shutdown();
      await core.initialize(); // não deve logar warn

      const warnCalls = logSpy.mock.calls.filter(c => c[0] === 'warn');
      expect(warnCalls).toHaveLength(0);
    });
  });

  // ============================================================
  // STORAGE EDGE CASES
  // ============================================================
  describe('Mock Adapter Storage', () => {
    it('retorna null para chave inexistente', async () => {
      const adapter = createMockAdapter();
      expect(await adapter.storage.get('missing')).toBeNull();
    });

    it('lista keys por prefixo', async () => {
      const adapter = createMockAdapter();
      await adapter.storage.set('a:1', 1);
      await adapter.storage.set('a:2', 2);
      await adapter.storage.set('b:1', 3);

      expect(await adapter.storage.keys('a:')).toEqual(expect.arrayContaining(['a:1', 'a:2']));
      expect(await adapter.storage.keys('a:')).not.toContain('b:1');
    });
  });

  // ============================================================
  // NETWORK ALLOWLIST
  // ============================================================
  describe('Network Security', () => {
    it('V1Adapter.isAllowed retorna false em falha', () => {
      const v1 = new MockV1Harness();
      v1.install();
      // Remove network do mock para simular falha
      delete (globalThis as any).opencode.network;
      const adapter = new V1Adapter();
      expect(adapter.network.isAllowed('https://api.github.com')).toBe(false);
      v1.uninstall();
    });

    it('V2Adapter delega isAllowed ao host', () => {
      const v2 = new MockV2Harness();
      v2.install();
      const adapter = new V2Adapter();
      expect(adapter.network.isAllowed('https://api.github.com/x')).toBe(true);
      expect(adapter.network.isAllowed('https://evil.com')).toBe(false);
      v2.uninstall();
    });
  });
});
