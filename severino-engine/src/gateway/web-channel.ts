/**
 * 🌐 WebChannel — Canal HTTP nativo (node:http puro, sem Fastify).
 * Endpoints:
 *   POST /engine/tasks -> { objective, domain?, teamId?, room? } => JSON dispatch (clássico)
 *   POST /engine/cartas -> { objective, priority?, domainHint? } => JSON dispatchCarta
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

      // POST /engine/cartas — ciclo da carta (fila + líder + pipeline + Guanabara)
      if (req.method === "POST" && (url.pathname === "/engine/cartas" || url.pathname === "/engine/carta")) {
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
            const { dispatchCarta } = await import("../core/dispatch-carta.js");
            const result = await dispatchCarta(objective, {
              priority: typeof data.priority === "number" ? data.priority : undefined,
              domainHint: typeof data.domainHint === "string" ? data.domainHint : undefined,
            });
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify(result, null, 2));
          } catch (err: any) {
            const carta = (err as any)?.carta;
            res.writeHead(carta ? 422 : 500, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ error: err.message || "Erro no ciclo da carta.", carta: carta || undefined }, null, 2));
          }
        });
        return;
      }

      // GET /engine/fila — quadro externo de tarefas
      if (req.method === "GET" && url.pathname === "/engine/fila") {
        try {
          const { globalTaskQueue } = await import("../core/task-queue.js");
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ tamanho: globalTaskQueue.size(), cartas: globalTaskQueue.list() }, null, 2));
        } catch (err: any) {
          res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ error: err.message || "Erro ao listar fila." }));
        }
        return;
      }

      // GET /engine/skills?query=...&houseId=... — busca resumida na loja
      if (req.method === "GET" && url.pathname === "/engine/skills") {
        try {
          const { SkillStore } = await import("../skills/skill-store.js");
          const store = new SkillStore();
          const q = url.searchParams.get("query") || "";
          const houseId = url.searchParams.get("houseId") || undefined;
          const resultados = await store.buscar(q, houseId || undefined);
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ query: q, resultados }, null, 2));
        } catch (err: any) {
          res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ error: err.message || "Erro ao buscar skills." }));
        }
        return;
      }

      // GET /engine/skills/:id/test — roda a suite real da skill e retorna passRate
      if (req.method === "GET" && url.pathname.startsWith("/engine/skills/") && url.pathname.endsWith("/test")) {
        try {
          const prefix = "/engine/skills/";
          const suffix = "/test";
          const rawId = url.pathname.length > prefix.length + suffix.length
            ? url.pathname.slice(prefix.length, -suffix.length)
            : "";
          const skill_id = decodeURIComponent(rawId).trim();
          if (!skill_id || skill_id.includes("/")) {
            res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ error: "skill_id inválido na URL. Use GET /engine/skills/:id/test" }));
            return;
          }
          const { Guanabara } = await import("../skills/guanabara.js");
          const guanabara = new Guanabara();
          const { passou, detalhe } = await guanabara.testeInterno(skill_id);
          // Extrai passRate do detalhe da suite real ("passRate=0.67"); stub vira 1/0 honesto.
          const m = detalhe.match(/passRate=([0-9.]+)/);
          const passRate = m ? Number(m[1]) : (passou ? 1 : 0);
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ skill_id, passou, passRate, detalhe }, null, 2));
        } catch (err: any) {
          res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ error: err.message || "Erro ao testar skill." }));
        }
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

      // GET /engine/quadro?houseId=casa-dev — colunas com cartas (Kanban interno)
      if (req.method === "GET" && url.pathname === "/engine/quadro") {
        try {
          const { boardDaCasa } = await import("../houses/house-board.js");
          const houseId = url.searchParams.get("houseId") || "casa-dev";
          const board = boardDaCasa(houseId);
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ houseId, wipLimitPorQuarto: board.wipLimitPorQuarto, colunas: board.colunas() }, null, 2));
        } catch (err: any) {
          res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ error: err.message || "Erro ao ler quadro." }));
        }
        return;
      }

      // POST /engine/quadro/mover { houseId, cartaId, para, de? } — move carta validando transição
      if (req.method === "POST" && url.pathname === "/engine/quadro/mover") {
        let body = "";
        req.on("data", (chunk) => { body += chunk; });
        req.on("end", async () => {
          try {
            const data = JSON.parse(body || "{}");
            const houseId = typeof data.houseId === "string" && data.houseId ? data.houseId : "casa-dev";
            const cartaId = data.cartaId;
            const para = data.para;
            if (!cartaId || typeof cartaId !== "string") {
              res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
              res.end(JSON.stringify({ error: "Campo 'cartaId' obrigatório." }));
              return;
            }
            if (!para || typeof para !== "string") {
              res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
              res.end(JSON.stringify({ error: "Campo 'para' obrigatório (A_FAZER|FAZENDO|EM_REVIEW|PRONTO)." }));
              return;
            }
            const { boardDaCasa } = await import("../houses/house-board.js");
            const board = boardDaCasa(houseId);
            const de = typeof data.de === "string" && data.de ? data.de : board.colunaDe(cartaId);
            if (!de) {
              res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
              res.end(JSON.stringify({ error: `Carta ${cartaId} não está no quadro ${houseId}.` }));
              return;
            }
            const item = board.mover(cartaId, de as any, para as any);
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ houseId, item }, null, 2));
          } catch (err: any) {
            res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ error: err.message || "Erro ao mover carta no quadro." }));
          }
        });
        return;
      }

      // 404
      res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "Endpoint não encontrado. Use POST /engine/tasks, POST /engine/cartas ou GET /health" }));
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
