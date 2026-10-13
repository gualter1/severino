/**
 * 📋 TaskQueue — fila em memória com prioridade.
 * Maior priority (1-5) sai primeiro; FIFO dentro da mesma prioridade.
 * preempt() fura a fila (insere na frente, preservando ordem dos demais).
 */

import type { Carta } from "./carta.js";

interface Entry {
  carta: Carta;
  seq: number; // ordem de chegada p/ FIFO
  preempted: boolean;
  enfileiradaEm: number; // timestamp p/ starvation-guard
}

export class TaskQueue {
  private items: Entry[] = [];
  private seqCounter = 0;
  private pausadas = new Set<string>();

  enqueue(carta: Carta): void {
    this.items.push({ carta, seq: this.seqCounter++, preempted: false, enfileiradaEm: Date.now() });
    this.sort();
    console.log(`📋 Fila: carta ${carta.cartaId} enfileirada (p${carta.priority}) — tamanho ${this.items.length}`);
  }

  dequeue(): Carta | undefined {
    // pula pausadas (starvation-guard não deixa carta pausada bloquear a fila)
    const idx = this.items.findIndex((e) => !this.pausadas.has(e.carta.cartaId));
    if (idx === -1) {
      if (this.items.length > 0) {
        console.log("📋 Fila: só há cartas pausadas — nada a despachar.");
        return undefined;
      }
      console.log("📋 Fila vazia — nada a despachar.");
      return undefined;
    }
    const [entry] = this.items.splice(idx, 1);
    console.log(`📋 Fila: carta ${entry.carta.cartaId} retirada (p${entry.carta.priority}) — restam ${this.items.length}`);
    return entry.carta;
  }

  /** Fura fila: vai para a frente, atrás de outros preempted. */
  preempt(carta: Carta): void {
    const lastPreempted = this.lastPreemptIndex();
    const entry: Entry = { carta, seq: this.seqCounter++, preempted: true, enfileiradaEm: Date.now() };
    if (lastPreempted === -1) this.items.unshift(entry);
    else this.items.splice(lastPreempted + 1, 0, entry);
    console.log(`📋 Fila: carta ${carta.cartaId} FURA FILA 🚨 — tamanho ${this.items.length}`);
  }

  /**
   * ⏳ Starvation-guard: envelhece cartas há mais de Nmin na fila.
   * Cada carta esperando > Nmin ganha +1 de prioridade (teto 5) e a fila reordena.
   * Chamado periodicamente pelo loop do motor (ou manualmente via teste).
   */
  envelhecer(Nmin = 5): number {
    const agora = Date.now();
    const limiteMs = Nmin * 60 * 1000;
    let promovidas = 0;
    for (const entry of this.items) {
      const esperaMs = agora - entry.enfileiradaEm;
      if (esperaMs >= limiteMs && entry.carta.priority < 5) {
        const antes = entry.carta.priority;
        entry.carta.priority = Math.min(5, entry.carta.priority + 1);
        // renova o relógio p/ não promover de novo no próximo ciclo imediato
        entry.enfileiradaEm = agora;
        promovidas++;
        console.log(
          `⏳ Starvation-guard: carta ${entry.carta.cartaId} esperando há ${Math.round(esperaMs / 1000)}s — prioridade p${antes} → p${entry.carta.priority}`
        );
      }
    }
    if (promovidas > 0) this.sort();
    else console.log(`⏳ Starvation-guard: nenhuma carta há >${Nmin}min na fila (${this.items.length} na fila).`);
    return promovidas;
  }

  /** ⏸️ Pausa carta: dequeue pula até retomar. */
  pausar(cartaId: string): void {
    this.pausadas.add(cartaId);
    console.log(`⏸️ Fila: carta ${cartaId} pausada.`);
  }

  /** ▶️ Retoma carta pausada. */
  retomar(cartaId: string): void {
    if (this.pausadas.delete(cartaId)) {
      console.log(`▶️ Fila: carta ${cartaId} retomada.`);
    } else {
      console.log(`▶️ Fila: carta ${cartaId} não estava pausada.`);
    }
  }

  /** true se a carta está pausada. */
  pausada(cartaId: string): boolean {
    return this.pausadas.has(cartaId);
  }

  list(): Carta[] {
    return this.items.map((e) => e.carta);
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
    console.log("📋 Fila limpa.");
  }

  // ---- internos ----
  private lastPreemptIndex(): number {
    let idx = -1;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].preempted) idx = i;
    }
    return idx;
  }

  private sort(): void {
    // ordena apenas os não-preempted; preempted ficam na frente na ordem de inserção
    const preempted = this.items.filter((e) => e.preempted);
    const rest = this.items
      .filter((e) => !e.preempted)
      .sort((a, b) => b.carta.priority - a.carta.priority || a.seq - b.seq);
    this.items = [...preempted, ...rest];
  }
}

export const globalTaskQueue = new TaskQueue();
