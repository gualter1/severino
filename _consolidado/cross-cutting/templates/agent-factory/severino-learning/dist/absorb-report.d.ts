import { CuratedContext } from "./curated-context.js";
import { ExecutionReport } from "./report-schema.js";
/**
 * Função de alto nível: processa relatório e retorna resumo para log do Severino.
 */
export declare function processReportAndSummarize(report: ExecutionReport): Promise<string>;
/**
 * Absorve um relatório de execução e atualiza o contexto curado.
 * Esta é a função principal do Learning Loop do Severino.
 */
export declare function absorbReport(report: ExecutionReport): Promise<{
    contextUpdated: CuratedContext;
    newPatterns: number;
    newTraps: number;
    newShortcuts: number;
    promotedShortcuts: number;
}>;
//# sourceMappingURL=absorb-report.d.ts.map