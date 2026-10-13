/**
 * 🤖 agent.ts — convenção Eve: defineAgent + defaultAgent.
 *
 * Local-first: o modelo default é `SEVERINO_MODEL` ou "Tech" (9router).
 * NUNCA OpenAI/Anthropic como default — sem vendor lock, sem phone-home.
 */

export interface AgentConfig {
  /** Modelo do agente. Default: ENV SEVERINO_MODEL ou "Tech" (9router, local-first). */
  model?: string;
  /** Nível de raciocínio ("low" | "medium" | "high"). Default: "medium". */
  reasoning?: "low" | "medium" | "high";
  /** Casas que o agente pode rotear. Default: as 3 casas da vila. */
  houses?: string[];
}

export interface Agent {
  model: string;
  reasoning: "low" | "medium" | "high";
  houses: string[];
}

const DEFAULT_HOUSES = ["casa-dev", "casa-negocios", "casa-dados"];

export function defineAgent(config: AgentConfig = {}): Agent {
  return {
    // 9router local-first. NUNCA openai/anthropic aqui.
    model: config.model || process.env.SEVERINO_MODEL || "Tech",
    reasoning: config.reasoning || "medium",
    houses: config.houses || [...DEFAULT_HOUSES],
  };
}

/** Agente padrão da vila — model via ENV, resto no default. */
export const defaultAgent: Agent = defineAgent();
