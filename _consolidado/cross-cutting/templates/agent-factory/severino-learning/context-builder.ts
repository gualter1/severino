import { buildInjectionContext, formatContextForPrompt } from "./curated-context-store.js";
import { ExecutionReport } from "./report-schema.js";
import { absorbReport, processReportAndSummarize } from "./absorb-report.js";

/**
 * Interface principal do Learning Loop do Severino.
 * Usada pelo Severino (orquestrador) para:
 * 1. ANTES da tarefa: buildContextForRobot()
 * 2. DEPOIS da tarefa: absorbReport()
 */
export class SeverinoLearningLoop {
  /**
   * Constrói o bloco de contexto para injetar no prompt do robô.
   * Chama ANTES de despachar a tarefa.
   */
  async buildContextForRobot(
    domain: string,
    objective: string
  ): Promise<{
    injectionMarkdown: string;
    taskSignature: string;
    hasContext: boolean;
    contextVersion: number;
  }> {
    const injection = await buildInjectionContext(domain, objective);
    const markdown = formatContextForPrompt(injection);

    return {
      injectionMarkdown: markdown,
      taskSignature: injection.taskSignature,
      hasContext: injection.primary !== null,
      contextVersion: injection.primary?.version || 0,
    };
  }

  /**
   * Processa o relatório devolvido pelo robô e atualiza o conhecimento.
   * Chama DEPOIS que o robô finaliza e entrega o relatório.
   */
  async absorbRobotReport(report: ExecutionReport): Promise<{
    summary: string;
    contextVersion: number;
    newLearnings: {
      patterns: number;
      traps: number;
      shortcuts: number;
      promoted: number;
    };
  }> {
    const summary = await processReportAndSummarize(report);
    const result = await absorbReport(report);

    return {
      summary,
      contextVersion: result.contextUpdated.version,
      newLearnings: {
        patterns: result.newPatterns,
        traps: result.newTraps,
        shortcuts: result.newShortcuts,
        promoted: result.promotedShortcuts,
      },
    };
  }

  /**
   * Lista todos os contextos curados (para dashboard/inspeção).
   */
  async listContexts() {
    const { curatedContextStore } = await import("./curated-context-store.js");
    return curatedContextStore.list();
  }

  /**
   * Busca contexto específico (para debug/inspeção).
   */
  async getContext(domain: string, taskSignature: string) {
    const { curatedContextStore } = await import("./curated-context-store.js");
    return curatedContextStore.get(domain, taskSignature);
  }

  /**
   * Exporta todo o conhecimento para backup/migração.
   */
  async exportAll(): Promise<string> {
    const contexts = await this.listContexts();
    return JSON.stringify(contexts, null, 2);
  }
}

/**
 * Instância singleton para uso direto no Severino.
 */
export const severinoLearning = new SeverinoLearningLoop();

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
export async function runLearningCycle(
  domain: string,
  objective: string,
  executeRobot: (prompt: string) => Promise<{ result: any; report: ExecutionReport }>
): Promise<{ result: any; learningSummary: string }> {
  // 1. Constrói contexto
  const { injectionMarkdown, taskSignature } = await severinoLearning.buildContextForRobot(domain, objective);

  // 2. Executa robô com contexto injetado
  const fullPrompt = `${objective}\n\n${injectionMarkdown}\n\n---\n⚠️ OBRIGATÓRIO: Ao final, gere relatório no formato JSON válido conforme schema.`;
  const { result, report } = await executeRobot(fullPrompt);

  // 3. Valida e absorve relatório
  const { summary } = await severinoLearning.absorbRobotReport(report);

  return { result, learningSummary: summary };
}