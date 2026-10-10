# EXTRACTION: ECC — `Repositorios/ECC/`

## METADADOS
- **Repositório**: `ECC`
- **Lead Responsável**: `guanabara`
- **Funcionário (Subagente)**: `guanabara` (Professor Particular)
- **Data**: `2026-10-09`
- **Tempo gasto**: `2h 30min`
- **Versão analisada**: `2.2.3` (2026-10-01)

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | *Agent Harness Operating System* — plugin production-ready que dá ao agent um sistema de engenharia coordenado: 68 agentes especializados, 293 skills, 94 comandos, hooks, rules, memory, continuous learning e AgentShield. Fluxo `plan -> test -> implement -> review -> verify -> remember -> improve`. |
| **Público-alvo** | AI engineers, full-stack devs, platform architects, tech leads que operam Claude Code / Codex / Cursor / OpenCode / Gemini / Zed |
| **Tamanho** | 48 dirs raiz, 293 skills, 68 agents, 94 commands, 14 MCP configs, 200+ scripts |
| **Linguagens/Tech** | TypeScript, JavaScript, Python, Shell, YAML, JSON, Markdown, Go/Java/Perl snippets |
| **Freshness** | 🔥 Muito ativo — release semanal, MIT, 7 harnesses suportados, docs em 13 línguas |

### Mapa dos 48 Diretórios — Categorização Didática

| Categoria Didática | Diretórios | O que ensina |
|--------------------|------------|--------------|
| **🧠 Cérebro — Orquestração & Agentes** | `agents/` (68), `.agents/`, `.claude/`, `.codex/`, `.pi/`, `pi/` | Delegação especialista, orquestração, handoff |
| **📚 Biblioteca — Skills (o ouro ensinável)** | `skills/` (293) | Workflows reutilizáveis com progressive disclosure |
| **🔌 Compatibilidade — Commands** | `commands/` (94), `legacy-command-shims/` | Por que skills-first > slash commands |
| **⚙️ Reflexos — Automação** | `hooks/`, `.claude-plugin/`, `.codex-plugin/` | Trigger-based automation (Pre/PostToolUse, Stop, PreCompact) |
| **📏 Regras — Padrões Always-loaded** | `rules/` (common + por linguagem), `.cursor/`, `.zed/`, `.gemini/`, `.opencode/`, `.qwen/`, `.hermes/`, `.openclaw/`, `.kimi/`, `.codebuddy/`, `.trae/`, `.kiro/` | Standards modulares, context budget |
| **💾 Memória — Persistência** | `contexts/`, `ecc2/`, `hooks/memory-persistence` | Session memory, vault, compaction |
| **🔗 Integrações — Mundo externo** | `mcp-configs/` (14), `integrations/`, `plugins/` | MCP economy, CLI vs MCP trade-off |
| **🏗️ Infra & Distribuição** | `scripts/` (50+), `manifests/`, `schemas/`, `docker/`, `workflows/`, `config/`, `.github/` | Instalação manifest-driven, doctor/repair/uninstall |
| **📖 Campus — Ensino** | `docs/`, `examples/`, `scaffolds/`, `assets/`, `.adal/` | Onboarding, longform/shortform guides |
| **🧪 Laboratório** | `tests/`, `src/` | TDD evidence loop, 80%+ coverage |

**Analogia-mãe:** ECC é uma **Oficina Mecânica Completa** — não um martelo solto. O agent sabe programar, mas ECC dá a oficina: bancada (context), caixa de ferramentas (skills), especialistas (agents), manual de normas (rules), e inspetor de qualidade (hooks + verification).

---

## 2. CONCEITOS ENSINÁVEIS (Tabela: conceito → analogia → complexidade → destino)

| # | Conceito | Analogia Guanabara | Complexidade | Destino em `_consolidado/` |
|---|----------|-------------------|--------------|----------------------------|
| 1 | **Agent Harness OS** (`README.md:128-137`) | 🏭 Oficina vs Martelo — "Seu agent sabe pregar prego, ECC é a oficina inteira" | ⭐⭐ | `analogies/agent-harness-os.md` |
| 2 | **Skills = Livro de Receitas com Abas** (`the-shortform-guide.md:13-34`) | 📖 Livro de receitas que só abre a aba que você precisa (progressive disclosure) | ⭐⭐ | `analogies/skills-cookbook.md` (expandir) |
| 3 | **Context Window = Mesa de Trabalho** (`the-longform-guide.md:39-86`) | 🗂️ Mesa que encolhe — MCPs são caixas que ocupam espaço mesmo fechadas | ⭐⭐⭐ | `analogies/context-budget-desk.md` |
| 4 | **Stop Hook vs UserPromptSubmit** (`the-longform-guide.md:99-103` + `continuous-learning-v2`) | 🧹 Faxina no fim do expediente vs fiscal seguindo cada passo | ⭐⭐⭐ | `tutorials/stop-hook-memory.md` |
| 5 | **Instincts Atômicos (0.3-0.9)** (`skills/continuous-learning-v2/SKILL.md:48-79`) | 🌱 Semente → muda → árvore (instinct → cluster → skill) | ⭐⭐⭐ | `analogies/instincts-seeds.md` |
| 6 | **Project-scoped vs Global Instincts** (`continuous-learning-v2:15-35`) | 🗣️ Sotaque local vs idioma universal — React fica no projeto React | ⭐⭐ | `decision-records/project-scoped-learning.md` |
| 7 | **Model Routing Haiku/Sonnet/Opus** (`skills/agentic-engineering/SKILL.md:33-38`) | 🚚 Moto / Van / Caminhão — não leva caminhão pra entregar envelope | ⭐⭐ | `learning-paths/model-routing.md` |
| 8 | **15-minute Unit Rule** (`agentic-engineering:27-31`) | 🍕 Fatias de pizza — cada fatia verificável sozinha | ⭐ | `guidelines/task-decomposition.md` |
| 9 | **TDD RED→GREEN→REFACTOR com Evidence** (`skills/tdd-workflow/SKILL.md:151-262`) | 🚦 Semáforo com foto — não basta dizer que passou, tem que provar | ⭐⭐⭐ | `runbooks/tdd-evidence-loop.md` |
| 10 | **Verification Loop 6 Fases** (`skills/verification-loop/SKILL.md`) | ✅ Checklist de piloto antes de decolar (build→types→lint→tests→security→diff) | ⭐⭐ | `checklists/verification-6phases.md` |
| 11 | **MCP Token Economy (~500 tokens/tool)** (`skills/context-budget/SKILL.md:42-44`) | 🧳 Bagagem despachada — cada MCP é uma mala que paga taxa mesmo vazia | ⭐⭐ | `guidelines/mcp-economy.md` |
| 12 | **Agent = Especialista com Crachá Limitado** (`AGENTS.md` — 68 agents) | 👨‍⚕️ Hospital — não pede pro cardiologista consertar encanamento | ⭐ | `analogies/agents-hospital.md` |
| 13 | **Hooks = Reflexos Involuntários** (`the-shortform-guide.md:36-73`) | 🦵 Reflexo do joelho — dispara sem pensar, 100% determinístico | ⭐⭐ | `analogies/hooks-reflexes.md` |
| 14 | **Skill Scout (search-before-create)** (`skills/skill-scout/SKILL.md`) | 🔍 Pesquisar na biblioteca antes de escrever livro novo | ⭐⭐ | `checklists/skill-scout.md` |
| 15 | **ADRs como Diário de Bordo** (`skills/architecture-decision-records/SKILL.md`) | 📓 Diário do capitão — por que viramos à esquerda na tempestade | ⭐⭐ | `templates/adr-template.md` |
| 16 | **Codebase Onboarding 4 Fases** (`skills/codebase-onboarding/SKILL.md`) | 🗺️ Reconhecimento → Mapa → Convenções → Guia (expedição) | ⭐⭐ | `tutorials/codebase-onboarding-expedition.md` |
| 17 | **Git Worktrees = Canteiros Isolados** (`the-longform-guide.md:190-215`) | 🏗️ Obras simultâneas sem dividir betoneira | ⭐⭐ | `analogies/worktrees-construction.md` (expandir) |
| 18 | **Pass@k vs Pass^k** (`the-longform-guide.md:160-171`) | 🎯 "Acertar 1 de 5" vs "Acertar 5 de 5" | ⭐⭐⭐ | `tutorials/eval-metrics.md` |

---

## 3. ONBOARDING MATERIALS (guias, tutoriais, glossários)

| Material | Fonte em ECC | Tipo | Reuso |
|----------|--------------|------|-------|
| **The Shortform Guide** (skills, hooks, subagents, MCPs, plugins) | `the-shortform-guide.md` | Tutorial onboarding Jr | Base para `onboarding/agent-ecosystem-101.md` |
| **The Longform Guide** (token economics, memory, verification, parallelization) | `the-longform-guide.md` | Tutorial Mid/Sr | Base para `onboarding/agent-ecosystem-201.md` |
| **The Security Guide** | `the-security-guide.md` | Compliance onboarding | `onboarding/security-baseline.md` |
| **Codebase Onboarding 4 fases** (Recon→Mapa→Convenção→Artefatos) | `skills/codebase-onboarding/SKILL.md:22-234` | Runbook onboarding | Template `templates/onboarding-guide.md` |
| **Install Matrix (6 harnesses)** | `README.md:229-418` | Quick-start | `onboarding/harness-matrix.md` |
| **Glossário ECC** (68 agents, 293 skills, hooks, rules, MCP, instincts) | `AGENTS.md` + `package.json:files` | Glossário | `glossary/agent-terms.md` |
| **COMMANDS-QUICK-REF** (94 comandos) | `COMMANDS-QUICK-REF.md` | Cheat-sheet | `cheatsheets/ecc-commands.md` |

**Exercício onboarding proposto:** *Dia 1 — instalar ECC minimal, rodar `/context-budget`, contar tokens. Dia 2 — criar 1 instinct project-scoped. Dia 3 — completar 1 ciclo TDD com evidence report.*

---

## 4. DECISION RECORDS DIDÁTICOS (Por que X, não Y)

| Decisão | Por que X | Por que NÃO Y | Onde ensinar |
|---------|-----------|---------------|--------------|
| **Skills-first, commands como shim** (`AGENTS.md: Workflow Surface Policy`) | Skills têm estrutura (SKILL.md + assets + codemaps), lazy-load, versionáveis | Commands são shims legados, poluem namespace, sem progressive disclosure | `decision-records/skills-over-commands.md` |
| **Stop hook para learning, não UserPromptSubmit** (`the-longform-guide.md:99` + `continuous-learning-v2:35-52`) | Stop: 1x por sessão, zero latência. Hooks 100% determinísticos vs skills 50-80% probabilísticos | UserPromptSubmit: latência em cada mensagem, custo | `decision-records/stop-hook-learning.md` |
| **Instincts atômicos + confidence scoring** (`continuous-learning-v2:48-79`) | Granular, compositional, evolui para skill/command/agent | Skills diretas: monolíticas, sem scoring, difícil promover | `decision-records/atomic-instincts.md` |
| **Project-scoped instincts (v2.1)** (`continuous-learning-v2:15-35`) | Evita contaminação cruzada (React ≠ Python), promoção controlada (2+ projetos + conf≥0.8) | Global puro: vazamento de convenções | `decision-records/project-scoped-learning.md` |
| **Model routing explícito (Haiku/Sonnet/Opus)** (`agentic-engineering:33-38` + `the-longform-guide.md:107-127`) | Custo/qualidade ótimo — 90% Sonnet, Haiku para busca, Opus para arquitetura | Tudo Opus: custo 10x; tudo Haiku: falha em reasoning | `decision-records/model-routing.md` |
| **MCP minimal (~500 tokens/tool)** (`the-shortform-guide.md:136-154` + `context-budget:42-44`) | CLI+skill replica 80% do valor com 5% do custo de contexto | 14 MCPs = 70k tokens queimados antes de começar | `decision-records/mcp-minimal.md` |
| **TDD evidence report obrigatório** (`tdd-workflow:226-262`) | Prova RED→GREEN preserva confiança após squash/compact | Só testes sem evidence: perde rastreabilidade | `decision-records/tdd-evidence.md` |
| **Manifest-driven install com doctor/repair** (`README.md:614-651` + `scripts/`) | Idempotência, ownership tracking, safe uninstall | Cópia manual: duplicação, conflitos, sem rollback | `decision-records/manifest-install.md` |

---

## 5. LEARNING PATHS (Junior → Mid → Senior em Agent Development)

### Trilha A — Agentic Engineer (baseada em ECC + awesome-llm-apps + dify)

| Nível | Foco | Skills ECC para estudar | Entregável |
|-------|------|------------------------|------------|
| **Jr (Semana 1-2)** | Vocabulário + operar | `the-shortform-guide` → `agentic-engineering` (15-min rule) → `search-first` → `skill-scout` | Instalar ECC minimal, rodar 1 skill, explicar analogia oficina |
| **Jr→Mid (Semana 3-4)** | Construir workflows | `tdd-workflow` (RED→GREEN) → `verification-loop` (6 fases) → `context-budget` → `codebase-onboarding` | 1 feature com TDD evidence + verification report |
| **Mid (Mês 2-3)** | Orquestrar agents | `team-agent-orchestration` → `orch-*` (add-feature/build-mvp) → `continuous-learning-v2` → `architecture-decision-records` | Orquestrar 3 agents em worktrees paralelos, 1 ADR |
| **Sr (Mês 4+)** | Projetar harness | `agent-harness-construction` → `autonomous-agent-harness` → `eval-harness` (pass@k vs pass^k) → `mcp-server-patterns` | Desenhar 1 harness novo, eval com deltas, publicar skill |

### Trilha B — Skill Craftsman (foco pedido do user: "muitos possíveis colaboradores, muita skill")

| Nível | Foco | Skills ECC para estudar |
|-------|------|------------------------|
| **Jr** | Consumir skills | `skill-scout` (search local→remote→vet→rank) → `skill-stocktake` (auditoria) → `agent-sort` |
| **Mid** | Criar skills | `tdd-workflow` (estrutura SKILL.md + frontmatter) → `continuous-learning-v2` (instinct→skill) → `rules-distill` |
| **Sr** | Governar skills | `skill-comply` (security validation) → `evolve` (cluster) → `promote` (project→global) → marketplace patterns |

---

## 6. ANTI-PATTERNS PARA ENSINAR (o que NÃO fazer + analogia)

| Anti-pattern | Analogia | Onde ECC avisa | Consequência ensinável |
|--------------|----------|----------------|------------------------|
| **God Agent (1 agent faz tudo)** | 🧑‍🍳 Chef que quer ser garçom, caixa e faxineiro | `AGENTS.md: Agent-First` + `the-longform-guide: model routing` | Context rot, custo 10x, falha em reasoning |
| **MCP Buffet (14 MCPs sempre ligados)** | 🍽️ Buffet que cobra por prato mesmo sem comer | `the-shortform-guide:136-148` + `context-budget:42-44` | 70k tokens queimados, 200k window → 70k úteis |
| **Command Sprawl (94 comandos sem skill)** | 🗝️ Molho de chaves sem etiquetar | `Workflow Surface Policy` + `skill-scout: Anti-Patterns` | Duplicação, sem progressive disclosure |
| **Mutação de estado** | ✏️ Rasurar contrato em vez de fazer aditivo | `AGENTS.md: Immutability` | Bugs de concorrência, impossível auditar |
| **Pular RED (escrever código sem teste falhando)** | 🏗️ Construir sem fundação e dizer "confia" | `tdd-workflow:151-178` (RED gate) | Sem prova de que teste testa algo |
| **Instinct Global para tudo** | 🧳 Levar roupa de neve pro deserto | `continuous-learning-v2:287-298` Scope Guide | Contaminação: convenção React vaza pra Python |
| **Worktree sem plano** | 🚧 Duas obras dividindo a mesma betoneira | `the-longform-guide:175-215` | Conflitos, overwrite, perda de trabalho |
| **CLAUDE.md de 500 linhas** | 📜 Manual que ninguém lê | `context-budget:96-98` + `codebase-onboarding: Anti-Patterns` | Tokens queimados a cada turno |
| **Instalar skill externa sem ler SKILL.md** | 📦 Abrir pacote desconhecido sem raio-X | `skill-scout: Step 4 - Vet` | RCE, exfiltração de secrets |

---

## 7. GAPS DE CONHECIMENTO (o que ECC não cobre mas deveria — lente ensino)

- [ ] **Gap 1 — Simulador Visual de Orquestração**: Falta diagrama interativo de handoff `planner → tdd-guide → code-reviewer → security-reviewer`. Sugestão: `tutorials/multi-agent-handoff-simulator.md` com mermaid + vídeo.
- [ ] **Gap 2 — Lab de Context Rot para Juniors**: Falta exercício prático "adicione 5 MCPs e veja o window encolher". Sugestão: `labs/context-rot-simulator.md` com `context-budget` antes/depois.
- [ ] **Gap 3 — Skill Security Hands-on**: `skill-comply` e `gateguard` existem mas sem tutorial de "como auditar skill maliciosa". Sugestão: `tutorials/skill-security-dojo.md`.
- [ ] **Gap 4 — Harness Comparison Didático**: Matrix Claude vs Codex vs Cursor vs OpenCode é técnica, não didática. Falta "qual harness para qual perfil de aluno". Sugestão: `onboarding/harness-chooser-quiz.md`.

---

## 8. TEMPLATES / CHECKLISTS / RUNBOOKS / SKILLS DIDÁTICOS (extrair para `_consolidado/`)

### Templates
- `templates/adr-template.md` ← `skills/architecture-decision-records/SKILL.md:24-69`
- `templates/onboarding-guide-template.md` ← `skills/codebase-onboarding/SKILL.md:114-169`
- `templates/tdd-evidence-report.md` ← `skills/tdd-workflow/SKILL.md:248-256`
- `templates/skill-SKILL-md.md` ← padrão `skills/*/SKILL.md` frontmatter (name, description, metadata.origin)

### Checklists
- `checklists/verification-6phases.md` ← `skills/verification-loop/SKILL.md:21-112` (build→types→lint→tests→security→diff)
- `checklists/skill-scout.md` ← `skills/skill-scout/SKILL.md:30-106` (capture→local→remote→vet→rank→decide)
- `checklists/context-budget-audit.md` ← `skills/context-budget/SKILL.md:22-152` (inventory→classify→detect→report)
- `checklists/codebase-recon.md` ← `skills/codebase-onboarding/SKILL.md:24-49` (6 checks paralelos)

### Runbooks
- `runbooks/tdd-evidence-loop.md` ← `skills/tdd-workflow/SKILL.md:86-262`
- `runbooks/continuous-learning-v2.md` ← `skills/continuous-learning-v2/SKILL.md:81-343`
- `runbooks/parallel-worktrees.md` ← `the-longform-guide.md:190-215`

### Skills (candidatas a `_consolidado/skills/`)
- `skills/agent-harness-101/` — Onboarding ao ecossistema ECC (curadoria Shortform+Longform)
- `skills/context-economy-dojo/` — Lab prático de context-budget + MCP minimal
- `skills/skill-craftsman/` — Criar skill do zero com scout→vet→rank→create

---

## 9. FONTES (deep links)

- `README.md:128-152` — O que é ECC + counts (68/293/94)
- `README.md:229-418` — Install matrix multi-harness
- `AGENTS.md` — 68 agents + orchestration + principles
- `SOUL.md` — 5 core principles + cross-harness vision
- `the-shortform-guide.md:13-183` — Skills, hooks, subagents, MCPs, plugins
- `the-longform-guide.md:39-248` — Context/memory, token optimization, verification, parallelization, groundwork
- `package.json` — Distribuição (293 skills listadas em `files[]`)
- `skills/agentic-engineering/SKILL.md` — Operating principles + model routing
- `skills/tdd-workflow/SKILL.md:86-583` — TDD completo com evidence
- `skills/continuous-learning-v2/SKILL.md` — Instincts atômicos, project-scoped v2.1
- `skills/context-budget/SKILL.md` — Auditoria de context window
- `skills/verification-loop/SKILL.md` — 6-phase verification
- `skills/skill-scout/SKILL.md` — Search-before-create + vet
- `skills/architecture-decision-records/SKILL.md` — ADR lifecycle
- `skills/codebase-onboarding/SKILL.md` — 4-phase onboarding
- `COMMANDS-QUICK-REF.md` — 94 commands

---

## 10. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto |
|------|-------------|--------|------------|
| `commands/` como surface primária | `commands/` (94) | Legacy shim, sem progressive disclosure | `skills/` |
| Copiar `hooks/hooks.json` cru para `settings.json` | `README.md:552-560` | Quebra `${CLAUDE_PLUGIN_ROOT}`, duplica execução | `install.sh` / `ecc install` manifest-driven |
| `scripts/sync-ecc-to-codex.sh` | `scripts/` | Deprecated, só compatibilidade | Native `codex plugin add ecc@ecc` |
| MCP over-subscription (>10 servers) | `the-shortform-guide:136-148` | 70k tokens overhead | CLI + skill wrapper |

---

## 11. SCORE DE VALOR DO REPO (lente Guanabara)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | É *o* repositório de agente ensinável — 293 skills, 68 agents, 48 dirs |
| **Qualidade** | 5 | Shortform + Longform + Security guides, SKILL.md exemplares, testes 80%+ |
| **Atualidade** | 5 | v2.2.3 (2026-10-01), 7 harnesses, weekly releases |
| **Ação** | 5 | Gera imediatamente analogias, learning paths, checklists, ADRs |
| **Completude** | 5 | End-to-end: install→skill→agent→hook→memory→eval→harness |
| **TOTAL** | **25/25** | **Priorizar extração completa** |

> Regra: <10 arquivar, 10-17 seletivo, >17 completa. **ECC = 25 — máximo.**

---

## 12. AÇÕES PROPOSTAS PARA O LEAD

- [ ] **Salvar esta extração** em `_consolidado/agents/guanabara/extractions/ECC.md`
- [ ] **Atualizar CONSOLIDATED.md**: adicionar ECC ao Scoreboard (25/25), expandir analogias (oficina, reflexos, sementes), adicionar Trilhas A+B, registrar 4 ADRs, fechar gaps de KMP/SwiftUI (parcialmente coberto por `skills/` multi-stack)
- [ ] **Criar `analogies/agent-harness-os.md`** (oficina), `analogies/hooks-reflexes.md`, `analogies/instincts-seeds.md`
- [ ] **Criar `tutorials/stop-hook-memory.md`** e `labs/context-rot-simulator.md`
- [ ] **Criar `checklists/skill-scout.md`** e `checklists/verification-6phases.md`

---

*Citações preservadas: `README.md:130-134` (plan→remember→improve), `the-longform-guide.md:99-103` (Stop vs UserPromptSubmit), `continuous-learning-v2:35-46` (tabela v1→v2).*

---

**Para o agente pai:** Copie o bloco acima para `_consolidado/agents/guanabara/extractions/ECC.md`. CONSOLIDATED.md deve ser atualizado em seguida (Batch 1 tinha 8 repos, ECC será o 9º com score 25).