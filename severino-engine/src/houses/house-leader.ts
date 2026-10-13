/**
 * 🛏️ HouseLeader — síndico de cada casa.
 * Valida endereço (validateAddress) e fatia a carta em subtarefas por quarto (breakDown).
 */

import { houseForDomain, HOUSES } from "./houses.js";
import type { Carta, DecisaoCasa } from "../core/carta.js";

// Mesma tabela de keywords do engine — duplicada aqui de propósito:
// o líder decide sozinho, sem depender do Carteiro.
const DOMAIN_PATTERNS: Array<{ domain: string; re: RegExp }> = [
  { domain: "frontend", re: /frontend|react|vue|angular|svelte|css|html|tailwind|\bui\b|tela|componente|site|pagina|página|layout/ },
  { domain: "qa", re: /\bqa\b|test|testing|jest|vitest|cypress|playwright|e2e|cobertura|media|média|nota|avali/ },
  { domain: "devops", re: /devops|docker|kubernetes|\bk8s\b|ci\/cd|terraform|deploy|aws|azure|gcp/ },
  { domain: "security", re: /secur|auth|owasp|pentest|vulnerab|cripto|firewall|permission|proteg|login|senha/ },
  { domain: "data", re: /\bdata\b|analytics|\betl\b|spark|kafka|elasticsearch|dataset|aluno|nota|ano letivo|relatorio|relatório|planilha|dashboard/ },
  { domain: "research", re: /research|investigat|pesquis|survey|experiment|analis/ },
  { domain: "sales", re: /sales|venda|crm|lead|hubspot|salesforce|cliente|funil/ },
  { domain: "product", re: /product|produto|roadmap|feature|backlog|spec|requisito/ },
  { domain: "tech-lead", re: /tech-lead|arquitet|sindico|síndico|planejamento técnico/ },
];

/** Inferência local do líder (não usa o Carteiro). */
export function inferDomainLocal(objective: string): { domain: string; certo: boolean } {
  const o = (objective || "").toLowerCase();
  for (const { domain, re } of DOMAIN_PATTERNS) {
    if (re.test(o)) return { domain, certo: true };
  }
  return { domain: "backend", certo: false };
}

/** Indica se o objective é incerto demais para endereçar. */
export function isEnderecoIncerto(objective: string): boolean {
  const clean = (objective || "").trim();
  if (clean.length < 10) return true;
  const { certo } = inferDomainLocal(clean);
  return !certo;
}

// Mapeamento chunk → quarto via keywords
const ROOM_PATTERNS: Array<{ room: string; re: RegExp }> = [
  { room: "frontend-developer", re: /frontend|react|vue|angular|css|html|tailwind|tela|componente|site|pagina|página|\bui\b|layout/ },
  { room: "backend-developer", re: /backend|endpoint|api|banco|\bsql\b|migration|webhook|fila|cache|servidor|controller|model/ },
  { room: "qa-engineer", re: /test|qa|cypress|playwright|jest|vitest|e2e|cobertura|valid|media|média|calcul/ },
  { room: "devops-engineer", re: /docker|\bk8s\b|kubernetes|deploy|terraform|infra|ci\/cd|pipeline.*deploy/ },
  { room: "security-engineer", re: /secur|auth|vulnerab|pentest|owasp|cripto|permission|proteg|login|senha/ },
];

export interface PipelineStep {
  room: string;
  subtask: string;
}

export class HouseLeader {
  readonly houseId: string;

  constructor(houseId: string) {
    if (!HOUSES[houseId]) throw new Error(`Casa desconhecida: ${houseId}`);
    this.houseId = houseId;
  }

  validateAddress(carta: Carta): DecisaoCasa {
    const hint = (carta.domainHint || "").trim().toLowerCase();
    const objective = carta.objective || "";

    const inferred = inferDomainLocal(objective);
    const domain = hint || inferred.domain;
    const esperado = houseForDomain(domain).houseId;

    if (isEnderecoIncerto(objective) && !hint) {
      const motivo = `endereço incerto — objective curto ou sem keyword reconhecível (carta ${carta.cartaId})`;
      console.log(`🛏️ Líder ${this.houseId}: NEGADO — ${motivo}`);
      return { aceita: false, motivo };
    }

    if (esperado !== this.houseId) {
      const motivo = `carta endereçada à ${esperado} (domínio '${domain}'), não a ${this.houseId}`;
      console.log(`🛏️ Líder ${this.houseId}: NEGADO — ${motivo}`);
      return { aceita: false, motivo };
    }

    const motivo = `carta ${carta.cartaId} aceita em ${this.houseId} (domínio '${domain}')`;
    console.log(`🛏️ Líder ${this.houseId}: ACEITO — ${motivo}`);
    return { aceita: true, motivo };
  }

  breakDown(carta: Carta): PipelineStep[] {
    const chunks = splitObjective(carta.objective);
    const house = HOUSES[this.houseId];
    const fallbackRoom = defaultRoomForHouse(house.houseId, house.rooms);

    if (chunks.length === 1) {
      // pipeline padrão da casa: construir → testar → proteger
      const target = roomForChunk(chunks[0], fallbackRoom);
      const steps: PipelineStep[] = [{ room: target, subtask: chunks[0] }];
      const extras = ["qa-engineer", "security-engineer"];
      for (const room of extras) {
        if (room !== target && house.rooms.includes(room)) {
          steps.push({ room, subtask: `${chunks[0]} [etapa ${room}]` });
        }
      }
      console.log(
        `🛏️ Líder ${this.houseId}: breakdown 1 chunk → pipeline [${steps.map((s) => s.room).join(" → ")}]`
      );
      return steps;
    }

    const steps = chunks.map((chunk) => ({
      room: roomForChunk(chunk, fallbackRoom),
      subtask: chunk,
    }));
    console.log(
      `🛏️ Líder ${this.houseId}: breakdown ${chunks.length} chunks → [${steps.map((s) => s.room).join(", ")}]`
    );
    return steps;
  }
}

// ---- helpers ----
function splitObjective(objective: string): string[] {
  // fatia por conectores: " e ", ";", "\n- ", "|" (com lookbehind simples)
  const parts = objective
    .split(/\s*(?:\n\s*[-*]\s*|\n+|\s*\|\s*|;\s*|\s+e\s+)\s*/i)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  if (parts.length === 0) return [objective.trim()];
  return parts;
}

function roomForChunk(chunk: string, fallback: string): string {
  const o = chunk.toLowerCase();
  for (const { room, re } of ROOM_PATTERNS) {
    if (re.test(o)) return room;
  }
  return fallback;
}

/** Quarto default da casa a partir do domínio predominante. */
function defaultRoomForHouse(houseId: string, rooms: string[]): string {
  const prefs: Record<string, string[]> = {
    "casa-dev": ["backend-developer", "frontend-developer"],
    "casa-negocios": ["product-manager", "sales-specialist"],
    "casa-dados": ["data-engineer", "researcher"],
  };
  const ordered = prefs[houseId] || ["generalist"];
  for (const r of ordered) if (rooms.includes(r)) return r;
  return rooms[0] || "generalist";
}
