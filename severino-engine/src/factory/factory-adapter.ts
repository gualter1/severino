/**
 * 🏭 FactoryAdapter — ponte fina para o robotFactory real (severino-core).
 *
 * Por que adapter: o engine decide (use-existing / create-new), mas quem
 * sabe fundar casa / abrir quarto / executar tarefa é o robotFactory.
 * Se o import do core falhar (core ausente), cai num stub local que
 * registra em memória — nunca quebra o dispatch.
 */

import type { PostmanDecision } from "../core/engine.js";

// ---------------------------------------------------------------------------
// Tipos mínimos do robotFactory real (duck-typing, sem acoplamento forte)
// ---------------------------------------------------------------------------
interface RealRobot {
  robotId: string;
  role: string;
  teamId: string;
  status: string;
}

interface RealFactory {
  foundHouse(houseId: string): Promise<{ teamId: string; robots: RealRobot[] }>;
  ensureRoom(houseId: string, role: string): Promise<RealRobot>;
  executeTask(robotId: string, task: any): Promise<any>;
  splitDemand?(objective: string, domain: string): Array<{ room: string; subtask: string }>;
  getTeam?(teamId: string): any;
}

let realFactory: RealFactory | null = null;
let triedLoad = false;

// Stub local (fallback em memória)
const stubRobots = new Map<string, RealRobot>();

async function loadRealFactory(): Promise<RealFactory | null> {
  if (triedLoad) return realFactory;
  triedLoad = true;
  // Caminho relativo do adapter até o severino-core template
  const candidates = [
    "../../../_consolidado/cross-cutting/templates/agent-factory/severino-core/src/micro-agents/robot-factory.js",
    "../../../_consolidado/cross-cutting/templates/agent-factory/severino-core/src/micro-agents/robot-factory.ts",
  ];
  for (const rel of candidates) {
    try {
      const mod = await import(rel);
      const factory = mod.robotFactory ?? mod.default;
      if (factory && typeof factory.ensureRoom === "function") {
        console.log(`🏭 Fábrica real conectada via '${rel}'`);
        realFactory = factory as RealFactory;
        return realFactory;
      }
    } catch {
      // tenta próximo candidato
    }
  }
  console.log("🏭 Fábrica real indisponível — usando stub local (memória).");
  return null;
}

/** Garante um robô para a decisão: reutiliza ou funda/abre quarto. */
export async function ensureRobot(decision: PostmanDecision): Promise<RealRobot> {
  const factory = await loadRealFactory();
  const room = decision.room || "generalist";

  if (factory) {
    try {
      if (decision.action === "use-existing" && decision.robotId) {
        // robô já escolhido pelo estoque — só confirma via ensureRoom (idempotente)
        // se o robô sumiu, ensureRoom cria um novo do mesmo quarto
        return await factory.ensureRoom(decision.houseId, room);
      }
      // create-new: funda casa se preciso + abre quarto
      try {
        return await factory.ensureRoom(decision.houseId, room);
      } catch {
        await factory.foundHouse(decision.houseId);
        return await factory.ensureRoom(decision.houseId, room);
      }
    } catch (err: any) {
      console.log(`🏭 Falha na fábrica real (${err.message}) — caindo pro stub local.`);
    }
  }

  // ---- stub local ----
  const key = `${decision.houseId}:${room}`;
  const existing = stubRobots.get(key);
  if (existing) return existing;
  const stub: RealRobot = {
    robotId: `robot-${room}-stub-01`,
    role: room,
    teamId: decision.houseId,
    status: "idle",
  };
  stubRobots.set(key, stub);
  console.log(`🏭 Stub: quarto '${room}' aberto em ${decision.houseId} → ${stub.robotId}`);
  return stub;
}

/** Executa a tarefa no robô (real ou stub). */
export async function runTask(robotId: string, task: { objective: string; domain: string; id?: string }): Promise<any> {
  const factory = await loadRealFactory();
  if (factory && typeof factory.executeTask === "function") {
    try {
      return await factory.executeTask(robotId, {
        id: task.id || `task-${Date.now()}`,
        objective: task.objective,
        domain: task.domain,
      });
    } catch (err: any) {
      console.log(`🏭 executeTask real falhou (${err.message}) — retornando stub.`);
    }
  }
  // stub: registra localmente e retorna resposta sintética
  const started = Date.now();
  return {
    taskId: task.id || `task-${Date.now()}`,
    teamId: "stub",
    robotId,
    status: "completed",
    result: { summary: `Stub executou: ${task.objective.slice(0, 120)}` },
    reportSummary: "Execução stub local (fábrica real indisponível).",
    metrics: { durationMs: Date.now() - started, contextVersion: 0 },
  };
}

/** Quebra a demanda em subtarefas por quarto (usa splitDemand real se houver). */
export async function splitDemand(
  objective: string,
  domain: string
): Promise<Array<{ room: string; subtask: string }>> {
  const factory = await loadRealFactory();
  if (factory?.splitDemand) {
    try {
      return factory.splitDemand(objective, domain);
    } catch {
      // cai no fallback abaixo
    }
  }
  // fallback determinístico: chunk único
  return [{ room: "generalist", subtask: objective }];
}

// util p/ testes: limpa stub
export function _clearStub(): void {
  stubRobots.clear();
  triedLoad = false;
  realFactory = null;
}

export type { RealRobot };
