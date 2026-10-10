import { ResourceDefinition, ResourceToken } from "./resource-broker.js";
import { SkillDefinition } from "./skill-manager.js";
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
export declare class ResourceManager {
    private resourceBroker;
    private skillManager;
    initialize(): Promise<void>;
    registerSkillAsResource(skill: SkillDefinition): ResourceDefinition;
    checkoutSkill(request: SkillCheckoutRequest): Promise<SkillCheckoutResponse>;
    checkinSkill(token: string): Promise<void>;
    validateToken(token: string): {
        valid: boolean;
        tokenInfo?: ResourceToken;
        error?: string;
    };
    getAvailableSkills(): ResourceDefinition[];
    getCheckedOutSkills(): ResourceDefinition[];
    getAllResources(): ResourceDefinition[];
}
export declare const resourceManager: ResourceManager;
//# sourceMappingURL=resource-manager.d.ts.map