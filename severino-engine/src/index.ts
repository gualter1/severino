/**
 * 🏠 Severino Engine — Boot principal.
 * - Registra canais (Web sempre, Telegram opcional)
 * - Inicia canais e exibe casas disponíveis
 * - Exporta dispatch para uso programático.
 */

import { dispatch, type DispatchResult, type TaskHints } from "./core/index.js";
import { ChannelRegistry, type InboundMessage } from "./gateway/channel.js";
import { WebChannel } from "./gateway/web-channel.js";
import { TelegramChannel } from "./gateway/telegram-channel.js";
import { HOUSES } from "./houses/houses.js";

const registry = new ChannelRegistry();
const webChannel = new WebChannel();
const telegramChannel = new TelegramChannel();

registry.register(webChannel);
registry.register(telegramChannel);

// Handler universal de inbound: recebe mensagem de qualquer canal, chama dispatch e retorna string formatada
async function handleInbound(msg: InboundMessage): Promise<string> {
  console.log(`📥 Inbound [${msg.channel} / ${msg.from}]: "${msg.text.slice(0, 60)}"`);
  const result: DispatchResult = await dispatch(msg.text, msg.hints || {});
  return JSON.stringify(result, null, 2);
}

/** Resposta curta p/ Telegram: reason + robot. */
export function shortReply(result: DispatchResult): string {
  const d = result.routingDecision;
  const robot = d.robotId ? ` → 🤖 ${d.robotId}` : "";
  const dist = result.distribution.length > 1 ? ` (${result.distribution.length} subtarefas)` : "";
  return `${d.reason}${robot}${dist}`;
}

export async function startEngine(): Promise<void> {
  console.log("🏠 Iniciando Severino Engine (Local-First, Zero Telemetry)...");

  // Inicia canais configurados
  for (const channel of registry.list()) {
    if (channel.isConfigured()) {
      await channel.start(handleInbound);
    } else {
      console.log(`📡 Canal '${channel.meta.id}' ignorado (não configurado).`);
    }
  }

  const port = process.env.ENGINE_PORT || process.env.PORT || "3100";
  console.log(`🏠 Severino Engine no ar :${port}`);
  console.log("🏘️ Casas disponíveis:");
  for (const h of Object.values(HOUSES)) {
    console.log(`   - ${h.houseId} (${h.name}): ${h.description} [${h.domains.join(", ")}]`);
  }
}

// Se executado diretamente via CLI/tsx (argv contém index.ts) — robusto sob tsx/npx
const argv1 = process.argv[1] || "";
const isMain = argv1.endsWith("src/index.ts") || argv1.endsWith("src/index.js") || argv1.endsWith("dist/index.js");
if (isMain) {
  startEngine().catch((err) => {
    console.error("❌ Erro fatal ao iniciar Severino Engine:", err);
    process.exit(1);
  });
}

export { dispatch, registry, webChannel, telegramChannel, HOUSES };
export type { DispatchResult, TaskHints };

// ---- FASE 1/2/3: dashboard, skill-tests Fase 2, grill-me ----
export { getDashboardHtml } from "./gateway/dashboard-html.js";
export { runGrillMe, type GrillResult } from "./core/grill.js";
export { runSkillTests, type SkillTestCase, type SkillTestResult } from "./skills/skill-tests.js";
