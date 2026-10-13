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

/** Uma parte verificável do DAG: 1 room responsável + dependências explícitas. */
export interface PipelineParte {
  parteId: string;
  room: string;
  subtask: string;
  dependeDe: string[];
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

  /**
   * 🕸️ breakDownDAG — pipeline canônico da casa como DAG de partes verificáveis.
   * Cada parte tem 1 room responsável + dependeDe explícito. Não executa nada,
   * só planeja; `runHousePipelineDAG` executa respeitando as dependências.
   *
   * - casa-dev: construir(quarto-alvo) → revisar(qa como review) →
   *   proteger(security) → testar(qa). Se o objective tem front+back
   *   (ex: html+css+js), gera 2 ramos paralelos (frontend, backend) que
   *   convergem para o review.
   * - casa-negocios / casa-dados: quarto-alvo → tech-lead (consolida).
   * - Só usa quarto que existe em `house.rooms` (proteger é pulado se
   *   security-engineer não existe na casa).
   */
  breakDownDAG(carta: Carta): PipelineParte[] {
    const house = HOUSES[this.houseId];
    const rooms = new Set(house.rooms);
    const objective = (carta.objective || "").trim() || carta.objective;
    const fallback = defaultRoomForHouse(house.houseId, house.rooms);

    if (this.houseId === "casa-dev") {
      return buildDevDAG(objective, fallback, rooms);
    }
    return buildSimpleDAG(objective, fallback, house.techLeadRoom, rooms);
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

/** Objective pede front+back? (ex: "site html media notas com javascript") */
function querFrontEBack(objective: string): boolean {
  const o = (objective || "").toLowerCase();
  const front =
    /html|css|tailwind|tela|layout|componente|site|p[aá]gina|\bui\b|frontend/.test(o);
  const back =
    /javascript|typescript|\bjs\b|\bts\b|api|endpoint|banco|\bsql\b|servidor|backend|l[oó]gica|calcul|media|m[eé]dia|nota/.test(
      o
    );
  return front && back;
}

/** casa-dev: canônico construir → revisar → proteger → testar (+ 2 ramos front/back). */
function buildDevDAG(
  objective: string,
  fallback: string,
  rooms: Set<string>
): PipelineParte[] {
  const partes: PipelineParte[] = [];
  const tem = (r: string) => rooms.has(r);

  // Ramo duplo front+back: dois construtores paralelos que convergem no review.
  if (
    querFrontEBack(objective) &&
    tem("frontend-developer") &&
    tem("backend-developer")
  ) {
    partes.push({
      parteId: "construir-front",
      room: "frontend-developer",
      subtask: `${objective} [etapa construir-front: estrutura html+css]`,
      dependeDe: [],
    });
    partes.push({
      parteId: "construir-back",
      room: "backend-developer",
      subtask: `${objective} [etapa construir-back: lógica javascript]`,
      dependeDe: [],
    });
  } else {
    const alvo = tem(fallback) ? fallback : [...rooms][0] || "generalist";
    partes.push({
      parteId: "construir",
      room: alvo,
      subtask: `${objective} [etapa construir]`,
      dependeDe: [],
    });
  }

  const raiz = partes.map((p) => p.parteId);

  // revisar: qa-engineer como review (se não existe, usa tech-lead como revisor).
  const revisor = tem("qa-engineer")
    ? "qa-engineer"
    : tem("tech-lead")
      ? "tech-lead"
      : raiz.length > 0
        ? partes[0].room
        : fallback;
  partes.push({
    parteId: "revisar",
    room: revisor,
    subtask: `${objective} [etapa revisar: review do que foi construído]`,
    dependeDe: [...raiz],
  });

  // proteger: pula se security-engineer não existe na casa.
  let antesDeTestar = ["revisar"];
  if (tem("security-engineer")) {
    partes.push({
      parteId: "proteger",
      room: "security-engineer",
      subtask: `${objective} [etapa proteger: hardening/segurança]`,
      dependeDe: ["revisar"],
    });
    antesDeTestar = ["proteger"];
  }

  // testar: qa-engineer (se já foi usado como revisor, continua — é o dono do teste).
  const testador = tem("qa-engineer") ? "qa-engineer" : revisor;
  partes.push({
    parteId: "testar",
    room: testador,
    subtask: `${objective} [etapa testar: valida entrega final]`,
    dependeDe: antesDeTestar,
  });

  console.log(
    `🛏️ Líder casa-dev: DAG [${partes.map((p) => `${p.parteId}(${p.room})`).join(" → ")}]`
  );
  return partes;
}

/** casa-negocios / casa-dados: quarto-alvo → tech-lead (consolida). */
function buildSimpleDAG(
  objective: string,
  fallback: string,
  techLeadRoom: string,
  rooms: Set<string>
): PipelineParte[] {
  const alvo = rooms.has(fallback) ? fallback : [...rooms][0] || "generalist";
  const partes: PipelineParte[] = [
    {
      parteId: "construir",
      room: alvo,
      subtask: `${objective} [etapa construir]`,
      dependeDe: [],
    },
  ];
  if (rooms.has(techLeadRoom) && techLeadRoom !== alvo) {
    partes.push({
      parteId: "consolidar",
      room: techLeadRoom,
      subtask: `${objective} [etapa consolidar: tech-lead consolida a entrega]`,
      dependeDe: ["construir"],
    });
  }
  console.log(
    `🛏️ Líder: DAG simples [${partes.map((p) => `${p.parteId}(${p.room})`).join(" → ")}]`
  );
  return partes;
}
