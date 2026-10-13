/**
 * ✈️ TelegramChannel — Entrada via Telegram (lazy telegraf).
 * - Sem TELEGRAM_BOT_TOKEN → isConfigured()=false, start() só loga desabilitado.
 * - Com token: /task <obj> ou texto >20 chars vira dispatch.
 * Sem vendor lock: telegraf importado dinamicamente SÓ dentro de start().
 */

import type { Channel, ChannelMeta, InboundMessage } from "./channel.js";

export class TelegramChannel implements Channel {
  meta: ChannelMeta = { id: "telegram", label: "Telegram Bot" };
  private bot: any = null;
  private token: string | undefined;

  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN;
  }

  isConfigured(): boolean {
    return Boolean(this.token);
  }

  async start(onMessage: (msg: InboundMessage) => Promise<string>): Promise<void> {
    if (!this.isConfigured()) {
      console.log("✈️ Telegram desabilitado — sem TELEGRAM_BOT_TOKEN.");
      return;
    }
    try {
      // @ts-ignore — telegraf é dependência opcional (só com token)
      const { Telegraf } = await import("telegraf");
      this.bot = new Telegraf(this.token!);

      const answer = async (text: string, from: string): Promise<string> => {
        const raw = await onMessage({ channel: "telegram", from, text });
        try {
          const parsed = JSON.parse(raw);
          const d = parsed.routingDecision;
          if (d) return `${d.reason} (Robô: ${d.robotId || "novo"})`;
        } catch { /* usa raw */ }
        return raw.slice(0, 4000);
      };

      this.bot.command("task", async (ctx: any) => {
        const text = (ctx.message?.text || "").replace(/^\/task\s*/, "").trim();
        if (!text) {
          await ctx.reply("Uso: /task <objetivo da tarefa>");
          return;
        }
        await ctx.reply(await answer(text, String(ctx.from?.id || "tg")));
      });

      this.bot.on("text", async (ctx: any) => {
        const text: string = ctx.message?.text || "";
        if (text.startsWith("/")) return;
        if (text.trim().length <= 20) return;
        await ctx.reply(await answer(text, String(ctx.from?.id || "tg")));
      });

      await this.bot.launch();
      console.log("✈️ Telegram no ar — ouvindo /task e textos longos.");
    } catch (err: any) {
      console.log(`✈️ Telegram falhou ao iniciar (${err?.message || err}) — seguindo sem ele.`);
    }
  }

  async stop(): Promise<void> {
    try {
      this.bot?.stop?.();
    } catch { /* noop */ }
    this.bot = null;
  }

  async send(to: string, text: string): Promise<void> {
    if (!this.bot) {
      console.log(`✈️ [Telegram -> ${to}] (bot off): ${text.slice(0, 100)}`);
      return;
    }
    await this.bot.telegram.sendMessage(to, text.slice(0, 4000));
  }
}
