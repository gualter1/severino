# METADADOS
- **Repositório**: claude-code-best-practice
- **Lead Responsável**: turing
- **Funcionário (Subagente)**: Turing
- **Data**: 2026-10-08
- **Tempo gasto**: 0h 30min

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Guia de melhores práticas de desenvolvimento com IA (Claude Code), incluindo prompts, workflows e agent teams |
| **Público-alvo** | Devs usando IA-assisted coding, agentes de codificação |
| **Tamanho** | ~21 diretórios (best-practice, agent-teams, development-workflows, etc.) |
| **Linguagens/Tech** | Markdown, YAML (MCP config), prompts, skills |
| **Freshness** | Material 2024-2025, aborda temas recentes de IA agents |

---

## 2. O QUE PRESTA PARA **FRONTEND/DX**
| Item | Localização | Tipo | Destino sugerido | Prioridade |
|------|------------|------|------------------|------------|
| CLAUDE.md system prompt patterns | `CLAUDE.md` | Template | `templates/claude/CLAUDE.frontend.md` | 🔴 Alta |
| Agent teams orchestration | `agent-teams/` | Pattern | `agents/turing/agent-orchestration.md` | 🟠 Média |
| Development workflows (planning → exec → review) | `development-workflows/` | Guideline | `agents/turing/ai-workflows.md` | 🔴 Alta |
| MCP config patterns | `.mcp.json` | Tool config | `templates/mcp/mcp.json` | 🟠 Média |
| Skill structure for reusable prompts | `best-practice/` | Template | `_consolidado/skills/` | 🟠 Média |
| Changelog-driven development | `changelog/` | Guideline | `agents/turing/changelog-driven.md` | 🟢 Baixa |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO
| Item | Localização | Motivo | Substituto moderno |
|------|-------------|--------|-------------------|
| Conteúdo genérico de prompt engineering | Vários | Saturado, evolui rápido | Manter apenas workflows testados localmente |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA
- [ ] **Frontend-specific AI prompts** (a11y review, perf audit, component gen) — Sugestão: criar prompts especializados
- [ ] **Design-to-code workflows** (Figma → React) — Sugestão: documentar pipeline
- [ ] **Visual regression com IA** — Sugestão: integrar Playwright + IA review

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Turing)
- [ ] **Criar Skill**: `ai-frontend-review` (a11y + perf + design) — Em `_consolidado/skills/ai-frontend-review/`
- [ ] **Criar Template**: `CLAUDE.frontend.md` — Em `templates/claude/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES
> `CLAUDE.md:1` — Padrão de system prompt com contexto de projeto, conventions e workflow
> `.mcp.json:1` — Config de MCP servers para ferramentas externas

---

## 7. SCORE DE VALOR DO REPO (Para Frontend/DX)
| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 3 | DX para IA-coding, não frontend direto |
| **Qualidade** | 4 | Bem organizado, workflows práticos |
| **Atualidade** | 5 | Temas 2025 (agents, MCP, skills) |
| **Ação** | 3 | Gera templates de prompts/skills |
| **Completude** | 3 | Não cobre UI/perf/a11y |
| **TOTAL** | **18/25** |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO
- [x] Salvar em `_consolidado/agents/turing/extractions/claude-code-best-practice.md`
- [ ] Prosseguir para `android-best-practices`