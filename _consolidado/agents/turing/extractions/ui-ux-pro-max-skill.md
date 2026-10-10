# TEMPLATE DE EXTRAÇÃO — ui-ux-pro-max-skill (Lente Turing: Frontend/DX)

## METADADOS
- **Repositório**: `ui-ux-pro-max-skill`
- **Lead Responsável**: `turing`
- **Funcionário (Subagente)**: `Turing`
- **Data**: `2026-10-09`
- **Tempo gasto**: `0h 30min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | AI skill + CLI (`uipro`) que gera design system completo (pattern + style + colors + typography + effects + anti-patterns + pre-delivery checklist) a partir de reasoning engine com 192 regras por indústria, 79 estilos UI, 192 paletas, 74 pares tipográficos, 119 UX guidelines, 25 chart types, 22 stacks |
| **Público-alvo** | Frontend devs, AI coding agents (Claude/Cursor/Windsurf/Copilot/etc), design-system builders |
| **Tamanho** | Médio-grande: `cli/src/index.ts` + `cli/assets/skills/{design,design-system,ui-styling}` com references/*.md, templates/*.json, scripts Python (search.py BM25), data CSVs (styles, palettes, fonts), gallery Next.js, 21 platform templates |
| **Linguagens/Tech** | TypeScript (CLI installer), Python stdlib-only (search/reasoning engine), CSS Custom Properties + W3C DTCG JSON, Tailwind CSS, shadcn/ui + Radix, Markdown |
| **Freshness** | Alta: v2.13.0, semantic-release main/dev, `verify:data` offline gate + `refresh-catalogs.yml` semanal (Google Fonts 1934 approved + Phosphor 1512 upstream manifest), npm `ui-ux-pro-max-cli` ativo |

---

## 2. O QUE PRESTA PARA **TURING** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| 3-layer token architecture (primitive → semantic → component) + dark-mode só em semantic | `cli/assets/skills/design-system/references/token-architecture.md:5-135` | Pattern | `agents/turing/design-tokens/architecture.md` | 🔴 Alta |
| Primitive scales prontas: gray 50-950, blue, spacing 4px base, type/leading/tracking, radius, shadow, duration, z-index | `cli/assets/skills/design-system/references/primitive-tokens.md:10-203` | Code snippet | `agents/turing/design-tokens/primitives.css` | 🔴 Alta |
| Semantic aliases: background/foreground, card/popover, primary/secondary/muted/accent/destructive, status (success/warning/error/info), border/ring, spacing-component/section/page, font-heading/body/label, ring/opacity/transition | `cli/assets/skills/design-system/references/semantic-tokens.md:9-160` | Code snippet | `agents/turing/design-tokens/semantics.css` | 🔴 Alta |
| DTCG starter JSON (primitive/semantic/component/dark) — base para Style Dictionary / Tokens Studio | `cli/assets/skills/design-system/templates/design-tokens-starter.json:1-143` | Template | `agents/turing/templates/design-tokens-starter.json` | 🔴 Alta |
| Component specs tabela: Button (6 variants x 4 sizes x 6 states), Input, Card, Badge, Alert, Dialog (5 sizes), Table row heights | `cli/assets/skills/design-system/references/component-specs.md:5-236` | Guideline | `agents/turing/components/specs.md` | 🔴 Alta |
| State system: prioridade disabled>loading>active>focus>hover>default + transitions 150/200ms + focus-ring 2px+2px + ARIA snippets (aria-busy, aria-invalid+role=alert) | `cli/assets/skills/design-system/references/states-and-variants.md:18-241` | Pattern | `agents/turing/components/states-and-variants.md` | 🔴 Alta |
| shadcn/ui + RHF + Zod form pattern (zodResolver, FormField/FormMessage, aria-invalid/aria-describedby) | `cli/assets/skills/ui-styling/references/shadcn-components.md:43-80` | Code snippet | `agents/turing/forms/rhf-zod-shadcn.md` | 🔴 Alta |
| A11y completo Radix: focus-visible ring, skip-link, dialog focus-trap, menu/command keyboard map, sr-only, live regions (polite/assertive), form labels/errors, contrast AA/AAA, motion-reduce, checklist 14 itens + axe-core snippet | `cli/assets/skills/ui-styling/references/shadcn-accessibility.md:18-471` | Checklist | `agents/turing/a11y/shadcn-checklist.md` | 🔴 Alta |
| Resilient text/compact UI: heading balance é enhancement, reflow sem clip em zoom/spacing override, chips wrap ou +n disclosure, badge não só por cor, animação cancelável mantém estado semântico+focus | `README.md:199-216` | Guideline | `agents/turing/ux/resilient-text.md` | 🔴 Alta |
| Pre-delivery checklist v2.0: no emoji-as-icon (SVG Lucide/Heroicons), cursor-pointer, timing por plataforma, contraste 4.5:1 light, focus visível, prefers-reduced-motion, reflow chips/badges, responsive 375/768/1024/1440 | `README.md:118-128` | Checklist | `agents/turing/checklists/pre-delivery.md` | 🔴 Alta |
| Mobile-first Tailwind: breakpoints sm/md/lg/xl/2xl, max-* e range queries, container queries @container, custom @theme breakpoints, 2-3 breakpoints/elemento, testing checklist 320px→zoom+44px targets | `cli/assets/skills/ui-styling/references/tailwind-responsive.md:5-382` | Guideline | `agents/turing/styling/tailwind-responsive.md` | 🟠 Média |
| MASTER.md + pages/ overrides + hierarchical retrieval prompt (persist --persist -p) | `README.md:444-478` | Pattern | `agents/turing/dx/design-system-persist.md` | 🟠 Média |
| Reasoning engine pipeline: 5 parallel searches (product/style/color/landing-pattern/typography) → BM25 rank → decision-rules JSON → output Pattern+Style+Colors+Type+Effects+Anti-patterns | `README.md:137-164` | Pattern | `agents/turing/design-system/reasoning-pipeline.md` | 🟠 Média |
| Stack-aware search versionada (sem major = current; `Next.js 15`/`Svelte 4` = legacy rows, sem mix) | `README.md:438-442` | Guideline | `agents/turing/dx/version-aware-search.md` | 🟢 Baixa |
| CLI multi-platform install (`uipro init --ai {claude,cursor,windsurf,copilot,opencode,...all}` + --global/--dry-run/--offline) + template-based generation | `README.md:262-318`, `skill.json:20-42` | Tool config | `agents/turing/dx/uipro-cli.md` | 🟢 Baixa |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Pacote `uipro-cli` antigo | `README.md:296` | Nome stale, assets desatualizados | `ui-ux-pro-max-cli` + `uipro init --ai` |
| Upload ZIP repo cheio no Claude.ai (200-file limit) / symlinks pré-v2.5.1 | `README.md:667-693` | Checkout dev ≠ artefato de skill | Marketplace `/plugin install` ou CLI installer |
| `focus:outline-none` sem substituto | `cli/assets/skills/ui-styling/references/shadcn-accessibility.md:402-409` | Remove indicador keyboard | `focus-visible:ring-2` |
| `div onClick` sem semântica | `shadcn-accessibility.md:111-118` | Quebra SR + keyboard | `<button>`/`<nav>`/`<a>` nativos |
| Texto low-contrast `text-gray-400` | `shadcn-accessibility.md:367-374` | Falha WCAG AA | `text-muted-foreground` / gray-900 |
| `text-xl lg:text-base` (desktop-first) | `tailwind-responsive.md:279-284` | Inverte mobile-first | `text-base md:text-lg lg:text-xl` |
| 6 breakpoints por elemento | `tailwind-responsive.md:324-334` | Manutenção inviável | 2-3 breakpoints/elemento |
| Componente usar primitive direto (`--color-gray-50` no .card) | `semantic-tokens.md:193-206` | Quebra theming | Semantic `--color-card` |
| Flat tokens (`--button-primary-bg: #2563EB`) | `token-architecture.md:188-198` | Sem camada, sem dark-mode | 3-layer primitive→semantic→component |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] Gap 1: `Performance budgets por estilo` (glassmorphism blur/shadow custa LCP/INP; sem CLS budget) — Sugestão: criar `agents/turing/performance/style-budgets.md` com limites blur/shadow/animação por Core Web Vitals
- [ ] Gap 2: `React Server Components / Next.js App Router` (Suspense boundaries, Server Actions + Zod server, streaming SSR) — Sugestão: criar `agents/turing/react/rsc-forms.md` estendendo o pattern RHF+Zod atual (só client)
- [ ] Gap 3: `Testes visuais + a11y automatizados` (só checklist manual + axe dev; sem Playwright visual regression / Storybook interaction / Vitest) — Sugestão: criar `agents/turing/testing/a11y-visual.md` com @axe-core/playwright + chromatic
- [ ] Gap 4: `i18n/RTL + text-expansion` (cita locales no wrapping mas sem chaves externas, sem `:dir()`, sem testes de expansão 30%) — Sugestão: criar `agents/turing/ux/i18n-checklist.md`
- [ ] Gap 5: `Container Queries + UnoCSS mapping` (doc é Tailwind-only; ADR-005 é Vite+UnoCSS) — Sugestão: criar adapter `agents/turing/styling/unocss-tokens.md`

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: `3-layer tokens (DTCG+CSS), specs Button/Input/Card/Dialog/Table, state priority + focus-ring, RHF+Zod a11y, resilient-text, pre-delivery checklist, mobile-first Tailwind`
- [ ] **Criar Template**: `design-tokens-starter.json + primitives.css + semantics.css` — Em: `agents/turing/templates/` (copiar de `design-system/templates/` + references)
- [ ] **Criar Checklist**: `pre-delivery + shadcn-a11y-14-itens + tailwind-responsive-test` — Em: `agents/turing/checklists/`
- [ ] **Criar Runbook**: `design-system-persist-runbook (MASTER + overrides + retrieval prompt)` — Em: `agents/turing/runbooks/`
- [ ] **Criar ADR**: `ADR-XXX: Adotar 3-layer tokens (nunca primitive direto em componente; dark só em semantic)` — Para: `padronizar theming ADR-006 WCAG AA`
- [ ] **Criar Skill**: `ui-ux-design-intelligence` — Em: `_consolidado/skills/ui-ux-design-intelligence/`
- [ ] **Novo agente necessário**: N/A — cobertura Turing suficiente; só mapear cross-ref Towards (backend contracts) + Qualy (axe/Playwright)

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `token-architecture.md:8-17` — "Component Tokens --button-bg ... / Semantic Tokens --color-primary ... / Primitive Tokens --color-blue-600"

> `semantic-tokens.md:193-206` — "Good - uses semantic tokens .card { background: var(--color-card); } / Bad - uses primitive tokens directly"

> `states-and-variants.md:20-27` — "State Priority: 1. disabled 2. loading 3. active 4. focus 5. hover 6. default"

> `states-and-variants.md:54-58` — ".focusable:focus-visible { box-shadow: 0 0 0 var(--ring-offset) var(--color-background), 0 0 0 calc(...) var(--ring-color); }"

> `shadcn-accessibility.md:402-409` — "Don't remove focus styles: // Avoid focus:outline-none // Use focus-visible instead focus-visible:ring-2"

> `README.md:209-212` — "Chip and tag collections should wrap or use an operable `+n` disclosure... unavoidable truncation needs an accessible full-value path"

> `README.md:121-126` — "Interaction timing follows the platform... Light mode: text contrast 4.5:1 minimum / Focus states visible / prefers-reduced-motion respected"

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Core Turing: tokens, shadcn/Radix a11y, RHF+Zod, Tailwind mobile-first, resilient UI |
| **Qualidade** | 5 | Specs tabulares executáveis, CSS/DTCG copiáveis, checklist 14 itens + axe snippet, state machine definida |
| **Atualidade** | 5 | v2.13.0, Tailwind v4 @theme/container queries, Radix WAI-ARIA, version-aware search, refresh semanal Fonts/Phosphor |
| **Ação** | 5 | Templates + checklists + runbook geráveis HOJE sem adaptação |
| **Completude** | 4 | Falta só perf budgets, RSC/Server Actions, visual-regression, i18n — fora isso end-to-end |
| **TOTAL** | **24/25** | Priorizar extração completa |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/turing/extractions/ui-ux-pro-max-skill.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Template v1.0 — Atualize se precisar de campos extras para seu domínio.*
