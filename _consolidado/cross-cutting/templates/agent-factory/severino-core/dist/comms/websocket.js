export function registerWebSocket(server) {
    server.register(async (fastify) => {
        fastify.get("/ws", { websocket: true }, (connection, req) => {
            console.log("🔌 WebSocket client connected");
            connection.socket.on("message", async (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    console.log("📩 WS Message received:", data);
                    if (data.type === "ping") {
                        connection.socket.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
                    }
                    else if (data.type === "task") {
                        const { robotFactory } = await import("../micro-agents/robot-factory.js");
                        const response = await robotFactory.executeTask(data.robotId, data.task);
                        connection.socket.send(JSON.stringify({ type: "task-result", response }));
                    }
                }
                catch (e) {
                    connection.socket.send(JSON.stringify({ type: "error", message: e.message }));
                }
            });
            connection.socket.on("close", () => {
                console.log("🔌 WebSocket client disconnected");
            });
        });
    });
}
//# sourceMappingURL=websocket.js.map