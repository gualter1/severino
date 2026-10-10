import { z } from "zod";

/**
 * Schema do Relatório Obrigatório que TODO robô deve gerar ao finalizar uma tarefa.
 * Severino usa isso para validar, absorver e curar contexto.
 */
export const ExecutionReportSchema = z.object({
  // Metadados básicos
  meta: z.object({
    robotId: z.string().min(1),
    taskId: z.string().min(1),
    taskSignature: z.string().min(1), // ex: "webhook-stripe-hmac", "form-validation-react"
    domain: z.enum(["backend", "frontend", "qa", "devops", "security", "sales", "product", "research", "data"]),
    startedAt: z.string().datetime(),
    finishedAt: z.string().datetime(),
    durationMs: z.number().int().positive(),
    attemptNumber: z.number().int().positive().default(1),
  }),

  // Objetivo original da tarefa
  objective: z.string().min(10),

  // Contexto que o robô RECEBEU do Severino (para rastreabilidade)
  contextReceived: z.object({
    version: z.number().int().nonnegative(), // v0 = nenhum contexto
    patterns: z.array(z.string()).default([]),
    traps: z.array(z.string()).default([]),
    shortcuts: z.array(z.string()).default([]),
    recommendedSkills: z.array(z.string()).default([]),
    estimatedTime: z.string().optional(),
  }).default({}),

  // Passos executados (auditoria granular)
  steps: z.array(z.object({
    step: z.number().int().positive(),
    action: z.string().min(1),           // "Criar endpoint", "Rodar testes"
    tool: z.string().min(1),             // "edit", "npm", "skill:fastify-route-template"
    durationMs: z.number().int().nonnegative(),
    outcome: z.enum(["success", "partial", "failed", "skipped"]),
    notes: z.string().optional(),
  })).min(1),

  // Decisões técnicas tomadas durante a execução
  decisions: z.array(z.object({
    decision: z.string().min(1),
    rationale: z.string().min(1),
    alternativesConsidered: z.array(z.string()).default([]),
    tradeoffs: z.string().optional(),
  })).default([]),

  // Ferramentas/Skills/MCPs usados (com versões)
  toolsUsed: z.array(z.object({
    name: z.string().min(1),             // "github-cli", "skill:fastify-route-template", "mcp:browser"
    version: z.string().optional(),
    purpose: z.string().min(1),
  })).default([]),

  // Armadilhas encontradas + "se eu soubesse antes"
  traps: z.array(z.object({
    trap: z.string().min(1),
    impact: z.enum(["lost-time", "bug", "rework", "confusion"]),
    timeLostMs: z.number().int().nonnegative().optional(),
    workaround: z.string().optional(),
    prevention: z.string().min(1),       // "Para próxima vez: faça X"
  })).default([]),

  // Candidatas a skill/atalho descobertas durante a tarefa
  skillCandidates: z.array(z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    triggerPattern: z.string().min(1),   // "toda vez que peço webhook stripe"
    estimatedTimeSaved: z.string(),      // "~5min por tarefa"
    reusableAcross: z.array(z.string()).default([]), // domínios onde serve
  })).default([]),

  // Artefatos produzidos (arquivos, PRs, issues, etc.)
  artifacts: z.array(z.object({
    type: z.enum(["file", "pr", "issue", "doc", "script", "config", "test", "other"]),
    path: z.string().optional(),
    url: z.string().url().optional(),
    description: z.string().min(1),
  })).default([]),

  // Métricas finais
  metrics: z.object({
    totalTimeMs: z.number().int().positive(),
    skillsReused: z.number().int().nonnegative().default(0),
    newSkillCandidates: z.number().int().nonnegative().default(0),
    testsPassed: z.number().int().nonnegative().default(0),
    testsFailed: z.number().int().nonnegative().default(0),
    lintErrors: z.number().int().nonnegative().default(0),
    typeErrors: z.number().int().nonnegative().default(0),
  }),

  // Auto-avaliação do robô (opcional mas recomendado)
  selfAssessment: z.object({
    confidence: z.number().min(0).max(1).default(0.8),
    wouldDoDifferently: z.string().optional(),
    blockers: z.array(z.string()).default([]),
  }).optional(),
});

export type ExecutionReport = z.infer<typeof ExecutionReportSchema>;

/**
 * Valida e parseia um relatório (lança se inválido).
 */
export function parseExecutionReport(json: unknown): ExecutionReport {
  return ExecutionReportSchema.parse(json);
}

/**
 * Versão segura que retorna { success, data?, error? }.
 */
export function safeParseExecutionReport(json: unknown):
  | { success: true; data: ExecutionReport }
  | { success: false; error: z.ZodError } {
  const result = ExecutionReportSchema.safeParse(json);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}