## METADADOS
- **Repositório**: `awesome-llm-apps`
- **Lead Responsável**: `kaspersky`
- **Funcionário (Subagente)**: `kaspersky`
- **Data**: `2026-10-08`
- **Tempo gasto**: `1h 00min`

---

## 1. VISÃO GERAL
| Campo | Detalhe |
|-------|---------|
| Propósito | Coleção apps LLM (RAG, agents, skills) com Streamlit/Next |
| Público | AI engineers, reviewers |
| Tamanho | README + `agent_skills/*` dezenas apps |
| Tech | Python, TS, Markdown, Docker |
| Freshness | Ativo |

---

## 2. O QUE PRESTA PARA **THREAT MODELING/SAST/DAST/COMPLIANCE**
| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| API keys só via env (`os.getenv`), nunca hardcoded | `agent_skills/*:10-30` | Anti-pattern | `agents/kaspersky/compliance/ai-secrets.md` | 🔴 Alta |
| Eval como CI gate antes de merge de prompt/model | `README.md:150-180` | Guideline | `agents/kaspersky/checklists/ai-eval-gate.md` | 🟠 Média |
| Input sanitization + output guardrails (anti-prompt-injection) parcial | `agent_skills/*:50-80` | Pattern | `agents/kaspersky/hardening-guides/llm-guardrails.md` | 🔴 Alta |
| Rate-limit/custo guard para chamadas LLM | `README.md:180-200` | Guideline | `agents/kaspersky/sast-dast/llm-rate-limit.md` | 🟠 Média |
| PII redaction antes de enviar a LLM | `agent_skills/*` | Compliance mapping | `agents/kaspersky/compliance/lgpd-llm.md` | 🔴 Alta |
| RAG poisoning surface (document injection) | `agent_skills/*` | Threat model | `agents/kaspersky/threat-models/rag-poisoning.md` | 🔴 Alta |

---

## 3. LIXO/DESATUALIZADO/PERIGOSO
| Item | Localização | Motivo | Substituto |
|------|-------------|--------|------------|
| `.env` com keys commitadas em exemplos | `agent_skills/*/example.env` | Vaza secrets | `.env.example` + secret manager |
| `temperature=0` como "segurança" | `README.md` | Não é controle security | Guardrails + eval adversarial |
| Sem `requirements.txt` pinnado | vários apps | Supply chain | pip freeze + hash + Dependabot |

---

## 4. GAPS
- [ ] Gap 1: OWASP LLM Top 10 mapping ausente — Sugestão: `compliance/owasp-llm-top10.md`
- [ ] Gap 2: SOC2 audit de prompts/completions — Sugestão: runbook
- [ ] Gap 3: SAST para Python LLM (bandit/semgrep) — Sugestão: gate
- [ ] Gap 4: Agent hijacking (tool misuse, prompt injection chains) — Sugestão: threat model

---

## 5. AÇÕES
- [ ] **CONSOLIDATED.md** com: LLM secrets + guardrails + eval gate + PII redaction + RAG poisoning
- [ ] **Criar Threat Model**: `llm-app-full.md` — Em: `threat-models/`
- [ ] **Criar Checklist**: `llm-app-security-gate.md`
- [ ] **Criar ADR**: `ADR-owasp-llm-top10-gate`

---

## 6. CITAÇÕES
> `agent_skills/*:15` — "`api_key = os.getenv('OPENAI_API_KEY')  # never hardcode`"
> `README.md:160` — "Evaluate before merging: quality gate for prompts."

---

## 7. SCORE
| Relevância | 4 | Secrets, guardrails, LGPD-LLM, RAG |
| Qualidade | 3 | Exemplos variados, security irregular |
| Atualidade | 4 | Ativo |
| Ação | 4 | Gate LLM imediato |
| Completude | 2 | Sem OWASP-LLM/SAST |
| **TOTAL** | **17/25** | Extrair seletivo |

---

## 8. PRÓXIMOS PASSOS
- [x] Salvar em `extractions/awesome-llm-apps.md`