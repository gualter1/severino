import { loadConfig } from "../config.js";
import { TaskRequestSchema, TaskResponse, CreateTeamRequestSchema, TeamState } from "../types.js";
import { robotFactory } from "../micro-agents/robot-factory.js";
import { skillManager } from "../micro-agents/skill-manager.js";
import { learningEngine } from "../micro-agents/learning-engine.js";
import { reporter } from "../micro-agents/reporter.js";
import { modelRouter } from "../model-router.js";
import { postman } from "../micro-agents/postman.js";

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

  // List robots
  server.get("/robots", async () => {
    const robots = robotFactory.listRobots();
    return { robots };
  });

  // Execute task
  server.post("/tasks", async (request: any) => {
    const body = TaskRequestSchema.parse(request.body);
    const taskId = body.id || `task-${Date.now()}`;

    // Use Postman agent for routing
    const decision = await postman.route(body.objective, {
      domain: body.domain,
      teamId: body.teamId
    });

    let robotId: string;
    let targetTeamId = decision.teamId;

    if (decision.action === 'use-existing' && decision.robotId) {
      robotId = decision.robotId;
    } else {
      // Need to create a new team or add robot to team
      // Check if team already exists
      let team = robotFactory.getTeam(targetTeamId);
      if (!team) {
        // Create new team with roles from postman decision or default
        const roles = decision.roles ?? [body.domain, 'generalist'];
        const teamResult = await robotFactory.createTeam({
          teamId: targetTeamId,
          name: `Auto Team ${body.domain} ${decision.roles?.join(' ') ?? ''}`,
          domain: body.domain,
          roles: roles,
        });
        targetTeamId = teamResult.teamId;
        robotId = teamResult.robots[0].robotId;
      } else {
        // Team exists but no idle robot, create a new robot in this team
        const newRobotId = `${targetTeamId}-${body.domain}-${Date.now()}`;
        const newRobot = await robotFactory.createRobot({
          robotId: newRobotId,
          role: body.domain,
          teamId: targetTeamId,
          name: `${team.name} ${body.domain}`,
        });
        robotId = newRobot.robotId;
      }
    }

    const task = { ...body, id: taskId, teamId: targetTeamId };
    const response = await robotFactory.executeTask(robotId, task);
    return {
      ...response,
      routingDecision: decision
    };
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