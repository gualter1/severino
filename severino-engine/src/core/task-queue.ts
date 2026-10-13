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
}

export class TaskQueue {
  private items: Entry[] = [];
  private seqCounter = 0;

  enqueue(carta: Carta): void {
    this.items.push({ carta, seq: this.seqCounter++, preempted: false });
    this.sort();
    console.log(`📋 Fila: carta ${carta.cartaId} enfileirada (p${carta.priority}) — tamanho ${this.items.length}`);
  }

  dequeue(): Carta | undefined {
    const entry = this.items.shift();
    if (!entry) {
      console.log("📋 Fila vazia — nada a despachar.");
      return undefined;
    }
    console.log(`📋 Fila: carta ${entry.carta.cartaId} retirada (p${entry.carta.priority}) — restam ${this.items.length}`);
    return entry.carta;
  }

  /** Fura fila: vai para a frente, atrás de outros preempted. */
  preempt(carta: Carta): void {
    const lastPreempted = this.lastPreemptIndex();
    const entry: Entry = { carta, seq: this.seqCounter++, preempted: true };
    if (lastPreempted === -1) this.items.unshift(entry);
    else this.items.splice(lastPreempted + 1, 0, entry);
    console.log(`📋 Fila: carta ${carta.cartaId} FURA FILA 🚨 — tamanho ${this.items.length}`);
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
