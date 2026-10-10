export interface ModelRouterOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
}
export interface ModelResponse {
    content: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    model: string;
}
export declare class ModelRouter {
    private config;
    private apiKey;
    private baseUrl;
    private defaultModel;
    constructor();
    complete(messages: Array<{
        role: string;
        content: string;
    }>, options?: ModelRouterOptions): Promise<ModelResponse>;
    streamComplete(messages: Array<{
        role: string;
        content: string;
    }>, options: ModelRouterOptions | undefined, onChunk: (chunk: string) => void): Promise<ModelResponse>;
    private mockResponse;
    listModels(): Promise<string[]>;
}
export declare const modelRouter: ModelRouter;
//# sourceMappingURL=model-router.d.ts.map