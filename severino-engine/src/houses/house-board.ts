/**
 * 🗂️ HouseBoard — quadro interno por casa (Kanban).
 * Colunas: A_FAZER → FAZENDO → EM_REVIEW → PRONTO.
 * WIP-limit default 1 por quarto na coluna FAZENDO.
 * O pipeline chama o board na fase 2 (outro agente integra).
 */

import type { Carta } from "../core/carta.js";

export type ColunaQuadro = "A_FAZER" | "FAZENDO" | "EM_REVIEW" | "PRONTO";

export interface ItemQuadro {
  carta: Carta;
  coluna: ColunaQuadro;
  quarto: string;
  desde: string;
}

const ORDEM: ColunaQuadro[] = ["A_FAZER", "FAZENDO", "EM_REVIEW", "PRONTO"];

/** Transições válidas: avança 1 casa; EM_REVIEW pode voltar p/ FAZENDO (retrabalho). */
function transicaoValida(de: ColunaQuadro, para: ColunaQuadro): boolean {
  if (de === para) return false;
  const iDe = ORDEM.indexOf(de);
  const iPara = ORDEM.indexOf(para);
  if (iPara === iDe + 1) return true;
  if (de === "EM_REVIEW" && para === "FAZENDO") return true;
  return false;
}

export class HouseBoard {
  readonly houseId: string;
  readonly wipLimitPorQuarto: number;
  private itens = new Map<string, ItemQuadro>();

  constructor(houseId: string, wipLimitPorQuarto = 1) {
    this.houseId = houseId;
    this.wipLimitPorQuarto = wipLimitPorQuarto;
    console.log(`🗂️ Quadro criado para ${houseId} (WIP ${wipLimitPorQuarto}/quarto em FAZENDO)`);
  }

  /** Coloca carta em A_FAZER (idempotente por cartaId). */
  adicionar(carta: Carta, quarto = "generalist"): ItemQuadro {
    const existente = this.itens.get(carta.cartaId);
    if (existente) return existente;
    const item: ItemQuadro = {
      carta,
      coluna: "A_FAZER",
      quarto,
      desde: new Date().toISOString(),
    };
    this.itens.set(carta.cartaId, item);
    console.log(`🗂️ [${this.houseId}] carta ${carta.cartaId} entrou em A_FAZER (quarto ${quarto})`);
    return item;
  }

  /** Coluna atual da carta, ou undefined se não está no quadro. */
  colunaDe(cartaId: string): ColunaQuadro | undefined {
    return this.itens.get(cartaId)?.coluna;
  }

  /**
   * Move carta entre colunas validando a transição.
   * Lança Error se carta não existe, se `de` diverge da coluna atual ou se transição inválida.
   */
  mover(cartaId: string, de: ColunaQuadro, para: ColunaQuadro): ItemQuadro {
    const item = this.itens.get(cartaId);
    if (!item) throw new Error(`🗂️ Carta ${cartaId} não está no quadro ${this.houseId}.`);
    if (item.coluna !== de) {
      throw new Error(
        `🗂️ Carta ${cartaId} está em ${item.coluna}, não em ${de} — movimento recusado.`
      );
    }
    if (!transicaoValida(de, para)) {
      throw new Error(`🗂️ Transição inválida ${de} → ${para} (ordem: ${ORDEM.join(" → ")}, retorno permitido: EM_REVIEW → FAZENDO).`);
    }
    // WIP-limit: só 1 por quarto em FAZENDO (vale p/ entrada em FAZENDO)
    if (para === "FAZENDO" && de !== "FAZENDO") {
      const emFazendo = this.contarPorQuarto("FAZENDO", item.quarto);
      if (emFazendo >= this.wipLimitPorQuarto) {
        throw new Error(
          `🗂️ WIP lotado: quarto ${item.quarto} já tem ${emFazendo} carta(s) em FAZENDO (limite ${this.wipLimitPorQuarto}).`
        );
      }
    }
    item.coluna = para;
    item.desde = new Date().toISOString();
    console.log(`🗂️ [${this.houseId}] carta ${cartaId} movida ${de} → ${para} (quarto ${item.quarto})`);
    return item;
  }

  /** Lista itens, opcionalmente filtrando por coluna. */
  listar(coluna?: ColunaQuadro): ItemQuadro[] {
    const todos = [...this.itens.values()];
    if (!coluna) return todos;
    return todos.filter((i) => i.coluna === coluna);
  }

  /** Visão por colunas p/ endpoint GET /engine/quadro. */
  colunas(): Record<ColunaQuadro, ItemQuadro[]> {
    return {
      A_FAZER: this.listar("A_FAZER"),
      FAZENDO: this.listar("FAZENDO"),
      EM_REVIEW: this.listar("EM_REVIEW"),
      PRONTO: this.listar("PRONTO"),
    };
  }

  /** Conta cartas por quarto numa coluna. Sem quarto → total da coluna. */
  contarPorQuarto(coluna: ColunaQuadro, quarto?: string): number;
  /** Conta cartas agrupadas por quarto numa coluna. */
  contarPorQuarto(coluna: ColunaQuadro): number;
  contarPorQuarto(coluna: ColunaQuadro, quarto?: string): number {
    const lista = this.listar(coluna);
    if (!quarto) return lista.length;
    return lista.filter((i) => i.quarto === quarto).length;
  }

  /** Agrupamento quarto → quantidade numa coluna (p/ inspeção). */
  agruparPorQuarto(coluna: ColunaQuadro): Record<string, number> {
    const agg: Record<string, number> = {};
    for (const item of this.listar(coluna)) {
      agg[item.quarto] = (agg[item.quarto] ?? 0) + 1;
    }
    return agg;
  }

  /**
   * Tenta puxar carta p/ FAZENDO (respeita WIP-limit).
   * Retorna true se puxou, false se WIP do quarto está lotado.
   * Se a carta não está no quadro, adiciona em A_FAZER antes de puxar.
   */
  tentarPuxar(carta: Carta, quarto = "generalist"): boolean {
    let item = this.itens.get(carta.cartaId);
    if (!item) item = this.adicionar(carta, quarto);
    // alinha quarto informado
    item.quarto = quarto || item.quarto;
    if (item.coluna === "FAZENDO") {
      console.log(`🗂️ [${this.houseId}] carta ${carta.cartaId} já está em FAZENDO (quarto ${item.quarto})`);
      return true;
    }
    if (item.coluna !== "A_FAZER") {
      console.log(
        `🗂️ [${this.houseId}] carta ${carta.cartaId} está em ${item.coluna} — só A_FAZER pode ser puxada`
      );
      return false;
    }
    const ocupacao = this.contarPorQuarto("FAZENDO", item.quarto);
    if (ocupacao >= this.wipLimitPorQuarto) {
      console.log(
        `🗂️ [${this.houseId}] WIP lotado: quarto ${item.quarto} com ${ocupacao}/${this.wipLimitPorQuarto} em FAZENDO — carta ${carta.cartaId} aguarda`
      );
      return false;
    }
    item.coluna = "FAZENDO";
    item.desde = new Date().toISOString();
    console.log(`🗂️ [${this.houseId}] carta ${carta.cartaId} puxada A_FAZER → FAZENDO (quarto ${item.quarto})`);
    return true;
  }

  limpar(): void {
    this.itens.clear();
    console.log(`🗂️ [${this.houseId}] quadro limpo.`);
  }
}

// ---- registro global de quadros por casa ----
const quadros = new Map<string, HouseBoard>();

export function boardDaCasa(houseId: string, wipLimitPorQuarto = 1): HouseBoard {
  let board = quadros.get(houseId);
  if (!board) {
    board = new HouseBoard(houseId, wipLimitPorQuarto);
    quadros.set(houseId, board);
  }
  return board;
}

export function listarQuadros(): string[] {
  return [...quadros.keys()];
}
