import { TaskRequestSchema, CreateTeamRequestSchema } from "../types.js";
import { robotFactory } from "../micro-agents/robot-factory.js";
import { skillManager } from "../micro-agents/skill-manager.js";
import { learningEngine } from "../micro-agents/learning-engine.js";
import { modelRouter } from "../model-router.js";
export async function registerHttpApi(server) {
    // Health check
    server.get("/health", async () => ({ status: "ok", timestamp: new Date().toISOString() }));
    // List teams
    server.get("/teams", async () => {
        const teams = robotFactory.listTeams();
        return { teams };
    });
    // Get team details
    server.get("/teams/:teamId", async (request) => {
        const team = robotFactory.getTeam(request.params.teamId);
        if (!team)
            throw new Error("Team not found");
        return team;
    });
    // Create team
    server.post("/teams", async (request) => {
        const body = CreateTeamRequestSchema.parse(request.body);
        const result = await robotFactory.createTeam(body);
        return { success: true, ...result };
    });
    // Execute task
    server.post("/tasks", async (request) => {
        const body = TaskRequestSchema.parse(request.body);
        const taskId = body.id || `task-${Date.now()}`;
        // Find available robot in team or create ad-hoc
        let robotId;
        if (body.teamId) {
            const team = robotFactory.getTeam(body.teamId);
            if (!team)
                throw new Error(`Team not found: ${body.teamId}`);
            const robots = team.robotIds.map(id => robotFactory.getRobot(id)).filter(Boolean);
            const available = robots.find(r => r && r.status === "idle");
            if (!available)
                throw new Error("No available robots in team");
            robotId = available.robotId;
        }
        else {
            // Create ad-hoc robot for the domain
            const adHocId = `ad-hoc-${body.domain}-${Date.now()}`;
            await robotFactory.createRobot({
                robotId: `robot-${adHocId}`,
                role: body.domain,
                teamId: "ad-hoc",
                name: `Ad-hoc ${body.domain}`,
            });
            robotId = `robot-${adHocId}`;
        }
        const task = { ...body, id: taskId };
        const response = await robotFactory.executeTask(robotId, task);
        return response;
    });
    // Skill catalog
    server.get("/skills", async (request) => {
        const skills = skillManager.listSkills(request.query);
        return { skills };
    });
    server.post("/skills", async (request) => {
        const skill = await skillManager.registerSkill(request.body);
        // Also register as resource
        const { resourceManager } = await import("../micro-agents/resource-manager.js");
        resourceManager.registerSkillAsResource(skill);
        return { success: true, skill };
    });
    server.post("/skills/:name/assign/:robotId", async (request) => {
        const success = await skillManager.assignSkillToRobot(request.params.robotId, request.params.name);
        return { success };
    });
    // Resource Broker (Porteiro) endpoints
    server.get("/resources", async (request) => {
        const { resourceManager } = await import("../micro-agents/resource-manager.js");
        const filter = {
            type: request.query.type,
            status: request.query.status,
        };
        const resources = resourceManager.getAllResources().filter(r => {
            if (filter.type && r.type !== filter.type)
                return false;
            if (filter.status && r.status !== filter.status)
                return false;
            return true;
        });
        return { resources };
    });
    server.post("/resources/checkout", async (request) => {
        const { resourceManager } = await import("../micro-agents/resource-manager.js");
        const { resourceId, robotId, teamId, ttlMs } = request.body;
        if (!resourceId || !robotId) {
            throw new Error("resourceId and robotId are required");
        }
        const resource = resourceManager.getAllResources().find(r => r.resourceId === resourceId);
        if (!resource)
            throw new Error(`Resource not found: ${resourceId}`);
        const { resourceBroker } = await import("../micro-agents/resource-broker.js");
        const { token, expiresAt } = resourceBroker.checkout(resourceId, robotId, teamId, ttlMs);
        return { success: true, token, expiresAt, resource };
    });
    server.post("/resources/checkin", async (request) => {
        const { resourceBroker } = await import("../micro-agents/resource-broker.js");
        const { token } = request.body;
        if (!token)
            throw new Error("Token required");
        const success = resourceBroker.checkin(token);
        return { success };
    });
    server.post("/resources/validate", async (request) => {
        const { resourceBroker } = await import("../micro-agents/resource-broker.js");
        const { token } = request.body;
        if (!token)
            throw new Error("Token required");
        const result = resourceBroker.verifyToken(token);
        return result;
    });
    // Learning contexts
    server.get("/learning/contexts", async () => {
        const contexts = await learningEngine.listContexts();
        return { contexts };
    });
    server.get("/learning/contexts/:domain/:signature", async (request) => {
        const context = await learningEngine.getContext(request.params.domain, request.params.signature);
        if (!context)
            throw new Error("Context not found");
        return context;
    });
    // Model router
    server.post("/model/complete", async (request) => {
        const { messages, ...options } = request.body;
        const response = await modelRouter.complete(messages, options);
        return response;
    });
    server.get("/model/models", async () => {
        const models = await modelRouter.listModels();
        return { models };
    });
    // Grill Me endpoint (placeholder)
    server.post("/grill-me", async (request) => {
        const { topic, participants, runNow } = request.body;
        const { grillScheduler } = await import("../micro-agents/grill-scheduler.js");
        if (runNow) {
            const session = await grillScheduler.runGrillNow(topic);
            return { success: true, session };
        }
        else {
            const session = grillScheduler.schedule(topic);
            return { success: true, session };
        }
    });
    server.get("/grill", async () => {
        const { grillScheduler } = await import("../micro-agents/grill-scheduler.js");
        return { sessions: grillScheduler.listSessions() };
    });
    server.get("/grill/:sessionId", async (request) => {
        const { grillScheduler } = await import("../micro-agents/grill-scheduler.js");
        const session = grillScheduler.getSession(request.params.sessionId);
        if (!session)
            throw new Error("Session not found");
        return session;
    });
}
//# sourceMappingURL=http-api.js.map