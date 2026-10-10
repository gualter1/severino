## METADADOS
- **Repositório**: `claude-code-best-practice`
- **Lead Responsável**: `kaspersky`
- **Funcionário (Subagente)**: `kaspersky`
- **Data**: `2026-10-08`
- **Tempo gasto**: `45min`

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

## 2. O QUE PRESTA PARA **THREAT MODELING/SAST/DAST/COMPLIANCE**
| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| Permissions least-privilege (allow/deny) — nunca `--dangerously-skip-permissions` | `README.md:80-120` | Threat model | `agents/kaspersky/threat-models/ai-agent-permissions.md` | 🔴 Alta |
| Sandboxing do agent (filesystem/network scope) | `README.md:130-160` | Pattern | `agents/kaspersky/hardening-guides/ai-agent-sandbox.md` | 🔴 Alta |
| Human-in-the-loop para bash/network/write sensível | `tips/*.md: dica 10` | Guideline | `agents/kaspersky/checklists/ai-agent-hitl.md` | 🔴 Alta |
| Secrets via env, nunca no prompt/contexto | `README.md:150-170` | Anti-pattern | `agents/kaspersky/compliance/ai-secrets.md` | 🔴 Alta |
| Audit log ações do agent (SOC2) | `README.md:180-200` | Compliance mapping | `agents/kaspersky/compliance/soc2-ai-audit.md` | 🟠 Média |
| Code review IA como gate, não auto-merge | `README.md:210-230` | Guideline | `agents/kaspersky/checklists/ai-code-review.md` | 🟠 Média |

---

## 3. LIXO/DESATUALIZADO/PERIGOSO
| Item | Localização | Motivo | Substituto |
|------|-------------|--------|------------|
| `--dangerously-skip-permissions` em exemplos | `README.md:100` | Bypass total | allowlist + sandbox + HITL |
| `curl \| bash` suggestions | `tips/*.md` | Supply chain | Pin SHA + review |

---

## 4. GAPS
- [ ] Gap 1: Prompt injection / indirect injection defenses — Sugestão: `threat-models/prompt-injection.md`
- [ ] Gap 2: LGPD em contexto enviado ao LLM (PII redaction) — Sugestão: checklist
- [ ] Gap 3: SBOM de skills/mcp-servers — Sugestão: supply-chain

---

## 5. AÇÕES
- [ ] **CONSOLIDATED.md** com: AI agent threat model + sandbox + HITL + audit
- [ ] **Criar Threat Model**: `ai-agent-full.md` — Em: `threat-models/`
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