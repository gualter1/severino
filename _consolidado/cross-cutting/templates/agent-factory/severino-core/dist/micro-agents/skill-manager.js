import { promises as fs } from "fs";
import { join } from "path";
import { loadConfig } from "../config.js";
export class SkillManagerAgent {
    config = loadConfig();
    skills = new Map();
    catalogPath;
    constructor() {
        this.catalogPath = join(this.config.templatesDir, "agent-factory", "skill-catalog.json");
        this.loadCatalog();
    }
    async loadCatalog() {
        try {
            const content = await fs.readFile(this.catalogPath, "utf-8");
            const catalog = JSON.parse(content);
            for (const skill of catalog) {
                this.skills.set(skill.name, skill);
            }
            console.log(`📚 Skill catalog loaded: ${this.skills.size} skills`);
        }
        catch {
            console.log("📚 No existing skill catalog, starting fresh");
            await this.saveCatalog();
        }
    }
    async saveCatalog() {
        const catalog = Array.from(this.skills.values());
        await fs.writeFile(this.catalogPath, JSON.stringify(catalog, null, 2), "utf-8");
    }
    async registerSkill(skill) {
        const fullSkill = {
            ...skill,
            status: "available",
            registeredAt: new Date().toISOString(),
            registeredBy: "severino-core",
        };
        this.skills.set(skill.name, fullSkill);
        await this.saveCatalog();
        console.log(`✅ Skill registered: ${skill.name}`);
        return fullSkill;
    }
    async unregisterSkill(name) {
        const deleted = this.skills.delete(name);
        if (deleted)
            await this.saveCatalog();
        return deleted;
    }
    getSkill(name) {
        return this.skills.get(name);
    }
    listSkills(filter) {
        let skills = Array.from(this.skills.values());
        if (filter?.domain)
            skills = skills.filter(s => s.domain === filter.domain);
        if (filter?.type)
            skills = skills.filter(s => s.type === filter.type);
        if (filter?.status)
            skills = skills.filter(s => s.status === filter.status);
        return skills;
    }
    async assignSkillToRobot(robotId, skillName) {
        const skill = this.skills.get(skillName);
        if (!skill)
            return false;
        skill.status = "in-use";
        await this.saveCatalog();
        // Update robot's agent.json capabilities
        const config = loadConfig();
        const agentPath = join(config.roomsDir, robotId, "agent.json");
        try {
            const agentContent = await fs.readFile(agentPath, "utf-8");
            const agent = JSON.parse(agentContent);
            if (!agent.capabilities.includes(skillName)) {
                agent.capabilities.push(skillName);
                await fs.writeFile(agentPath, JSON.stringify(agent, null, 2), "utf-8");
            }
        }
        catch {
            console.warn(`Could not update agent.json for ${robotId}`);
        }
        console.log(`🔗 Skill ${skillName} assigned to robot ${robotId}`);
        return true;
    }
    async releaseSkillFromRobot(robotId, skillName) {
        const skill = this.skills.get(skillName);
        if (skill) {
            skill.status = "available";
            await this.saveCatalog();
        }
    }
}
export const skillManager = new SkillManagerAgent();
//# sourceMappingURL=skill-manager.js.map