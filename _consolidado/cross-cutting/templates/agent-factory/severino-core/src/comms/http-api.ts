import { loadConfig } from "../config.js";
import { TaskRequestSchema, TaskResponse, CreateTeamRequestSchema, TeamState } from "../types.js";
import { robotFactory } from "../micro-agents/robot-factory.js";
import { skillManager } from "../micro-agents/skill-manager.js";
import { learningEngine } from "../micro-agents/learning-engine.js";
import { reporter } from "../micro-agents/reporter.js";
import { modelRouter } from "../model-router.js";

export async function registerHttpApi(server: any) {
  // Health check
  server.get("/health", async () => ({ status: "ok", timestamp: new Date().toISOString() }));

  // List teams
  server.get("/teams", async () => {
    const teams = robotFactory.listTeams();
    return { teams };
  });

  // Get team details
  server.get("/teams/:teamId", async (request: any) => {
    const team = robotFactory.getTeam(request.params.teamId);
    if (!team) throw new Error("Team not found");
    return team;
  });

  // Create team
  server.post("/teams", async (request: any) => {
    const body = CreateTeamRequestSchema.parse(request.body);
    const result = await robotFactory.createTeam(body);
    return { success: true, ...result };
  });

  // Execute task
  server.post("/tasks", async (request: any) => {
    const body = TaskRequestSchema.parse(request.body);
    const taskId = body.id || `task-${Date.now()}`;

    // Find available robot in team or create ad-hoc
    let robotId: string;

    if (body.teamId) {
      const team = robotFactory.getTeam(body.teamId);
      if (!team) throw new Error(`Team not found: ${body.teamId}`);
      const robots = team.robotIds.map(id => robotFactory.getRobot(id)).filter(Boolean);
      const available = robots.find(r => r && r.status === "idle");
      if (!available) throw new Error("No available robots in team");
      robotId = available.robotId;
    } else {
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
  server.get("/skills", async (request: any) => {
    const skills = skillManager.listSkills(request.query);
    return { skills };
  });

  server.post("/skills", async (request: any) => {
    const skill = await skillManager.registerSkill(request.body);
    // Also register as resource
    const { resourceManager } = await import("../micro-agents/resource-manager.js");
    resourceManager.registerSkillAsResource(skill);
    return { success: true, skill };
  });

  server.post("/skills/:name/assign/:robotId", async (request: any) => {
    const success = await skillManager.assignSkillToRobot(request.params.robotId, request.params.name);
    return { success };
  });

  // Resource Broker (Porteiro) endpoints
  server.get("/resources", async (request: any) => {
    const { resourceManager } = await import("../micro-agents/resource-manager.js");
    const filter = {
      type: request.query.type as string,
      status: request.query.status as string,
    };
    const resources = resourceManager.getAllResources().filter(r => {
      if (filter.type && r.type !== filter.type) return false;
      if (filter.status && r.status !== filter.status) return false;
      return true;
    });
    return { resources };
  });

  server.post("/resources/checkout", async (request: any) => {
    const { resourceManager } = await import("../micro-agents/resource-manager.js");
    const { resourceId, robotId, teamId, ttlMs } = request.body;
    if (!resourceId || !robotId) {
      throw new Error("resourceId and robotId are required");
    }
    const resource = resourceManager.getAllResources().find(r => r.resourceId === resourceId);
    if (!resource) throw new Error(`Resource not found: ${resourceId}`);
    
    const { resourceBroker } = await import("../micro-agents/resource-broker.js");
    const { token, expiresAt } = resourceBroker.checkout(resourceId, robotId, teamId, ttlMs);
    return { success: true, token, expiresAt, resource };
  });

  server.post("/resources/checkin", async (request: any) => {
    const { resourceBroker } = await import("../micro-agents/resource-broker.js");
    const { token } = request.body;
    if (!token) throw new Error("Token required");
    const success = resourceBroker.checkin(token);
    return { success };
  });

  server.post("/resources/validate", async (request: any) => {
    const { resourceBroker } = await import("../micro-agents/resource-broker.js");
    const { token } = request.body;
    if (!token) throw new Error("Token required");
    const result = resourceBroker.verifyToken(token);
    return result;
  });

  // Learning contexts
  server.get("/learning/contexts", async () => {
    const contexts = await learningEngine.listContexts();
    return { contexts };
  });

  server.get("/learning/contexts/:domain/:signature", async (request: any) => {
    const context = await learningEngine.getContext(request.params.domain, request.params.signature);
    if (!context) throw new Error("Context not found");
    return context;
  });

  // Model router
  server.post("/model/complete", async (request: any) => {
    const { messages, ...options } = request.body;
    const response = await modelRouter.complete(messages, options);
    return response;
  });

  server.get("/model/models", async () => {
    const models = await modelRouter.listModels();
    return { models };
  });

  // Grill Me endpoint (placeholder)
  server.post("/grill-me", async (request: any) => {
    const { topic, participants, runNow } = request.body;
    const { grillScheduler } = await import("../micro-agents/grill-scheduler.js");
    
    if (runNow) {
      const session = await grillScheduler.runGrillNow(topic);
      return { success: true, session };
    } else {
      const session = grillScheduler.schedule(topic);
      return { success: true, session };
    }
  });

  server.get("/grill", async () => {
    const { grillScheduler } = await import("../micro-agents/grill-scheduler.js");
    return { sessions: grillScheduler.listSessions() };
  });

  server.get("/grill/:sessionId", async (request: any) => {
    const { grillScheduler } = await import("../micro-agents/grill-scheduler.js");
    const session = grillScheduler.getSession(request.params.sessionId);
    if (!session) throw new Error("Session not found");
    return session;
  });
}