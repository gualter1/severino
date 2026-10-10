/**
 * 🧠 Severino Learning Loop — Exportações Principais
 *
 * Este módulo contém todo o sistema de aprendizado centralizado do Severino.
 * Os robôs NÃO têm learning loop interno — eles apenas geram relatórios.
 * O Severino absorve, cura e injeta contexto nas próximas tarefas.
 */
export { ExecutionReportSchema, type ExecutionReport, parseExecutionReport, safeParseExecutionReport, } from "./report-schema.js";
export { CuratedContextSchema, CuratedPatternSchema, CuratedTrapSchema, CuratedShortcutSchema, type CuratedContext, type CuratedPattern, type CuratedTrap, type CuratedShortcut, contextKey, deriveTaskSignature, } from "./curated-context.js";
export { CuratedContextStore, curatedContextStore, buildInjectionContext, formatContextForPrompt, } from "./curated-context-store.js";
export { absorbReport, processReportAndSummarize, } from "./absorb-report.js";
export { SeverinoLearningLoop, severinoLearning, runLearningCycle, } from "./context-builder.js";
//# sourceMappingURL=index.d.ts.map