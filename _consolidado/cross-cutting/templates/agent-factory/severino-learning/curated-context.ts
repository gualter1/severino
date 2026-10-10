import { z } from "zod";

/**
 * Padrão extraído de relatórios e curado pelo Severino.
 * Ex: "Para webhooks Stripe, SEMPRE use rawBody como Buffer + middleware antes do parser JSON"
 */
export const CuratedPatternSchema = z.object({
  id: z.string().min(1),
  pattern: z.string().min(1),           // "Use X para Y"
  trigger: z.string().min(1),           // "Quando tarefa envolve webhook Stripe"
  domain: z.string().min(1),
  confidence: z.number().min(0).max(1).default(0.8),
  sourceReports: z.array(z.string()).default([]), // IDs dos relatórios que originaram
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  timesApplied: z.number().int().nonnegative().default(0),
  timesConfirmed: z.number().int().nonnegative().default(0),
  timesContradicted: z.number().int().nonnegative().default(0),
});

export type CuratedPattern = z.infer<typeof CuratedPatternSchema>;

/**
 * Armadilha conhecida e como evitá-la.
 * Ex: "stripe-node v14 exige rawBody como Buffer — não string"
 */
export const CuratedTrapSchema = z.object({
  id: z.string().min(1),
  trap: z.string().min(1),
  symptom: z.string().min(1),           // "constructEvent falha com 'invalid signature'"
  rootCause: z.string().min(1),
  prevention: z.string().min(1),        // "Configure rawBody: true ANTES do parser JSON"
  domain: z.string().min(1),
  severity: z.enum(["critical", "high", "medium", "low"]).default("medium"),
  sourceReports: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  timesEncountered: z.number().int().nonnegative().default(0),
  timesPrevented: z.number().int().nonnegative().default(0),
});

export type CuratedTrap = z.infer<typeof CuratedTrapSchema>;

/**
 * Atalho/skill recomendado para um tipo de tarefa.
 * Ex: "skill:fastify-webhook-stripe resolve 80% do boilerplate"
 */
export const CuratedShortcutSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),              // "skill:fastify-webhook-stripe"
  type: z.enum(["skill", "tool", "mcp", "template", "snippet"]),
  description: z.string().min(1),
  trigger: z.string().min(1),           // "Criar endpoint webhook Stripe"
  domain: z.string().min(1),
  estimatedTimeSaved: z.string(),       // "~5min"
  version: z.string().optional(),
  sourceReports: z.array(z.string()).default([]),
  status: z.enum(["candidate", "validated", "official", "deprecated"]).default("candidate"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CuratedShortcut = z.infer<typeof CuratedShortcutSchema>;

/**
 * Contexto Curado completo para um domínio + assinatura de tarefa.
 * É o que Severino injeta no robô ANTES de executar.
 */
export const CuratedContextSchema = z.object({
  // Identidade
  domain: z.string().min(1),
  taskSignature: z.string().min(1),     // "webhook-stripe-hmac", "react-form-zod"
  version: z.number().int().positive().default(1),

  // Conteúdo curado
  patterns: z.array(CuratedPatternSchema).default([]),
  traps: z.array(CuratedTrapSchema).default([]),
  shortcuts: z.array(CuratedShortcutSchema).default([]),

  // Métricas de efetividade
  metrics: z.object({
    avgTimeWithoutContextMs: z.number().int().positive().nullable().optional(),
    avgTimeWithContextMs: z.number().int().positive().nullable().optional(),
    successRateWithoutContext: z.number().min(0).max(1).nullable().optional(),
    successRateWithContext: z.number().min(0).max(1).nullable().optional(),
    reportsAbsorbed: z.number().int().nonnegative().nullable().default(0),
  }).default({ reportsAbsorbed: 0 }),

  // Rastreabilidade
  sourceReportIds: z.array(z.string()).default([]),
  lastUpdated: z.string().datetime(),
  updatedBy: z.string().default("severino-learning-loop"),
});

export type CuratedContext = z.infer<typeof CuratedContextSchema>;

/**
 * Chave única para buscar contexto curado.
 */
export function contextKey(domain: string, taskSignature: string): string {
  return `${domain}::${taskSignature}`;
}

/**
 * Gera assinatura de tarefa a partir do objetivo (heurística simples).
 * Pode ser substituída por embedding similarity no futuro.
 */
export function deriveTaskSignature(objective: string): string {
  const stopWords = new Set(["criar", "criar", "fazer", "implementar", "adicionar", "remover", "atualizar", "corrigir", "o", "a", "um", "uma", "para", "com", "de", "do", "da", "em", "no", "na"]);
  const words = objective
    .toLowerCase()
    .replace(/[^\w\sà-ÿ]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w))
    .slice(0, 6);
  return words.join("-") || "generic-task";
}