import { BaseAdapter, AdapterConfig, Message, SendOptions } from "./base-adapter.js";

export class TelegramAdapter extends BaseAdapter {
  private bot: any = null;
  private polling = false;

  constructor(config: AdapterConfig) {
    super({ ...config, name: "telegram" });
  }

  async start(): Promise<void> {
    const token = this.config.config.token || process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error("TELEGRAM_BOT_TOKEN não configurado");
    }

    // Kill any competing getUpdates session first (prevents 409 Conflict
    // when a previous instance died without releasing long-polling).
    try {
      const kick = await fetch(`https://api.telegram.org/bot${token}/getUpdates?timeout=1`);
      await kick.json().catch(() => null);
    } catch {
      // Ignore — best effort cleanup
    }

    // Dynamic import to avoid issues if not installed
    const { Telegraf } = await import("telegraf");
    this.bot = new Telegraf(token);

    this.bot.on("message", async (ctx: any) => {
      if (!ctx.message || !ctx.message.text) return;

      const message: Message = {
        id: String(ctx.message.message_id),
        chatId: String(ctx.chat.id),
        userId: String(ctx.from?.id),
        username: ctx.from?.username,
        text: ctx.message.text,
        timestamp: new Date(),
        raw: ctx.message,
      };

      this.emitMessage(message);
    });

    this.bot.on("error", (err: Error) => {
      console.error("Telegram bot error:", err);
      this.status = "error";
      this.error = err;
    });

    // Start polling
    try {
      await this.bot.launch();
    } catch (e: any) {
      if (e.message?.includes("409") || e.message?.includes("Conflict")) {
        throw new Error("409 Conflict: outra instância do bot está rodando. Pare todas (pkill -f 'tsx src/index') e reinicie uma só.");
      }
      throw e;
    }
    this.polling = true;
    console.log("🤖 Telegram bot started (polling mode)");
  }

  async stop(): Promise<void> {
    if (this.bot && this.polling) {
      await this.bot.stop();
      this.polling = false;
      console.log("🤖 Telegram bot stopped");
    }
  }

  async sendMessage(chatId: string, text: string, options?: SendOptions): Promise<void> {
    if (!this.bot) throw new Error("Bot not initialized");

    const parseMode = options?.parseMode === "markdown" ? "Markdown" : 
                      options?.parseMode === "html" ? "HTML" : undefined;

    await this.bot.telegram.sendMessage(chatId, text, {
      parse_mode: parseMode,
      reply_to_message_id: options?.replyToMessageId ? parseInt(options.replyToMessageId) : undefined,
    });
  }

  getBot(): any {
    return this.bot;
  }
}

export async function createTelegramAdapter(config?: Partial<AdapterConfig>): Promise<TelegramAdapter> {
  const adapter = new TelegramAdapter({
    name: "telegram",
    enabled: config?.enabled ?? (process.env.TELEGRAM_BOT_TOKEN ? true : false),
    config: config?.config || {},
  });
  return adapter;
}