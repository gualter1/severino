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

/** Remove bot tokens / API keys from any string before exposing via API/logs. */
function sanitizeErrorMessage(msg: string): string {
  return msg
    .replace(/bot\d{6,12}:[^\s"'`,;)]+/gi, "bot[REDACTED]")
    .replace(/\b\d{6,12}:[A-Za-z0-9_-]{20,}\b/g, "[REDACTED_TELEGRAM_TOKEN]")
    .replace(/\bsk-[A-Za-z0-9_-]{8,}\b/g, "[REDACTED_API_KEY]");
}

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

  // Friendly error handler: Zod validation -> 400 with human message,
  // never leak secrets (tokens, keys) in error payloads.
  app.setErrorHandler((error: any, request, reply) => {
    const sanitized = sanitizeErrorMessage(error?.message || "Internal error");
    if (error?.name === "ZodError" || error?.code === "FST_ERR_VALIDATION") {
      const issues = error?.issues || error?.validation || [];
      const hints = (Array.isArray(issues) ? issues : []).map((i: any) => {
        const field = Array.isArray(i.path) ? i.path.join(".") : i.params?.missingProperty || "campo";
        if (i.code === "too_small") return `• "${field}": descreva com mais detalhes (mínimo ${i.minimum} caracteres)`;
        if (i.code === "invalid_type") return `• "${field}": valor inválido (esperado ${i.expected})`;
        if (i.code === "invalid_enum_value") return `• "${field}": use um dos valores: ${(i.options || []).join(", ")}`;
        return `• "${field}": ${i.message || "valor inválido"}`;
      });
      return reply.status(400).send({
        error: "validation_error",
        message: hints.length ? `Verifique os campos:\n${hints.join("\n")}` : "Dados inválidos. Verifique os campos e tente de novo.",
      });
    }
    const status = error?.statusCode && error.statusCode < 500 ? error.statusCode : 500;
    return reply.status(status).send({ error: status === 500 ? "internal_error" : error?.error || "error", message: sanitized });
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

  // Adapter status & restart endpoints
  app.get("/adapters", async () => {
    return {
      adapters: adapterRegistry.list().map(a => {
        const s = a.getStatus();
        return {
          name: a.getName(),
          status: s.status,
          ...(s.error ? { error: sanitizeErrorMessage(s.error) } : {}),
        };
      })
    };
  });

  app.post("/adapters/restart", async () => {
    // Non-blocking: restart in background so slow networks (Telegram ~3s/call)
    // don't hang the HTTP response. Poll GET /adapters for the result.
    adapterRegistry.stopAll()
      .then(() => adapterRegistry.startAll())
      .then(() => console.log("🔄 Adapters restart cycle finished"))
      .catch((e: any) => console.warn("⚠️ Adapters restart warning:", e.message));
    return { success: true, message: "Reiniciando adapters em background — verifique GET /adapters em ~30s" };
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