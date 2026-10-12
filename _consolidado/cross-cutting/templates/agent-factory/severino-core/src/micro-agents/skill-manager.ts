import { promises as fs } from "fs";
import { join } from "path";
import { loadConfig } from "../config.js";

export interface SkillDefinition {
  name: string;
  type: "skill" | "mcp" | "toolset" | "sandbox";
  description: string;
  trigger: string;
  domain: string;
  version: string;
  config?: Record<string, any>;
  status: "available" | "in-use" | "deprecated";
  registeredAt: string;
  registeredBy: string;
}

export class SkillManagerAgent {
  private config = loadConfig();
  private skills = new Map<string, SkillDefinition>();
  private catalogPath: string;

  constructor() {
    this.catalogPath = join(this.config.templatesDir, "agent-factory", "skill-catalog.json");
    this.loadCatalog();
  }

  private async loadCatalog() {
    try {
      const content = await fs.readFile(this.catalogPath, "utf-8");
      const catalog = JSON.parse(content);
      for (const skill of catalog) {
        this.skills.set(skill.name, skill);
      }
      console.log(`📚 Skill catalog loaded: ${this.skills.size} skills`);
    } catch {
      console.log("📚 No existing skill catalog, starting fresh");
      try {
        await fs.mkdir(join(this.catalogPath, ".."), { recursive: true });
        await this.saveCatalog();
      } catch (e: any) {
        console.warn(`⚠️ Could not persist skill catalog at ${this.catalogPath}: ${e.message}`);
      }
    }
  }

  private async saveCatalog() {
    const catalog = Array.from(this.skills.values());
    await fs.writeFile(this.catalogPath, JSON.stringify(catalog, null, 2), "utf-8");
  }

  async registerSkill(skill: Omit<SkillDefinition, "registeredAt" | "registeredBy" | "status">): Promise<SkillDefinition> {
    const fullSkill: SkillDefinition = {
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

  async unregisterSkill(name: string): Promise<boolean> {
    const deleted = this.skills.delete(name);
    if (deleted) await this.saveCatalog();
    return deleted;
  }

  getSkill(name: string): SkillDefinition | undefined {
    return this.skills.get(name);
  }

  listSkills(filter?: { domain?: string; type?: string; status?: string }): SkillDefinition[] {
    let skills = Array.from(this.skills.values());
    if (filter?.domain) skills = skills.filter(s => s.domain === filter.domain);
    if (filter?.type) skills = skills.filter(s => s.type === filter.type);
    if (filter?.status) skills = skills.filter(s => s.status === filter.status);
    return skills;
  }

  async assignSkillToRobot(robotId: string, skillName: string): Promise<boolean> {
    const skill = this.skills.get(skillName);
    if (!skill) return false;

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
    } catch {
      console.warn(`Could not update agent.json for ${robotId}`);
    }

    console.log(`🔗 Skill ${skillName} assigned to robot ${robotId}`);
    return true;
  }

  async releaseSkillFromRobot(robotId: string, skillName: string): Promise<void> {
    const skill = this.skills.get(skillName);
    if (skill) {
      skill.status = "available";
      await this.saveCatalog();
    }
  }
}

export const skillManager = new SkillManagerAgent();