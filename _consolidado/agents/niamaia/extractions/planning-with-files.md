# METADADOS
- **Repositório**: `planning-with-files`
- **Lead Responsável**: `niamaia`
- **Funcionário (Subagente)**: `niamaia`
- **Data**: `2026-10-09`
- **Tempo gasto**: `0h 45min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Persistent file-based planning for AI coding agents and long-running tasks. Mantém `task_plan.md`, `findings.md` e `progress.md` em disco, re-injetados via hooks a cada turno para sobreviver a `/clear`, compactação e falhas. |
| **Público-alvo** | Desenvolvedores, engenheiros de IA, arquitetos que utilizam agentes de código autônomos (Claude Code, Codex, Pi, Hermes, OpenCode, etc.). |
| **Tamanho** | 1 repositório core, ~60+ scripts de automação/testes, suporte nativo a múltiplos IDEs/harnesses, documentação extensiva em `docs/`. |
| **Linguagens/Tech** | Shell script (POSIX / Bash), Python, PowerShell, Markdown, JSON. |
| **Freshness** | Ativamente mantido (v3.23.0+, centenas de testes automatizados pytest/shell). |

---

## 2. O QUE PRESTA PARA **ARQUITETURA DE SOFTWARE** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| **The 3-file pattern** (`task_plan.md`, `findings.md`, `progress.md`) | `README.md:80-97` | Pattern | `agents/niamaia/CONSOLIDATED.md` | 🔴 Alta |
| **Filesystem = Disk state, Context = RAM** | `README.md:83-87` | Guideline | `agents/niamaia/CONSOLIDATED.md` | 🔴 Alta |
| **Parallel task isolation** (`.planning/YYYY-MM-DD-slug/` + `.active_plan`) | `README.md:98` | Pattern | `agents/niamaia/CONSOLIDATED.md` | 🔴 Alta |
| **Attestation & Tamper Defense** (SHA-256 hash anchoring `task_plan.md`) | `SKILL.md:470-476` | Guideline | `agents/niamaia/CONSOLIDATED.md` | 🟠 Média |
| **Autonomous & Gated Modes** (Ledder summary, completion oracle, guardrails) | `SKILL.md:365-440` | Pattern | `agents/niamaia/CONSOLIDATED.md` | 🟠 Média |
| **Orchestrator owns plan, workers report via ledger** | `SKILL.md:85` | Guideline | `agents/niamaia/CONSOLIDATED.md` | 🔴 Alta |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO
| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| `TodoWrite` interno de IDEs voláteis | `README.md:73` | Perde estado após `/clear` ou compactação de contexto | `planning-with-files` (disco persistente) |
| Edição direta por subagentes no plano compartilhado | `AGENTS.md` | Cria conflitos de concorrência e sobrescrita silenciosa | Orquestrador dono do plano + ledgers isolados por worker |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)
- [ ] Gap 1: Sincronização multi-repositório de planos hierárquicos — Sugestão: Extensão para arquiteturas monorepo com dependências cruzadas de specs.
- [ ] Gap 2: Integração nativa com ferramentas de diagramação como Archify — Sugestão: Vincular fases do `task_plan.md` diretamente a diagramas de arquitetura versionados.

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)
- [ ] **Criar/Atualizar CONSOLIDATED.md** com: Padrões de file-based planning, isolamento de tarefas paralelas e contratos de ledger.
- [ ] **Criar ADR**: `ADR-007: Agent Orchestration Protocol (3-file + attestation)` — Para formalizar a adoção do padrão de planejamento baseado em arquivos persistentes em disco.
- [ ] **Criar Template**: `Multi-Agent Plan Isolation` — Padronizar estrutura de pastas `.planning/` e contratos de escrita.

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)
> "Context Window = RAM (volatile, limited)
> Filesystem = Disk (persistent, unlimited)
> → Anything important gets written to disk."
> — `README.md:83-87`

> "Markdown is my 'working memory' on disk. Since I process information iteratively and my active context has limits, Markdown files serve as scratch pads for notes, checkpoints for progress, building blocks for final deliverables."
> — Manus AI / `README.md:100-103`

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)
| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Essencial para arquitetura de agentes e spec-driven development. |
| **Qualidade** | 5 | Extremamente robusto, com testes extensivos e suporte a múltiplos hosts. |
| **Atualidade** | 5 | Aborda problemas modernos de perda de contexto e janelas de contexto limitadas. |
| **Ação** | 5 | Fornece padrões claros, scripts prontos e mecanismos de attestation. |
| **Completude** | 5 | Cobre end-to-end desde o ciclo de vida do plano até o travamento por hash e modo gated. |
| **TOTAL** | **25/25** | |

> **Regra**: Score 25/25 = "Priorizar extração completa".

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO
- [ ] Salvar este arquivo em `_consolidado/agents/niamaia/extractions/planning-with-files.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Concluir batch de extrações arquiteturais
