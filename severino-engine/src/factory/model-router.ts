/**
 * 🧠 ModelRouter do engine — porte enxuto do severino-core.
 *
 * Fala com a 9router via fetch nativo (node20) em
 * `${BASE}/chat/completions` com `Authorization: Bearer KEY`.
 * Sem KEY ou se o fetch falhar → retorna MOCK e NUNCA lança.
 */

export interface ChatMessage {
  role: string;
  content: string;
}

export interface CompleteOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface CompleteResult {
  content: string;
  model: string;
  mock: boolean;
}

function baseUrl(): string {
  return process.env.NINEROUTER_BASE_URL || "http://localhost:20128/v1";
}

function defaultModel(): string {
  return process.env.SEVERINO_MODEL || "Tech";
}

function apiKey(): string {
  return process.env.NINEROUTER_API_KEY || "";
}

/** Verdadeiro quando não há chave configurada (modo MOCK). */
export function isMock(): boolean {
  return !apiKey();
}

function mockResponse(messages: ChatMessage[], model: string): CompleteResult {
  const lastUser = messages.filter((m) => m.role === "user").pop()?.content || "";
  return {
    content: `[MOCK ${model}] Resposta simulada para: "${lastUser.slice(0, 80)}..."`,
    model,
    mock: true,
  };
}

/** Completa mensagens via 9router; cai em MOCK sem chave ou em falha de rede. */
export async function complete(
  messages: ChatMessage[],
  opts: CompleteOptions = {}
): Promise<CompleteResult> {
  const model = opts.model || defaultModel();
  const key = apiKey();

  if (!key) {
    console.warn("⚠️ NINEROUTER_API_KEY ausente — ModelRouter em modo MOCK.");
    return mockResponse(messages, model);
  }

  try {
    const payload = {
      model,
      messages: opts.systemPrompt
        ? [{ role: "system", content: opts.systemPrompt }, ...messages]
        : messages,
      temperature: opts.temperature ?? 0.3,
      max_tokens: opts.maxTokens ?? 4096,
      stream: false,
    };

    const response = await fetch(`${baseUrl()}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      console.warn(`⚠️ 9router erro ${response.status} — caindo em MOCK. Detalhe: ${err.slice(0, 200)}`);
      return mockResponse(messages, model);
    }

    const data: any = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || "",
      model: data.model || model,
      mock: false,
    };
  } catch (err: any) {
    console.warn(`⚠️ Falha ao chamar 9router (${err?.message || err}) — caindo em MOCK.`);
    return mockResponse(messages, model);
  }
}
