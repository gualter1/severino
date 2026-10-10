import { z } from "zod";
/**
 * Schema do Relatório Obrigatório que TODO robô deve gerar ao finalizar uma tarefa.
 * Severino usa isso para validar, absorver e curar contexto.
 */
export declare const ExecutionReportSchema: z.ZodObject<{
    meta: z.ZodObject<{
        robotId: z.ZodString;
        taskId: z.ZodString;
        taskSignature: z.ZodString;
        domain: z.ZodEnum<{
            backend: "backend";
            data: "data";
            devops: "devops";
            frontend: "frontend";
            product: "product";
            qa: "qa";
            research: "research";
            sales: "sales";
            security: "security";
        }>;
        startedAt: z.ZodString;
        finishedAt: z.ZodString;
        durationMs: z.ZodNumber;
        attemptNumber: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
    objective: z.ZodString;
    contextReceived: z.ZodDefault<z.ZodObject<{
        version: z.ZodNumber;
        patterns: z.ZodDefault<z.ZodArray<z.ZodString>>;
        traps: z.ZodDefault<z.ZodArray<z.ZodString>>;
        shortcuts: z.ZodDefault<z.ZodArray<z.ZodString>>;
        recommendedSkills: z.ZodDefault<z.ZodArray<z.ZodString>>;
        estimatedTime: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    steps: z.ZodArray<z.ZodObject<{
        step: z.ZodNumber;
        action: z.ZodString;
        tool: z.ZodString;
        durationMs: z.ZodNumber;
        outcome: z.ZodEnum<{
            failed: "failed";
            partial: "partial";
            skipped: "skipped";
            success: "success";
        }>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    decisions: z.ZodDefault<z.ZodArray<z.ZodObject<{
        decision: z.ZodString;
        rationale: z.ZodString;
        alternativesConsidered: z.ZodDefault<z.ZodArray<z.ZodString>>;
        tradeoffs: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    toolsUsed: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        version: z.ZodOptional<z.ZodString>;
        purpose: z.ZodString;
    }, z.core.$strip>>>;
    traps: z.ZodDefault<z.ZodArray<z.ZodObject<{
        trap: z.ZodString;
        impact: z.ZodEnum<{
            bug: "bug";
            confusion: "confusion";
            "lost-time": "lost-time";
            rework: "rework";
        }>;
        timeLostMs: z.ZodOptional<z.ZodNumber>;
        workaround: z.ZodOptional<z.ZodString>;
        prevention: z.ZodString;
    }, z.core.$strip>>>;
    skillCandidates: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        triggerPattern: z.ZodString;
        estimatedTimeSaved: z.ZodString;
        reusableAcross: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>>;
    artifacts: z.ZodDefault<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<{
            config: "config";
            doc: "doc";
            file: "file";
            issue: "issue";
            other: "other";
            pr: "pr";
            script: "script";
            test: "test";
        }>;
        path: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        description: z.ZodString;
    }, z.core.$strip>>>;
    metrics: z.ZodObject<{
        totalTimeMs: z.ZodNumber;
        skillsReused: z.ZodDefault<z.ZodNumber>;
        newSkillCandidates: z.ZodDefault<z.ZodNumber>;
        testsPassed: z.ZodDefault<z.ZodNumber>;
        testsFailed: z.ZodDefault<z.ZodNumber>;
        lintErrors: z.ZodDefault<z.ZodNumber>;
        typeErrors: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
    selfAssessment: z.ZodOptional<z.ZodObject<{
        confidence: z.ZodDefault<z.ZodNumber>;
        wouldDoDifferently: z.ZodOptional<z.ZodString>;
        blockers: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ExecutionReport = z.infer<typeof ExecutionReportSchema>;
/**
 * Valida e parseia um relatório (lança se inválido).
 */
export declare function parseExecutionReport(json: unknown): ExecutionReport;
/**
 * Versão segura que retorna { success, data?, error? }.
 */
export declare function safeParseExecutionReport(json: unknown): {
    success: true;
    data: ExecutionReport;
} | {
    success: false;
    error: z.ZodError;
};
//# sourceMappingURL=report-schema.d.ts.map