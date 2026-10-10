# EXTRAÇÃO — ui-ux-pro-max-skill

## METADADOS
- **Repositório**: `ui-ux-pro-max-skill`
- **Lead Responsável**: `towards`
- **Funcionário (Subagente)**: `towards-batch2-w4`
- **Data**: `2026-10-09`
- **Tempo gasto**: `0h 35min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | AI skill que provê design intelligence para UI/UX profissional cross-platform: gera design system completo (pattern + style + cores + tipografia + efeitos + anti-patterns + checklist) a partir de query em linguagem natural |
| **Público-alvo** | devs frontend/full-stack, AI agents (Claude Code, Cursor, Copilot, etc.), designers usando AI codegen |
| **Tamanho** | ~180+ arquivos; 82 `.md` (skills/references), `src/ui-ux-pro-max/data/` 17 CSV + 22 stacks CSV, `scripts/` 5 py + 13 testes, `cli/` TS installer + 21 platform templates, 5 READMEs i18n |
| **Linguagens/Tech** | Markdown (skill content), Python 3 stdlib-only (BM25 search + reasoning engine), TypeScript (CLI `uipro`), CSV (catalog: styles/colors/typography/ux-guidelines/products/landing), CSS/Tailwind + shadcn/ui snippets |
| **Freshness** | Alta — v2.13.0, semantic-release ativo (`main`=stable, `dev`=beta), workflow `refresh-catalogs.yml` semanal ( seg 03:17 UTC), journals em `docs/journals/260813-*` (web-stack freshness, accessibility refresh), offline CI gate `verify:data` |

---

## 2. O QUE PRESTA PARA **TOWARDS (backend/API + frontend consumível)** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Three-layer token architecture (Primitive → Semantic → Component) + naming `--{category}-{item}-{variant}-{state}` + file org | `cli/assets/skills/design-system/references/token-architecture.md:1-224` | Guideline | `agents/towards/design-tokens-architecture.md` | 🔴 Alta |
| Semantic tokens completos prontos p/ PR (bg/fg, primary/secondary/muted/accent/destructive/status, border/ring, spacing/typography semantics, dark-mode overrides) | `cli/assets/skills/design-system/references/semantic-tokens.md:1-215` | Code snippet | `agents/towards/snippets/semantic-tokens.css` | 🔴 Alta |
| Component specs tabela (Button 6 variants × 4 sizes × 6 states, Input/Card Badge Alert Dialog Table + anatomia ASCII + spacing) | `cli/assets/skills/design-system/references/component-specs.md:1-236` | Template | `agents/towards/component-specs-template.md` | 🔴 Alta |
| States & variants system: state priority (disabled>loading>active>focus>hover>default), transition durations, focus-ring spec 2px+2px, disabled/loading/error treatments, ARIA states | `cli/assets/skills/design-system/references/states-and-variants.md:1-241` | Guideline | `agents/towards/component-states-guideline.md` | 🔴 Alta |
| shadcn/Radix accessibility patterns: focus trap, skip-link, sr-only, live regions, form error `aria-invalid/describedby`, WCAG AA/AAA table, reduced-motion CSS, testing checklist 14 itens | `cli/assets/skills/ui-styling/references/shadcn-accessibility.md:1-471` | Checklist | `agents/towards/accessibility-checklist.md` | 🔴 Alta |
| Pre-delivery checklist (no-emoji-icons, cursor-pointer, transitions 150-300ms, contrast 4.5:1, focus visible, reduced-motion, responsive 375/768/1024/1440) — embutido no output do gerador | `src/ui-ux-pro-max/scripts/design_system.py:800-810` + `README.md:118-128` | Checklist | `agents/towards/pre-delivery-checklist.md` | 🔴 Alta |
| WCAG contrast engine em Python stdlib: `_relative_luminance`, `_contrast_ratio`, dark-mode resolution (`_resolve_color_mode`, `_select_palette_for_mode`, `_derive_dark_palette`, `_filter_anti_patterns_for_mode`) | `src/ui-ux-pro-max/scripts/design_system.py:101-280` | Code snippet | `agents/towards/snippets/wcag-contrast.py` | 🟠 Média |
| Design System Generator pipeline: product search → reasoning rules (192 rules) → multi-domain BM25 (product/style/color/landing/typography) → best-match select → ASCII/Markdown/MASTER.md | `src/ui-ux-pro-max/scripts/design_system.py:283-630` | Pattern | `agents/towards/design-system-generator-pattern.md` | 🟠 Média |
| MASTER + Overrides persistence pattern: `design-system/<slug>/MASTER.md` + `pages/<page>.md`, slugify anti-traversal `safe_slug`, atomic write via temp+`os.link`, `skipped_exists` sem overwrite silencioso | `src/ui-ux-pro-max/scripts/design_system.py:986-1098` | Pattern | `agents/towards/master-overrides-persistence.md` | 🟠 Média |
| Design dials 1-10 (variance/motion/density) como bias sem quebrar default — padrão de parametrização opcional | `src/ui-ux-pro-max/scripts/design_system.py:67-99` | Pattern | `agents/towards/optional-dials-pattern.md` | 🟢 Baixa |
| Resilient text layout rules: balanced wrapping = progressive enhancement, reflow sem clipping em zoom, chips wrap + `+n` disclosure, badge não só por cor, animação cancelável mantém estado semântico | `README.md:199-216` | Guideline | `agents/towards/resilient-text-guideline.md` | 🟠 Média |
| Tailwind responsive reference: mobile-first, breakpoints table, sidebar/card-grid/hero/nav layouts, container queries, custom `@theme` breakpoints, 2-3 breakpoints/element rule | `cli/assets/skills/ui-styling/references/tailwind-responsive.md:1-382` | Tutorial | `agents/towards/tailwind-responsive-reference.md` | 🟠 Média |
| Reasoning contract: 192 industry rules (Tech/Finance/Health/E-commerce/Services/Creative/Lifestyle/Emerging) cada uma com pattern + style priority + color/typo mood + effects + anti-patterns | `README.md:166-198` + `src/ui-ux-pro-max/scripts/reasoning_contract.py` | Decision record | `agents/towards/industry-reasoning-rules.md` | 🟢 Baixa |
| Version-aware stack search (22 stacks): query sem major retorna guidance atual; legacy explícito retorna só legacy rotulado; sem legacy = zero results em vez de misturar gerações | `README.md:438-442` | Guideline | `agents/towards/version-aware-search-guideline.md` | 🟢 Baixa |
| Offline-first CI gate: `verify:data`, snapshot hashes, count validation, fixtures em `scripts/tests/fixtures/catalogs/` | `README.md:547-554` + `src/ui-ux-pro-max/scripts/tests/test_data_contracts.py` | Tool config | `agents/towards/offline-data-gate.md` | 🟢 Baixa |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Premium upsell / brand/logo/CIP/banner paywall (`uupm.cc`) | `README.md:243-249` | Não extraível (closed-source), enviesa extração | Ignorar; usar só Basic open-source |
| Estilo “AI purple/pink gradients” citado como anti-pattern mas ainda presente em exemplos antigos/screenshots | `README.md:116` + `screenshots/` | Inconsistente com próprias regras | Seguir anti-pattern list do reasoning engine, não screenshots |
| CLI legado `uipro-cli` (pacote stale) | `README.md:296` | Nome antigo quebra installs | `ui-ux-pro-max-cli` + comando `uipro` |
| Symlink-based installs < v2.5.1 (falha marketplace “Zip contains symlink”) | `README.md:684-693` | Quebra instaladores | `>=v2.5.1` via CLI installer |
| Catalog counts hardcoded no README/badges (79 styles, 192 palettes) vs taxonomy real (50 active + 29 supplemental + 9 deprecated) | `README.md:191` vs `README.md:222-228` | Divergência confunde ranking | Fonte verdade: `src/ui-ux-pro-max/data/styles.csv` + `catalog-summary.json` |
| Truncamento de output human-readable em 300 chars | `README.md:708-714` | Perde tokens de cor/fonte em uso programático | Usar `--json` para consumo backend |
| Prompt-level `export CLAUDE_CODE_MAX_OUTPUT_TOKENS` como troubleshooting | `README.md:620-637` | Workaround de limite de modelo, não fix | Split em steps + escrita incremental em arquivos |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para Towards/UI-UX consumível no backend)

- [ ] Gap 1: **Contraste validado só no escuro-derivado** — `_derive_dark_palette` garante ring ≥3:1 mas palettes light não têm verificação automática de 4.5:1 texto normal — Sugestão: estender `_contrast_ratio` check p/ todos os pares `foreground/background` no `validate_data.py` e falhar CI se <4.5
- [ ] Gap 2: **Sem user-research / testes com usuários** — 119 UX guidelines + 192 reasoning rules são heurísticas sem evidência, sem protocolo de teste A/B ou entrevista — Sugestão: criar `agents/towards/user-research-protocol.md` (tarefas, métricas SUS/tempo-erro, n=5)
- [ ] Gap 3: **Tokens só em CSS vanilla, sem saída programática** — sem export JSON (Style Dictionary), Tailwind `@theme`, ou CSS-in-JS — Sugestão: gerador `tokens.json` a partir dos CSVs + integração `tailwind-integration.md` já existente
- [ ] Gap 4: **Sem i18n/RTL/l10n guidance** — resilient text cobre wrapping mas não `dir=rtl`, expansão de string (~30% DE/PT), formatação ICU — Sugestão: seção em `resilient-text-guideline.md`
- [ ] Gap 5: **Sem mapeamento WCAG 2.2 formal** (focus-appearance, dragging, target-size 24px) — checklist cobre AA genérico — Sugestão: `Compliance mapping` WCAG 2.2 → componentes shadcn

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: three-layer tokens + semantic CSS + states priority + a11y checklist + pre-delivery checklist + MASTER/overrides pattern
- [ ] **Criar Template**: `component-specs-template.md` — Em: `_consolidado/agents/towards/templates/`
- [ ] **Criar Checklist**: `accessibility-checklist.md` (14 itens shadcn + contraste + reduced-motion + zoom 200%) — Em: `_consolidado/agents/towards/checklists/`
- [ ] **Criar Checklist**: `pre-delivery-checklist.md` (8 itens do gerador) — Em: `_consolidado/agents/towards/checklists/`
- [ ] **Criar Skill**: `design-tokens-generator` (gera primitive/semantic/component + dark overrides a partir de paleta) — Em: `_consolidado/skills/design-tokens-generator/`
- [ ] **Criar ADR**: `ADR-tokens-three-layer-vs-flat` — Para: decidir adoção do three-layer como padrão Towards (vs flat atual)
- [ ] **Criar Runbook**: `master-overrides-persistence` (slugify + atomic write + skipped_exists) — Em: `_consolidado/agents/towards/runbooks/`
- [ ] **Novo agente necessário**: nenhum — Turing cobre DX/React em paralelo; só alinhar fronteira (Turing=componentes, Towards=tokens/a11y/persistência)

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `token-architecture.md:20-26` — “Primitive = Rarely change, Semantic = Theme switching, Component = Per-component needs.”

> `semantic-tokens.md:193-206` — “Good - uses semantic tokens (.card { background: var(--color-card) }); Bad - uses primitive tokens directly.”

> `states-and-variants.md:20-28` — “State priority: 1. disabled 2. loading 3. active 4. focus 5. hover 6. default”

> `shadcn-accessibility.md:402-409` — “Don't remove focus styles (focus:outline-none = Bad); Use focus-visible instead (Good).”

> `README.md:204-209` — “Balanced heading wrapping is a progressive enhancement, not a guarantee… Designs must still work with natural wrapping across widths, fonts, and locales.”

> `design_system.py:986-992` — “Only [a-z0-9_-] survives; every other character collapses… the slug can never leave its parent dir.”

---

## 7. SCORE DE VALOR DO REPO (Para Towards/UI-UX aplicável)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 4 | Tokens, a11y, states, specs e checklists são diretamente aplicáveis a PRs frontend de Towards; reasoning engine é inspiração backend |
| **Qualidade** | 5 | Snippets CSS/TSX copiáveis, tabelas de spec completas, engine Python legível com testes (data contracts, taxonomy, text-resilience) |
| **Atualidade** | 5 | v2.13.0 ativa, refresh semanal de catálogos, journals ago/2026, version-aware stacks |
| **Ação** | 5 | Gera 2 checklists + 1 template + 1 skill + 1 ADR imediatamente |
| **Completude** | 3 | Falta user-research, i18n/RTL, export programático de tokens, WCAG 2.2 formal |
| **TOTAL** | **22/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/towards/extractions/ui-ux-pro-max-skill.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Código pronto p/ PR (snippets-chave para consolidado):*

*1. `agents/towards/snippets/semantic-tokens.css` — copiar de `semantic-tokens.md` (bg/fg, primary/hover/active, status, border/ring, dark `.dark` overrides).*
*2. `agents/towards/snippets/wcag-contrast.py` — copiar `_relative_luminance` + `_contrast_ratio` + `_button_outline_text_color` de `design_system.py:129-280`.*
*3. `agents/towards/checklists/pre-delivery-checklist.md` — 8 itens de `design_system.py:800-810`.*
*Decisões técnicas: priorizado three-layer sobre flat (theme switch O(1) via `.dark`); `focus-visible` sobre `focus:outline-none`; MASTER+overrides com no-overwrite default p/ multi-agent safety. Testes sugeridos: contraste AA em todas as palettes light (happy: ≥4.5 pass; edge: muted-fg em card; error: ring em dark derivado), slug traversal (`../../etc` → `etc`), persist concorrente (2 writers → 1 FileExistsError), zoom 200% sem clipping, keyboard-only no dialog/dropdown. Arquivos lidos: README, skill.json, token-architecture, semantic-tokens, states-and-variants, component-specs, shadcn-accessibility, tailwind-responsive, design_system.py (parcial). TODO: ler `ux-guidelines.csv` + `tailwind-integration.md` + `primitive-tokens.md` na extração completa.*
