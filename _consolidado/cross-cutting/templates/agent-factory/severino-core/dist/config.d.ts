export interface SeverinoConfig {
    port: number;
    host: string;
    logLevel: string;
    nineRouterApiKey?: string;
    nineRouterBaseUrl: string;
    defaultModel: string;
    roomsDir: string;
    templatesDir: string;
}
export declare function loadConfig(): SeverinoConfig;
//# sourceMappingURL=config.d.ts.map