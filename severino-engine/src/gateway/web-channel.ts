/**
 * 🌐 WebChannel — Canal HTTP nativo (node:http puro, sem Fastify).
 * Endpoints:
 *   POST /engine/tasks -> { objective, domain?, teamId?, room? } => JSON dispatch
 *   GET  /health       -> { status: "ok" }
 */

import http from "http";
import type { Channel, ChannelMeta, InboundMessage } from "./channel.js";

export class WebChannel implements Channel {
  meta: ChannelMeta = { id: "web", label: "Web HTTP Channel (Porto Seguro)" };
  private server: http.Server | null = null;
  private port: number;

  constructor() {
    const envPort = process.env.ENGINE_PORT || process.env.PORT;
    this.port = envPort ? parseInt(envPort, 10) : 3100;
  }

  isConfigured(): boolean {
    return true; // sempre configurado
  }

  async start(dispatch: (msg: InboundMessage) => Promise<string>): Promise<void> {
    if (this.server) return;

    this.server = http.createServer(async (req, res) => {
      const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
      
      // CORS headers amigáveis
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      // GET /health
      if (req.method === "GET" && url.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ status: "ok", engine: "severino", timestamp: new Date().toISOString() }));
        return;
      }

      // POST /engine/tasks
      if (req.method === "POST" && url.pathname === "/engine/tasks") {
        let body = "";
        req.on("data", (chunk) => { body += chunk; });
        req.on("end", async () => {
          try {
            const data = JSON.parse(body || "{}");
            const objective = data.objective;
            if (!objective || typeof objective !== "string") {
              res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
              res.end(JSON.stringify({ error: "Campo 'objective' obrigatório." }));
              return;
            }

            // Monta InboundMessage com hints extras serializados ou passados
            const inbound: InboundMessage = {
              channel: "web",
              from: data.from || "web-client",
              text: objective,
              hints: {
                domain: data.domain,
                teamId: data.teamId,
                room: data.room,
              },
            };

            // Se houver hints de domain/teamId/room, podemos embutir ou tratar no dispatch
            // O dispatch recebe o text (objective). O motor faz inferência.
            const resultStr = await dispatch(inbound);
            let parsedResult: any;
            try {
              parsedResult = JSON.parse(resultStr);
            } catch {
              parsedResult = { raw: resultStr };
            }

            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify(parsedResult, null, 2));
          } catch (err: any) {
            res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ error: err.message || "Erro interno no motor." }));
          }
        });
        return;
      }

      // 404
      res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "Endpoint não encontrado. Use POST /engine/tasks ou GET /health" }));
    });

    await new Promise<void>((resolve) => {
      this.server!.listen(this.port, () => {
        console.log(`🌐 WebChannel ouvindo na porta ${this.port}`);
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    if (!this.server) return;
    await new Promise<void>((resolve) => {
      this.server!.close(() => {
        this.server = null;
        resolve();
      });
    });
  }

  async send(to: string, text: string): Promise<void> {
    // WebChannel síncrono via POST response; send() pode ser usado para webhooks ou log.
    console.log(`🌐 [WebChannel -> ${to}]: ${text.slice(0, 100)}`);
  }
}
