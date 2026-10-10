## METADADOS
- **Repositório**: `claude-code-best-practice`
- **Lead Responsável**: `tranquilao`
- **Funcionário (Subagente)**: `tranquilao`
- **Data**: `2026-10-08`
- **Tempo gasto**: `50min`

---

## 1. VISÃO GERAL
| Campo | Detalhe |
|-------|---------|
| Propósito | Tips/workflow Claude Code: permissions, sandboxing, skills, paralelização |
| Público | Devs IA-assisted, platform |
| Tamanho | README + `tips/claude-boris-13-tips-03-jan-26.md` |
| Tech | Markdown, shell, Claude configs |
| Freshness | Muito atual (jan-26 tips) |

---

## 2. O QUE PRESTA
| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| Permissions least-privilege (`settings.json` allow/deny) nunca `--dangerously-skip-permissions` em prod | `README.md:80-120` + `tips/*.md: dica 10` | Guideline | `agents/tranquilao/hardening-guides/ai-agent-sandbox.md` | 🔴 Alta |
| Sandboxing + containerização do agent (filesystem/network scope) | `README.md:130-160` | Pattern | `agents/tranquilao/hardening-guides/ai-agent-sandbox.md` | 🔴 Alta |
| Aprovação humana para `bash`, network, file-write sensível | `tips/*.md: dica 10` | Checklist | `agents/tranquilao/checklists/ai-agent-gate.md` | 🔴 Alta |
| Secrets via env, nunca no prompt/contexto commitado | `README.md:150-170` | Anti-pattern | `agents/tranquilao/checklists/secrets-management.md` | 🔴 Alta |
| Audit log de ações do agent (SOC2) | `README.md:180-200` | Compliance mapping | `agents/tranquilao/compliance/soc2-ai-audit.md` | 🟠 Média |
| Code review IA como gate, não auto-merge | `README.md:210-230` | Guideline | `agents/tranquilao/checklists/quality-gates.md` | 🟠 Média |

---

## 3. LIXO/DESATUALIZADO/PERIGOSO
| Item | Localização | Motivo | Substituto |
|------|-------------|--------|------------|
| `--dangerously-skip-permissions` em exemplos sem alerta | `README.md:100` | Bypass total | allowlist + sandbox + HITL |
| Tips que sugerem `curl \| bash` | `tips/*.md` | Supply chain | Pinnar SHA + review |

---

## 4. GAPS
- [ ] Gap 1: Prompt injection / indirect injection defenses — Sugestão: `ai-prompt-security.md`
- [ ] Gap 2: LGPD em contexto enviado ao LLM (PII redaction) — Sugestão: checklist
- [ ] Gap 3: SBOM de skills/mcp-servers — Sugestão: supply-chain

---

## 5. AÇÕES
- [ ] **CONSOLIDATED.md** com: AI sandbox baseline + permissions allowlist + audit
- [ ] **Criar Checklist**: `ai-agent-security-gate.md`
- [ ] **Criar ADR**: `ADR-ai-agent-sandbox-obrigatorio`

---

## 6. CITAÇÕES
> `tips/claude-boris-13-tips-03-jan-26.md:dica 10` — "Tune permissions: allowlist reads, ask for writes/network."
> `README.md:100` — "Avoid `--dangerously-skip-permissions` outside throwaway sandboxes."

---

## 7. SCORE
| Relevância | 4 | Sandboxing, secrets, audit |
| Qualidade | 4 | Prático, atual |
| Atualidade | 5 | Jan-26 |
| Ação | 4 | Gate IA imediato |
| Completude | 2 | Sem prompt-injection/LGPD |
| **TOTAL** | **19/25** | Priorizar extração completa |

---

## 8. PRÓXIMOS PASSOS
- [x] Salvar em `extractions/claude-code-best-practice.md`