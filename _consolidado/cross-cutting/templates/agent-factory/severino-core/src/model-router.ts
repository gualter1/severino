import { loadConfig } from "./config.js";

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

export class ModelRouter {
  private config = loadConfig();
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;

  constructor() {
    this.apiKey = this.config.nineRouterApiKey || "";
    this.baseUrl = this.config.nineRouterBaseUrl;
    this.defaultModel = this.config.defaultModel;

    if (!this.apiKey) {
      console.warn("⚠️ NINEROUTER_API_KEY não configurado. ModelRouter operará em modo mock.");
    }
  }

  async complete(messages: Array<{ role: string; content: string }>, options: ModelRouterOptions = {}): Promise<ModelResponse> {
    const model = options.model || this.defaultModel;
    const temperature = options.temperature ?? 0.3;
    const maxTokens = options.maxTokens ?? 4096;
    const systemPrompt = options.systemPrompt;

    if (!this.apiKey) {
      return this.mockResponse(messages, model);
    }

    const payload = {
      model,
      messages: systemPrompt ? [{ role: "system", content: systemPrompt }, ...messages] : messages,
      temperature,
      max_tokens: maxTokens,
      stream: false,
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`9router error ${response.status}: ${error}`);
    }

    const data: any = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || "",
      usage: data.usage,
      model: data.model,
    };
  }

  async streamComplete(
    messages: Array<{ role: string; content: string }>,
    options: ModelRouterOptions = {},
    onChunk: (chunk: string) => void
  ): Promise<ModelResponse> {
    const model = options.model || this.defaultModel;
    const temperature = options.temperature ?? 0.3;
    const maxTokens = options.maxTokens ?? 4096;
    const systemPrompt = options.systemPrompt;

    if (!this.apiKey) {
      const mock = this.mockResponse(messages, model);
      onChunk(mock.content);
      return mock;
    }

    const payload = {
      model,
      messages: systemPrompt ? [{ role: "system", content: systemPrompt }, ...messages] : messages,
      temperature,
      max_tokens: maxTokens,
      stream: true,
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`9router stream error ${response.status}: ${error}`);
    }

    let fullContent = "";
    let usage: ModelResponse["usage"];

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error("No response body");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(line => line.trim());

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices[0]?.delta?.content;
            if (delta) {
              fullContent += delta;
              onChunk(delta);
            }
            if (parsed.usage) usage = parsed.usage;
          } catch {
            // Ignore parse errors on partial chunks
          }
        }
      }
    }

    return { content: fullContent, usage, model };
  }

  private mockResponse(messages: Array<{ role: string; content: string }>, model: string): ModelResponse {
    const lastUserMsg = messages.filter(m => m.role === "user").pop()?.content || "";
    return {
      content: `[MOCK ${model}] Resposta simulada para: "${lastUserMsg.slice(0, 80)}..."`,
      usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
      model,
    };
  }

  async listModels(): Promise<string[]> {
    if (!this.apiKey) {
      return [
        "anthropic/claude-3.5-sonnet",
        "anthropic/claude-3-opus",
        "openai/gpt-4o",
        "openai/gpt-4o-mini",
        "google/gemini-1.5-pro",
        "meta-llama/llama-3.1-405b",
      ];
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      if (!response.ok) return [];
      const data: any = await response.json();
      return data.data?.map((m: any) => m.id) || [];
    } catch {
      return [];
    }
  }
}

export const modelRouter = new ModelRouter();