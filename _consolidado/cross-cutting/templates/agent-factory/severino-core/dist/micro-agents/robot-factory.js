import { promises as fs } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { loadConfig } from "../config.js";
import { createRobot as createRobotFactory } from "../../../create-robot.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");
export class RobotFactoryAgent {
    config = loadConfig();
    robots = new Map();
    teams = new Map();
    async createTeam(request) {
        const robots = [];
        for (let i = 0; i < request.roles.length; i++) {
            const role = request.roles[i];
            const robotId = `${request.teamId}-${role}-${i + 1}`;
            const robot = await this.createRobot({
                robotId,
                role: role,
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
    async createRobot(params) {
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
        });
        // Load agent.json to get capabilities
        const actualRobotId = roomDir.split("/").pop() || robotId;
        const agentJson = JSON.parse(await fs.readFile(join(roomDir, "agent.json"), "utf-8"));
        const robot = {
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
    async executeTask(robotId, task) {
        const robot = this.robots.get(robotId);
        if (!robot)
            throw new Error(`Robot not found: ${robotId}`);
        robot.status = "busy";
        robot.currentTaskId = task.id;
        const startTime = Date.now();
        let result;
        let reportSummary = "";
        let status = "completed";
        try {
            // Build context from Severino Learning
            const { severinoLearning } = await import("@severino-learning/index.js");
            const { injectionMarkdown, taskSignature, hasContext, contextVersion } = await severinoLearning.buildContextForRobot(task.domain, task.objective);
            // Execute via model router (simplified - in real impl would spawn robot process)
            const { modelRouter } = await import("../model-router.js");
            const prompt = this.buildRobotPrompt(task, injectionMarkdown, robot);
            const response = await modelRouter.complete([
                { role: "system", content: "Você é um robô worker. Execute a tarefa e gere relatório JSON no final." },
                { role: "user", content: prompt },
            ], { maxTokens: 8192, temperature: 0.2 });
            // Parse response for report
            const { report, parsedResult } = this.extractReportAndResult(response.content);
            reportSummary = report ? "Relatório gerado" : "Sem relatório válido";
            result = parsedResult;
            // Absorb report if present
            if (report) {
                const { summary } = await severinoLearning.absorbRobotReport(report);
                console.log(`🧠 ${summary}`);
            }
        }
        catch (error) {
            status = "failed";
            result = { error: error.message };
            reportSummary = `Erro: ${error.message}`;
        }
        finally {
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
    buildRobotPrompt(task, contextMarkdown, robot) {
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
    extractReportAndResult(content) {
        // Try to find JSON block at the end
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
            try {
                const report = JSON.parse(jsonMatch[1]);
                const resultText = content.replace(jsonMatch[0], "").trim();
                return { report, parsedResult: { summary: resultText } };
            }
            catch {
                // Not valid JSON
            }
        }
        return { report: null, parsedResult: { raw: content } };
    }
    getRobot(robotId) {
        return this.robots.get(robotId);
    }
    getTeam(teamId) {
        return this.teams.get(teamId);
    }
    listRobots() {
        return Array.from(this.robots.values());
    }
    listTeams() {
        return Array.from(this.teams.values());
    }
}
export const robotFactory = new RobotFactoryAgent();
//# sourceMappingURL=robot-factory.js.map