# EXTRAÇÃO — awesome-llm-apps

## METADADOS
- **Repositório**: `awesome-llm-apps` | **Lead**: `niamaia` | **Data**: `2026-10-08` | **Tempo**: `40min`

---

## 1. VISÃO GERAL
| Campo | Detalhe |
|-------|---------|
| Propósito | 100+ AI agents, skills, RAG apps open-source (Apache-2.0) — starter → advanced → voice → MCP → RAG |
| Público | AI engineers, full-stack devs, architects de sistemas LLM |
| Tamanho | Grande: starter_ai_agents/, advanced_ai_agents/ (single/multi/agent_teams), voice_ai_agents/, mcp_ai_agents/, rag_tutorials/ (20+), generative_ui_agents/, always_on_agents/ |
| Tech | Python (Streamlit), OpenAI Agents SDK, Google ADK, AG2, CrewAI, LangGraph, Pydantic AI, MCP, Qdrant, Firecrawl |
| Freshness | Alta — templates semanais, trendshift #1, multi-model (Claude/Gemini/GPT/DeepSeek/Llama/Qwen) |

---

## 2. O QUE PRESTA PARA NIAMAIA

| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| Taxonomia single-agent → multi-agent teams → always-on (scheduled/event-driven) | `README.md:114-165` | Pattern | `agents/niamaia/llm-architecture.md` | 🔴 Alta |
| RAG spectrum: basic chain → hybrid search → corrective RAG → agentic RAG → knowledge-graph RAG | `README.md:226-250` | Pattern | `agents/niamaia/rag-patterns.md` | 🔴 Alta |
| MCP router: specialist agents cada um com seu MCP server + bridge OpenAI→MCP remoto | `README.md:215-224` | Pattern | `agents/niamaia/mcp-architecture.md` | 🔴 Alta |
| Trust-gated team: every agent verified + hash-chained audit trail | `README.md:157` | Pattern | `agents/niamaia/llm-architecture.md` | 🟠 Média |
| Memory patterns: session-persistent, personalized, shared multi-LLM | `README.md:260-268` | Pattern | `agents/niamaia/llm-memory.md` | 🟠 Média |
| Generative UI: tool calls renderizam como workspace cards (não só texto) | `README.md:195-206` | Pattern | `agents/niamaia/agentic-frontends.md` | 🟠 Média |
| Optimização: TOON (-30-60% tokens), Headroom (-50-90% contexto) | `README.md:282-286` | Decision record | `agents/niamaia/llm-cost.md` | 🟠 Média |
| Failure diagnostics clinic para RAG (debug sistemático de pipeline) | `README.md:249` | Runbook | `agents/niamaia/rag-debug-runbook.md` | 🟠 Média |
| Framework crash courses: ADK vs OpenAI SDK (tools, memory, handoffs, evals) | `README.md:295-301` | Decision record | `agents/niamaia/adrs/ADR-agent-framework.md` | 🟠 Média |
| Agent skills com security+eval CI gate | `README.md:101-103` | Guideline | `agents/niamaia/skill-gates.md` | 🟢 Baixa |

---

## 3. LIXO / DESATUALIZADO
| Item | Motivo | Substituto |
|------|--------|------------|
| Single-file Streamlit como "production-style" | OK para starter, não para prod | FastAPI + frontend + queues + observability |
| Nomes de modelos específicos (GPT-6, Gemini 3.8, Claude Fable 5.1) | Podem ser fictícios/aspiracionais | Pin de modelo real + evals |

---

## 4. GAPS
- [ ] Eval harness (accuracy, faithfulness, latency, cost) — parcial; sugerir `llm-evals.md`
- [ ] Guardrails / prompt injection defense em profundidade — sugerir com kaspersky
- [ ] Streaming, cancelamento, backpressure — ausente
- [ ] Data boundaries: PII redaction, retention, lineage — ausente (crítico p/ RAG prod)
- [ ] Versionamento de prompts/skills + rollback — ausente

---

## 5. AÇÕES
- [ ] CONSOLIDATED: taxonomia de agentes; RAG spectrum; MCP router; memory patterns
- [ ] ADR: `ADR-agent-framework` (ADK vs OpenAI SDK vs LangGraph)
- [ ] Runbook: RAG failure diagnostics
- [ ] Checklist: prod readiness LLM (evals, guardrails, PII, cost caps)

---

## 6. CITAÇÕES
> `README.md:5` — "100+ open-source AI agents, agent skills, and RAG apps. Hand-built, tested end-to-end, Apache-2.0."
> `README.md:103` — "Every skill ships real code and passes a security + eval CI gate."
> `README.md:157` — "Trust-Gated Multi-Agent Research Team — Every agent verified, every action in a hash-chained audit trail."

---

## 7. SCORE
| Relevância 4 | Qualidade 4 | Atualidade 5 | Ação 3 | Completude 3 | **TOTAL 19/25 → Priorizar extração (com camada prod/evals própria)** |

## 8. SALVO
- [x] `extractions/awesome-llm-apps.md`