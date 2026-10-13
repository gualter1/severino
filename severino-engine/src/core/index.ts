/**
 * 🚚 dispatch(objective) — fluxo completo:
 * engine.handleTask → factory.ensureRobot → factory.runTask
 * (+ distribution via splitDemand quando há múltiplas subtarefas).
 */

import { severinoEngine, type PostmanDecision, type TaskHints } from "./engine.js";
import { ensureRobot, runTask, splitDemand } from "../factory/factory-adapter.js";

export interface DispatchResult {
  routingDecision: PostmanDecision;
  distribution: Array<{ room: string; subtask: string }>;
  execution: any;
}

export async function dispatch(objective: string, hints: TaskHints = {}): Promise<DispatchResult> {
  // 1) Carteiro roteia
  const routingDecision = await severinoEngine.handleTask(objective, hints);

  // 2) Fábrica garante o robô (reutiliza ou abre quarto)
  const robot = await ensureRobot(routingDecision);
  // alinha decisão com o robô efetivo
  routingDecision.robotId = robot.robotId;
  if (robot.role) routingDecision.room = robot.role;

  // 3) Distribuição: quebra em subtarefas por quarto (best-effort)
  let distribution: Array<{ room: string; subtask: string }> = [];
  try {
    distribution = await splitDemand(objective, routingDecision.domain);
  } catch {
    distribution = [{ room: routingDecision.room || "generalist", subtask: objective }];
  }

  // 4) Executa a tarefa principal no robô
  const execution = await runTask(robot.robotId, {
    objective,
    domain: routingDecision.domain,
  });

  console.log(`🚚 Dispatch concluído: ${robot.robotId} (${routingDecision.action}) — ${distribution.length} subtarefa(s)`);
  return { routingDecision, distribution, execution };
}

export { severinoEngine };
export type { PostmanDecision, TaskHints };
