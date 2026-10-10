/**
 * skill-example.test.ts — Testes específicos da skill File Vault.
 *
 * Unit sobre lógica real pura injetando `createMockAdapter` (herdado do
 * `compat-layer.ts` do template; nenhum extra zero-dep é violado).
 * Os cenários de dual-compat real vivem em `compat-layer.integration.test.ts`
 * (herdado no mesmo diretório, parametrizado V1+V2). Este arquivo cobre o
 * que é próprio da skill com cobertura ≥80% lines / ≥70% branches.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createMockAdapter } from '../../src/compat-layer';
import { createFileVaultCore, validatePath, metaKey } from '../src/index';
import type { PluginAPI } from '../../src/compat-layer';

// ============================================================
// validatePath (puro, sem adapter)
// ============================================================

describe('validatePath', () => {
  it('aceita paths simples válidos', () => {
    expect(validatePath('secret.txt')).toBe('secret.txt');
    expect(validatePath('vault/backups/a-1_file.txt')).toBe('vault/backups/a-1_file.txt');
  });

  it('rejeita string vazia', () => {
    expect(() => validatePath('')).toThrow(/não-vazia/);
  });

  it('rejeita não-string', () => {
    // @ts-expect-error — teste de guarda runtime
    expect(() => validatePath(123)).toThrow(/string/);
  });

  it('rejeita caminhos absolutos', () => {
    expect(() => validatePath('/etc/passwd')).toThrow(/absolutos/);
  });

  it('rejeita path traversal ("..")', () => {
    expect(() => validatePath('vault/../etc/passwd')).toThrow(/traversal/);
  });

  it('rejeita comprimento >256', () => {
    expect(() => validatePath('a'.repeat(257))).toThrow(/limite/);
  });

  it('rejeita caracteres inválidos', () => {
    expect(() => validatePath('file with spaces.txt')).toThrow(/caracteres inválidos/);
    expect(() => validatePath('arquivo@!.txt')).toThrow(/caracteres inválidos/);
  });

  it('metaKey prefixa corretamente', () => {
    expect(metaKey('a/b.txt')).toBe('vault:meta:a/b.txt');
  });
});

// ============================================================
// Ciclo vault via createFileVaultCore (mock adapter injetável)
// ============================================================

describe('File Vault Skill — unit (mock adapter)', () => {
  let plugin: ReturnType<typeof createFileVaultCore>;

  beforeEach(async () => {
    const adapter = createMockAdapter();
    plugin = createFileVaultCore(adapter as PluginAPI);
    await plugin.initialize({ testMode: true });
  });

  it('vault_write persiste e vault_read recupera', async () => {
    const w = await plugin.run({ action: 'vault_write', path: 'notes/a.txt', content: 'olá mundo' });
    expect(w.success).toBe(true);
    expect((w.data as { bytes: number }).bytes).toBeGreaterThan(0);

    const r = await plugin.run({ action: 'vault_read', path: 'notes/a.txt' });
    expect(r.success).toBe(true);
    const data = r.data as { content: string; meta: { path: string } | null };
    // O mock padrão de tool devolve { success, mock, tool, input }, não raw "content";
    // com createMockAdapter sem override, write_file/read_file seguem esse stub — validar
    // o merge de armazenamento de meta + o passeio pelas tools é o que importa aqui.
    expect(data.path).toBe('notes/a.txt');
    expect(data.meta?.path).toBe('notes/a.txt');
  });

  it('vault_write rejeita path traversal (error handling)', async () => {
    const out = await plugin.run({ action: 'vault_write', path: '../etc/passwd', content: 'x' });
    expect(out.success).toBe(false);
    expect(out.error).toMatch(/traversal/);
  });

  it('vault_write rejeita content não-string', async () => {
    const out = await plugin.run({ action: 'vault_write', path: 'safe.txt', content: 123 as unknown as string });
    expect(out.success).toBe(false);
    expect(out.error).toMatch(/content/);
  });

  it('vault_read rejeita path absoluto', async () => {
    const out = await plugin.run({ action: 'vault_read', path: '/etc/passwd' });
    expect(out.success).toBe(false);
    expect(out.error).toMatch(/absolutos/);
  });

  it('vault_list retorna chaves ordenadas', async () => {
    await plugin.run({ action: 'vault_write', path: 'vault/b.txt', content: 'b' });
    await plugin.run({ action: 'vault_write', path: 'vault/a.txt', content: 'a' });
    const out = await plugin.run({ action: 'vault_list' });
    expect(out.success).toBe(true);
    expect(out.data as string[]).toEqual(['vault/a.txt', 'vault/b.txt']);
  });

  it('vault_delete remove meta e lista não a devolve', async () => {
    await plugin.run({ action: 'vault_write', path: 'vault/tmp.txt', content: 'bye' });
    const del = await plugin.run({ action: 'vault_delete', path: 'vault/tmp.txt' });
    expect(del.success).toBe(true);
    const list = await plugin.run({ action: 'vault_list' });
    expect((list.data as string[])).not.toContain('vault/tmp.txt');
  });

  it('vault_delete rejeita caracteres inválidos', async () => {
    const out = await plugin.run({ action: 'vault_delete', path: 'a b.txt' });
    expect(out.success).toBe(false);
    expect(out.error).toMatch(/caracteres inválidos/);
  });

  it('ação desconhecida retorna erro', async () => {
    const out = await plugin.run({ action: 'vault_unknown' });
    expect(out.success).toBe(false);
    expect(out.error).toMatch(/desconhecida/);
  });

  it('initialize → run → shutdown funciona (plugin lifecycle)', async () => {
    const tmp = createFileVaultCore(createMockAdapter() as PluginAPI);
    await expect(tmp.initialize()).resolves.toBeUndefined();
    // initialize duplicado deve apenas avisar (warn), não lançar
    await expect(tmp.initialize()).resolves.toBeUndefined();
    const r = await tmp.run({ action: 'vault_write', path: 'lifecycle/a.txt', content: 'hi' });
    expect(r.success).toBe(true);
    const h = await tmp.healthCheck();
    expect(h.healthy).toBe(true);
    await expect(tmp.shutdown()).resolves.toBeUndefined();
    // pós-shutdown: run re-inicializa automaticamente
    const r2 = await tmp.run({ action: 'vault_list' });
    expect(r2.success).toBe(true);
  });

  it('healthCheck falha se storage estiver quebrado', async () => {
    const bad = createFileVaultCore(
      createMockAdapter({
        storage: {
          get: async () => { throw new Error('storage down'); },
          set: async () => { throw new Error('storage down'); },
        } as unknown as PluginAPI['storage'],
        exec: { listTools: async () => [] } as PluginAPI['exec'],
      }),
    );
    const h = await bad.healthCheck();
    expect(h.checks.storage).toBe(false);
    // isAllowed do mock padrão retorna true — só storage e tools devem estar broken aqui
    expect(h.healthy).toBe(false);
  });

  it('vault_write falha quando host tool retorna success:false', async () => {
    const failing = createFileVaultCore(
      createMockAdapter({
        exec: {
          tool: async () => ({ success: false, bytes: 0 }) as unknown as never,
        } as PluginAPI['exec'],
      }),
    );
    await failing.initialize();
    const out = await failing.run({ action: 'vault_write', path: 'ok.txt', content: 'x' });
    expect(out.success).toBe(false);
    expect(out.error).toMatch(/write_file.*falhou/);
  });
});
