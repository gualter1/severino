/**
 * 🛏️ runHousePipeline — executa as etapas do HouseLeader em sandbox.
 * Cada etapa gera 1 RelatorioAgente, mesmo se falhar.
 */

import { HouseLeader } from "../houses/house-leader.js";
import { runSandbox } from "../skills/sandbox.js";
import type { Carta, RelatorioAgente } from "./carta.js";

export interface PipelineRobot {
  robotId: string;
  role?: string;
}

export interface PipelineDeps {
  ensureRobot: (args: { houseId: string; room: string }) => Promise<PipelineRobot>;
  runTask: (
    robotId: string,
    task: { objective: string; domain: string; id?: string }
  ) => Promise<any>;
}

export interface PipelineResult {
  artefato: any;
  relatorios: RelatorioAgente[];
}

function extrairResumo(artefato: any, fallback: string): string {
  if (!artefato) return fallback;
  if (typeof artefato.reportSummary === "string") return artefato.reportSummary;
  if (typeof artefato.result?.summary === "string") return artefato.result.summary;
  if (typeof artefato.resumo === "string") return artefato.resumo;
  try {
    const s = JSON.stringify(artefato);
    return s.length > 200 ? s.slice(0, 200) + "…" : s;
  } catch {
    return fallback;
  }
}

function extrairSkills(artefato: any): string[] {
  const v =
    artefato?.skillsUsadas ?? artefato?.result?.skills ?? artefato?.skills ?? [];
  return Array.isArray(v) ? v.map(String) : [];
}

function relatorioOk(
  carta: Carta,
  houseId: string,
  robotId: string,
  role: string,
  artefato: any
): RelatorioAgente {
  const resumo = extrairResumo(artefato, `Etapa ${role} concluída.`);
  return {
    cartaId: carta.cartaId,
    robotId,
    role,
    houseId,
    erros: [],
    acertos: [resumo],
    resumo,
    rodouSemErros: true,
    skillsUsadas: extrairSkills(artefato),
    oQueMelhorar: "manter o padrão da etapa",
    oQueNaoFazer: "não pular a validação do artefato",
    precisouCorrigir: false,
  };
}

function relatorioFalha(
  carta: Carta,
  houseId: string,
  robotId: string,
  role: string,
  msg: string
): RelatorioAgente {
  return {
    cartaId: carta.cartaId,
    robotId,
    role,
    houseId,
    erros: [msg],
    acertos: [],
    resumo: `Etapa ${role} falhou: ${msg}`,
    rodouSemErros: false,
    skillsUsadas: [],
    oQueMelhorar: "investigar o erro e repetir a etapa isolada",
    oQueNaoFazer: "não repetir sem corrigir a causa raiz",
    precisouCorrigir: true,
    detalhesCorrecao: msg,
  };
}

export async function runHousePipeline(
  carta: Carta,
  houseId: string,
  deps: PipelineDeps
): Promise<PipelineResult> {
  const leader = new HouseLeader(houseId);
  const steps = leader.breakDown(carta);
  const relatorios: RelatorioAgente[] = [];
  let artefato: any = null;

  for (let i = 0; i < steps.length; i++) {
    const { room, subtask } = steps[i];
    console.log(
      `🛏️ Etapa ${i + 1}/${steps.length} [${houseId}/${room}]: "${subtask.slice(0, 80)}"`
    );
    let robotId = "desconhecido";
    let role = room;
    try {
      const robot = await deps.ensureRobot({ houseId, room });
      robotId = robot.robotId;
      role = robot.role || room;
      const taskId = `${carta.cartaId}-${room}-${i + 1}`;
      const domain = carta.domainHint || houseId;
      // runSandbox nunca lança — devolve {ok, artefato?, erro?}
      const sb = await runSandbox(taskId, role, async () =>
        deps.runTask(robotId, { objective: subtask, domain, id: taskId })
      );
      if (sb.ok) {
        artefato = sb.artefato;
        relatorios.push(relatorioOk(carta, houseId, robotId, role, sb.artefato));
        console.log(`🛏️ Etapa ${i + 1}/${steps.length} ✅ ${robotId} concluiu`);
      } else {
        relatorios.push(
          relatorioFalha(carta, houseId, robotId, role, sb.erro || "erro desconhecido no sandbox")
        );
        console.log(`🛏️ Etapa ${i + 1}/${steps.length} ❌ ${robotId} falhou: ${sb.erro}`);
      }
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      relatorios.push(relatorioFalha(carta, houseId, robotId, role, msg));
      console.log(`🛏️ Etapa ${i + 1}/${steps.length} ❌ exceção: ${msg}`);
    }
  }

  console.log(
    `🛏️ Pipeline ${houseId} concluído: ${relatorios.filter((r) => r.rodouSemErros).length}/${relatorios.length} etapa(s) sem erro`
  );
  return { artefato, relatorios };
}
