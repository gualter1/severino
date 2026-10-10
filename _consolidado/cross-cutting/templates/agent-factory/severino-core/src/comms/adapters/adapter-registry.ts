import { adapterRegistry, BaseAdapter, Message } from "./base-adapter.ts";
import { TelegramAdapter, createTelegramAdapter } from "./telegram-adapter.ts";
import { WhatsAppAdapter, createWhatsAppAdapter } from "./whatsapp-adapter.ts";
import { robotFactory } from "../../micro-agents/robot-factory.js";
import { reporter } from "../../micro-agents/reporter.js";
import { modelRouter } from "../../model-router.js";
import { loadConfig } from "../../config.js";

const config = loadConfig();

export class CommandProcessor {
  private prefix = "/";

  async process(message: Message, adapterName: string): Promise<string | null> {
    const text = message.text.trim();
    
    if (!text.startsWith(this.prefix)) {
      // Not a command, could be a natural language task
      return this.processNaturalLanguage(message);
    }

    const parts = text.slice(1).split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    switch (command) {
      case "help":
        return this.getHelp();
      case "status":
        return await this.getStatus();
      case "teams":
        return await this.listTeams();
      case "team":
        return await this.getTeamInfo(args);
      case "task":
        return await this.executeTask(message, args, adapterName);
      case "robots":
        return await this.listRobots();
      case "skills":
        return await this.listSkills();
      case "contexts":
        return await this.listContexts();
      case "model":
        return await this.queryModel(args);
      case "grill":
        return await this.scheduleGrill(args);
      default:
        return `❓ Comando desconhecido: ${command}. Use /help para ver comandos disponíveis.`;
    }
  }

  private async processNaturalLanguage(message: Message): Promise<string | null> {
    // If message looks like a task request (longer than 20 chars, not a simple greeting)
    const text = message.text.trim();
    if (text.length > 20 && !this.isGreeting(text)) {
      return await this.executeTask(message, text, "auto");
    }
    return null;
  }

  private isGreeting(text: string): boolean {
    const greetings = ["oi", "olá", "hello", "hi", "hey", "bom dia", "boa tarde", "boa noite"];
    return greetings.some(g => text.toLowerCase().startsWith(g));
  }

  private getHelp(): string {
    return `
🏭 **Severino Master - Comandos Disponíveis**

**Sistema:**
/status - Status do sistema
/help - Esta ajuda

**Equipes e Robôs:**
/teams - Listar equipes
/team <id> - Info da equipe
/robots - Listar robôs ativos

**Tarefas:**
/task <objetivo> - Executar tarefa (cria robô ad-hoc)
/task @<teamId> <objetivo> - Executar em equipe específica

**Conhecimento:**
/skills - Listar skills disponíveis
/contexts - Contextos curados (learning)

**IA:**
/model <pergunta> - Perguntar direto ao modelo

**Avançado:**
/grill <tópico> - Agendar sessão Grill Me

**Exemplos:**
\`/task Criar endpoint POST /api/webhook stripe\`
\`/task @backend-team Refatorar autenticação JWT\`
\`/model Como fazer webhook Stripe em Fastify?\`
    `.trim();
  }

  private async getStatus(): Promise<string> {
    const adapters = adapterRegistry.list();
    const adapterStatus = adapters.map(a => {
      const s = a.getStatus();
      return `${s.status === "running" ? "✅" : s.status === "error" ? "❌" : "⏸️"} ${a.getName()}: ${s.status}${s.error ? ` (${s.error})` : ""}`;
    }).join("\n");

    return `
🏭 **Severino Master Status**

**Adapters:**
${adapterStatus}

**Model Router:** ${config.nineRouterApiKey ? "✅ 9router configurado" : "⚠️ Mock mode"}
**Port:** ${config.port}
**Rooms:** ${config.roomsDir}
    `.trim();
  }

  private async listTeams(): Promise<string> {
    const teams = robotFactory.listTeams();
    if (teams.length === 0) return "📭 Nenhuma equipe criada.";

    return teams.map(t => 
      `🏢 **${t.name}** (\`${t.teamId}\`)\n   Domínio: ${t.domain} | Robôs: ${t.robotIds.length} | Status: ${t.status}`
    ).join("\n\n");
  }

  private async getTeamInfo(teamId: string): Promise<string> {
    if (!teamId) return "❌ Use: /team <teamId>";
    const team = robotFactory.getTeam(teamId);
    if (!team) return `❌ Equipe não encontrada: ${teamId}`;

    const robots = team.robotIds.map(id => robotFactory.getRobot(id)).filter(Boolean);
    const robotList = robots.map(r => 
      `  🤖 \`${r!.robotId}\` (${r!.role}) - ${r!.status}`
    ).join("\n");

    return `
🏢 **Equipe: ${team.name}** (\`${team.teamId}\`)
Domínio: ${team.domain}
Status: ${team.status}
Tasks completas: ${team.totalTasksCompleted}

**Robôs:**
${robotList}
    `.trim();
  }

  private async executeTask(message: Message, args: string, adapterName: string): Promise<string> {
    if (!args.trim()) {
      return "❌ Use: /task <objetivo> ou /task @teamId <objetivo>";
    }

    let teamId: string | undefined;
    let objective = args;

    // Check for @teamId syntax
    const teamMatch = args.match(/^@(\S+)\s+(.+)$/);
    if (teamMatch) {
      teamId = teamMatch[1];
      objective = teamMatch[2];
    }

    const taskId = `chat-${message.chatId}-${Date.now()}`;
    const chatId = message.chatId;

    // Send initial response
    const adapter = adapterRegistry.get(adapterName);
    if (adapter) {
      await adapter.sendMessage(chatId, `🔄 Iniciando tarefa...\n\`${objective.slice(0, 100)}\`\n${teamId ? `🏢 Equipe: ${teamId}` : "🤖 Modo ad-hoc"}`);
    }

    try {
      const task: any = {
        id: taskId,
        domain: "backend", // Could be inferred from objective
        objective,
        teamId,
      };

      const response = await robotFactory.executeTask(
        task.teamId ? robotFactory.getTeam(task.teamId)?.robotIds[0] || "" : 
          (await robotFactory.createRobot({
            robotId: `ad-hoc-${Date.now()}`,
            role: "backend",
            teamId: "ad-hoc",
            name: "Ad-hoc Backend",
          })).robotId,
        task
      );

      const formatted = reporter.formatTaskCompletion(response);
      
      if (adapter) {
        await adapter.sendMessage(chatId, formatted, { parseMode: "markdown" });
      }
      
      return formatted;
    } catch (e: any) {
      const error = `❌ Erro ao executar tarefa: ${e.message}`;
      if (adapter) {
        await adapter.sendMessage(chatId, error);
      }
      return error;
    }
  }

  private async listRobots(): Promise<string> {
    const robots = robotFactory.listRobots();
    if (robots.length === 0) return "🤖 Nenhum robô ativo.";

    return robots.map(r => 
      `🤖 \`${r.robotId}\` (${r.role}) - Team: ${r.teamId} - ${r.status} - ${r.capabilities.length} caps`
    ).join("\n");
  }

  private async listSkills(): Promise<string> {
    const { skillManager } = await import("../../micro-agents/skill-manager.js");
    const skills = skillManager.listSkills();
    if (skills.length === 0) return "📚 Nenhuma skill registrada.";

    return skills.slice(0, 20).map(s => 
      `📦 ${s.type}:${s.name} (${s.domain}) - ${s.status}`
    ).join("\n");
  }

  private async listContexts(): Promise<string> {
    const { learningEngine } = await import("../../micro-agents/learning-engine.js");
    const contexts = await learningEngine.listContexts();
    if (contexts.length === 0) return "🧠 Nenhum contexto curado.";

    return contexts.slice(0, 10).map((c: any) => 
      `🧠 ${c.domain}::${c.taskSignature} v${c.version} - ${c.metrics.reportsAbsorbed} reports`
    ).join("\n");
  }

  private async queryModel(question: string): Promise<string> {
    if (!question.trim()) return "❌ Use: /model <pergunta>";

    try {
      const response = await modelRouter.complete([
        { role: "system", content: "Responda de forma concisa e útil." },
        { role: "user", content: question },
      ], { temperature: 0.3, maxTokens: 1000 });

      return `🤖 **Resposta:**\n${response.content}`;
    } catch (e: any) {
      return `❌ Erro: ${e.message}`;
    }
  }

  private async scheduleGrill(topic: string): Promise<string> {
    return `🔥 Grill Me agendado para: ${topic || "tópico não especificado"}\n(Funcionalidade em desenvolvimento)`;
  }
}

export async function initializeAdapters(): Promise<void> {
  // Create and register adapters
  const telegram = await createTelegramAdapter();
  const whatsapp = await createWhatsAppAdapter();

  adapterRegistry.register(telegram);
  adapterRegistry.register(whatsapp);

  // Set up message handler
  const processor = new CommandProcessor();
  adapterRegistry.setDefaultMessageHandler(async (message, adapterName) => {
    try {
      const response = await processor.process(message, adapterName);
      if (response) {
        const adapter = adapterRegistry.get(adapterName);
        if (adapter && adapter.getStatus().status === "running") {
          await adapter.sendMessage(message.chatId, response, { parseMode: "markdown" });
        }
      }
    } catch (e: any) {
      console.error("Error processing message:", e);
      const adapter = adapterRegistry.get(adapterName);
      if (adapter) {
        await adapter.sendMessage(message.chatId, `❌ Erro interno: ${e.message}`);
      }
    }
  });

  // Start all enabled adapters
  await adapterRegistry.startAll();
}

export { TelegramAdapter, WhatsAppAdapter };