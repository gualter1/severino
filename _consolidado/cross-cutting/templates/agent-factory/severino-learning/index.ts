/**
 * 🧠 Severino Learning Loop — Exportações Principais
 *
 * Este módulo contém todo o sistema de aprendizado centralizado do Severino.
 * Os robôs NÃO têm learning loop interno — eles apenas geram relatórios.
 * O Severino absorve, cura e injeta contexto nas próximas tarefas.
 */

export {
  // Schema & Types
  ExecutionReportSchema,
  type ExecutionReport,
  parseExecutionReport,
  safeParseExecutionReport,
} from "./report-schema.js";

export {
  // Curated Context Types
  CuratedContextSchema,
  CuratedPatternSchema,
  CuratedTrapSchema,
  CuratedShortcutSchema,
  type CuratedContext,
  type CuratedPattern,
  type CuratedTrap,
  type CuratedShortcut,
  contextKey,
  deriveTaskSignature,
} from "./curated-context.js";

export {
  // Store
  CuratedContextStore,
  curatedContextStore,
  buildInjectionContext,
  formatContextForPrompt,
} from "./curated-context-store.js";

export {
  // Learning Engine
  absorbReport,
  processReportAndSummarize,
} from "./absorb-report.js";

export {
  // High-level Interface
  SeverinoLearningLoop,
  severinoLearning,
  runLearningCycle,
} from "./context-builder.js";