/**
 * 📦 Estoque — leitura direta do filesystem (ROOMS_DIR).
 *
 * Por que existe: o Carteiro precisa saber quem está em casa antes
 * de decidir "use-existing" vs "create-new". Nada de memória volátil
 * ou cache — lê o chão (teams.json + agent.json).
 */

import { promises as fs } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

export interface StockItem {
  robotId: string;
  role: string;
  houseId: string;
  capabilities: string[];
  status: "idle" | "busy" | "error";
}

// ---------------------------------------------------------------------------
// ROOMS_DIR — via env, default ../../rooms (relativo à raiz do projeto)
// ---------------------------------------------------------------------------
function getRoomsDir(): string {
  if (process.env.ROOMS_DIR) return resolve(process.env.ROOMS_DIR);
  // severino-engine/src/core/stock.ts -> ../../../rooms
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    return resolve(__dirname, "../../../rooms");
  } catch {
    return resolve(process.cwd(), "../../rooms");
  }
}

// ---------------------------------------------------------------------------
// Leitura bruta do estoque
// ---------------------------------------------------------------------------
export async function queryStock(): Promise<StockItem[]> {
  const roomsDir = getRoomsDir();
  const items: StockItem[] = [];

  let teamsRaw: string;
  try {
    teamsRaw = await fs.readFile(join(roomsDir, "teams.json"), "utf-8");
  } catch {
    // sem teams.json = sem estoque
    return [];
  }

  let parsed: any;
  try {
    parsed = JSON.parse(teamsRaw);
  } catch {
    return [];
  }

  const teams: Array<{ teamId: string; robotIds: string[] }> = parsed.teams || [];

  // mapa robotId -> houseId via teams.json
  const robotToHouse = new Map<string, string>();
  for (const t of teams) {
    for (const rid of t.robotIds || []) robotToHouse.set(rid, t.teamId);
  }

  // para cada robotId, tenta ler rooms/<robotId>/agent.json
  for (const [robotId, houseId] of robotToHouse) {
    const agentPath = join(roomsDir, robotId, "agent.json");
    try {
      const raw = await fs.readFile(agentPath, "utf-8");
      const agent = JSON.parse(raw);
      items.push({
        robotId,
        role: agent.role || "generalist",
        houseId: agent.teamId && agent.teamId !== "unknown" ? agent.teamId : houseId,
        capabilities: agent.capabilities || [],
        status: (agent.status as StockItem["status"]) || "idle",
      });
    } catch {
      // sem agent.json — usa o que temos do teams.json (assume idle)
      items.push({
        robotId,
        role: "generalist",
        houseId,
        capabilities: [],
        status: "idle",
      });
    }
  }

  return items;
}

// ---------------------------------------------------------------------------
// Consulta com prioridade: quarto exato → qualquer idle na casa → null
// ---------------------------------------------------------------------------
export async function checkStock(role: string, houseId: string): Promise<StockItem | null> {
  const normalizedRole = (role || "generalist").toLowerCase();
  const stock = await queryStock();

  // filtra só a casa pedida e ociosos
  const inHouse = stock.filter((s) => s.houseId === houseId && s.status === "idle");

  if (inHouse.length === 0) {
    console.log(`📦 Estoque: nenhum morador ocioso em ${houseId}`);
    return null;
  }

  // 1) match exato de quarto (role)
  const exact = inHouse.find((s) => s.role.toLowerCase() === normalizedRole);
  if (exact) {
    console.log(`📦 Estoque: quarto '${normalizedRole}' encontrado → ${exact.robotId}`);
    return exact;
  }

  // 2) fallback: qualquer morador ocioso da mesma casa (cobertura)
  const fallback = inHouse[0];
  console.log(`📦 Estoque: quarto '${normalizedRole}' lotado, cobertura → ${fallback.robotId} (${fallback.role})`);
  return fallback;
}

export async function hasRoom(role: string, houseId: string): Promise<boolean> {
  const found = await checkStock(role, houseId);
  return found !== null;
}

export function _getRoomsDir(): string {
  return getRoomsDir();
}
