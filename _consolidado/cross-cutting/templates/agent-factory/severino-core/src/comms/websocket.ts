export function registerWebSocket(server: any) {
  server.register(async (fastify: any) => {
    // @fastify/websocket v10: handler receives (socket, req) directly,
    // NOT { socket }. Using connection.socket breaks every connection.
    fastify.get("/ws", { websocket: true }, (socket: any, req: any) => {
      console.log("🔌 WebSocket client connected");

      // Heartbeat: keep proxies/LBs from killing idle connections
      const heartbeat = setInterval(() => {
        try {
          socket.ping();
        } catch { /* ignore */ }
      }, 25000);

      socket.on("message", async (message: Buffer) => {
        try {
          const data = JSON.parse(message.toString());
          console.log("📩 WS Message received:", data);

          if (data.type === "ping") {
            socket.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
          } else if (data.type === "task") {
            const { robotFactory } = await import("../micro-agents/robot-factory.js");
            const response = await robotFactory.executeTask(data.robotId, data.task);
            socket.send(JSON.stringify({ type: "task-result", response }));
          }
        } catch (e: any) {
          try {
            socket.send(JSON.stringify({ type: "error", message: e.message }));
          } catch { /* socket may be closing */ }
        }
      });

      const cleanup = () => {
        clearInterval(heartbeat);
        console.log("🔌 WebSocket client disconnected");
      };
      socket.on("close", cleanup);
      socket.on("error", (err: any) => {
        console.warn("⚠️ WebSocket error:", err?.message || err);
        cleanup();
      });
    });
  });
}