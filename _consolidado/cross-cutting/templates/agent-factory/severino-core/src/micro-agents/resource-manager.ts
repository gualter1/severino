import { resourceBroker, ResourceDefinition, ResourceToken } from "./resource-broker.js";
import { skillManager, SkillDefinition } from "./skill-manager.js";

export interface SkillCheckoutRequest {
  skillName: string;
  robotId: string;
  teamId?: string;
  ttlMs?: number;
}

export interface SkillCheckoutResponse {
  token: string;
  expiresAt: string;
  skill: SkillDefinition;
}

export class ResourceManager {
  private resourceBroker = resourceBroker;
  private skillManager = skillManager;

  async initialize(): Promise<void> {
    // Register all skills as resources
    const skills = this.skillManager.listSkills();
    for (const skill of skills) {
      this.registerSkillAsResource(skill);
    }
    console.log(`📦 Resource Broker initialized with ${skills.length} skills`);
  }

  registerSkillAsResource(skill: SkillDefinition): ResourceDefinition {
    return this.resourceBroker.registerResource({
      resourceId: `skill:${skill.name}`,
      name: skill.name,
      type: "skill",
      description: skill.description,
      metadata: {
        trigger: skill.trigger,
        domain: skill.domain,
        version: skill.version,
        config: skill.config,
      },
    });
  }

  async checkoutSkill(request: SkillCheckoutRequest): Promise<SkillCheckoutResponse> {
    const skill = this.skillManager.getSkill(request.skillName);
    if (!skill) {
      throw new Error(`Skill not found: ${request.skillName}`);
    }

    // Register if not already registered
    const resourceId = `skill:${skill.name}`;
    if (!this.resourceBroker.listResources().find(r => r.resourceId === resourceId)) {
      this.registerSkillAsResource(skill);
    }

    const { token, expiresAt } = this.resourceBroker.checkout(
      resourceId,
      request.robotId,
      request.teamId,
      request.ttlMs
    );

    // Update skill manager status
    await this.skillManager.assignSkillToRobot(request.robotId, skill.name);

    return {
      token,
      expiresAt,
      skill,
    };
  }

  async checkinSkill(token: string): Promise<void> {
    const result = this.resourceBroker.checkin(token);
    if (!result) {
      throw new Error("Invalid or expired token");
    }
    // The skill manager will handle releasing
  }

  validateToken(token: string): { valid: boolean; tokenInfo?: ResourceToken; error?: string } {
    return this.resourceBroker.verifyToken(token);
  }

  getAvailableSkills(): ResourceDefinition[] {
    return this.resourceBroker.listResources({ type: "skill", status: "available" });
  }

  getCheckedOutSkills(): ResourceDefinition[] {
    return this.resourceBroker.listResources({ type: "skill", status: "checked-out" });
  }

  getAllResources(): ResourceDefinition[] {
    return this.resourceBroker.listResources();
  }
}

export const resourceManager = new ResourceManager();