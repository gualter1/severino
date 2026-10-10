/**
 * index.ts — Entry point da skill File Vault.
 *
 * Liga a lógica real (`logic.ts`) ao `createPluginCore` herdado do
 * compat-layer do template, injetando o dispatcher via override tipado.
 * Funciona sem alteração em OpenCode V1 (callbacks) e V2 (promises).
 */

import {
  createPluginCore,
  type PluginAPI,
  type PluginCore,
  type PluginInput,
} from '../../src/compat-layer';
import { executeVaultLogic } from './logic';

// O PluginCore expõe `executePluginLogic` internamente (chamado por `run`).
// Tipamos a extensão em vez de usar `any` para manter `strict: true`.
type CoreWithLogic = PluginCore & {
  executePluginLogic(input: PluginInput, api: PluginAPI): Promise<unknown>;
};

export function createFileVaultCore(customAdapter?: PluginAPI): PluginCore {
  const core = createPluginCore(customAdapter) as CoreWithLogic;
  core.executePluginLogic = async (input, api) =>
    executeVaultLogic(api, input as Record<string, unknown>);
  return core;
}

export * from './logic';
export { createPluginCore };
export type { PluginAPI, PluginCore };
