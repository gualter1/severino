# TEMPLATE DE EXTRAÇÃO — Para Funcionários (Subagentes)

**Use este template para cada repositório que analisar.**
Salve em: `_consolidado/agents/{seu_lead}/extractions/{nome-do-repo}.md`

---

## METADADOS
- **Repositório**: `react-boilerplate`
- **Lead Responsável**: `trevor`
- **Funcionário (Subagente)**: `trevor`
- **Data**: `2026-10-08`
- **Tempo gasto**: `0h 50min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | React boilerplate escalável, offline-first, foco em DX, performance, best practices — webpack, jest, express, i18n, redux-saga |
| **Público-alvo** | Frontend devs, tech leads, DevOps |
| **Tamanho** | README 169 linhas + `internals/` (webpack, scripts, generators), `server/` (express), `docs/` (css, js, maintenance, testing), `app/` (nginx.conf, .htaccess) |
| **Linguagens/Tech** | JS (React 16, Redux, Saga, Reselect, Styled Components), Webpack 4, Babel, Jest, ESLint, Prettier, Stylelint, Travis/Appveyor |
| **Freshness** | Antigo (v4.0.0, React 16, IE10 browserslist, Travis/Appveyor em vez de GHA) mas patterns atemporais |

---

## 2. O QUE PRESTA PARA **DEVOPS/PLATFORM** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| **Travis CI**: matrix Node (node + lts), xvfb, cache, coveralls | `.travis.yml:1-25` | Template | `templates/travis/travis.yml.react` + `agents/trevor/ci-cd/travis-to-gha-migration.md` | 🟠 Média |
| **AppVeyor CI**: matrix Windows (Current + LTS), npm ci, test + build | `appveyor.yml:1-45` | Template | `templates/appveyor/appveyor.yml.react` | 🟢 Baixa |
| **Webpack prod**: `webpack.prod.babel.js` — minify, gzip, code splitting, tree-shaking | `internals/webpack/webpack.prod.babel.js` | Config | `templates/webpack/webpack.prod.babel.js` | 🟠 Média |
| **Webpack base/dev split**: `webpack.base` + `webpack.dev` (HMR, source maps) | `internals/webpack/` | Pattern | `agents/trevor/build-systems/webpack-env-split.md` | 🟢 Baixa |
| **Express server**: gzip precompressed (`*.js` → `*.js.gz`), static, ngrok tunnel dev | `server/index.js:1-60` | Code snippet | `templates/express/server-prod.js` | 🟠 Média |
| **Nginx config**: HTTP→HTTPS redirect + HTTPS block para SPA | `app/.nginx.conf` | Template | `templates/nginx/spa-https.conf` | 🟠 Média |
| **Apache .htaccess**: rewrite para SPA fallback | `app/.htaccess` | Template | `templates/apache/spa-rewrite.htaccess` | 🟢 Baixa |
| **npm scripts**: `build` (cross-env + webpack), `lint` (eslint + stylelint), `test` (jest --coverage), `coveralls` | `package.json:scripts` | Tool config | `templates/package/scripts-react.json` | 🟠 Média |
| **Generate templates for linting**: script antes do lint/test em CI | `internals/scripts/generate-templates-for-linting.js` + `.travis.yml:8` | Pattern | `agents/trevor/ci-cd/pre-lint-generation.md` | 🟢 Baixa |
| **Bundle analyzer**: `npm run analyze` (`stats.json` + `rimraf`) | `package.json:scripts` | Tool config | `agents/trevor/performance/bundle-analysis.md` | 🟢 Baixa |
| **Internationalization extraction**: `extract-intl` script | `internals/scripts/extract-intl.js` | Tool config | `agents/towards/i18n-extraction.md` | 🟢 Baixa |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Travis CI + AppVeyor | `.travis.yml`, `appveyor.yml` | Travis OSS limitado; AppVeyor nicho Windows | GitHub Actions (`actions/setup-node` + matrix) |
| IE10 em browserslist | `package.json:browserslist` | IE10 EOL; bloat de polyfills | `>0.5%, last 2 versions, not dead` |
| Webpack 4 + Babel custom | `internals/webpack/` | Vite/Rspack 10-100x mais rápido em dev | Vite + SWC / Rspack |
| Redux + Saga como default | `app/` | Boilerplate pesado; Zustand/Jotai/TanStack Query mais simples | Zustand + TanStack Query |
| `coveralls` como coverage reporter | `.travis.yml:21` | Codecov mais moderno/integrado | Codecov + `codecov-action` |
| Sem Dockerfile / .dockerignore | — | Deploy containerizado é padrão | Adicionar multi-stage Dockerfile + nginx alpine |
| Sem bundle budget enforcement | — | `performance` budgets previnem regressão | `bundlesize` / `size-limit` no CI |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] **Gap 1: GitHub Actions workflow moderno** — Sugestão: Template com `setup-node`, cache pnpm, `lint` + `test` + `build` + `upload-artifact` + `deploy-preview`
- [ ] **Gap 2: Dockerfile multi-stage (build + nginx serve)** — Sugestão: `FROM node:22-alpine AS build` → `FROM nginx:alpine` + `COPY --from=build`
- [ ] **Gap 3: Preview deployments (Vercel/Netlify/Cloudflare Pages)** — Sugestão: Documentar `vercel --prod` + preview por PR
- [ ] **Gap 4: Bundle size budgets + Lighthouse CI** — Sugestão: `lighthouseci` + `size-limit` como quality gates
- [ ] **Gap 5: Canary / feature flags (LaunchDarkly/Unleash)** — Sugestão: Padrão de rollout + kill switch
- [ ] **Gap 6: Observabilidade frontend (Sentry, Datadog RUM, Web Vitals)** — Sugestão: Template + dashboards

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: Seção Frontend Platform — CI migration, webpack→Vite, nginx SPA, express gzip, bundle analysis
- [ ] **Criar Template**: `templates/github-actions/react-ci.yml` (migração de Travis/AppVeyor)
- [ ] **Criar Template**: `templates/nginx/spa-https.conf`
- [ ] **Criar Runbook**: `runbooks/frontend/travis-to-gha-migration.md`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `.travis.yml:7-11` — "script: - node ./internals/scripts/generate-templates-for-linting - npm test -- --maxWorkers=4 - npm run build"

> `appveyor.yml:25-36` — "install: - ps: Install-Product node $env:nodejs_version - npm ci / build: off / test_script: - npm run test - npm run build"

> `package.json:scripts` — "`build`: cross-env NODE_ENV=production webpack --config internals/webpack/webpack.prod.babel.js --color -p --progress --hide-modules --display-optimization-bailout"

> `server/index.js:38-44` — "use the gzipped bundle / app.get('*.js', (req, res, next) => { req.url = req.url + '.gz'; res.set('Content-Encoding', 'gzip'); next(); })"

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 3 | CI legacy, webpack, nginx, express — útil mas datado |
| **Qualidade** | 3 | Scripts bem organizados, mas React 16/Webpack 4 |
| **Atualidade** | 2 | Travis/AppVeyor, IE10, Redux-Saga, sem Docker, sem GHA |
| **Ação** | 3 | nginx SPA, express gzip, migration runbook |
| **Completude** | 2 | Sem Docker, sem preview deploys, sem bundle budgets, sem RUM |
| **TOTAL** | **13/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/trevor/extractions/react-boilerplate.md`
- [x] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Template v1.0 — Atualize se precisar de campos extras para seu domínio.*