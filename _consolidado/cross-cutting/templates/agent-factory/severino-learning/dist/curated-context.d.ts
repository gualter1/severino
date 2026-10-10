import { z } from "zod";
/**
 * Padrão extraído de relatórios e curado pelo Severino.
 * Ex: "Para webhooks Stripe, SEMPRE use rawBody como Buffer + middleware antes do parser JSON"
 */
export declare const CuratedPatternSchema: z.ZodObject<{
    id: z.ZodString;
    pattern: z.ZodString;
    trigger: z.ZodString;
    domain: z.ZodString;
    confidence: z.ZodDefault<z.ZodNumber>;
    sourceReports: z.ZodDefault<z.ZodArray<z.ZodString>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    timesApplied: z.ZodDefault<z.ZodNumber>;
    timesConfirmed: z.ZodDefault<z.ZodNumber>;
    timesContradicted: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type CuratedPattern = z.infer<typeof CuratedPatternSchema>;
/**
 * Armadilha conhecida e como evitá-la.
 * Ex: "stripe-node v14 exige rawBody como Buffer — não string"
 */
export declare const CuratedTrapSchema: z.ZodObject<{
    id: z.ZodString;
    trap: z.ZodString;
    symptom: z.ZodString;
    rootCause: z.ZodString;
    prevention: z.ZodString;
    domain: z.ZodString;
    severity: z.ZodDefault<z.ZodEnum<{
        critical: "critical";
        high: "high";
        low: "low";
        medium: "medium";
    }>>;
    sourceReports: z.ZodDefault<z.ZodArray<z.ZodString>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    timesEncountered: z.ZodDefault<z.ZodNumber>;
    timesPrevented: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type CuratedTrap = z.infer<typeof CuratedTrapSchema>;
/**
 * Atalho/skill recomendado para um tipo de tarefa.
 * Ex: "skill:fastify-webhook-stripe resolve 80% do boilerplate"
 */
export declare const CuratedShortcutSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<{
        mcp: "mcp";
        skill: "skill";
        snippet: "snippet";
        template: "template";
        tool: "tool";
    }>;
    description: z.ZodString;
    trigger: z.ZodString;
    domain: z.ZodString;
    estimatedTimeSaved: z.ZodString;
    version: z.ZodOptional<z.ZodString>;
    sourceReports: z.ZodDefault<z.ZodArray<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<{
        candidate: "candidate";
        deprecated: "deprecated";
        official: "official";
        validated: "validated";
    }>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type CuratedShortcut = z.infer<typeof CuratedShortcutSchema>;
/**
 * Contexto Curado completo para um domínio + assinatura de tarefa.
 * É o que Severino injeta no robô ANTES de executar.
 */
export declare const CuratedContextSchema: z.ZodObject<{
    domain: z.ZodString;
    taskSignature: z.ZodString;
    version: z.ZodDefault<z.ZodNumber>;
    patterns: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        pattern: z.ZodString;
        trigger: z.ZodString;
        domain: z.ZodString;
        confidence: z.ZodDefault<z.ZodNumber>;
        sourceReports: z.ZodDefault<z.ZodArray<z.ZodString>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        timesApplied: z.ZodDefault<z.ZodNumber>;
        timesConfirmed: z.ZodDefault<z.ZodNumber>;
        timesContradicted: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>>;
    traps: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        trap: z.ZodString;
        symptom: z.ZodString;
        rootCause: z.ZodString;
        prevention: z.ZodString;
        domain: z.ZodString;
        severity: z.ZodDefault<z.ZodEnum<{
            critical: "critical";
            high: "high";
            low: "low";
            medium: "medium";
        }>>;
        sourceReports: z.ZodDefault<z.ZodArray<z.ZodString>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        timesEncountered: z.ZodDefault<z.ZodNumber>;
        timesPrevented: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>>;
    shortcuts: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodEnum<{
            mcp: "mcp";
            skill: "skill";
            snippet: "snippet";
            template: "template";
            tool: "tool";
        }>;
        description: z.ZodString;
        trigger: z.ZodString;
        domain: z.ZodString;
        estimatedTimeSaved: z.ZodString;
        version: z.ZodOptional<z.ZodString>;
        sourceReports: z.ZodDefault<z.ZodArray<z.ZodString>>;
        status: z.ZodDefault<z.ZodEnum<{
            candidate: "candidate";
            deprecated: "deprecated";
            official: "official";
            validated: "validated";
        }>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>>;
    metrics: z.ZodDefault<z.ZodObject<{
        avgTimeWithoutContextMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        avgTimeWithContextMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        successRateWithoutContext: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        successRateWithContext: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        reportsAbsorbed: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>;
    sourceReportIds: z.ZodDefault<z.ZodArray<z.ZodString>>;
    lastUpdated: z.ZodString;
    updatedBy: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type CuratedContext = z.infer<typeof CuratedContextSchema>;
/**
 * Chave única para buscar contexto curado.
 */
export declare function contextKey(domain: string, taskSignature: string): string;
/**
 * Gera assinatura de tarefa a partir do objetivo (heurística simples).
 * Pode ser substituída por embedding similarity no futuro.
 */
export declare function deriveTaskSignature(objective: string): string;
//# sourceMappingURL=curated-context.d.ts.map