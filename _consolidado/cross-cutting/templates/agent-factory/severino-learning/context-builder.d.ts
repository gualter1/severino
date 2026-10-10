import { ExecutionReport } from "./report-schema.js";
/**
 * Interface principal do Learning Loop do Severino.
 * Usada pelo Severino (orquestrador) para:
 * 1. ANTES da tarefa: buildContextForRobot()
 * 2. DEPOIS da tarefa: absorbReport()
 */
export declare class SeverinoLearningLoop {
    /**
     * Constrói o bloco de contexto para injetar no prompt do robô.
     * Chama ANTES de despachar a tarefa.
     */
    buildContextForRobot(domain: string, objective: string): Promise<{
        injectionMarkdown: string;
        taskSignature: string;
        hasContext: boolean;
        contextVersion: number;
    }>;
    /**
     * Processa o relatório devolvido pelo robô e atualiza o conhecimento.
     * Chama DEPOIS que o robô finaliza e entrega o relatório.
     */
    absorbRobotReport(report: ExecutionReport): Promise<{
        summary: string;
        contextVersion: number;
        newLearnings: {
            patterns: number;
            traps: number;
            shortcuts: number;
            promoted: number;
        };
    }>;
    /**
     * Lista todos os contextos curados (para dashboard/inspeção).
     */
    listContexts(): Promise<{
        domain: string;
        taskSignature: string;
        version: number;
        patterns: {
            id: string;
            pattern: string;
            trigger: string;
            domain: string;
            confidence: number;
            sourceReports: string[];
            createdAt: string;
            updatedAt: string;
            timesApplied: number;
            timesConfirmed: number;
            timesContradicted: number;
        }[];
        traps: {
            id: string;
            trap: string;
            symptom: string;
            rootCause: string;
            prevention: string;
            domain: string;
            severity: "critical" | "high" | "medium" | "low";
            sourceReports: string[];
            createdAt: string;
            updatedAt: string;
            timesEncountered: number;
            timesPrevented: number;
        }[];
        shortcuts: {
            id: string;
            name: string;
            type: "tool" | "skill" | "mcp" | "template" | "snippet";
            description: string;
            trigger: string;
            domain: string;
            estimatedTimeSaved: string;
            sourceReports: string[];
            status: "candidate" | "validated" | "official" | "deprecated";
            createdAt: string;
            updatedAt: string;
            version?: string | undefined;
        }[];
        metrics: {
            reportsAbsorbed: number | null;
            avgTimeWithoutContextMs?: number | null | undefined;
            avgTimeWithContextMs?: number | null | undefined;
            successRateWithoutContext?: number | null | undefined;
            successRateWithContext?: number | null | undefined;
        };
        sourceReportIds: string[];
        lastUpdated: string;
        updatedBy: string;
    }[]>;
    /**
     * Busca contexto específico (para debug/inspeção).
     */
    getContext(domain: string, taskSignature: string): Promise<{
        domain: string;
        taskSignature: string;
        version: number;
        patterns: {
            id: string;
            pattern: string;
            trigger: string;
            domain: string;
            confidence: number;
            sourceReports: string[];
            createdAt: string;
            updatedAt: string;
            timesApplied: number;
            timesConfirmed: number;
            timesContradicted: number;
        }[];
        traps: {
            id: string;
            trap: string;
            symptom: string;
            rootCause: string;
            prevention: string;
            domain: string;
            severity: "critical" | "high" | "medium" | "low";
            sourceReports: string[];
            createdAt: string;
            updatedAt: string;
            timesEncountered: number;
            timesPrevented: number;
        }[];
        shortcuts: {
            id: string;
            name: string;
            type: "tool" | "skill" | "mcp" | "template" | "snippet";
            description: string;
            trigger: string;
            domain: string;
            estimatedTimeSaved: string;
            sourceReports: string[];
            status: "candidate" | "validated" | "official" | "deprecated";
            createdAt: string;
            updatedAt: string;
            version?: string | undefined;
        }[];
        metrics: {
            reportsAbsorbed: number | null;
            avgTimeWithoutContextMs?: number | null | undefined;
            avgTimeWithContextMs?: number | null | undefined;
            successRateWithoutContext?: number | null | undefined;
            successRateWithContext?: number | null | undefined;
        };
        sourceReportIds: string[];
        lastUpdated: string;
        updatedBy: string;
    } | null>;
    /**
     * Exporta todo o conhecimento para backup/migração.
     */
    exportAll(): Promise<string>;
}
/**
 * Instância singleton para uso direto no Severino.
 */
export declare const severinoLearning: SeverinoLearningLoop;
/**
 * Helper para o fluxo completo: contexto → execução → absorção.
 * Uso típico no Severino:
 *
 * ```typescript
 * // 1. ANTES de mandar tarefa
 * const { injectionMarkdown, taskSignature } = await severinoLearning.buildContextForRobot("backend", "Criar webhook Stripe");
 *
 * // 2. Injeta no prompt do robô
 * const robotPrompt = `...sua tarefa...\n\n${injectionMarkdown}`;
 *
 * // 3. Robô executa e devolve { result, report }
 *
 * // 4. DEPOIS de receber relatório
 * const { summary } = await severinoLearning.absorbRobotReport(report);
 * console.log(summary);
 * ```
 */
export declare function runLearningCycle(domain: string, objective: string, executeRobot: (prompt: string) => Promise<{
    result: any;
    report: ExecutionReport;
}>): Promise<{
    result: any;
    learningSummary: string;
}>;
//# sourceMappingURL=context-builder.d.ts.map