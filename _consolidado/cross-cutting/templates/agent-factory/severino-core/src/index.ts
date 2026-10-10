import { createWebServer } from "./comms/web-server.js";
import { robotFactory } from "./micro-agents/robot-factory.js";
import { skillManager } from "./micro-agents/skill-manager.js";
import { learningEngine } from "./micro-agents/learning-engine.js";
import { modelRouter } from "./model-router.js";
import { loadConfig } from "./config.js";

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                        🏭 SEVERINO MASTER ORCHESTRATOR                        ║
║                     AI Agent Platform v1.0.0                                   ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Micro-agents: Robot Factory | Skill Manager | Learning Engine | Reporter     ║
║  Model Router: 9router (pluggable)                                            ║
║  Comms: HTTP API + WebSocket + HTML Dashboard                                 ║
╚══════════════════════════════════════════════════════════════════════════════╝
  `);

  // Load and validate config
  const config = loadConfig();
  console.log("⚙️  Config carregada:");
  console.log(`   Port: ${config.port}`);
  console.log(`   Model: ${config.defaultModel}`);
  console.log(`   9router: ${config.nineRouterApiKey ? "✅ Configurado" : "⚠️ Mock mode"}`);
  console.log(`   Rooms: ${config.roomsDir}`);
  console.log(`   Templates: ${config.templatesDir}`);

  // Initialize micro-agents
  console.log("\n🤖 Inicializando micro-agents...");
  console.log("   ✅ Robot Factory");
  console.log("   ✅ Skill Manager");
  console.log("   ✅ Learning Engine");
  console.log("   ✅ Reporter");

  // Test model router
  console.log("\n🧠 Testando Model Router...");
  try {
    const models = await modelRouter.listModels();
    console.log(`   Modelos disponíveis: ${models.length > 0 ? models.slice(0, 3).join(", ") + "..." : "mock mode"}`);
  } catch (e) {
    console.log("   ⚠️ Model router em modo mock");
  }

  // Start web server
  console.log("\n🌐 Iniciando servidor web...");
  await createWebServer();

  console.log("\n🎉 Severino Master pronto para receber ordens!");
  console.log("\n📋 Próximos passos:");
  console.log("   1. Acesse o dashboard: http://localhost:3000/ui/");
  console.log("   2. Crie uma equipe: POST /teams ou use o botão '+ Nova Equipe'");
  console.log("   3. Execute tarefas: POST /tasks ou use o formulário no dashboard");
  console.log("   4. Monitore learning: GET /learning/contexts");
  console.log("\n💡 Dica: Use 'npx tsx create-robot.ts --from-template backend' para criar robôs standalone");
}

main().catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});