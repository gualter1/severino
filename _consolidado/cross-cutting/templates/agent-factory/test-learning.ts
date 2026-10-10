import { severinoLearning, runLearningCycle } from "./severino-learning/index.js";
import { ExecutionReport } from "./severino-learning/report-schema.js";

async function testLearningLoop() {
  console.log("🧪 Testando Learning Loop do Severino...\n");

  const domain = "backend";
  const objective = "Criar endpoint POST /api/v1/webhooks/stripe com validação HMAC";

  // 1. Severino constrói contexto para o robô
  console.log("1️⃣ Severino construindo contexto...");
  const injection = await severinoLearning.buildContextForRobot(domain, objective);
  console.log(`   Assinatura: ${injection.taskSignature}`);
  console.log(`   Tem contexto? ${injection.hasContext} (v${injection.contextVersion})`);
  console.log(`   Tamanho do prompt markdown: ${injection.injectionMarkdown.length} caracteres\n`);

  // 2. Simula execução de um robô que retorna um relatório válido
  console.log("2️⃣ Simulando robô executando e gerando relatório...");
  const mockReport: ExecutionReport = {
    meta: {
      robotId: "robot-backend-001",
      taskId: "task-test-099",
      taskSignature: injection.taskSignature,
      domain: domain,
      startedAt: new Date(Date.now() - 120000).toISOString(),
      finishedAt: new Date().toISOString(),
      durationMs: 120000,
      attemptNumber: 1,
    },
    objective,
    contextReceived: {
      version: injection.contextVersion,
      patterns: ["Use rawBody como Buffer"],
      traps: ["Cuidado com string vs buffer"],
      shortcuts: ["skill:fastify-route-template"],
      recommendedSkills: ["skill:fastify-webhook-stripe"],
      estimatedTime: "~2min",
    },
    steps: [
      { step: 1, action: "Criar rota Fastify", tool: "skill:fastify-route-template", durationMs: 30000, outcome: "success" },
      { step: 2, action: "Adicionar rawBody middleware", tool: "edit", durationMs: 40000, outcome: "success" },
      { step: 3, action: "Rodar testes vitest", tool: "npm-scripts", durationMs: 50000, outcome: "success" },
    ],
    decisions: [
      {
        decision: "Usar rawBody apenas na rota do webhook",
        rationale: "Performance e segurança das demais rotas",
        alternativesConsidered: ["Global parser"],
      },
    ],
    toolsUsed: [
      { name: "skill:fastify-route-template", version: "2.1.0", purpose: "Boilerplate" },
      { name: "github-cli", version: "2.45.0", purpose: "Criar PR" },
    ],
    traps: [
      {
        trap: "stripe-node v14 exige Buffer no constructEvent",
        impact: "bug",
        workaround: "Converter req.body para Buffer",
        prevention: "Configurar rawBody: true no Fastify",
      },
    ],
    skillCandidates: [
      {
        name: "skill:fastify-webhook-stripe",
        description: "Boilerplate completo webhook Stripe",
        triggerPattern: "criar webhook stripe",
        estimatedTimeSaved: "~5min",
      },
    ],
    artifacts: [
      { type: "file", path: "src/routes/webhooks/stripe.ts", description: "Endpoint" },
      { type: "pr", url: "https://github.com/org/repo/pull/123", description: "PR webhook" },
    ],
    metrics: {
      totalTimeMs: 120000,
      skillsReused: 1,
      newSkillCandidates: 1,
      testsPassed: 6,
      testsFailed: 0,
      lintErrors: 0,
      typeErrors: 0,
    },
  };

  // 3. Severino absorve o relatório
  console.log("3️⃣ Severino absorvendo relatório do robô...");
  const absorbResult = await severinoLearning.absorbRobotReport(mockReport);
  console.log("\n" + absorbResult.summary + "\n");

  // 4. Verifica novo contexto após absorção
  console.log("4️⃣ Verificando contexto atualizado...");
  const updatedContext = await severinoLearning.getContext(domain, injection.taskSignature);
  console.log(`   Nova versão do contexto: v${updatedContext?.version}`);
  console.log(`   Padrões totais: ${updatedContext?.patterns.length}`);
  console.log(`   Armadilhas totais: ${updatedContext?.traps.length}`);
  console.log(`   Atalhos totais: ${updatedContext?.shortcuts.length}`);
  console.log(`   Média de tempo COM contexto: ${updatedContext?.metrics.avgTimeWithContextMs}ms`);

  console.log("\n✅ Teste do Learning Loop concluído com sucesso!");
}

testLearningLoop().catch(console.error);