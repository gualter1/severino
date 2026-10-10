## METADADOS
- **Repositório**: `project-guidelines`
- **Lead Responsável**: `guanabara`
- **Funcionário (Subagente)**: `Guanabara`
- **Data**: `2026-10-08`
- **Tempo gasto**: `0h 30min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Guia de diretrizes para projetos JavaScript da Elsewhen: Git, documentação, ambientes, dependências, testes, estrutura/nomes, code style, logging, API, a11y, licenciamento |
| **Público-alvo** | Devs JS/TS, tech leads, QA, DevOps |
| **Tamanho** | `README.md` (~954 linhas, 11 seções) + `README.sample.md` + `config.sample.js` + `configWithTest.sample.js` + traduções (zh/ja/ko/ru/pt-BR/it/ir) |
| **Linguagens/Tech** | Markdown, JavaScript/Node, ESLint/Prettier, Joi, Docker, nvm |
| **Freshness** | Mantido pela comunidade (elsewhen), padrão estável/atemporal; partes datadas (npm@5/Yarn, FlowType, `git checkout -b`) mas essência válida |

---

## 2. O QUE PRESTA PARA **GUANABARA** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Frase-âncora greenfield vs manutenção (pesadelo p/ outro) | `README.md:13-15` | Analogy | `agents/guanabara/analogies/greenfield-vs-maintenance.md` | 🔴 Alta |
| Feature-branch workflow + rebase interativo + elementos Gitflow | `README.md:103-175` | Guideline | `agents/guanabara/tutorials/git-workflow.md` | 🔴 Alta |
| Regras Git: nunca push direto em develop/master, PR, deletar branch, build+test antes do PR | `README.md:50-99` | Checklist | `agents/guanabara/checklists/pre-pr-checklist.md` | 🔴 Alta |
| 7 regras de commit (50/72, imperativo, sujeito vs corpo, o quê/porquê) | `README.md:178-203` | Guideline | `agents/guanabara/tutorials/writing-good-commits.md` | 🔴 Alta |
| Template README.sample.md (install/dev/build/deploy/versioning/config/tests/style/api/db) | `README.sample.md:1-100` | Template | `agents/guanabara/templates/readme-starter.md` | 🔴 Alta |
| Regras de documentação/comentário: linkar discussão SO/GitHub, não usar comentário como desculpa p/ código ruim | `README.md:210-218` | Guideline | `agents/guanabara/tutorials/document-like-you-mean-it.md` | 🟠 Média |
| Separar dev/test/prod + config via env vars, nunca constante no código (.env + .env.example) | `README.md:225-240` | Guideline | `agents/guanabara/tutorials/env-config-separation.md` | 🔴 Alta |
| Validar env vars no boot com Joi (fail fast, sample completo) | `configWithTest.sample.js:1-40` + `README.md:242-244` | Code snippet | `agents/guanabara/templates/config-validation-joi.md` | 🔴 Alta |
| Dev env consistente: engines + .nvmrc + preinstall check + Docker + módulos locais | `README.md:248-279` | Runbook | `agents/guanabara/runbooks/consistent-dev-env.md` | 🟠 Média |
| Deps consistentes: package-lock.json / Yarn, versões travadas | `README.md:282-301` | Guideline | `agents/guanabara/tutorials/lockfile-discipline.md` | 🟠 Média |
| Auditoria de deps: npm ls, depcheck, npm-stat, npm view, npm outdated, Snyk | `README.md:304-335` | Checklist | `agents/guanabara/checklists/dependency-health-check.md` | 🟠 Média |
| Testes ao lado do módulo (*.spec.js) + pasta __test__ p/ extras | `README.md:348-358` | Guideline | `agents/guanabara/tutorials/colocated-tests.md` | 🔴 Alta |
| Código testável: pure functions, extrair side effects | `README.md:360-366` | Analogy | `agents/guanabara/analogies/pure-functions-testability.md` | 🔴 Alta |
| Estrutura por feature (product/user) NÃO por camada (controllers/models) — bad vs good | `README.md:392-422` | Pattern | `agents/guanabara/tutorials/feature-structure.md` | 🔴 Alta |
| Pasta ./config única (sem config por env) + ./scripts + ./build no .gitignore | `README.md:430-448` | Guideline | `agents/guanabara/tutorials/project-layout.md` | 🟠 Média |
| Step-down rule + nomes verbosos/buscáveis (função = verbo) | `README.md:515-526` | Guideline | `agents/guanabara/tutorials/naming-stepdown.md` | 🟠 Média |
| TODO pequeno vs ticket (`//TODO(#3456)` com lint) | `README.md:497-501` | Guideline | `agents/guanabara/tutorials/todo-discipline.md` | 🟢 Baixa |
| Enforce style: ESLint + Airbnb + editorconfig + prettier + husky/lint-staged + git hooks | `README.md:465-550` | Tool config | `agents/guanabara/templates/lint-precommit-stack.md` | 🔴 Alta |
| Logging prod legível (winston/bunyan), sem console.log no client | `README.md:557-567` | Guideline | `agents/guanabara/tutorials/logging-hygiene.md` | 🟠 Média |
| API resource-oriented: kebab-case URLs, plural coleção, sem verbo, singular+id, nested, versionamento v1 à esquerda | `README.md:587-705` | Guideline | `agents/guanabara/tutorials/rest-url-design.md` | 🔴 Alta |
| CRUD via HTTP verbs + erros auto-descritivos (code/message/description) + subset de status codes | `README.md:664-767` | Pattern | `agents/guanabara/tutorials/rest-errors-status.md` | 🔴 Alta |
| API security básico: sem basic auth sem TLS, token no header, short-lived, 403 p/ HTTP, rate limit, helmet, validar tudo, serializar JSON, checar Content-Type | `README.md:779-819` | Checklist | `agents/guanabara/checklists/api-security-basics.md` | 🔴 Alta |
| Template de doc de endpoint (URL params, POST required/optional, success/error response, Swagger/Blueprint) | `README.md:823-857` | Template | `agents/guanabara/templates/api-endpoint-doc.md` | 🟠 Média |
| A11y desde o início: audits lighthouse/axe + linter (jsx-a11y/codelyzer) + testes axe-core + storybook + design system acessível | `README.md:865-900` | Tutorial | `agents/guanabara/tutorials/a11y-starter-kit.md` | 🟠 Média |
| Regras a11y básicas: link names, listas semânticas, heading order, contraste, alt text | `README.md:901-933` | Checklist | `agents/guanabara/checklists/a11y-basics.md` | 🟠 Média |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| `git checkout <branch>` / `git checkout -b` no workflow | `README.md:109-147` | `checkout` ambíguo; moderno separa switch/restore | `git switch -c <branch>` / `git switch develop` |
| Branch `develop` como obrigatório + `master` | `README.md:58-62` | Trunk-based + main é padrão atual p/ maioria | `main` + feature curta / trunk-based; manter `develop` só se Gitflow real |
| `npm@5 / package-lock` como novidade, Yarn como alternativa, shrinkwrap | `README.md:292-300` | Datado (era npm 5) | pnpm/bun + lockfile + `engines`/`packageManager` + corepack |
| `stage-2 syntax`, FlowType + eslint-plugin-flowtype | `README.md:459-483` | Flow perdeu p/ TS; stage-X confuso hoje | TypeScript + `@typescript-eslint` |
| `npm-stat`, `npm view async`, RisingStack/Apigee links | `README.md:315-335` | Ferramentas/links legados | `npm view/downloads`, socket.dev, Snyk/Dependabot/Renovate |
| Joi via `joi.validate(process.env, schema)` (API antiga) | `configWithTest.sample.js:21` | API removida no Joi 16+ | `schema.validate(value)` / Zod (`z.object().parse`) |
| Travis badge no README.sample | `README.sample.md:3` | Travis morto p/ OSS | GitHub Actions badge |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] Gap 1: Glossário iniciante (rebase vs merge, squash, lockfile, env, lint-staged, a11y) — Sugestão: criar `agents/guanabara/onboarding/glossary-project-guidelines.md`
- [ ] Gap 2: Analogias prontas p/ cada seção (ex: rebase = reescrever história a limpo; lockfile = foto do armário; env = cofre fora da casa) — Sugestão: criar `agents/guanabara/analogies/project-guidelines-pack.md`
- [ ] Gap 3: Learning path junior→mid usando o repo em ordem (Git → docs → env → deps → testes → estrutura → style → logging → API → a11y) com exercícios — Sugestão: criar `agents/guanabara/learning-paths/project-guidelines-ladder.md`
- [ ] Gap 4: Grill-me validation (perguntas p/ testar se entendeu: "explique rebase p/ leigo", "por que não commitar .env?") — Sugestão: criar `agents/guanabara/tutorials/grill-me-project-guidelines.md`

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: trilha onboarding end-to-end (Git→API→a11y) + pack de analogias + checklists PR/API/a11y
- [ ] **Criar Template**: `readme-starter` (de README.sample.md modernizado p/ Actions) — Em: `agents/guanabara/templates/`
- [ ] **Criar Template**: `config-validation` (Joi moderno + alternativa Zod) — Em: `agents/guanabara/templates/`
- [ ] **Criar Checklist**: `pre-pr-checklist` (rebase, build, testes, lint, eslint-disable removido) — Em: `agents/guanabara/checklists/`
- [ ] **Criar Checklist**: `api-security-basics` + `a11y-basics` — Em: `agents/guanabara/checklists/`
- [ ] **Criar Analogy/Tutorial**: `greenfield-vs-maintenance` + `pure-functions-testability` — Em: `agents/guanabara/analogies/`
- [ ] **Criar Skill**: `onboarding-project-hygiene` (setup env, commits, PR, docs) — Em: `_consolidado/skills/onboarding-project-hygiene/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> "While developing a new project is like rolling on a green field for you, maintaining it is a potential dark twisted nightmare for someone else." (`README.md:13`)

> "Rebasing will merge in the requested branch (`master` or `develop`) and apply the commits that you have made locally to the top of the history without creating a merge commit." (`README.md:74`)

> "Use the body to explain **what** and **why** as opposed to **how**." (`README.md:202`)

> "Your config should be correctly separated from the app internals as if the codebase could be made public at any moment." (`README.md:235`)

> "It may save others from hours of troubleshooting." (`README.md:244`, sobre validar env vars)

> "You don't want to dig through a folder structure to find a unit test." (`README.md:352`)

> "Instead of a long list of files, you will create small modules that encapsulate one responsibility including its test and so on." (`README.md:422`)

> "Don't use comments as an excuse for a bad code. Keep your code clean. / Don't use clean code as an excuse to not comment at all." (`README.md:215-216`)

> "Note: Keep security exception messages as generic as possible... saying 'invalid username or password'." (`README.md:741`)

> "Web content is [accessible by default]. We compromise this when we build complex features." (`README.md:871`)

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Onboarding completo: Git, docs, env, testes, estrutura, API, a11y — tudo ensinável |
| **Qualidade** | 4 | Todo item tem _Why_ didático + bad/good; peca em samples datados e links velhos |
| **Atualidade** | 3 | Núcleo atemporal, mas camada tooling datada (npm5, Flow, Travis, checkout, Joi antigo) |
| **Ação** | 5 | Gera templates, checklists, runbooks e analogias imediatos |
| **Completude** | 5 | 11 áreas end-to-end, raro num repo só |
| **TOTAL** | **22/25** | Priorizar extração completa (com modernização nas notas) |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/guanabara/extractions/project-guidelines.md`
- [x] Avisar seu Lead (gerente) que a extração está pronta
- [x] Mover para próximo repo na fila

---
*Template v1.0 — Atualize se precisar de campos extras para seu domínio.*