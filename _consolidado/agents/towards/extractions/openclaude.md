# METADADOS
- **Repositório**: `openclaude`
- **Lead Responsável**: `towards`
- **Funcionário (Subagente)**: `Towards`
- **Data**: `2026-04-09`
- **Tempo gasto**: `2h 45min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Open-source coding-agent CLI para cloud e local model providers, fork refinado e adaptado do Claude Code. |
| **Público-alvo** | Desenvolvedores backend/full-stack, engenheiros de IA, arquitetos de sistemas autônomos e CLI enthusiasts. |
| **Tamanho** | ~100+ arquivos em `src/`, abrangendo runtime, ink UI, CLI, ferramentas, tarefas, agentes e provedores. |
| **Linguagens/Tech** | TypeScript (strict), React, Ink (terminal UI), Bun, Node.js `>=22.0.0`. |
| **Freshness** | Ativo, atualizado, pipeline de CI rigoroso, cobertura de testes abrangente com Bun test. |

---

## 2. O QUE PRESTA PARA **TOWARDS** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| **Agent Routing & Model Isolation** | `docs/agent-routing.md:1-133` | Pattern | `agents/towards/agent-routing-and-models.md` | 🔴 Alta |
| **MaxSteps Bounded Tool Execution** | `docs/agent-routing.md:7-24`, `src/query.ts:308-423` | Pattern | `agents/towards/bounded-tool-loops.md` | 🔴 Alta |
| **Sub-agent Permission Forwarding** | `docs/agent-routing.md:98-112` | Pattern | `agents/towards/sub-agent-permissions.md` | 🟠 Média |
| **GitHub Copilot Serialization** | `docs/agent-routing.md:113-132` | Tool config | `agents/towards/resource-throttling.md` | 🟢 Baixa |
| **Agent Loop State Machine (queryLoop)** | `src/query.ts:628-676, 678-839` | Pattern | `agents/towards/agent-loop-state-machine.md` | 🔴 Alta |
| **Immutable State + Mutable Cross-Iteration State Pattern** | `src/query.ts:629-654, 728-744` | Pattern | `agents/towards/immutable-state-pattern.md` | 🔴 Alta |
| **Smart Routing (Simple vs Strong Model)** | `docs/smart-routing.md:1-57`, `src/query.ts:1276-1330` | Pattern | `agents/towards/smart-routing.md` | 🔴 Alta |
| **Provider Fallback Chain (Rate Limit Recovery)** | `src/query.ts:1760-1780, 2404-2484` | Pattern | `agents/towards/provider-fallback-chain.md` | 🔴 Alta |
| **Context Collapse & Reactive Compaction** | `src/query.ts:970-1023, 1091-1113, 2146-2214` | Pattern | `agents/towards/context-collapse-reactive-compact.md` | 🔴 Alta |
| **Token Budget Continuation (Auto-continue)** | `src/query.ts:2546-2598` | Pattern | `agents/towards/token-budget-continuation.md` | 🟠 Média |
| **Streaming Tool Execution** | `src/query.ts:1252-1260, 1794-1819` | Pattern | `agents/towards/streaming-tool-execution.md` | 🟠 Média |
| **Agent Step Limit Enforcement (maxSteps)** | `src/query.ts:308-423, 2725+` | Code snippet | `agents/towards/agent-step-limit-enforcement.ts` | 🔴 Alta |
| **Multi-turn Query Tracking (Chain ID + Depth)** | `src/query.ts:889-906` | Pattern | `agents/towards/multi-turn-query-tracking.md` | 🟠 Média |
| **Stop Hooks Integration** | `src/query.ts:2495-2544` | Pattern | `agents/towards/stop-hooks-integration.md` | 🟠 Média |
| **Task Budget Across Compaction Boundaries** | `src/query.ts:753-762, 1152-1163, 1167-1177` | Pattern | `agents/towards/task-budget-compaction.md` | 🟢 Baixa |
| **Query Source Typing (compact, session_memory, agent:*, repl_main_thread)** | `src/query.ts:542, 940-942` | Pattern | `agents/towards/query-source-typing.md` | 🟢 Baixa |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| `api_key` in `settings.json` | `docs/agent-routing.md:34` | Armazenamento de chaves em plaintext no JSON de configurações do usuário. | Keyring do OS / Secret Storage dedicado |
| DuckDuckGo scraping fallback | `README.md:414` | Sujeito a rate-limiting, bloqueio e quebra por TOS de terceiros. | APIS de busca oficiais (Exa, Firecrawl, Tavily) |
| `feature('CHICAGO_MCP')` gating | `src/query.ts:181` | Feature flag hardcoded no runtime — acoplamento a MCP específico. | Abstração de feature flags via config |
| `feature('CACHED_MICROCOMPACT')` string elimination | `src/query.ts:999, 1839` | Tree-shaking via strings de feature flag — frágil e não tipado. | Feature flags via build-time constants (tsconfig paths / define) |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] Gap 1: Tratamento de concorrência massiva em background jobs — Sugestão: Adicionar lock distribuído/file-based rigoroso para evitar race conditions em múltiplos processos de background.
- [ ] Gap 2: Estratégias de fallback automático de provedor em tempo de execução — Sugestão: Documentar circuit breakers dinâmicos quando um provider retorna 429 ou 5xx.
- [ ] Gap 3: Observabilidade distribuída de agent chains — Sugestão: Adicionar trace propagation (W3C trace-context) entre sub-agents e main thread.
- [ ] Gap 4: Dead letter queue para tool failures persistentes — Sugestão: Implementar DLQ para tool results que falham repetidamente após max retries.
- [ ] Gap 5: Garantias de idempotência para tool calls — Sugestão: Adicionar `toolCallId` determinístico para deduplicação em retries.

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: Padrões de orquestração de agentes (Agent loops, Bounded tool use com `maxSteps`, e routing dinâmico por modelo).
- [ ] **Criar Pattern**: `bounded-tool-loops.md` — Em: `_consolidado/agents/towards/patterns/`
- [ ] **Criar Pattern**: `agent-routing-and-models.md` — Em: `_consolidado/agents/towards/patterns/`
- [ ] **Criar Pattern**: `agent-loop-state-machine.md` — Em: `_consolidado/agents/towards/patterns/`
- [ ] **Criar Pattern**: `immutable-state-pattern.md` — Em: `_consolidado/agents/towards/patterns/`
- [ ] **Criar Pattern**: `smart-routing.md` — Em: `_consolidado/agents/towards/patterns/`
- [ ] **Criar Pattern**: `provider-fallback-chain.md` — Em: `_consolidado/agents/towards/patterns/`
- [ ] **Criar Pattern**: `context-collapse-reactive-compact.md` — Em: `_consolidado/agents/towards/patterns/`
- [ ] **Criar Code snippet**: `agent-step-limit-enforcement.ts` — Em: `_consolidado/agents/towards/snippets/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `docs/agent-routing.md:7-11`: "Custom agents can define `maxSteps` as a positive integer to cap how many tool-use steps a sub-agent may execute. When the limit is reached, OpenClaude stops additional tool calls and asks the sub-agent for a concise final summary covering completed work, findings, remaining tasks, and whether another run is needed."

> `src/query.ts:629-654`: State type — "Mutable state carried between loop iterations" com campos para `agentStepLimit`, `continuationNudgeCount`, `transition`, `hasAttemptedProviderFallback`, etc. Demonstrando pattern de **imutáveis params + estado mutável cross-iteration**.

> `src/query.ts:1276-1330`: Smart routing — "Classify once per user turn (transition===undefined) and pin the decision; reuse the pin on every continuation pass." Demonstrando **single decision per turn** com **pin surviving continuations**.

> `src/query.ts:1760-1780`: Model fallback — "Fallback was triggered - switch model and retry... Clear assistant messages since we'll retry the entire request... Discard pending results from the failed attempt."

> `src/query.ts:2404-2484`: Provider fallback — "When the active provider returns a rate-limit error and the user has configured an ordered `providerFallbackChain`, swap to the next chain entry and retry the turn once instead of bubbling the error to the UI."

> `src/query.ts:2146-2214`: Reactive compact — "Single-shot on each — if a retry still 413's, the next stage handles it or the error surfaces." Demonstrando **recovery pipeline escalation**: collapse drain → reactive compact → error surface.

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Altíssimo foco em agent orchestration, tool loops e multi-agent workflows. |
| **Qualidade** | 5 | Excelente documentação e arquitetura limpa em TypeScript. |
| **Atualidade** | 5 | Padrões modernos de LLM CLI e multi-provider routing. |
| **Ação** | 5 | Gera padrões e diretrizes diretas para arquitetura backend/agents. |
| **Completude** | 4 | Cobre muito bem agentes e ferramentas, faltando apenas detalhes de escalabilidade distribuída. |
| **TOTAL** | **24/25** | |

> **Regra**: Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [ ] Salvar este arquivo em `_consolidado/agents/towards/extractions/openclaude.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila