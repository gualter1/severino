# EXTRAÇÃO — react-boilerplate

## METADADOS
- **Repositório**: `react-boilerplate`
- **Lead**: `niamaia` | **Subagente**: `niamaia` | **Data**: `2026-10-08` | **Tempo**: `40min`

---

## 1. VISÃO GERAL
| Campo | Detalhe |
|-------|---------|
| Propósito | Offline-first foundation React altamente escalável, DX-first, performance-first |
| Público | React devs experientes, architects, product teams |
| Tamanho | app/ (containers/components), internals/ (webpack, generators, scripts), server/, docs/ |
| Tech | React 16.8, Redux, redux-saga, reselect, react-router, styled-components, react-intl, Jest, Webpack 4 |
| Freshness | v4.0.0 (2019-era); stack desatualizada (React 16, Webpack 4) mas arquitetura atemporal |

---

## 2. O QUE PRESTA PARA NIAMAIA

| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| Feature-first: containers/<Feature>/ (actions/constants/reducer/saga/selectors/index) | `app/containers/App, FeaturePage, HomePage/` | Pattern | `agents/niamaia/architecture-patterns.md` | 🔴 Alta |
| Redux + redux-saga (side effects isolados) + reselect (memoized selectors) + immutable via immer | `package.json:88-93` | Decision record | `agents/niamaia/tech-stack-decisions.md` | 🟠 Média |
| Unidirectional data flow + time-travel debugging | `README.md:61-62` | Pattern | `agents/niamaia/architecture-patterns.md` | 🟠 Média |
| Offline-first via `offline-plugin` + ServiceWorker + manifest | `package.json:143`, `README.md:76-77` | Pattern | `agents/niamaia/offline-first.md` | 🔴 Alta |
| Code splitting via dynamic import + babel-plugin-dynamic-import-node | `package.json:99`, devDeps | Pattern | `agents/niamaia/scalability.md` | 🟠 Média |
| i18n escalável via react-intl + extract-intl script | `package.json:19` | Tool config | `templates/react/i18n/` | 🟢 Baixa |
| Generators via plop (component/container/route/selector/saga + tests) | `package.json:32` | Template | `templates/react/generators/` | 🔴 Alta |
| SEO via react-helmet | `package.json:85` | Pattern | `agents/niamaia/seo-spa.md` | 🟢 Baixa |
| Styling co-locado: styled-components + stylelint | `package.json:93`, lint scripts | Decision record | `agents/niamaia/tech-stack-decisions.md` | 🟠 Média |
| Express server prod com compression (gzip) fora do Node app | `package.json:69` | Pattern | `agents/niamaia/scalability.md` | 🟢 Baixa |

---

## 3. LIXO / DESATUALIZADO
| Item | Motivo | Substituto |
|------|--------|------------|
| React 16.8 / Redux clássico boilerplate | Verboso; modern RTK/Zustand/Jotai | Redux Toolkit, Zustand, React Query |
| redux-saga para tudo | Overkill; complexidade | RTK Query, TanStack Query, Server Actions |
| Webpack 4 + babel 7 | Lento | Vite, Turbopack, Rspack |
| `offline-plugin` (arquivado) | Sem manutenção | Workbox, Serwist |
| connected-react-router 6 | Legado | TanStack Router, Next.js App Router |
| styled-components v4 | Runtime cost | CSS Modules, Tailwind, Panda, Vanilla Extract |
| componentWillMount-era patterns | Legacy lifecycle | Hooks + Suspense |

---

## 4. GAPS
- [ ] Micro-frontends (Module Federation) — ausente
- [ ] RSC / SSR / SSG strategy — SPA-only; sugerir `rsc-strategy.md`
- [ ] State colocation vs global store decision tree — sugerir ADR
- [ ] Edge rendering / CDN caching — ausente
- [ ] Design system boundaries (tokens → components) — ausente

---

## 5. AÇÕES
- [ ] CONSOLIDATED: feature-first containers pattern; saga/selectors boundaries; offline-first checklist
- [ ] ADR: `ADR-react-state` — RTK Query default, saga só para workflows complexos
- [ ] Template: plop generators modernizados (Vite + TS)
- [ ] Checklist: offline-first (SW, cache strategies, fallback UI)

---

## 6. CITAÇÕES
> `README.md:52-56` — "A highly scalable, offline-first foundation with the best DX and a focus on performance and best practices... Create components, containers, routes, selectors and sagas - and their tests - right from the CLI!"
> `README.md:61-62` — "Unidirectional data flow allows for change logging and time travel debugging."

---

## 7. SCORE
| Relevância 4 | Qualidade 4 | Atualidade 2 | Ação 3 | Completude 4 | **TOTAL 17/25 → Extrair seletivo** |

## 8. SALVO
- [x] `extractions/react-boilerplate.md`