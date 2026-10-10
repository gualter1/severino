# TEMPLATE DE EXTRAÇÃO — Para Funcionários (Subagentes)

**Use este template para cada repositório que analisar.**
Salve em: `_consolidado/agents/{seu_lead}/extractions/{nome-do-repo}.md`

---

## METADADOS
- **Repositório**: `superpowers`
- **Lead Responsável**: `niamaia`
- **Funcionário (Subagente)**: `niamaia`
- **Data**: `2026-10-09`
- **Tempo gasto**: `2h 30min`

---

## 1. VISÃO GERAL DO REPO

| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Software development methodology completo para coding agents, built on composable skills + initial instructions that ensure agents use them automatically |
| **Público-alvo** | Coding agent users (Claude Code, Codex, Cursor, OpenCode, Pi, Gemini, etc.), plugin developers, architects de sistemas de agent workflow |
| **Tamanho** | ~15 skills, 14 harness integrations, 17 test dirs, ~400 files. Skills: 14 core. Harness plugins: 14 (Claude Code, Codex App/CLI, Cursor, Devin, Factory Droid, Gemini, Copilot, Grok, Kimi, OpenCode, Pi, Qwen, Hermes, Muse) |
| **Linguagens/Tech** | TypeScript/JavaScript (plugin entrypoints), Bash (hooks/scripts), Markdown (skills), YAML (manifests), Python (evals) |
| **Freshness** | v6.4.2 (2026). Active development. 94% PR rejection rate = high quality bar. Multiple recent harness additions (Kimi, Hermes, Muse, Pi). |

---

## 2. O QUE PRESTA PARA **NIAMAIA** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| **Bootstrap-first architecture** — `using-superpowers` skill injected at session start, every session, no opt-in | `hooks/session-start:1-53`, `docs/porting-to-a-new-harness.md:49-55` | Pattern | `agents/niamaia/architecture-patterns.md` | 🔴 Alta |
| **Three-shape plugin integration model** (Shell-hook / In-process / Instructions-file) | `docs/porting-to-a-new-harness.md:209-298` | Pattern | `agents/niamaia/plugin-architecture.md` | 🔴 Alta |
| **Action vocabulary vs tool mapping separation** — skills name actions ("invoke a skill"), not tools; per-harness mapping in `references/<harness>-tools.md` | `docs/porting-to-a-new-harness.md:59-63`, `docs/porting-to-a-new-harness.md:456-508` | Pattern | `agents/niamaia/extensibility-patterns.md` | 🔴 Alta |
| **Zero-dependency plugin principle** — no third-party runtime deps; new harness = carve-out only | `docs/porting-to-a-new-harness.md:784-787`, `package.json:5-14` | Guideline | `agents/niamaia/architecture-guidelines.md` | 🔴 Alta |
| **Dual-compatible OpenCode plugin (V1 + V2)** — single module serves both via named export + default.setup | `.opencode/plugins/superpowers.js:6-16, 219-382` | Code snippet | `agents/niamaia/plugin-architecture.md` | 🔴 Alta |
| **Bootstrap caching with dedup guard** — module-level Map cache, `<EXTREMELY_IMPORTANT>` tag check, child-session detection via parentID | `.opencode/plugins/superpowers.js:109-141, 156-210` | Code snippet | `agents/niamaia/performance-patterns.md` | 🟠 Média |
| **Cross-platform polyglot hook wrapper** — `run-hook.cmd` works on Windows (batch) + Unix (bash) | `hooks/run-hook.cmd:1-46` | Code snippet | `templates/cross-platform-hooks/run-hook.cmd` | 🟠 Média |
| **Subagent-driven development pattern** — fresh subagent per task + per-task review + whole-branch review + ledger for compaction survival | `skills/subagent-driven-development/SKILL.md:1-568` | Pattern | `agents/niamaia/subagent-patterns.md` | 🔴 Alta |
| **Skill lifecycle: mandatory workflow steps** — brainstorming → worktrees → writing-plans → SDD/executing → TDD → code-review → finish | `README.md:307-323`, `skills/brainstorming/SKILL.md:140-182` | Pattern | `agents/niamaia/workflow-patterns.md` | 🔴 Alta |
| **Three-path brainstorming classification** (Spike / Bounded / Architectural) with hard gates | `skills/brainstorming/SKILL.md:58-89` | Pattern | `agents/niamaia/decision-patterns.md` | 🔴 Alta |
| **Implementation plan template** — header with Goal/Architecture/Tech Stack/Spec/Global Constraints/Review Focus + task structure with exact interfaces | `skills/writing-plans/SKILL.md:52-138` | Template | `templates/implementation-plan.md` | 🔴 Alta |
| **Git worktree isolation pattern** — detect native tool first, fallback to git worktree, verify .gitignore, auto-setup, baseline tests | `skills/using-git-worktrees/SKILL.md:16-140` | Pattern | `agents/niamaia/workspace-isolation.md` | 🟠 Média |
| **Compaction-aware bootstrap re-injection** — pi lifecycle flag + agent_end reset; OpenCode per-step re-injection + dedup | `docs/porting-to-a-new-harness.md:430-434`, `.opencode/plugins/superpowers.js:156-210` | Pattern | `agents/niamaia/context-management.md` | 🟠 Média |
| **Eval architecture: plugin tests + skill behavior evals** — `tests/` for wiring, `evals/` (Quorum) for LLM behavior | `docs/testing.md:1-36` | Pattern | `agents/niamaia/eval-architecture.md` | 🟠 Média |
| **Distribution channel taxonomy** — marketplace, fork sync, git-URL, package manifest, local installer | `docs/porting-to-a-new-harness.md:675-749` | Guideline | `agents/niamaia/distribution-patterns.md` | 🟢 Baixa |
| **Installer must declare bootstrap as recognized component** — contextFileName field or skill surfacing; never edit user config | `docs/porting-to-a-new-harness.md:685-712` | Guideline | `agents/niamaia/plugin-security.md` | 🔴 Alta |
| **Script invocation through interpreter** — `bash scripts/foo.sh` survives packaging mode loss (Codex 0644, MiniMax 600) | `docs/porting-to-a-new-harness.md:714-725` | Anti-pattern | `agents/niamaia/anti-patterns.md` | 🟠 Média |
| **Version bump tracking** — `.version-bump.json` + `scripts/bump-version.sh` keeps all manifests in lockstep | `docs/porting-to-a-new-harness.md:736-742`, `README.md:299-305` | Template | `templates/version-bump.json` | 🟢 Baixa |
| **Skill content as behavior-shaping code** — not prose; rewording for "compliance" rejected without eval evidence | `AGENTS.md:73-78`, `docs/porting-to-a-new-harness.md:61-63` | Guideline | `agents/niamaia/skill-design-guidelines.md` | 🔴 Alta |
| **Hard requirement: automatic session-start injection** — no per-session opt-in; acceptance test = "Let's make a react todo list" auto-triggers brainstorming | `docs/porting-to-a-new-harness.md:86-106`, `docs/porting-to-a-new-harness.md:144-149` | Checklist | `checklists/harness-port-acceptance.md` | 🔴 Alta |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| **Editing skill bodies for harness compliance** | `docs/porting-to-a-new-harness.md:59-63` | Violates "skills name actions, not tools" invariant; rewording rejected | Add tool mapping in `references/<harness>-tools.md` |
| **Manual config edits** (`~/.gemini/config/AGENTS.md`, `settings.json`, etc.) | `docs/porting-to-a-new-harness.md:69-73` | Violates "everything ships through harness install mechanism" | Ship via plugin/extension manifest |
| **System message injection for bootstrap** | `docs/porting-to-a-new-harness.md:419-421` | Token bloat (#750), breaks Qwen/other models (#894) | Inject as user message |
| **Assuming parent harness behavior transfers** | `docs/porting-to-a-new-harness.md:202-205` | Fork may not honor parent's manifest fields/@-include | Verify with unique-marker test |
| **`git worktree add` when native tool exists** | `skills/using-git-worktrees/SKILL.md:55-57` | Creates phantom state harness can't manage | Use native tool (EnterWorktree, WorktreeCreate, etc.) |
| **Bare script invocations without interpreter** | `docs/porting-to-a-new-harness.md:720-723` | Packaging strips executable bits → Permission denied | Always prefix with `bash`, `node`, etc. |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para arquitetura)

- [ ] **Gap 1**: **ADR template for plugin architecture decisions** — O repo tem decisões arquiteturais implícitas (3 shapes, zero-deps, action vocab) mas não ADRs formais. Sugestão: Criar `ADR-001: Three-Shape Plugin Integration Model`, `ADR-002: Zero-Dependency Principle`, `ADR-003: Action Vocabulary vs Tool Mapping Separation`.
- [ ] **Gap 2**: **Capacity planning for eval pipeline** — Quorum scenarios are slow (3-30+ min), no cost/projection model. Sugestão: Documentar tiered model (static gates PR, live sweep nightly) com projeções de custo por harness.
- [ ] **Gap 3**: **Plugin versioning strategy across harnesses** — `.version-bump.json` tracks manifests mas não há política de semver cross-harness (breaking change = major?). Sugestão: Definir versioning policy + compat matrix.
- [ ] **Gap 4**: **Observability hooks for plugin internals** — No structured logging/metrics from plugin bootstrap/skill registration. Sugestão: Add OpenTelemetry hooks em plugin entrypoints.
- [ ] **Gap 5**: **Formal threat model for plugin supply chain** — Installs from git URLs, marketplace forks, external installers. Sugestão: STRIDE model for plugin distribution chain.

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Niamaia)

- [ ] **Criar ADR**: `ADR-001: Three-Shape Plugin Integration Model` — Para: Decisão irrevogável de como novos harnesses se integram (Shell-hook A / In-process B / Instructions-file C)
- [ ] **Criar ADR**: `ADR-002: Zero-Dependency Plugin Principle` — Para: Nenhuma dependência runtime third-party; new harness é único carve-out permitido
- [ ] **Criar ADR**: `ADR-003: Action Vocabulary vs Tool Mapping Separation` — Para: Skills nunca nomeiam tools; mapping per-harness em references/
- [ ] **Criar Template**: `implementation-plan.md` — Em: `templates/` — Baseado em `skills/writing-plans/SKILL.md:52-138`
- [ ] **Criar Template**: `cross-platform-hooks/run-hook.cmd` — Em: `templates/` — Polyglot Windows/Unix wrapper
- [ ] **Criar Template**: `version-bump.json` — Em: `templates/` — Tracking de versões multi-manifesto
- [ ] **Criar Checklist**: `harness-port-acceptance.md` — Em: `checklists/` — Aceitação: bootstrap loads + tool mapping + skill invocation + "Let's make a react todo list" triggers brainstorming
- [ ] **Criar Pattern Doc**: `plugin-architecture.md` — Em: `agents/niamaia/` — Consolidar 3 shapes, dual-compat OpenCode, distribution channels
- [ ] **Criar Pattern Doc**: `extensibility-patterns.md` — Em: `agents/niamaia/` — Action vocab, tool mapping, skill discovery, bootstrap injection
- [ ] **Criar Pattern Doc**: `subagent-patterns.md` — Em: `agents/niamaia/` — Fresh subagent per task, ledger for compaction, model selection tiers
- [ ] **Criar Pattern Doc**: `workflow-patterns.md` — Em: `agents/niamaia/` — Mandatory skill pipeline, three-path brainstorming, plan template
- [ ] **Criar Anti-pattern Doc**: `anti-patterns.md` — Em: `agents/niamaia/` — System msg injection, manual config edits, skill body edits, bare script invocations

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `docs/porting-to-a-new-harness.md:33-35`: "Three components: 1. Skills (harness-agnostic) — shared verbatim by every harness. 2. Tool mapping (per-harness) — action vocabulary translated into real tool names. 3. Bootstrap (per-harness) — at session start, the full using-superpowers skill is injected into the model's context, wrapped in `<EXTREMELY_IMPORTANT>` tags."

> `docs/porting-to-a-new-harness.md:59-63`: "Skills name actions, not tools. Do NOT edit skill bodies to fit your harness. Porting adds a tool-mapping reference and a bootstrap injector; it never reaches into skills/*/SKILL.md to swap tool names."

> `docs/porting-to-a-new-harness.md:65-73`: "Everything ships through the harness's own install mechanism. Never edit the user's files. The bootstrap, the skills, and the tool mapping all get delivered as part of what the harness installs."

> `hooks/session-start:27-31`: "session_context=\"<EXTREMELY_IMPORTANT>\\nYou have superpowers.\\n\\n**Below is the full content of your 'superpowers:using-superpowers' skill... For all other skills, use the 'Skill' tool:**\""

> `.opencode/plugins/superpowers.js:130-138`: "`_bootstrapCache.set(toolMapping, \`<EXTREMELY_IMPORTANT>\\nYou have superpowers.\\n\\n**IMPORTANT: The using-superpowers skill content is included below. It is ALREADY LOADED - you are currently following it. Do NOT use the skill tool to load \"using-superpowers\" again - that would be redundant.**\\n\\n${content}\\n\\n${toolMapping}\\n</EXTREMELY_IMPORTANT>\`);"`

> `docs/porting-to-a-new-harness.md:144-149`: "The acceptance test passes. In a clean session, the user message: 'Let's make a react todo list' auto-triggers the brainstorming skill BEFORE any code is written."

> `skills/subagent-driven-development/SKILL.md:12-13`: "**Core principle:** Fresh subagent per task + task review (spec + quality) + broad final review = high quality, fast iteration"

> `skills/writing-plans/SKILL.md:10-11`: "Write implementation plans for an engineer who has not seen this codebase or this spec. Assume they write idiomatic code... What they cannot know is what you decided: which files, which names and signatures, which values from the spec, which tests prove each task."

> `skills/brainstorming/SKILL.md:38-56`: "<HARD-GATE> Before taking any implementation action... complete the selected path's prerequisites... A reply approves the stage actually presented. Approval of an idea or feature scope does not approve artifacts that do not exist yet."

> `docs/porting-to-a-new-harness.md:714-725`: "Packagers can strip executable bits — skill prose invokes bundled scripts through their interpreter... So every script invocation in skills/**/*.md is spelled through its interpreter — `bash scripts/start-server.sh`..."

---

## 7. SCORE DE VALOR DO REPO (Para arquitetura)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Arquitetura de plugin system, extensibilidade multi-harness, bootstrap injection, skill-driven workflows — core para Niamaia |
| **Qualidade** | 5 | Código production-grade, edge cases handled (Windows polyglot, compaction, child sessions), testado em 14 harnesses |
| **Atualidade** | 5 | v6.4.2 (2026), active development, novas integrações recentes (Kimi, Hermes, Muse, Pi) |
| **Ação** | 5 | Gera ADRs, templates, patterns, checklists usáveis AGORA para qualquer sistema de plugin/agent |
| **Completude** | 4 | Cobre engine→bootstrap→plugin→distribution→eval end-to-end; gap: ADRs formais, observabilidade, threat model |
| **TOTAL** | **24/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/niamaia/extractions/superpowers.md`
- [ ] Avisar Lead (Niamaia) que a extração está pronta
- [ ] Iniciar criação dos ADRs prioritários (001, 002, 003)
- [ ] Mover para próximo repo na fila

---

*Template v1.0 — Atualize se precisar de campos extras para seu domínio.*