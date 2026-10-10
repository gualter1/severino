import { severinoLearning } from "./severino-learning/index.js";
import { ExecutionReport } from "./severino-learning/report-schema.js";

async function testMultipleTasks() {
  console.log("🧪 Testando múltiplas tarefas (simula Tarefa 1 → 3 → 10)...\n");

  const domain = "backend";
  const objective = "Criar endpoint POST /api/v1/webhooks/stripe com validação HMAC";

  // TAREFA 1: Primeiro relatório (contexto vazio)
  console.log("=" .repeat(60));
  console.log("📋 TAREFA 1 - Primeira execução (sem contexto prévio)");
  console.log("=" .repeat(60));

  const report1: ExecutionReport = {
    meta: { robotId: "robot-backend-001", taskId: "task-001", taskSignature: "endpoint-post-apiv1webhooksstripe-validação-hmac", domain, startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), durationMs: 850000, attemptNumber: 1 },
    objective,
    contextReceived: { version: 0, patterns: [], traps: [], shortcuts: [], recommendedSkills: [] },
    steps: [
      { step: 1, action: "Pesquisar como fazer webhook Stripe", tool: "web-search", durationMs: 180000, outcome: "success" },
      { step: 2, action: "Criar rota Fastify do zero", tool: "edit", durationMs: 300000, outcome: "success" },
      { step: 3, action: "Debug rawBody Buffer vs String", tool: "edit", durationMs: 250000, outcome: "partial" },
      { step: 4, action: "Testes locais stripe-cli", tool: "stripe-cli", durationMs: 120000, outcome: "success" },
    ],
    decisions: [
      { decision: "Usar rawBody global no Fastify", rationale: "Simplicidade", alternativesConsidered: ["Por rota"], tradeoffs: "Consome mais memória" },
      { decision: "Converter body para Buffer manualmente", rationale: "stripe-node exige Buffer", alternativesConsidered: [] },
    ],
    toolsUsed: [
      { name: "skill:fastify-route-template", version: "1.0.0", purpose: "Boilerplate inicial" },
      { name: "stripe-cli", version: "1.19.0", purpose: "Teste local" },
    ],
    traps: [
      { trap: "stripe-node v14 exige rawBody como Buffer", impact: "bug", timeLostMs: 250000, workaround: "Buffer.from(req.body)", prevention: "Configurar rawBody: true no Fastify" },
      { trap: "Fastify parser JSON consome stream antes do rawBody", impact: "lost-time", timeLostMs: 180000, workaround: "Desabilitar parser global", prevention: "rawBody antes do parser" },
    ],
    skillCandidates: [
      { name: "skill:fastify-webhook-stripe", description: "Boilerplate completo webhook Stripe", triggerPattern: "criar webhook stripe", estimatedTimeSaved: "~15min", reusableAcross: ["backend"] },
    ],
    artifacts: [{ type: "file", path: "src/routes/webhooks/stripe.ts", description: "Endpoint" }],
    metrics: { totalTimeMs: 850000, skillsReused: 0, newSkillCandidates: 1, testsPassed: 5, testsFailed: 1, lintErrors: 0, typeErrors: 0 },
  };

  const result1 = await severinoLearning.absorbRobotReport(report1);
  console.log(result1.summary + "\n");

  // TAREFA 3: Terceiro relatório (contexto com 2 reports absorvidos)
  console.log("=" .repeat(60));
  console.log("📋 TAREFA 3 - Terceira execução (contexto v2)");
  console.log("=" .repeat(60));

  // Injeta contexto
  const injection = await severinoLearning.buildContextForRobot(domain, objective);
  console.log("Contexto injetado (resumo):");
  console.log(injection.injectionMarkdown.split("\n").slice(0, 15).join("\n") + "\n...");

  const report3: ExecutionReport = {
    meta: { robotId: "robot-backend-002", taskId: "task-003", taskSignature: "endpoint-post-apiv1webhooksstripe-validação-hmac", domain, startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), durationMs: 280000, attemptNumber: 1 },
    objective,
    contextReceived: { version: injection.contextVersion, patterns: [], traps: [], shortcuts: [], recommendedSkills: [] },
    steps: [
      { step: 1, action: "Usar skill fastify-webhook-stripe", tool: "skill:fastify-webhook-stripe", durationMs: 60000, outcome: "success" },
      { step: 2, action: "Configurar rawBody na rota", tool: "edit", durationMs: 40000, outcome: "success" },
      { step: 3, action: "Rodar testes stripe-cli", tool: "stripe-cli", durationMs: 180000, outcome: "success" },
    ],
    decisions: [
      { decision: "Seguir skill oficial para estrutura", rationale: "Já validada em 2 tasks anteriores", alternativesConsidered: [] },
    ],
    toolsUsed: [
      { name: "skill:fastify-webhook-stripe", version: "1.2.0", purpose: "Boilerplate completo" },
      { name: "stripe-cli", version: "1.19.0", purpose: "Teste local" },
    ],
    traps: [],
    skillCandidates: [],
    artifacts: [{ type: "file", path: "src/routes/webhooks/stripe.ts", description: "Endpoint" }],
    metrics: { totalTimeMs: 280000, skillsReused: 1, newSkillCandidates: 0, testsPassed: 6, testsFailed: 0, lintErrors: 0, typeErrors: 0 },
  };

  const result3 = await severinoLearning.absorbRobotReport(report3);
  console.log("\n" + result3.summary + "\n");

  // TAREFA 10: Décima execução (contexto maduro)
  console.log("=" .repeat(60));
  console.log("📋 TAREFA 10 - Décima execução (contexto v9 maduro)");
  console.log("=" .repeat(60));

  const report10: ExecutionReport = {
    meta: { robotId: "robot-backend-003", taskId: "task-010", taskSignature: "endpoint-post-apiv1webhooksstripe-validação-hmac", domain, startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), durationMs: 90000, attemptNumber: 1 },
    objective,
    contextReceived: { version: 9, patterns: [], traps: [], shortcuts: [], recommendedSkills: [] },
    steps: [
      { step: 1, action: "Aplicar skill official + testes", tool: "skill:fastify-webhook-stripe", durationMs: 60000, outcome: "success" },
      { step: 2, action: "Rodar testes", tool: "npm-scripts", durationMs: 30000, outcome: "success" },
    ],
    decisions: [],
    toolsUsed: [
      { name: "skill:fastify-webhook-stripe", version: "1.3.0", purpose: "Official skill" },
    ],
    traps: [],
    skillCandidates: [],
    artifacts: [{ type: "file", path: "src/routes/webhooks/stripe.ts", description: "Endpoint" }],
    metrics: { totalTimeMs: 90000, skillsReused: 1, newSkillCandidates: 0, testsPassed: 6, testsFailed: 0, lintErrors: 0, typeErrors: 0 },
  };

  const result10 = await severinoLearning.absorbRobotReport(report10);
  console.log("\n" + result10.summary + "\n");

  // Resumo final
  console.log("=" .repeat(60));
  console.log("📊 RESUMO DA EVOLUÇÃO");
  console.log("=" .repeat(60));
  const finalCtx = await severinoLearning.getContext(domain, "endpoint-post-apiv1webhooksstripe-validação-hmac");
  console.log(`Contexto final: v${finalCtx?.version}`);
  console.log(`Padrões: ${finalCtx?.patterns.length}`);
  console.log(`Armadilhas: ${finalCtx?.traps.length}`);
  console.log(`Atalhos: ${finalCtx?.shortcuts.length} (${finalCtx?.shortcuts.filter(s => s.status === "official").length} official)`);
  console.log(`Reports absorvidos: ${finalCtx?.metrics.reportsAbsorbed}`);
  console.log(`Tempo SEM contexto (T1): ~850s`);
  console.log(`Tempo COM contexto (T3): ~280s → speedup 3.0x`);
  console.log(`Tempo COM contexto (T10): ~90s → speedup 9.4x`);

  console.log("\n✅ Teste de evolução completo!");
}

testMultipleTasks().catch(console.error);