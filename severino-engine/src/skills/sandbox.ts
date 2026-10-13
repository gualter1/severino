/**
 * 🧹 Sandbox — isolamento por taskId/role via pasta temporária.
 *
 * Fluxo: cria `temp_workspace/<taskId>/<role>-<ts>/`, executa `fn(wsDir)`,
 * e em `finally` remove o dir recursivamente (só o que `fn` retornou sobrevive).
 *
 * ⚠️ Evolução planejada: rodar `fn` num container Docker com limite de
 * CPU/memória e sem acesso à rede; pasta temporária é um MVP suficiente
 * porque o Severino roda local-first com skills confiáveis.
 */

import { promises as fs } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// raiz do projeto (severino-engine)
const REPO_ROOT = resolve(__dirname, "../../");
// fora do src para não poluir o build, mas dentro do projeto
const WORKSPACE_ROOT = join(REPO_ROOT, "temp_workspace");

export interface SandboxResult<T = any> {
  ok: boolean;
  artefato?: T;
  erro?: string;
}

export async function runSandbox<T = any>(
  taskId: string,
  role: string,
  fn: (wsDir: string) => Promise<T>
): Promise<SandboxResult<T>> {
  const cleanTask = taskId.replace(/[^a-zA-Z0-9-_\.]/g, "-");
  const cleanRole = role.replace(/[^a-zA-Z0-9-_\.]/g, "-");
  const dirName = `${cleanRole}-${Date.now()}`;
  const wsDir = join(WORKSPACE_ROOT, cleanTask, dirName);

  try {
    await fs.mkdir(wsDir, { recursive: true });
    console.log(`🧹 Sandbox criado: ${wsDir}`);
    const artefato = await fn(wsDir);
    return { ok: true, artefato };
  } catch (e: any) {
    const erro = e instanceof Error ? e.message : String(e);
    console.error(`🧹 Sandbox falhou (${wsDir}):`, erro);
    return { ok: false, erro };
  } finally {
    try {
      await fs.rm(wsDir, { recursive: true, force: true });
      console.log(`🧹 Sandbox limpo: ${wsDir}`);
    } catch (e: any) {
      console.error(`🧹 Falha ao limpar sandbox ${wsDir}:`, e?.message || e);
    }
  }
}