export function loadConfig() {
    return {
        port: parseInt(process.env.PORT || "3000", 10),
        host: process.env.HOST || "0.0.0.0",
        logLevel: process.env.LOG_LEVEL || "info",
        nineRouterApiKey: process.env.NINEROUTER_API_KEY,
        nineRouterBaseUrl: process.env.NINEROUTER_BASE_URL || "https://api.9router.com/v1",
        defaultModel: process.env.DEFAULT_MODEL || "anthropic/claude-3.5-sonnet",
        roomsDir: process.env.ROOMS_DIR || "/home/adison/Área de trabalho/severino capiroto/rooms",
        templatesDir: process.env.TEMPLATES_DIR || "/home/adison/Área de trabalho/severino capiroto/_consolidado/cross-cutting/templates",
    };
}
//# sourceMappingURL=config.js.map