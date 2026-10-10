/**
 * logic.ts — Lógica real da skill File Vault.
 *
 * Pura e agnóstica de runtime: recebe apenas a `PluginAPI` comum do
 * compat-layer (herdado do template) e nunca toca em callbacks V1 ou
 * promises V2 diretamente. Isso garante comportamento idêntico em ambos.
 *
 * Why: manter a lógica desacoplada do adapter permite testar tudo com
 * `createMockAdapter` (unit) e validar dual-compat só na borda (integration).
 */

import type { PluginAPI } from '../../src/compat-layer';

// ============================================================
// TIPOS PÚBLICOS
// ============================================================

export type VaultAction = 'vault_write' | 'vault_read' | 'vault_list' | 'vault_delete';

export interface VaultWriteInput {
  action: 'vault_write';
  path: string;
  content: string;
}

export interface VaultReadInput {
  action: 'vault_read';
  path: string;
}

export interface VaultListInput {
  action: 'vault_list';
}

export interface VaultDeleteInput {
  action: 'vault_delete';
  path: string;
}

export type VaultInput = VaultWriteInput | VaultReadInput | VaultListInput | VaultDeleteInput;

export interface VaultFileMeta {
  path: string;
  bytes: number;
  updatedAt: string;
}

export interface VaultWriteResult {
  path: string;
  bytes: number;
}

export interface VaultReadResult {
  path: string;
  content: string;
  meta: VaultFileMeta | null;
}

export interface VaultDeleteResult {
  path: string;
  deleted: boolean;
}

// ============================================================
// VALIDAÇÃO (segurança first: path traversal, absolutos, charset)
// ============================================================

const MAX_PATH_LENGTH = 256;
// Permite subdiretórios relativos simples: letras, números, ., _, -, /
const SAFE_PATH_PATTERN = /^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*$/;

export function validatePath(raw: unknown): string {
  if (typeof raw !== 'string' || raw.length === 0) {
    throw new Error('vault: "path" deve ser uma string não-vazia');
  }
  if (raw.length > MAX_PATH_LENGTH) {
    throw new Error(`vault: "path" excede o limite de ${MAX_PATH_LENGTH} caracteres`);
  }
  if (raw.startsWith('/')) {
    throw new Error('vault: caminhos absolutos não são permitidos');
  }
  if (raw.split('/').includes('..')) {
    throw new Error('vault: segmentos ".." (path traversal) não são permitidos');
  }
  if (!SAFE_PATH_PATTERN.test(raw)) {
    throw new Error('vault: "path" contém caracteres inválidos (permitidos: A-Z a-z 0-9 . _ - /)');
  }
  return raw;
}

export function metaKey(path: string): string {
  return `vault:meta:${path}`;
}

// ============================================================
// OPERAÇÕES (cada uma usa storage + host tools via PluginAPI)
// ============================================================

export async function vaultWrite(
  api: PluginAPI,
  path: string,
  content: unknown,
): Promise<VaultWriteResult> {
  const safePath = validatePath(path);
  if (typeof content !== 'string') {
    throw new Error('vault_write: "content" deve ser uma string');
  }

  const result = await api.exec.tool<{ path: string; content: string }, { success: boolean; bytes: number }>(
    'write_file',
    { path: safePath, content },
  );
  if (!result.success) {
    throw new Error(`vault_write: host tool "write_file" falhou para "${safePath}"`);
  }

  const meta: VaultFileMeta = {
    path: safePath,
    bytes: result.bytes,
    updatedAt: new Date().toISOString(),
  };
  await api.storage.set(metaKey(safePath), meta);
  api.log('info', 'vault_write concluído', { path: safePath, bytes: result.bytes });

  return { path: safePath, bytes: result.bytes };
}

export async function vaultRead(api: PluginAPI, path: string): Promise<VaultReadResult> {
  const safePath = validatePath(path);

  const result = await api.exec.tool<{ path: string }, { content: string }>('read_file', {
    path: safePath,
  });
  if (typeof result.content !== 'string') {
    throw new Error(`vault_read: host tool "read_file" retornou conteúdo inválido para "${safePath}"`);
  }

  const meta = await api.storage.get<VaultFileMeta>(metaKey(safePath));
  api.log('info', 'vault_read concluído', { path: safePath });

  return { path: safePath, content: result.content, meta };
}

export async function vaultList(api: PluginAPI): Promise<string[]> {
  const keys = await api.storage.keys('vault:meta:');
  return keys.map((k) => k.replace('vault:meta:', '')).sort();
}

export async function vaultDelete(api: PluginAPI, path: string): Promise<VaultDeleteResult> {
  const safePath = validatePath(path);
  await api.storage.delete(metaKey(safePath));
  api.log('info', 'vault_delete concluído', { path: safePath });
  return { path: safePath, deleted: true };
}

// ============================================================
// DISPATCHER — ponto de entrada chamado pelo PluginCore
// ============================================================

export async function executeVaultLogic(
  api: PluginAPI,
  input: Record<string, unknown>,
): Promise<unknown> {
  const action = input['action'];

  switch (action) {
    case 'vault_write':
      return vaultWrite(api, input['path'] as string, input['content']);
    case 'vault_read':
      return vaultRead(api, input['path'] as string);
    case 'vault_list':
      return vaultList(api);
    case 'vault_delete':
      return vaultDelete(api, input['path'] as string);
    default:
      throw new Error(
        `vault: ação desconhecida "${String(action)}" (esperado: vault_write | vault_read | vault_list | vault_delete)`,
      );
  }
}
