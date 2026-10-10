import { loadConfig } from "../config.js";
import { registerHttpApi } from "./http-api.js";
import { registerWebSocket } from "./websocket.js";
import { getHtmlUI } from "./html-ui.js";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCors from "@fastify/cors";
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

  // Register HTTP API routes
  await registerHttpApi(app);

  // Webhook endpoints for Telegram/WhatsApp
  app.post("/webhook/telegram", async (request, reply) => {
    return { status: "ok" };
  });

  app.post("/webhook/whatsapp", async (request, reply) => {
    return { status: "ok" };
  });

  // Adapter status endpoint
  app.get("/adapters", async () => {
    return { adapters: adapterRegistry.list().map(a => a.getStatus()) };
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

  // Initialize communication adapters
  try {
    await initializeAdapters();
  } catch (e: any) {
    console.warn("⚠️ Adapters initialization warning:", e.message);
  }

  // Start server
  try {
    await app.listen({ port: config.port, host: config.host });
    console.log(`🌐 Severino Core rodando em http://${config.host}:${config.port}`);
    console.log(`🎨 Dashboard: http://${config.host}:${config.port}/ui/`);
    console.log(`🔌 WebSocket: ws://${config.host}:${config.port}/ws`);
    console.log(`📱 Telegram webhook: http://${config.host}:${config.port}/webhook/telegram`);
    console.log(`📱 WhatsApp webhook: http://${config.host}:${config.port}/webhook/whatsapp`);
    console.log(`🔌 Adapters status: http://${config.host}:${config.port}/adapters`);

    // Setup WebSocket server on same port
    const httpServer = createServer(app.server);
    const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

    wss.on("connection", (ws, req) => {
      console.log("🔌 WebSocket client connected");

      ws.on("message", async (message: Buffer) => {
        try {
          const data = JSON.parse(message.toString());

          if (data.type === "ping") {
            ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
          } else if (data.type === "task") {
            // Forward to robot factory
            const { robotFactory } = await import("../micro-agents/robot-factory.js");
            const response = await robotFactory.executeTask(data.robotId, data.task);
            ws.send(JSON.stringify({ type: "task-result", response }));
          }
        } catch (e: any) {
          ws.send(JSON.stringify({ type: "error", message: e.message }));
        }
      });

      ws.on("close", () => {
        console.log("🔌 WebSocket client disconnected");
      });
    });

    // Replace app.server with our httpServer for WebSocket support
    (app as any).server = httpServer;

    return app;
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}