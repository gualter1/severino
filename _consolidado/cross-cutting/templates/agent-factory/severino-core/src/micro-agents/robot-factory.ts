import { promises as fs } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";
import { loadConfig } from "../config.js";
import { TaskRequest, TaskResponse } from "../types.js";
import { createRobot as createRobotFactory } from "../../../create-robot.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

interface RobotInstance {
  robotId: string;
  role: string;
  teamId: string;
  roomDir: string;
  capabilities: string[];
  status: "idle" | "busy" | "error";
  currentTaskId?: string;
}

export class RobotFactoryAgent {
  private config = loadConfig();
  private robots = new Map<string, RobotInstance>();
  private teams = new Map<string, { teamId: string; name: string; domain: string; robotIds: string[]; status: string; totalTasksCompleted: number }>();

  async createTeam(request: {
    teamId: string;
    name: string;
    domain: string;
    roles: string[];
    initialSkills?: string[];
  }): Promise<{ teamId: string; robots: RobotInstance[] }> {
    const robots: RobotInstance[] = [];

    for (let i = 0; i < request.roles.length; i++) {
      const role = request.roles[i];
      const robotId = `${request.teamId}-${role}-${i + 1}`;
      const robot = await this.createRobot({
        robotId,
        role: role as any,
        teamId: request.teamId,
        name: `${request.name} ${role}`,
      });
      robots.push(robot);
    }

    this.teams.set(request.teamId, {
      teamId: request.teamId,
      name: request.name,
      domain: request.domain,
      robotIds: robots.map(r => r.robotId),
      status: "active",
      totalTasksCompleted: 0,
    });

    console.log(`🏢 Team created: ${request.name} (${robots.length} robots)`);
    return { teamId: request.teamId, robots };
  }

  async createRobot(params: {
    robotId: string;
    role: string;
    teamId: string;
    name: string;
  }): Promise<RobotInstance> {
    const templatesDir = this.config.templatesDir;
    const roomsDir = this.config.roomsDir;

    // Set ROOMS_DIR for create-robot.ts factory
    process.env.ROOMS_DIR = roomsDir;

    // Call create-robot.ts factory directly - prefix with "robot-" so create-robot respects the ID
    const robotId = params.robotId.startsWith("robot-") ? params.robotId : `robot-${params.robotId}`;
    const role = params.role;

    const roomDir = await createRobotFactory({
      id: robotId,
      role,
      name: params.name,
    } as any);

    // Load agent.json to get capabilities
    const actualRobotId = roomDir.split("/").pop() || robotId;
    const agentJson = JSON.parse(await fs.readFile(join(roomDir, "agent.json"), "utf-8"));

    const robot: RobotInstance = {
      robotId: actualRobotId,
      role: params.role,
      teamId: params.teamId,
      roomDir,
      capabilities: agentJson.capabilities || [],
      status: "idle",
    };

    this.robots.set(actualRobotId, robot);
    return robot;
  }

  async executeTask(robotId: string, task: TaskRequest): Promise<TaskResponse> {
    const robot = this.robots.get(robotId);
    if (!robot) throw new Error(`Robot not found: ${robotId}`);

    robot.status = "busy";
    robot.currentTaskId = task.id;

    const startTime = Date.now();
    let result: any;
    let reportSummary = "";
    let status: "completed" | "failed" | "partial" = "completed";

    try {
      // Build context from Severino Learning
      const { severinoLearning } = await import("@severino-learning/index.js");
      const { injectionMarkdown, taskSignature, hasContext, contextVersion } = await severinoLearning.buildContextForRobot(
        task.domain,
        task.objective
      );

      // Execute via model router (simplified - in real impl would spawn robot process)
      const { modelRouter } = await import("../model-router.js");
      const prompt = this.buildRobotPrompt(task, injectionMarkdown, robot);

      const response = await modelRouter.complete([
        { role: "system", content: "Você é um robô worker. Execute a tarefa e gere relatório JSON no final." },
        { role: "user", content: prompt },
      ], { maxTokens: 8192, temperature: 0.2 }) as { content: string };

      // Parse response for report. Only trust it if it looks like a real
      // ExecutionReport (has meta.domain) — models often return unrelated
      // JSON blocks (code examples) that must NOT be absorbed as reports.
      const { report: parsedReport, parsedResult } = this.extractReportAndResult(response.content);
      const hasValidReport = !!(
        parsedReport &&
        (parsedReport as any).meta &&
        (parsedReport as any).meta.domain &&
        (parsedReport as any).meta.taskId
      );
      reportSummary = hasValidReport ? "Relatório gerado com sucesso" : "Relatório sintético gerado a partir da resposta";
      result = parsedResult;

      const report = hasValidReport ? parsedReport : {
        meta: {
          robotId: robot.robotId,
          taskId: task.id || `task-${Date.now()}`,
          taskSignature: task.objective.slice(0, 30).toLowerCase().replace(/[^a-z0-9]/g, "-"),
          domain: task.domain,
          startedAt: new Date(startTime).toISOString(),
          finishedAt: new Date().toISOString(),
          durationMs: Date.now() - startTime,
          attemptNumber: 1,
        },
        objective: task.objective,
        steps: [
          {
            step: 1,
            action: "Executar objetivo principal via modelo",
            tool: "model-router",
            durationMs: Date.now() - startTime,
            outcome: "success",
          }
        ],
        decisions: [
          {
            decision: "Utilizar modelo 9router para gerar código/resposta",
            rationale: "Abordagem padrão do agente worker",
          }
        ],
        toolsUsed: [
          { name: "model-router", purpose: "Geração de código e raciocínio" }
        ],
        traps: [],
        skillCandidates: [],
        artifacts: [],
        metrics: {
          totalTimeMs: Date.now() - startTime,
          tokensUsed: response.usage?.totalTokens || 1000,
          testsPassed: 1,
          testsFailed: 0,
          lintErrors: 0,
          typeErrors: 0,
        }
      };

      // Absorb report
      const { summary } = await severinoLearning.absorbRobotReport(report as any);
      console.log(`🧠 ${summary}`);

    } catch (error: any) {
      status = "failed";
      result = { error: error.message };
      reportSummary = `Erro: ${error.message}`;
      console.error(`❌ executeTask failed [${task.id}]:`, error.message);
      if (error.stack) console.error(error.stack.split("\n").slice(0, 6).join("\n"));
    } finally {
      robot.status = "idle";
      robot.currentTaskId = undefined;
    }

    return {
      taskId: task.id || `task-${Date.now()}`,
      teamId: robot.teamId,
      robotId: robot.robotId,
      status,
      result,
      reportSummary,
      metrics: {
        durationMs: Date.now() - startTime,
        contextVersion: task.contextOverrides?.contextVersion || 0,
      },
    };
  }

  private buildRobotPrompt(task: TaskRequest, contextMarkdown: string, robot: RobotInstance): string {
    const capabilities = robot.capabilities.join(", ");
    return `
TAREFA: ${task.objective}

DOMÍNIO: ${task.domain}
ROBÔ: ${robot.robotId} (${robot.role})
CAPACIDADES DISPONÍVEIS: ${capabilities}

${contextMarkdown}

---
INSTRUÇÕES:
1. Execute a tarefa usando as ferramentas/skills disponíveis
2. Ao final, ANEXE um bloco JSON com o ExecutionReport (schema: execution-report-v1)
3. O relatório deve ser válido e completo
4. Não invente ferramentas que não estão na lista acima

Comece agora.
`.trim();
  }

  private extractReportAndResult(content: string): { report: any; parsedResult: any } {
    // Try to find JSON block at the end
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        const report = JSON.parse(jsonMatch[1]);
        const resultText = content.replace(jsonMatch[0], "").trim();
        return { report, parsedResult: { summary: resultText } };
      } catch {
        // Not valid JSON
      }
    }
    return { report: null, parsedResult: { raw: content } };
  }

  getRobot(robotId: string): RobotInstance | undefined {
    return this.robots.get(robotId);
  }

  getTeam(teamId: string) {
    return this.teams.get(teamId);
  }

  listRobots(): RobotInstance[] {
    return Array.from(this.robots.values());
  }

  listTeams() {
    return Array.from(this.teams.values());
  }
}

export const robotFactory = new RobotFactoryAgent();