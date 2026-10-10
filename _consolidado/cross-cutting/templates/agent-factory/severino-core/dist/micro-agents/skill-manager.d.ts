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
export declare class SkillManagerAgent {
    private config;
    private skills;
    private catalogPath;
    constructor();
    private loadCatalog;
    private saveCatalog;
    registerSkill(skill: Omit<SkillDefinition, "registeredAt" | "registeredBy" | "status">): Promise<SkillDefinition>;
    unregisterSkill(name: string): Promise<boolean>;
    getSkill(name: string): SkillDefinition | undefined;
    listSkills(filter?: {
        domain?: string;
        type?: string;
        status?: string;
    }): SkillDefinition[];
    assignSkillToRobot(robotId: string, skillName: string): Promise<boolean>;
    releaseSkillFromRobot(robotId: string, skillName: string): Promise<void>;
}
export declare const skillManager: SkillManagerAgent;
//# sourceMappingURL=skill-manager.d.ts.map