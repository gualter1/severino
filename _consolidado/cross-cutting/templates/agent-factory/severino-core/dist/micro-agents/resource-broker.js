import { createHash, randomBytes } from "crypto";
export class ResourceBroker {
    resources = new Map();
    activeTokens = new Map();
    secretKey = randomBytes(32).toString("hex");
    registerResource(definition) {
        const resource = {
            ...definition,
            status: "available",
        };
        this.resources.set(resource.resourceId, resource);
        return resource;
    }
    checkout(resourceId, robotId, teamId, ttlMs = 3600000) {
        const resource = this.resources.get(resourceId);
        if (!resource) {
            throw new Error(`Resource not found: ${resourceId}`);
        }
        if (resource.status === "checked-out") {
            throw new Error(`Resource already checked out by ${resource.checkedOutBy?.robotId}`);
        }
        const now = new Date();
        const expiresAt = new Date(now.getTime() + ttlMs).toISOString();
        const tokenId = randomBytes(16).toString("hex");
        // Create token payload
        const tokenPayload = `${tokenId}:${resourceId}:${robotId}:${expiresAt}`;
        const signature = createHash("sha256").update(tokenPayload + this.secretKey).digest("hex");
        const token = `${tokenId}.${signature}`;
        const resourceToken = {
            token,
            resourceId,
            resourceType: resource.type,
            robotId,
            teamId,
            issuedAt: now.toISOString(),
            expiresAt,
            scope: ["read", "execute"],
        };
        this.activeTokens.set(token, resourceToken);
        resource.status = "checked-out";
        resource.checkedOutBy = {
            robotId,
            token,
            expiresAt,
        };
        console.log(`🔐 Resource checked out: ${resourceId} by robot ${robotId} (token: ${token.slice(0, 10)}...)`);
        return { token, expiresAt };
    }
    checkin(token) {
        const resourceToken = this.activeTokens.get(token);
        if (!resourceToken) {
            return false;
        }
        const resource = this.resources.get(resourceToken.resourceId);
        if (resource) {
            resource.status = "available";
            resource.checkedOutBy = undefined;
        }
        this.activeTokens.delete(token);
        console.log(`🔓 Resource checked in: ${resourceToken.resourceId} from robot ${resourceToken.robotId}`);
        return true;
    }
    verifyToken(token) {
        const resourceToken = this.activeTokens.get(token);
        if (!resourceToken) {
            return { valid: false, error: "Token not found or expired" };
        }
        if (new Date() > new Date(resourceToken.expiresAt)) {
            this.checkin(token);
            return { valid: false, error: "Token expired" };
        }
        // Verify signature
        const [tokenId, signature] = token.split(".");
        const tokenPayload = `${tokenId}:${resourceToken.resourceId}:${resourceToken.robotId}:${resourceToken.expiresAt}`;
        const expectedSignature = createHash("sha256").update(tokenPayload + this.secretKey).digest("hex");
        if (signature !== expectedSignature) {
            return { valid: false, error: "Invalid token signature" };
        }
        return { valid: true, resourceToken };
    }
    listResources(filter) {
        let list = Array.from(this.resources.values());
        if (filter?.type)
            list = list.filter(r => r.type === filter.type);
        if (filter?.status)
            list = list.filter(r => r.status === filter.status);
        return list;
    }
}
export const resourceBroker = new ResourceBroker();
//# sourceMappingURL=resource-broker.js.map