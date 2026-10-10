## METADADOS
- **Repositório**: `awesome-llm-apps`
- **Lead Responsável**: `tranquilao`
- **Funcionário (Subagente)**: `tranquilao`
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

## 2. O QUE PRESTA
| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| API keys só via env (`os.getenv`), nunca hardcoded | `agent_skills/*:10-30` | Anti-pattern | `agents/tranquilao/checklists/secrets-management.md` | 🔴 Alta |
| Eval como CI gate antes de merge de prompt/model | `README.md:150-180` | Guideline | `agents/tranquilao/checklists/quality-gates.md` | 🟠 Média |
| Input sanitization + output guardrails (anti-prompt-injection) parcial | `agent_skills/*:50-80` | Pattern | `agents/tranquilao/hardening-guides/llm-guardrails.md` | 🔴 Alta |
| Rate-limit/custo guard para chamadas LLM | `README.md:180-200` | Guideline | `agents/tranquilao/network-security/llm-rate-limit.md` | 🟠 Média |
| PII redaction antes de enviar a LLM | `agent_skills/*` | Compliance mapping | `agents/tranquilao/compliance/lgpd-llm.md` | 🔴 Alta |

---

## 3. LIXO/DESATUALIZADO/PERIGOSO
| Item | Localização | Motivo | Substituto |
|------|-------------|--------|------------|
| `.env` com keys commitadas em exemplos | `agent_skills/*/example.env` | Vaza secrets | `.env.example` + secret manager |
| `temperature=0` como "segurança" | `README.md` | Não é controle security | Guardrails + eval adversarial |
| Sem `requirements.txt` pinnado | vários apps | Supply chain | pip freeze + hash + Dependabot |

---

## 4. GAPS
- [ ] Gap 1: OWASP LLM Top 10 mapping ausente — Sugestão: `compliance/owasp-llm-mapping.md`
- [ ] Gap 2: SOC2 audit de prompts/completions — Sugestão: runbook
- [ ] Gap 3: SAST para Python LLM (bandit/semgrep) — Sugestão: gate

---

## 5. AÇÕES
- [ ] **CONSOLIDATED.md** com: LLM secrets + guardrails + eval gate + PII redaction
- [ ] **Criar Checklist**: `llm-app-security-gate.md`
- [ ] **Criar ADR**: `ADR-owasp-llm-top10-gate`

---

## 6. CITAÇÕES
> `agent_skills/*:15` — "`api_key = os.getenv('OPENAI_API_KEY')  # never hardcode`"
> `README.md:160` — "Evaluate before merging: quality gate for prompts."

---

## 7. SCORE
| Relevância | 4 | Secrets, guardrails, LGPD-LLM |
| Qualidade | 3 | Exemplos variados, security irregular |
| Atualidade | 4 | Ativo |
| Ação | 4 | Gate LLM imediato |
| Completude | 2 | Sem OWASP-LLM/SAST |
| **TOTAL** | **17/25** | Extrair seletivo |

---

## 8. PRÓXIMOS PASSOS
- [x] Salvar em `extractions/awesome-llm-apps.md`