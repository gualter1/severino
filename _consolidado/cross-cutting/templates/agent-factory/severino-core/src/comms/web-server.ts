import { loadConfig } from "../config.js";
import { registerHttpApi } from "./http-api.js";
import { registerWebSocket } from "./websocket.js";
import { getHtmlUI } from "./html-ui.js";
import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCors from "@fastify/cors";
import websocketPlugin from "@fastify/websocket";
import { join } from "path";
import { fileURLToPath } from "url";
import { initializeAdapters, adapterRegistry } from "./adapters/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

export async function createWebServer() {
  const config = loadConfig();

  const app = fastify({
    logger: {
      level: config.logLevel,
      transport: {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "HH:MM:ss" },
      },
    },
  });

  // Plugins
  await app.register(fastifyCors, { origin: true });
  await app.register(websocketPlugin);

  // Register HTTP API routes
  await registerHttpApi(app);

  // WebSocket route (registered on the SAME fastify server, same port)
  await registerWebSocket(app);

  // Webhook endpoints for Telegram/WhatsApp
  app.post("/webhook/telegram", async (request, reply) => {
    return { status: "ok" };
  });

  app.post("/webhook/whatsapp", async (request, reply) => {
    return { status: "ok" };
  });

  // Adapter status endpoint
  app.get("/adapters", async () => {
    return {
      adapters: adapterRegistry.list().map(a => ({
        name: a.getName(),
        ...a.getStatus()
      }))
    };
  });

  // Serve HTML UI at /ui/
  app.get("/ui/", async (request, reply) => {
    reply.type("text/html");
    return await getHtmlUI();
  });

  // Root route serves UI directly
  app.get("/", async (request, reply) => {
    return reply.redirect("/ui/");
  });

  // Initialize communication adapters in background (non-blocking).
  // A hanging adapter (e.g. Telegram long-polling with flaky network)
  // must NEVER block the HTTP server boot.
  initializeAdapters().catch((e: any) => {
    console.warn("⚠️ Adapters initialization warning:", e.message);
  });

  // Start server
  try {
    await app.listen({ port: config.port, host: config.host });
    console.log(`🌐 Severino Core rodando em http://${config.host}:${config.port}`);
    console.log(`🎨 Dashboard: http://${config.host}:${config.port}/ui/`);
    console.log(`🔌 WebSocket: ws://${config.host}:${config.port}/ws`);
    console.log(`📱 Telegram webhook: http://${config.host}:${config.port}/webhook/telegram`);
    console.log(`📱 WhatsApp webhook: http://${config.host}:${config.port}/webhook/whatsapp`);
    console.log(`🔌 Adapters status: http://${config.host}:${config.port}/adapters`);

    return app;
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}