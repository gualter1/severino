/**
 * ✉️ Carta — unidade de trabalho roteável entre casas.
 * Imutável por fora; carimbos registram o ciclo.
 */

export type DecisaoCarimbo = "ACEITO" | "NEGADO";

export interface Carimbo {
  de: string;
  para: string;
  decisao: DecisaoCarimbo;
  motivo: string;
}

export interface DecisaoCasa {
  aceita: boolean;
  motivo: string;
}

export interface Carta {
  cartaId: string;
  objective: string;
  domainHint?: string;
  priority: number; // 1-5, default 3
  attempts: number;
  history: Carimbo[];
  /** @deprecated alias para criadaEm — mantido por compat com spec */
  crielladaEm: string;
  criadaEm: string;
}

export interface RelatorioAgente {
  cartaId: string;
  robotId: string;
  role: string;
  houseId: string;
  erros: string[];
  acertos: string[];
  resumo: string;
  rodouSemErros: boolean;
  skillsUsadas: string[];
  oQueMelhorar: string;
  oQueNaoFazer: string;
  precisouCorrigir: boolean;
  detalhesCorrecao?: string;
}

function genId(): string {
  const rand = Math.random().toString(36).slice(2, 7);
  return `carta-${Date.now().toString(36)}-${rand}`;
}

function clampPriority(p?: number): number {
  const n = typeof p === "number" ? Math.round(p) : 3;
  if (Number.isNaN(n)) return 3;
  return Math.min(5, Math.max(1, n));
}

export function criarCarta(
  objective: string,
  opts?: { priority?: number; domainHint?: string }
): Carta {
  const clean = (objective || "").trim();
  if (!clean) throw new Error("Objective vazio — não é possível criar carta.");
  const now = new Date().toISOString();
  const priority = clampPriority(opts?.priority);
  const carta: Carta = {
    cartaId: genId(),
    objective: clean,
    domainHint: opts?.domainHint?.trim() || undefined,
    priority,
    attempts: 0,
    history: [],
    criadaEm: now,
    crielladaEm: now,
  };
  console.log(`✉️ Carta criada ${carta.cartaId} (p${priority}) — "${clean.slice(0, 60)}"`);
  return carta;
}

export function carimbar(
  carta: Carta,
  de: string,
  para: string,
  decisao: DecisaoCarimbo,
  motivo: string
): Carta {
  const carimbo: Carimbo = { de, para, decisao, motivo };
  carta.history.push(carimbo);
  // mantém alias sincronizado
  if ((carta as any).criadaEm) (carta as any).crielladaEm = (carta as any).criadaEm;
  else (carta as any).criadaEm = (carta as any).crielladaEm;
  const tag = decisao === "ACEITO" ? "✅" : "⛔";
  console.log(`✉️ Carimbo ${tag} ${de} → ${para}: ${decisao} — ${motivo}`);
  return carta;
}
