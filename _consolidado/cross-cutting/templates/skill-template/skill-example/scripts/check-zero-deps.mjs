#!/usr/bin/env node
/**
 * check-zero-deps.mjs — Gate zero-dep (Opção B da Grill-Me Session 8).
 *
 * Falha se `package.json` declarar `dependencies` de runtime.
 * `devDependencies` são permitidas (apenas teste/build) e ignoradas aqui.
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const runtimeDeps = Object.keys(pkg.dependencies ?? {});

if (runtimeDeps.length > 0) {
  console.error(`[zero-deps] FALHOU: dependencies de runtime detectadas: ${runtimeDeps.join(', ')}`);
  console.error('[zero-deps] Mova para devDependencies (teste) ou remova — skills devem ser zero-dep.');
  process.exit(1);
}

console.log('[zero-deps] OK: 0 dependencies de runtime.');
