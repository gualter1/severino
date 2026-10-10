# CONSOLIDATED.md — Turing (Frontend/DX)

**Data**: 2026-10-09  
**Lote**: Batch 1 (8 repos) + Batch 2 Wave 3 (+3 repos) = **11 repositórios analisados**  
**Objetivo**: Base de conhecimento frontend avançado, performance web, acessibilidade, design systems, DX tooling

---

## RESUMO DE EXTRAÇÕES

| Repositório | Score | Status | Principais Entregas |
|-------------|-------|--------|---------------------|
| **AionUi** | 24/25 | 🟢 Prioridade Máxima | Design System completo (UnoCSS tokens, Arco Design), Electron IPC type-safe, Justfile CI, Vitest/Playwright, i18n rigoroso, strict TS, architecture skills |
| **ui-ux-pro-max-skill** | 22/25 | 🟢 Prioridade Alta | Design tokens, component library, Storybook, a11y WCAG AA, responsive utils, Zod forms, CI GitHub Actions, Tailwind/UnoCSS config |
| **react-boilerplate** | 20/25 | 🟡 Modernizar | Webpack 5, React 18, Jest, ESLint/Prettier/Stylelint, Docker, HMR, bundle analyzer — **legacy tooling** (migrar p/ Vite+Vitest+UnoCSS) |
| **project-guidelines** | 18/25 | 🟡 Selecionar | Feature-based folder structure, component modularization, naming conventions — **atualizar p/ RSC/Next.js** |
| **claude-code-best-practice** | 18/25 | 🟡 Selecionar | CLAUDE.md patterns, agent teams, MCP config, AI workflows — **criar prompts frontend especializados** |
| **JavaScript** | 14/25 | 🟢 Extrair seletivo | Vitest config, Husky hooks, ES2024 patterns, debounce/throttle/memoize implementations — **não cobre UI** |
| **android-best-practices** | 14/25 | 🟢 Extrair seletivo | Mobile a11y (TalkBack), Compose state hoisting, ConstraintLayout perf, Material theming — **foco mobile, não web** |
| **ios-good-practices** | 14/25 | 🟢 Extrair seletivo | SwiftUI a11y (VoiceOver), Size classes, Design tokens (Assets.xcassets), SwiftUI state — **foco mobile, não web** |
| **mattpocock_skills** (Wave 3) | 18/25 | 🟢 Prioridade Alta | Deep-module enforcement (dependency-cruiser), Mocking-at-seams guideline, Good/Bad test patterns, Shoe-horn migration, CLI debug loop, DX dev scripts, npm scripts patterns |
| **obsidian-skills** (Wave 3) | 23/25 | 🟢 Prioridade Alta | SKILL.md template pattern, Obsidian CLI devtools (screenshot, DOM), Defuddle content cleaning, Knap template rendering |
| **superpowers** (Wave 3) | 24/25 | 🟢 Prioridade Máxima | Bootstrap-first architecture, Three-shape plugin integration model, Action vocabulary vs tool mapping, Zero-dependency plugin principle, Dual-compatible OpenCode plugin (V1+V2), Subagent-driven development, Skill lifecycle workflow, Eval architecture, Cross-platform hook wrapper |

---

## TEMPLATES / CHECKLISTS / SKILLS A CRIAR (Prioridade)

### 🔴 Críticos (Esta Semana)
1. **Template**: `vite-react-ts-unocss` — `templates/frontend/` (baseado em AionUi + ui-ux-pro-max-skill)
2. **Template**: `storybook-with-unocss` — `templates/storybook/`
3. **Checklist**: `frontend-project-bootstrap.md` — `checklists/turing/`
4. **Checklist**: `frontend-component-release.md` — `checklists/turing/`
5. **ADR**: `ADR-001: Migrate from Webpack to Vite` — `agents/turing/`
6. **ADR**: `ADR-002: Adopt UnoCSS as primary styling engine` — `agents/turing/`
7. **Skill**: `react-performance-profiling` — `_consolidado/skills/react-performance-profiling/`
8. **Skill**: `a11y-testing` — `_consolidado/skills/a11y-testing/`
9. **Skill**: `design-token-sync` (Figma) — `_consolidado/skills/design-token-sync/`

### 🟠 Importantes (Próximas 2 Semanas)
10. **Template**: `justfile/react-desktop.justfile` — `templates/justfile/`
11. **Runbook**: `bundle-optimization-runbook.md` — `runbooks/turing/`
12. **Runbook**: `electron-ipc-performance-runbook.md` — `runbooks/turing/`
13. **Runbook**: `a11y-ci-runbook.md` — `runbooks/turing/`
14. **Guideline**: `ts-strict-guidelines.md` — `agents/turing/`
15. **Guideline**: `i18n-guidelines.md` — `agents/turing/`
16. **Guideline**: `css-modules-guidelines.md` — `agents/turing/`
17. **Guideline**: `naming-conventions.md` — `agents/turing/`
18. **Guideline**: `frontend-folder-structure.md` — `agents/turing/`
19. **Skill**: `ai-frontend-review` (a11y + perf + design) — `_consolidado/skills/ai-frontend-review/`
20. **Skill**: `js-perf-patterns` (debounce, throttle, memoize) — `_consolidado/skills/js-perf-patterns/`

### 🟢 Opcionais / Futuro
21. **Template**: `CLAUDE.frontend.md` — `templates/claude/`
22. **Template**: `vitest + husky bootstrap` — `templates/testing/`
23. **Checklist**: `mobile-a11y-android.md` — `checklists/turing/`
24. **Checklist**: `mobile-a11y-ios.md` — `checklists/turing/`
25. **Guideline**: `compose-state-patterns.md` — `agents/turing/`
26. **Guideline**: `swiftui-state.md` — `agents/turing/`
27. **Guideline**: `mobile-responsive.md` — `agents/turing/`

### 🆕 Wave 3 — Novos Artefatos (Batch 2)
28. **Guideline**: `deep-modules.md` — `agents/turing/` (🔴 Alta, de mattpocock_skills)
29. **Guideline**: `mocking-guidelines.md` — `agents/turing/` (🔴 Alta, de mattpocock_skills)
30. **Guideline**: `testing-best-practices.md` — `agents/turing/` (🔴 Alta, de mattpocock_skills)
31. **Guideline**: `shoehorn-migration.md` — `agents/turing/` (🟠 Média, de mattpocock_skills)
32. **Runbook**: `cli-debug-loop.md` — `agents/turing/` (🟠 Média, de mattpocock_skills)
33. **Guideline**: `dev-scripts.md` + `npm-scripts.md` — `agents/turing/` (🟠/🟢, de mattpocock_skills)
34. **Template**: `SKILL.md` — `templates/skills/` (🔴 Alta, de obsidian-skills)
35. **Runbook**: `obsidian-devtools.md` (screenshot/DOM) — `agents/turing/devtools/` (🔴 Alta, de obsidian-skills)
36. **Skill**: `data-extraction` (Defuddle) — `_consolidado/skills/` (🟠 Média, de obsidian-skills)
37. **Guideline**: `template-engine.md` (Knap) — `agents/turing/dx/` (🟠 Média, de obsidian-skills)
38. **ADR**: `Three-Shape Plugin Integration Model` — `agents/turing/` (🔴 Alta, de superpowers, cross-ref Niamaia)
39. **ADR**: `Zero-Dependency Plugin Principle` — `agents/turing/` (🔴 Alta, de superpowers, cross-ref Niamaia)
40. **Pattern**: `action-vocab-vs-tool-mapping` — `agents/turing/` (🔴 Alta, de superpowers)
41. **Checklist**: `harness-port-acceptance.md` — `checklists/` (🔴 Alta, de superpowers)
42. **Pattern**: `subagent-driven-development` — `agents/turing/` (🔴 Alta, de superpowers)
43. **Pattern**: `eval-architecture.md` (wiring tests + Quorum behavior evals) — `agents/turing/` (🟠 Média, de superpowers)
44. **Template**: `implementation-plan.md` + `version-bump.json` + `cross-platform-hooks/run-hook.cmd` — `templates/` (de superpowers)

---

## DECISÕES TÉCNICAS CONSOLIDADAS (para ADRs)

| Tema | Decisão | Fonte |
|------|---------|-------|
| **Build Tool** | Vite 5+ / Turbopack (Next.js) — **NÃO Webpack** | react-boilerplate (legacy) vs AionUi (moderno) |
| **Styling** | UnoCSS utility-first + CSS Variables (semantic tokens) — **NÃO CSS Modules / styled-components** | AionUi, ui-ux-pro-max-skill |
| **Testing** | Vitest 2+ (unit) + Playwright (E2E + visual regression) — **NÃO Jest** | AionUi, ui-ux-pro-max-skill |
| **Type Safety** | TypeScript strict, `type` over `interface`, no `any`, path aliases | AionUi |
| **Package Manager** | pnpm + Turborepo (monorepo) / Bun (scripts) | AionUi |
| **CI** | GitHub Actions + `just push` pipeline (lint→format→typecheck→test→push) | AionUi |
| **Component Library** | Headless UI + Radix + Arco Design (desktop) / Material 3 (web) | AionUi, ui-ux-pro-max-skill |
| **State Management** | TanStack Query (server) + Zustand (client) — **NÃO Redux** | AionUi (store pattern), ui-ux-pro-max-skill |
| **Forms** | React Hook Form + Zod (shared schema) | ui-ux-pro-max-skill |
| **Accessibility** | WCAG 2.1 AA mandatory, axe-core in CI, focus-visible everywhere | ui-ux-pro-max-skill, AionUi, Android/iOS guides |
| **Internationalization** | Semantic keys, no hardcoded strings, next-intl / react-i18next | AionUi |
| **Design Tokens** | Centralized in UnoCSS config, exportable to Figma (JSON) | AionUi, ui-ux-pro-max-skill |
| **Performance Budgets** | Bundle < 150KB gzipped, LCP < 2.5s, CLS < 0.1 — enforced in CI | Gap identificado em todos |
| **Mobile Web / PWA** | Service Worker (Workbox), manifest, offline-first — **não coberto, gap** | Gap |
| **TypeScript Module Boundaries (Wave 3)** | Deep modules com entry-point único, proibição de barrels, `lint:boundaries` via dependency-cruiser | mattpocock_skills |
| **Testing Philosophy (Wave 3)** | Mocking-at-seams (DI + SDK-style), Integration-style tests, um assert lógico/teste, `fromPartial` no lugar de `as` | mattpocock_skills |
| **Plugin Architecture (Wave 3)** | Three-shape model (Shell-hook/In-process/Instructions-file), bootstrap-first injection, action vocab vs tool mapping, zero-dependency principle | superpowers |
| **Agent Workflow (Wave 3)** | Brainstorming → Worktrees → Plans → SDD → TDD → Review; Subagent-driven development (fresh subagent/task, ledger p/ compaction) | superpowers |
| **SKILL.md Standard (Wave 3)** | Metadata + doc pattern reusável; aceitação via auto-trigger de brainstorming | obsidian-skills, superpowers |
| **Dev CLI Debugging (Wave 3)** | CLI invocation, curl, Playwright/Puppeteer, screenshot/DOM inspection (`obsidian dev:screenshot`, `obsidian dev:dom`) | mattpocock_skills, obsidian-skills |
| **Eval Architecture (Wave 3)** | Plugin tests (wiring) + skill behavior evals (Quorum); separar engine→bootstrap→plugin→distribution→eval | superpowers |

---

## WAVE 3 — SEÇÕES DETALHADAS (Batch 2)

### W3.1 TypeScript Strict Patterns (mattpocock_skills, 18/25)

- **Deep-module enforcement**: cada package expõe entry-point único; `dependency-cruiser` rejeita imports fora do boundary; barrels proibidos para evitar acoplamento acidental.
- **Mocking-at-seams**: DI + interfaces SDK-style; nunca mockar código interno; testar via interface pública.
- **Good/Bad test patterns**: testes integration-style (via interface), um assert lógico por teste, evitar testes de implementação.
- **Shoe-horn migration**: substituir `as Type` por `fromPartial()`/`fromAny()` do `@total-typescript/shoehorn` para segurança de tipos em testes.
- **CLI feedback-loop**: diagnosticar bugs via scripts, curl, Playwright/Puppeteer ou `scripts/hitl-loop.template.sh`.
- **DX scripts**: `link-skills.sh`, `list-skills.sh`, `sync-plugin-version.mjs`; npm scripts package-manager agnostic (`changeset`, `version`, `check-plugin-version`).
- **Citações**: "Make every package a **deep module**… Entry‑point boundary… No barrels." · "Use dependency injection… Prefer SDK‑style interfaces…" · "Good Tests… Integration‑style… One logical assertion per test." · "Replace `as Type` with `fromPartial()`…" · "CLI invocation… Playwright / Puppeteer… HITL bash script."

### W3.2 DX Tooling & Devtools (obsidian-skills, 23/25)

- **SKILL.md standard**: estrutura metadata + doc em `skills/*/SKILL.md` — adotar como template em `templates/skills/SKILL.md`.
- **Obsidian CLI devtools**: `obsidian dev:screenshot path=…`, `obsidian dev:dom selector="…" text` — modelo para diagnóstico rápido de UI; criar runbook `obsidian-devtools.md`.
- **Defuddle**: limpeza de conteúdo para LLM (extração de dados web) → skill `data-extraction`.
- **Knap**: template rendering engine → guia `dx/template-engine.md`.
- **Gap Wave 3**: validação de SKILL.md via JSON schema; mapeamento de tokens Obsidian → componentes UI.

### W3.3 Plugin / Extension Architecture (superpowers, 24/25)

- **Bootstrap-first**: skill `using-superpowers` injetada no início de **toda** sessão, sem opt-in (`hooks/session-start`, tag `<EXTREMELY_IMPORTANT>`, dedup guard + child-session detection).
- **Three-shape integration model**: Shell-hook (A) / In-process (B) / Instructions-file (C) — base para ADRs de plugin architecture.
- **Action vocabulary vs tool mapping**: skills nomeiam ações ("invoke a skill"), nunca tools; mapping per-harness em `references/<harness>-tools.md`; proibido editar corpos de skill para compliance.
- **Zero-dependency principle**: nenhum runtime dep third-party; novo harness = único carve-out permitido.
- **Dual-compatible OpenCode plugin**: módulo único serve V1+V2 via named export + `default.setup`; bootstrap caching com Map + dedup.
- **Cross-platform hooks**: `run-hook.cmd` polyglot Windows/Unix; invocar scripts sempre via interpretador (`bash scripts/foo.sh`) pois packaging pode remover bits executáveis.
- **Distribuição**: marketplace, fork sync, git-URL, package manifest, local installer; installer deve declarar bootstrap como componente reconhecido, nunca editar config do usuário.
- **Citações**: "Three components: 1. Skills (harness-agnostic)… 2. Tool mapping (per-harness)… 3. Bootstrap (per-harness)…" · "Skills name actions, not tools. Do NOT edit skill bodies…" · "Everything ships through the harness's own install mechanism. Never edit the user's files."

### W3.4 Agent Workflow & Eval (superpowers, 24/25)

- **Skill lifecycle obrigatório**: brainstorming → worktrees → writing-plans → SDD/executing → TDD → code-review → finish.
- **Three-path brainstorming**: Spike / Bounded / Architectural com hard gates; aprovação de ideia ≠ aprovação de artefato.
- **Implementation plan template**: Goal/Architecture/Tech Stack/Spec/Global Constraints/Review Focus + tasks com interfaces exatas.
- **Subagent-driven development**: fresh subagent por task + review por task + review final do branch + ledger para sobrevivência a compaction.
- **Git worktree isolation**: detectar tool nativa primeiro, fallback para git worktree, verificar .gitignore, baseline tests.
- **Compaction-aware bootstrap**: re-injeção (Pi lifecycle flag, OpenCode per-step + dedup).
- **Eval**: testes de plugin (wiring) + evals de comportamento de skill (Quorum); modelo tierado (static gates no PR, live sweep nightly).
- **Citação**: "**Core principle:** Fresh subagent per task + task review (spec + quality) + broad final review = high quality, fast iteration"

---

## GAPS CRÍTICOS IDENTIFICADOS (O que NÃO existe mas PRECISA)

1. **Performance Budgets automatizados** — nenhum repo tem CI gate para LCP/CLS/bundle size
2. **Visual Regression Testing** — apenas ui-ux-pro-max-skill menciona Storybook, sem Chromatic/Playwright visual
3. **Design Token → Figma Sync** — AionUi + ui-ux-pro-max-skill têm tokens, mas sem pipeline de export
4. **Server Components / RSC Patterns** — nenhum repo cobre Next.js App Router ou React Server Components
5. **Edge/Streaming SSR** — ausente
6. **AI-assisted Frontend Review** — claude-code-best-practice tem workflows genéricos, falta prompts específicos (a11y, perf, design)
7. **Cross-platform Design System** — AionUi (Electron desktop), ui-ux-pro-max-skill (web), Android/iOS guias — sem unificação
8. **Bundle Analysis Automation** — react-boilerplate tem analyzer mas não budget enforcement

---

## PRÓXIMOS PASSOS IMEDIATOS

- [ ] Criar `CONSOLIDATED.md` para Turing (este arquivo)
- [ ] Iniciar **Template `vite-react-ts-unocss`** (base para todos novos projetos frontend)
- [ ] Abrir **ADR-001** e **ADR-002** para discussão com Niamaia/Trevor
- [ ] Criar **Skill `a11y-testing`** integrando axe-core + Playwright + CI
- [ ] Agendar sync com **Towards** (backend) para contratos de API (tRPC/OpenAPI) e shared Zod schemas
- [ ] Agendar sync com **Qualy** para estratégia de testes (unit → integration → e2e → visual)
- [ ] Documentar **Design Token Pipeline** (Figma → JSON → UnoCSS → Storybook)

---

## ARQUIVOS DE EXTRAÇÃO (Referência)

- `_consolidado/agents/turing/extractions/react-boilerplate.md`
- `_consolidado/agents/turing/extractions/AionUi.md`
- `_consolidado/agents/turing/extractions/ui-ux-pro-max-skill.md`
- `_consolidado/agents/turing/extractions/project-guidelines.md`
- `_consolidado/agents/turing/extractions/JavaScript.md`
- `_consolidado/agents/turing/extractions/claude-code-best-practice.md`
- `_consolidado/agents/turing/extractions/android-best-practices.md`
- `_consolidado/agents/turing/extractions/ios-good-practices.md`
- `_consolidado/agents/turing/extractions/mattpocock_skills.md` (Wave 3)
- `_consolidado/agents/turing/extractions/obsidian-skills.md` (Wave 3)
- `_consolidado/agents/niamaia/extractions/superpowers.md` (Wave 3)

---

*Gerado automaticamente pelo agente Turing (Batch 1 + Wave 3). Próxima atualização após criação dos templates/skills críticos.*