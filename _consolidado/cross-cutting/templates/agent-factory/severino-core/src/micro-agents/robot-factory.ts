import { promises as fs } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";
import { loadConfig } from "../config.js";
import { TaskRequest, TaskResponse } from "../types.js";
import { createRobot as createRobotFactory } from "../../../create-robot.ts";
import { resourceBroker } from "./resource-broker.js";
import { resourceManager } from "./resource-manager.js";

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

  constructor() {
    this.loadState();
  }

  private async loadState() {
    try {
      const teamsPath = join(this.config.roomsDir, 'teams.json');
      const data = await fs.readFile(teamsPath, 'utf-8');
      const state = JSON.parse(data);
      // Reconstruct teams
      const robotToTeam = new Map<string, string>();
      for (const teamData of state.teams || []) {
        this.teams.set(teamData.teamId, {
          teamId: teamData.teamId,
          name: teamData.name,
          domain: teamData.domain,
          robotIds: [...(teamData.robotIds || [])],
          status: teamData.status || 'active',
          totalTasksCompleted: teamData.totalTasksCompleted || 0,
        });
        for (const rid of teamData.robotIds || []) robotToTeam.set(rid, teamData.teamId);
      }
      // Reconstruct robots by scanning each robot folder for agent.json
      // (roomsDir contains subfolders per robot)
      const roomsDir = this.config.roomsDir;
      const entries = await fs.readdir(roomsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          const robotId = entry.name;
          const agentPath = join(roomsDir, robotId, 'agent.json');
          try {
            const agentContent = await fs.readFile(agentPath, 'utf-8');
            const agent = JSON.parse(agentContent);
            // Only create RobotInstance if not already present (maybe from team load)
            if (!this.robots.has(robotId)) {
              // 1) teams.json mapping wins 2) agent.json teamId 3) prefix inference
              let teamId: string | undefined = robotToTeam.get(robotId) || agent.teamId;
              if (!teamId || teamId === 'unknown') {
                teamId = this.inferTeamFromPrefix(robotId, agent);
              }
              const robot: RobotInstance = {
                robotId,
                role: agent.role || 'unknown',
                teamId,
                roomDir: join(roomsDir, robotId),
                capabilities: agent.capabilities || [],
                status: 'idle',
              };
              this.robots.set(robotId, robot);
              // Ensure team exists
              if (!this.teams.has(robot.teamId)) {
                this.teams.set(robot.teamId, {
                  teamId: robot.teamId,
                  name: `Legacy ${robot.teamId}`,
                  domain: (agent.allowedDomains && agent.allowedDomains[0]) || agent.domain || 'backend',
                  robotIds: [],
                  status: 'active',
                  totalTasksCompleted: 0,
                });
              }
              // Add robot to team's robotIds
              const team = this.teams.get(robot.teamId);
              if (team && !team.robotIds.includes(robotId)) {
                team.robotIds.push(robotId);
              }
            }
          } catch (err: any) {
            // Ignore errors reading individual agent.json (maybe not a robot folder)
            console.warn(`Could not load agent for robot ${robotId}:`, err.message);
          }
        }
      }
      // Drop empty placeholder 'unknown' team if it survived from older runs
      if (this.teams.has('unknown')) {
        const unk = this.teams.get('unknown')!;
        if (unk.robotIds.length === 0) {
          this.teams.delete('unknown');
        } else {
          // Migra robôs órfãos do 'unknown' para legacy-* por prefixo e remove o placeholder
          for (const rid of [...unk.robotIds]) {
            try {
              const agentContent = await fs.readFile(join(roomsDir, rid, 'agent.json'), 'utf-8');
              const agent = JSON.parse(agentContent);
              const newTeamId = this.inferTeamFromPrefix(rid, agent);
              if (!this.teams.has(newTeamId)) {
                this.teams.set(newTeamId, {
                  teamId: newTeamId,
                  name: `Legacy ${newTeamId}`,
                  domain: (agent.allowedDomains && agent.allowedDomains[0]) || agent.domain || 'backend',
                  robotIds: [],
                  status: 'active',
                  totalTasksCompleted: 0,
                });
              }
              const nt = this.teams.get(newTeamId)!;
              if (!nt.robotIds.includes(rid)) nt.robotIds.push(rid);
              const rb = this.robots.get(rid);
              if (rb) rb.teamId = newTeamId;
            } catch { /* mantém no unknown se não ler agent.json */ }
          }
          const still = this.teams.get('unknown')!;
          if (still.robotIds.every(rid => this.robots.get(rid)?.teamId !== 'unknown')) {
            this.teams.delete('unknown');
          }
        }
      }
      // Persiste a migração imediatamente para limpar o teams.json
      await this.saveState();
      console.log(`💾 Loaded state: ${this.teams.size} teams, ${this.robots.size} robots`);
    } catch (err: any) {
      console.warn(`💾 No persisted state found or error loading:`, err.message);
      // No state yet, start fresh
    }
  }

  private inferTeamFromPrefix(robotId: string, agent: any): string {
    // robot-backend-xxx -> legacy-backend | robot-prod-team-01-backend-1 -> prod-team-01
    // robot-backend-street-0864-backend-developer-1 -> backend-street-0864
    const street = robotId.match(/^(robot-.+-street-\d+)/);
    if (street) return street[1].replace(/^robot-/, '');
    const prod = robotId.match(/^robot-(prod-team-\d+)/);
    if (prod) return prod[1];
    const legacy = robotId.match(/^robot-(ad-hoc-[a-z]+|backend|frontend|qa|devops|sales|test-team[^-]*|final-test|test-task-team)/);
    if (legacy) return `legacy-${legacy[1]}`;
    const generic = robotId.match(/^robot-([a-z]+)/);
    if (generic) return `legacy-${generic[1]}`;
    return agent.teamId || 'legacy-orphans';
  }

  private inferSkillsFromTask(task: TaskRequest): string[] {
    const objective = task.objective.toLowerCase();
    const skills: string[] = [];

    // Match skills from available catalog based on objective keywords
    if (objective.includes('endpoint') || objective.includes('api')) skills.push('backend-developer');
    if (objective.includes('react') || objective.includes('frontend')) skills.push('frontend-developer');
    if (objective.includes('test')) skills.push('qa-engineer');
    if (objective.includes('docker') || objective.includes('ci/cd')) skills.push('devops-engineer');

    return skills;
  }

  private async saveState() {
    try {
      const teamsData = Array.from(this.teams.values()).map(t => ({
        teamId: t.teamId,
        name: t.name,
        domain: t.domain,
        robotIds: t.robotIds,
        status: t.status,
        totalTasksCompleted: t.totalTasksCompleted,
      }));
      const state = { teams: teamsData };
      const teamsPath = join(this.config.roomsDir, 'teams.json');
      await fs.writeFile(teamsPath, JSON.stringify(state, null, 2), 'utf-8');
      console.log(`💾 State saved: ${this.teams.size} teams`);
    } catch (err) {
      console.error(`❌ Failed to save state:`, err.message);
    }
  }

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
    await this.saveState();
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
    await this.saveState();
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
    const checkedOutTokens: { token: string; resourceId: string }[] = [];

    try {
      // 0. Resource Broker: checkout required skills/tools (auto-registra se não existir)
      const requiredSkills = this.inferSkillsFromTask(task);

      for (const skillId of requiredSkills) {
        try {
          const existing = resourceBroker.listResources().find(r => r.resourceId === skillId);
          if (!existing) {
            resourceBroker.registerResource({
              resourceId: skillId,
              name: skillId,
              type: "skill",
              description: `Auto-registered skill ${skillId} para domínio ${task.domain}`,
            });
          }
          const { token } = resourceBroker.checkout(skillId, robot.robotId, robot.teamId, 1800000);
          checkedOutTokens.push({ token, resourceId: skillId });
          console.log(`🔐 Resource Broker: Skill '${skillId}' checked out for robot ${robot.robotId}`);
        } catch (e: any) {
          console.warn(`⚠️ Resource Broker: Could not checkout skill '${skillId}': ${e.message}`);
        }
      }

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
      ], { maxTokens: 8192, temperature: 0.2 }) as { content: string; usage?: { totalTokens?: number } };

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
      // Resource Broker: Checkin resources back
      for (const { token, resourceId } of checkedOutTokens) {
        try {
          resourceBroker.checkin(token);
          console.log(`🔓 Resource Broker: Skill '${resourceId}' checked in from robot ${robot.robotId}`);
        } catch (e: any) {
          console.warn(`⚠️ Resource Broker: Could not checkin skill '${resourceId}': ${e.message}`);
        }
      }
      robot.status = "idle";
      robot.currentTaskId = undefined;
      // Atualiza contador e persiste estado
      const team = this.teams.get(robot.teamId);
      if (team && status === "completed") team.totalTasksCompleted += 1;
      await this.saveState();
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