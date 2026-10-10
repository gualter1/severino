import { resourceBroker } from "./resource-broker.js";
import { skillManager } from "./skill-manager.js";
export class ResourceManager {
    resourceBroker = resourceBroker;
    skillManager = skillManager;
    async initialize() {
        // Register all skills as resources
        const skills = this.skillManager.listSkills();
        for (const skill of skills) {
            this.registerSkillAsResource(skill);
        }
        console.log(`📦 Resource Broker initialized with ${skills.length} skills`);
    }
    registerSkillAsResource(skill) {
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
    async checkoutSkill(request) {
        const skill = this.skillManager.getSkill(request.skillName);
        if (!skill) {
            throw new Error(`Skill not found: ${request.skillName}`);
        }
        // Register if not already registered
        const resourceId = `skill:${skill.name}`;
        if (!this.resourceBroker.listResources().find(r => r.resourceId === resourceId)) {
            this.registerSkillAsResource(skill);
        }
        const { token, expiresAt } = this.resourceBroker.checkout(resourceId, request.robotId, request.teamId, request.ttlMs);
        // Update skill manager status
        await this.skillManager.assignSkillToRobot(request.robotId, skill.name);
        return {
            token,
            expiresAt,
            skill,
        };
    }
    async checkinSkill(token) {
        const result = this.resourceBroker.checkin(token);
        if (!result) {
            throw new Error("Invalid or expired token");
        }
        // The skill manager will handle releasing
    }
    validateToken(token) {
        return this.resourceBroker.verifyToken(token);
    }
    getAvailableSkills() {
        return this.resourceBroker.listResources({ type: "skill", status: "available" });
    }
    getCheckedOutSkills() {
        return this.resourceBroker.listResources({ type: "skill", status: "checked-out" });
    }
    getAllResources() {
        return this.resourceBroker.listResources();
    }
}
export const resourceManager = new ResourceManager();
//# sourceMappingURL=resource-manager.js.map