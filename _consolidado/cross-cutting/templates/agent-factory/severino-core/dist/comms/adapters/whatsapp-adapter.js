import { BaseAdapter } from "./base-adapter.js";
export class WhatsAppAdapter extends BaseAdapter {
    client = null;
    ready = false;
    constructor(config) {
        super({ ...config, name: "whatsapp" });
    }
    async start() {
        const sessionPath = this.config.config.sessionPath || process.env.WHATSAPP_SESSION_PATH || "./whatsapp-session";
        try {
            const { Client, LocalAuth } = await import("whatsapp-web.js");
            this.client = new Client({
                authStrategy: new LocalAuth({ dataPath: sessionPath }),
                puppeteer: {
                    headless: true,
                    args: [
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-accelerated-2d-canvas",
                        "--no-first-run",
                        "--no-zygote",
                        "--single-process",
                        "--disable-gpu",
                    ],
                },
            });
            this.client.on("qr", (qr) => {
                console.log("📱 WhatsApp QR Code received - scan with your phone");
                console.log(qr);
            });
            this.client.on("ready", () => {
                this.ready = true;
                console.log("📱 WhatsApp client ready!");
            });
            this.client.on("authenticated", () => {
                console.log("📱 WhatsApp authenticated");
            });
            this.client.on("auth_failure", (msg) => {
                console.error("📱 WhatsApp auth failure:", msg);
                this.status = "error";
                this.error = new Error(msg);
            });
            this.client.on("message", async (msg) => {
                if (!msg.body)
                    return;
                const message = {
                    id: msg.id._serialized,
                    chatId: msg.from,
                    userId: msg.from,
                    username: msg.author || msg.from,
                    text: msg.body,
                    timestamp: new Date(msg.timestamp * 1000),
                    raw: msg,
                };
                this.emitMessage(message);
            });
            this.client.on("disconnected", (reason) => {
                console.log("📱 WhatsApp disconnected:", reason);
                this.ready = false;
            });
            await this.client.initialize();
            console.log("📱 WhatsApp client initializing...");
        }
        catch (e) {
            if (e.message.includes("Cannot find module")) {
                throw new Error("whatsapp-web.js não instalado. Execute: npm install whatsapp-web.js");
            }
            throw e;
        }
    }
    async stop() {
        if (this.client) {
            await this.client.destroy();
            this.ready = false;
            console.log("📱 WhatsApp client destroyed");
        }
    }
    async sendMessage(chatId, text, options) {
        if (!this.client || !this.ready) {
            throw new Error("WhatsApp client not ready");
        }
        const chat = await this.client.getChatById(chatId);
        await chat.sendMessage(text);
    }
    isReady() {
        return this.ready;
    }
    getClient() {
        return this.client;
    }
}
export async function createWhatsAppAdapter(config) {
    const adapter = new WhatsAppAdapter({
        name: "whatsapp",
        enabled: config?.enabled ?? false, // Disabled by default, requires explicit setup
        config: config?.config || {},
    });
    return adapter;
}
//# sourceMappingURL=whatsapp-adapter.js.map