import { z } from "zod";

export const TaskRequestSchema = z.object({
  id: z.string().optional(),
  teamId: z.string().optional(),
  domain: z.enum(["backend", "frontend", "qa", "devops", "security", "sales", "product", "research", "data", "tech-lead"]),
  objective: z.string().min(10),
  contextOverrides: z.record(z.any()).optional(),
  requiredCapabilities: z.array(z.string()).optional(),
  timeoutMs: z.number().int().positive().default(1800000),
});

export type TaskRequest = z.infer<typeof TaskRequestSchema>;

export const TaskResponseSchema = z.object({
  taskId: z.string(),
  teamId: z.string().optional(),
  robotId: z.string(),
  status: z.enum(["completed", "failed", "partial"]),
  result: z.any(),
  reportSummary: z.string(),
  metrics: z.object({
    durationMs: z.number(),
    contextVersion: z.number(),
    speedup: z.string().optional(),
  }),
});

export type TaskResponse = z.infer<typeof TaskResponseSchema>;

export const CreateTeamRequestSchema = z.object({
  teamId: z.string(),
  name: z.string(),
  domain: z.string(),
  roles: z.array(z.string()),
  initialSkills: z.array(z.string()).default([]),
});

export type CreateTeamRequest = z.infer<typeof CreateTeamRequestSchema>;

export interface TeamState {
  teamId: string;
  name: string;
  domain: string;
  robots: string[]; // robotIds
  status: "active" | "idle" | "busy" | "error";
  totalTasksCompleted: number;
  lastActiveAt: string;
}