/**
 * 📮 dispatchCarta — ciclo da carta com retentativas entre casas.
 * Cria → enfileira → tenta entregar na casa do Carteiro → se NEGADO,
 * re-roteia para a próxima casa (casa-dev → casa-negocios → casa-dados).
 */

import { severinoEngine } from "./engine.js";
import { criarCarta, carimbar, type Carta, type RelatorioAgente } from "./carta.js";
import { TaskQueue, globalTaskQueue } from "./task-queue.js";
import { HouseLeader } from "../houses/house-leader.js";
import { runHousePipeline } from "./pipeline.js";
import { ensureRobot as factoryEnsureRobot, runTask as factoryRunTask } from "../factory/factory-adapter.js";
import type { PostmanDecision } from "./engine.js";

export interface DispatchCartaOpts {
  priority?: number;
  domainHint?: string;
  queue?: TaskQueue;
  maxTentativas?: number;
}

export interface DispatchCartaResult {
  carta: Carta;
  entrega: PostmanDecision;
  relatorios: RelatorioAgente[];
  artefacto: any;
  houseId: string;
  guanabara?: { versao?: string; uteis?: number; lixo?: number };
}

export interface DispatchCartaError {
  carta: Carta;
  erro: string;
}

const ORDEM_CASAS = ["casa-dev", "casa-negocios", "casa-dados"];

function proximasCasas(puladas: Set<string>): string[] {
  return ORDEM_CASAS.filter((h) => !puladas.has(h));
}

export async function dispatchCarta(
  objective: string,
  opts: DispatchCartaOpts = {}
): Promise<DispatchCartaResult> {
  const queue = opts.queue ?? globalTaskQueue;
  const maxTentativas = opts.maxTentativas ?? 3;

  const carta = criarCarta(objective, {
    priority: opts.priority,
    domainHint: opts.domainHint,
  });
  queue.enqueue(carta);
  // Anti-starvation: promove cartas esperando há >5min antes de despachar
  try { queue.envelhecer(5); } catch { /* fila antiga sem guard */ }

  const puladas = new Set<string>();
  let ultimoErro = "";
  let entrega: PostmanDecision | null = null;

  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    carta.attempts = tentativa;
    const work = queue.dequeue() ?? carta;

    // 1) Carteiro sugere a casa
    const decision = await severinoEngine.handleTask(work.objective, {
      domain: work.domainHint,
    });
    entrega = decision;

    // ordem: casa sugerida primeiro, depois as demais
    const candidatas = [
      decision.houseId,
      ...proximasCasas(new Set([decision.houseId, ...puladas])),
    ].filter((h, i, arr) => arr.indexOf(h) === i);

    let aceitou = false;
    for (const houseId of candidatas) {
      if (puladas.has(houseId)) continue;
      const leader = new HouseLeader(houseId);
      console.log(
        `📮 Tentativa ${tentativa}/${maxTentativas}: oferecendo carta ${work.cartaId} à ${houseId}`
      );
      const veredito = leader.validateAddress(work);

      if (!veredito.aceita) {
        carimbar(work, "carteiro", houseId, "NEGADO", veredito.motivo);
        puladas.add(houseId);
        ultimoErro = veredito.motivo;
        continue;
      }

      // 2) ACEITO → roda pipeline DAG da casa + atualiza quadro interno
      carimbar(work, "carteiro", houseId, "ACEITO", veredito.motivo);
      const { runHousePipelineDAG } = await import("./pipeline.js");
      const { boardDaCasa } = await import("../houses/house-board.js");
      const board = boardDaCasa(houseId);
      board.adicionar(work, decision.room || "tech-lead");

      const { artefato, relatorios } = await runHousePipelineDAG(work, houseId, {
        ensureRobot: async ({ houseId: h, room }) =>
          factoryEnsureRobot({
            action: "create-new",
            teamId: h,
            domain: work.domainHint || decision.domain,
            houseId: h,
            houseName: h,
            room,
            reason: `pipeline DAG carta ${work.cartaId}`,
          }),
        runTask: (robotId, task) => factoryRunTask(robotId, task),
      });
      aceitou = true;
      // Quadro interno: A_FAZER → FAZENDO → EM_REVIEW → PRONTO
      try {
        board.mover(work.cartaId, "A_FAZER", "FAZENDO");
        board.mover(work.cartaId, "FAZENDO", "EM_REVIEW");
        board.mover(work.cartaId, "EM_REVIEW", "PRONTO");
      } catch (err: any) {
        console.log(`🗂️ Quadro: ${err?.message || err}`);
      }
      // 3) Setor educação: Guanabara analisa e consolida na loja (best-effort, nunca quebra a entrega)
      let guanabara: { versao?: string; uteis?: number; lixo?: number } = {};
      try {
        const { Guanabara } = await import("../skills/guanabara.js");
        const g = new Guanabara();
        const analise = g.analisar(relatorios as any);
        const slug = work.objective.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40).replace(/^-+|-+$/g, "") || "tarefa";
        const versao = await g.consolidarParaCasa(houseId, analise.consolidado, {
          skill_id: slug,
          tags: [decision.domain, houseId.replace(/^casa-/, "")],
          resumo: `Aprendizado de: ${work.objective.slice(0, 120)}`,
          dependencias: [],
          versao_estavel: "1.0.0",
        });
        guanabara = { versao, uteis: analise.uteis.length, lixo: analise.lixo.length };
      } catch (err: any) {
        console.log(`🎓 Guanabara pulado (${err?.message || err}) — entrega segue válida.`);
      }
      console.log(
        `📮 Carta ${work.cartaId} ENTREGUE em ${houseId} após ${tentativa} tentativa(s) — ${relatorios.length} relatório(s)`
      );
      return { carta: work, entrega: decision, relatorios, artefacto: artefato, houseId, guanabara };
    }

    if (!aceitou) {
      console.log(
        `📮 Tentativa ${tentativa}/${maxTentativas}: todas as candidatas negaram — re-enfileirando`
      );
      if (tentativa < maxTentativas) queue.enqueue(work);
    }
  }

  const erro = `Carta ${carta.cartaId} esgotou ${maxTentativas} tentativa(s). Último motivo: ${ultimoErro || "todas as casas negaram"}`;
  console.log(`📮 ${erro}`);
  console.log(`📮 Histórico: ${JSON.stringify(carta.history, null, 2)}`);
  throw Object.assign(new Error(erro), { carta, erro } satisfies DispatchCartaError);
}

export type { Carta, RelatorioAgente };
