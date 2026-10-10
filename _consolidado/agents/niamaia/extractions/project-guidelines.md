# EXTRAÇÃO — project-guidelines

## METADADOS
- **Repositório**: `project-guidelines`
- **Lead Responsável**: `niamaia`
- **Funcionário (Subagente)**: `niamaia`
- **Data**: `2026-10-08`
- **Tempo gasto**: `35min`

---

## 1. VISÃO GERAL
| Campo | Detalhe |
|-------|---------|
| **Propósito** | Guidelines de projeto JavaScript (elsewhen) — Git, docs, envs, deps, testing, structure, code style, logging, API, a11y, licensing |
| **Público** | Full-stack JS teams, architects, leads |
| **Tamanho** | README ~954 linhas + config samples + traduções |
| **Tech** | Markdown, JS (config samples) |
| **Freshness** | Mantido (PRs welcome), refs RisingStack, Airbnb, Atlassian atuais |

---

## 2. O QUE PRESTA PARA NIAMAIA

| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| Feature-based folder structure (product/ vs controllers/) | `README.md:392-422` | Pattern | `agents/niamaia/architecture-patterns.md` | 🔴 Alta |
| 3-tier dentro do component: entry-points / domain / data-access | `README.md:252-271` (nodebestpractices — cross-ref) | Pattern | `agents/niamaia/architecture-patterns.md` | 🔴 Alta |
| API design: resource-oriented, kebab-case URLs, plural nouns, version prefix v1 | `README.md:587-704` | Decision record | `agents/niamaia/api-design.md` | 🔴 Alta |
| Environment config via .env + joi validation (config.sample.js) | `README.md:231-244` | Template | `templates/js/env-config/` | 🟠 Média |
| Structure: config/, scripts/, build/ (.gitignore) | `README.md:430-448` | Guideline | `agents/niamaia/project-structure.md` | 🟠 Média |
| Git workflow: feature branch + interactive rebase + force-with-lease | `README.md:103-174` | Pattern | `agents/niamaia/git-workflow.md` | 🟢 Baixa |
| API security: Bearer token, TLS only, rate limiting, helmet, JSON serializer | `README.md:779-819` | Checklist | `agents/kaspersky/api-security.md` | 🟠 Média |
| Code style: ESLint + Prettier + Airbnb + .editorconfig + husky/lint-staged | `README.md:455-550` | Tool config | `templates/js/eslint-config/` | 🟠 Média |
| Logging: winston/bunyan, stdout, structured | `README.md:553-567` | Guideline | `agents/niamaia/observability.md` | 🟢 Baixa |

---

## 3. LIXO / DESATUALIZADO

| Item | Localização | Motivo | Substituto |
|------|-------------|--------|------------|
| Stage-2 syntax recommendation | `README.md:459` | Stage-2 instável; use stable ES2024+ | ES2024 + TypeScript |
| IE 10 em browserslist | implícito | Morto | Não suportar |
| npm-shrinkwrap para npm<5 | `README.md:300` | npm>=7 tem lockfile nativo | package-lock.json / pnpm-lock.yaml |

---

## 4. GAPS
- [ ] Monorepo tooling (Nx, Turborepo, pnpm workspaces) — não coberto
- [ ] Module boundaries enforcement (ESLint import/no-internal-modules) — ausente
- [ ] Contract testing (Pact) — ausente
- [ ] Observability: OpenTelemetry, structured logging schema — ausente

---

## 5. AÇÕES
- [ ] CONSOLIDATED: Feature-based structure como padrão; API design rules; env config template
- [ ] ADR: `ADR-js-project-structure` — feature-based vs layer-based
- [ ] Template: `.env.example` + `config/` structure
- [ ] Checklist: API security hardening

---

## 6. CITAÇÕES
> `README.md:392-422` — "Organize your files around product features / pages / components, not roles... Instead of a long list of files, you will create small modules that encapsulate one responsibility."
> `README.md:597-606` — "Always use a plural nouns for naming a url pointing to a collection: `/users`... In the source code convert plurals to variables and properties with a List suffix."
> `README.md:630-634` — "Keep verbs out of your resource URLs... Use verbs for non-resources... Because for CRUD we use HTTP methods on resource or collection URLs."

---

## 7. SCORE
| Critério | 1-5 |
|----------|-----|
| Relevância | 4 |
| Qualidade | 4 |
| Atualidade | 3 |
| Ação | 4 |
| Completude | 3 |
| **TOTAL** | **18/25** → Extrair seletivo (templates/checklists acionáveis) |

---

## 8. SALVO
- [x] `_consolidado/agents/niamaia/extractions/project-guidelines.md`