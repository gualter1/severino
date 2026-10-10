export interface ResourceToken {
    token: string;
    resourceId: string;
    resourceType: "skill" | "mcp" | "tool" | "sandbox";
    robotId: string;
    teamId?: string;
    issuedAt: string;
    expiresAt: string;
    scope: string[];
}
export interface ResourceDefinition {
    resourceId: string;
    name: string;
    type: "skill" | "mcp" | "tool" | "sandbox";
    description: string;
    status: "available" | "checked-out" | "maintenance";
    checkedOutBy?: {
        robotId: string;
        token: string;
        expiresAt: string;
    };
    metadata?: Record<string, any>;
}
export declare class ResourceBroker {
    private resources;
    private activeTokens;
    private secretKey;
    registerResource(definition: Omit<ResourceDefinition, "status">): ResourceDefinition;
    checkout(resourceId: string, robotId: string, teamId?: string, ttlMs?: number): {
        token: string;
        expiresAt: string;
    };
    checkin(token: string): boolean;
    verifyToken(token: string): {
        valid: boolean;
        resourceToken?: ResourceToken;
        error?: string;
    };
    listResources(filter?: {
        type?: string;
        status?: string;
    }): ResourceDefinition[];
}
export declare const resourceBroker: ResourceBroker;
//# sourceMappingURL=resource-broker.d.ts.map