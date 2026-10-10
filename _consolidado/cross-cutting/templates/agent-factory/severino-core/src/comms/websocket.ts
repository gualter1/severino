export function registerWebSocket(server: any) {
  server.register(async (fastify: any) => {
    fastify.get("/ws", { websocket: true }, (connection: any, req: any) => {
      console.log("🔌 WebSocket client connected");

      connection.socket.on("message", async (message: Buffer) => {
        try {
          const data = JSON.parse(message.toString());
          console.log("📩 WS Message received:", data);

          if (data.type === "ping") {
            connection.socket.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
          } else if (data.type === "task") {
            const { robotFactory } = await import("../micro-agents/robot-factory.js");
            const response = await robotFactory.executeTask(data.robotId, data.task);
            connection.socket.send(JSON.stringify({ type: "task-result", response }));
          }
        } catch (e: any) {
          connection.socket.send(JSON.stringify({ type: "error", message: e.message }));
        }
      });

      connection.socket.on("close", () => {
        console.log("🔌 WebSocket client disconnected");
      });
    });
  });
}