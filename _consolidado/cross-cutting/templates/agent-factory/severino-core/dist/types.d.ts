import { z } from "zod";
export declare const TaskRequestSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    teamId: z.ZodOptional<z.ZodString>;
    domain: z.ZodEnum<["backend", "frontend", "qa", "devops", "security", "sales", "product", "research", "data", "tech-lead"]>;
    objective: z.ZodString;
    contextOverrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    requiredCapabilities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    timeoutMs: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    domain: "backend" | "frontend" | "qa" | "devops" | "security" | "sales" | "product" | "research" | "data" | "tech-lead";
    objective: string;
    timeoutMs: number;
    id?: string | undefined;
    teamId?: string | undefined;
    contextOverrides?: Record<string, any> | undefined;
    requiredCapabilities?: string[] | undefined;
}, {
    domain: "backend" | "frontend" | "qa" | "devops" | "security" | "sales" | "product" | "research" | "data" | "tech-lead";
    objective: string;
    id?: string | undefined;
    teamId?: string | undefined;
    contextOverrides?: Record<string, any> | undefined;
    requiredCapabilities?: string[] | undefined;
    timeoutMs?: number | undefined;
}>;
export type TaskRequest = z.infer<typeof TaskRequestSchema>;
export declare const TaskResponseSchema: z.ZodObject<{
    taskId: z.ZodString;
    teamId: z.ZodOptional<z.ZodString>;
    robotId: z.ZodString;
    status: z.ZodEnum<["completed", "failed", "partial"]>;
    result: z.ZodAny;
    reportSummary: z.ZodString;
    metrics: z.ZodObject<{
        durationMs: z.ZodNumber;
        contextVersion: z.ZodNumber;
        speedup: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        durationMs: number;
        contextVersion: number;
        speedup?: string | undefined;
    }, {
        durationMs: number;
        contextVersion: number;
        speedup?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    status: "completed" | "failed" | "partial";
    taskId: string;
    robotId: string;
    reportSummary: string;
    metrics: {
        durationMs: number;
        contextVersion: number;
        speedup?: string | undefined;
    };
    teamId?: string | undefined;
    result?: any;
}, {
    status: "completed" | "failed" | "partial";
    taskId: string;
    robotId: string;
    reportSummary: string;
    metrics: {
        durationMs: number;
        contextVersion: number;
        speedup?: string | undefined;
    };
    teamId?: string | undefined;
    result?: any;
}>;
export type TaskResponse = z.infer<typeof TaskResponseSchema>;
export declare const CreateTeamRequestSchema: z.ZodObject<{
    teamId: z.ZodString;
    name: z.ZodString;
    domain: z.ZodString;
    roles: z.ZodArray<z.ZodString, "many">;
    initialSkills: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    teamId: string;
    domain: string;
    name: string;
    roles: string[];
    initialSkills: string[];
}, {
    teamId: string;
    domain: string;
    name: string;
    roles: string[];
    initialSkills?: string[] | undefined;
}>;
export type CreateTeamRequest = z.infer<typeof CreateTeamRequestSchema>;
export interface TeamState {
    teamId: string;
    name: string;
    domain: string;
    robots: string[];
    status: "active" | "idle" | "busy" | "error";
    totalTasksCompleted: number;
    lastActiveAt: string;
}
//# sourceMappingURL=types.d.ts.map