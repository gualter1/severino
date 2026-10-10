# Vite + React + UnoCSS — Template Canônico (ADR-005)

Template canônico frontend: **Vite + React 18 + UnoCSS + TanStack Router + TanStack Query**.

## Stack Decisions (ADR-005)

| Decisão | Escolha | Por quê |
|---|---|---|
| Build tool | **Vite 5** | HMR instantâneo, ESM nativo, build Rollup otimizado |
| Styling | **UnoCSS** (preset-uno + attributify + icons) | Atomic CSS on-demand, bundle menor que Tailwind, shortcuts = design system |
| Routing | **TanStack Router** | Type-safe, file-based opcional, search params tipados |
| Server state | **TanStack Query v5** | Cache, retry, dedup, devtools |
| Forms | React Hook Form + Zod (adicionar por feature) | Validação client+server compartilhada |
| Testes unit | **Vitest + RTL** | Coverage 80/70 (ADR-008) |
| Testes E2E/a11y | **Playwright + axe-core** | WCAG 2.1 AA (ADR-006) |
| Docs UI | Storybook 8 | Component testing + visual regression |

## Cross-references

- **ADR-001**: feature-based structure (`src/features/<feature>/`)
- **ADR-005**: este template
- **ADR-006**: a11y (semantic HTML, ARIA, focus, contraste)
- **ADR-008**: coverage thresholds 80% lines / 70% branches
- **ADR-018**: warnings-as-errors (`--max-warnings 0`, `tsc` strict)

## Scripts

```bash
pnpm dev              # Vite dev server
pnpm build            # tsc + vite build
pnpm preview          # preview prod build
pnpm test             # vitest run + coverage
pnpm test:watch       # vitest watch
pnpm test:e2e         # playwright
pnpm lint             # eslint --max-warnings 0
pnpm typecheck        # tsc --noEmit
pnpm format           # prettier --write
```

## Estrutura

```
src/
├── app/              # App shell: main.tsx, App.tsx, routes.tsx, providers.tsx
├── components/ui/    # Design system primitives (button, input, card)
├── components/layout/# AppLayout, headers, nav
├── features/         # Feature-based modules (ADR-001)
├── hooks/            # Shared hooks
├── lib/              # api.ts (Query client), auth.ts, utils.ts (cn)
├── styles/           # global.css, theme.ts (tokens)
└── types/            # env.d.ts
```

## Extensões VS Code recomendadas

- `unocss.unocss-vscode` — IntelliSense attributify
- `dbaeumer.vscode-eslint`
- `esbenp.prettier-vscode`
- `ms-playwright.playwright`
- `vitest.explorer`

## Acessibilidade (ADR-006)

- HTML semântico (`<main>`, `<nav>`, `<button>`) — nunca `<div onClick>`
- `focus-visible` em todo interativo (ver `global.css`)
- Contraste AA via tokens (`theme.ts` — todos pares ≥ 4.5:1)
- E2E a11y com `@axe-core/playwright` em `e2e/a11y.spec.ts`
- `prefers-reduced-motion` respeitado no CSS global

## Performance

- Code-splitting por rota (`lazyRouteComponent` / `React.lazy`)
- UnoCSS gera só o CSS usado (zero-runtime)
- Imagens: `loading="lazy"`, `decoding="async"`, AVIF/WebP via `<picture>`
- Query `staleTime` + `gcTime` configurados em `lib/api.ts`

## i18n

Sem strings hardcoded — usar chaves externas (ex. `react-i18next`). Textos deste template são placeholders em `pt-BR` a serem extraídos.
