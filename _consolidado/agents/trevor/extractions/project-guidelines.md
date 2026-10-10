# TEMPLATE DE EXTRAÇÃO — Para Funcionários (Subagentes)

**Use este template para cada repositório que analisar.**
Salve em: `_consolidado/agents/{seu_lead}/extractions/{nome-do-repo}.md`

---

## METADADOS
- **Repositório**: `project-guidelines`
- **Lead Responsável**: `trevor`
- **Funcionário (Subagente)**: `trevor`
- **Data**: `2026-10-08`
- **Tempo gasto**: `0h 50min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Guidelines de projeto JS/Node (Elsewhen) — git, documentação, environments, dependencies, testing, structure, code style, logging, API |
| **Público-alvo** | JS/TS devs, tech leads, DevOps |
| **Tamanho** | 954 linhas README + sample files (`.gitignore`, `config.sample.js`, `configWithTest.sample.js`) |
| **Linguagens/Tech** | Markdown, JS (Express-style), ESLint, `.editorconfig`, `.gitignore` |
| **Freshness** | Moderado (sem workflows CI além de stale, sem Docker, mas guidelines atemporais) |

---

## 2. O QUE PRESTA PARA **DEVOPS/PLATFORM** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Separar `development`/`test`/`production` + env-specific config | `README.md:224-245` | Guideline | `agents/trevor/multi-env/environment-separation.md` | 🔴 Alta |
| Não commitar secrets: usar env vars + `.env` + `.gitignore` + `.env.example` | `README.md:231-240` | Pattern | `templates/dotenv/.env.example` | 🔴 Alta |
| Validar env vars no boot com `joi` (`configWithTest.sample.js`) | `README.md:242` | Code snippet | `templates/config/config-validation.js` | 🔴 Alta |
| `.nvmrc` + `engines` em `package.json` para consistência de Node | `README.md:248-266` | Tool config | `templates/dotenv/.nvmrc` + `templates/package/engines.json` | 🟠 Média |
| Docker para consistência dev→prod | `README.md:268-272` | Guideline | `agents/trevor/docker/dev-parity.md` | 🟠 Média |
| `package-lock.json` (ou Yarn lock) para deps reproduzíveis | `README.md:282-300` | Guideline | `agents/trevor/dependency-management/lockfile-policy.md` | 🔴 Alta |
| `npm ls --depth=0` + `depcheck` para deps não usadas | `README.md:308-314` | Checklist | `checklists/node/dependency-audit.md` | 🟢 Baixa |
| `npm outdated` + `npm-check-updates` para updates incrementais | `README.md:328-333` | Checklist | `checklists/node/dependency-updates.md` | 🟢 Baixa |
| Snyk para vuln scanning de packages | `README.md:335` | Tool config | `agents/trevor/security/snyk-scan.md` | 🟠 Média |
| Teste env dedicado + `*.test.js` co-localizado | `README.md:338-359` | Guideline | `agents/qualy/testing-conventions.md` | 🟢 Baixa |
| `config/` folder único (não por env) + valores via env vars | `README.md:430-435` | Pattern | `templates/config/config-structure.md` | 🟠 Média |
| `scripts/` folder + `build/` (gitignored) | `README.md:437-448` | Guideline | `agents/niamaia/project-structure.md` | 🟢 Baixa |
| ESLint obrigatório no build + `eslint-plugin-prettier` + `.editorconfig` | `README.md:458-537` | Tool config | `templates/eslint/.eslintrc.js` | 🟠 Média |
| Git hooks (Husky) + Prettier + lint-staged pre-commit | `README.md:538-549` | Tool config | `templates/git-hooks/husky-lint-staged.md` | 🟠 Média |
| Winston / node-bunyan para logging prod (timestamps, rotação) | `README.md:563-567` | Guideline | `agents/trevor/observability/js-logging.md` | 🟠 Média |
| Branch protection em `develop`/`master` | `README.md:95-99` | Guideline | `agents/trevor/git-workflow/branch-protection.md` | 🟠 Média |
| Feature branches + PR obrigatório + interactive rebase + squash | `README.md:44-174` | Guideline | `agents/trevor/git-workflow/feature-branch.md` | 🟢 Baixa |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| `npm-shrinkwrap.json` para npm antigo | `README.md:299-300` | Npm ≥5 usa `package-lock.json`; shrinkwrap é edge case (publicar lib) | Apenas `package-lock.json` + `npm ci` |
| FlowType mencionado como type checker | `README.md:479` | TypeScript dominou; Flow quase abandonado | TypeScript + `tsconfig.json` strict |
| `Yarn` como alternativa sem menção a pnpm | `README.md:294-296` | pnpm mais eficiente (symlink store) | pnpm / bun |
| Sem menção a `npm ci` (usa `npm install` implícito) | — | `npm ci` é determinístico para CI | Documentar `npm ci --production` |
| Sem workflows GitHub Actions reais | — | Apenas stale bot; 0 CI pipeline | Adicionar workflows de lint/test/build/deploy |
| Sem menção a secrets management (Vault, Sealed Secrets, ESO) | — | Env vars em `.env` insuficiente para prod/K8s | External Secrets Operator / Vault Agent |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] **Gap 1: CI/CD pipeline template (GitHub Actions)** — Sugestão: Workflow com lint → test → build → security scan → deploy
- [ ] **Gap 2: Dockerfile + .dockerignore + multi-stage** — Sugestão: Template Node slim + non-root + healthcheck
- [ ] **Gap 3: K8s manifests / Helm chart base** — Sugestão: `charts/app/` com values por env
- [ ] **Gap 4: Observabilidade (Prometheus metrics, Grafana, Jaeger traces)** — Sugestão: Seção em CONSOLIDATED.md
- [ ] **Gap 5: Secret rotation e audit trail** — Sugestão: Documentar rotação trimestral + vault audit logs
- [ ] **Gap 6: Cost optimization (right-sizing, spot, budgets)** — Sugestão: Guidelines de recursos K8s + cloud budgets

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: Seção "Project Guidelines → Platform" — env separation, validation, Docker parity, lockfiles, logging
- [ ] **Criar Template**: `templates/config/config-validation.js` (joi/env validation)
- [ ] **Criar Template**: `templates/dotenv/.env.example` — Em: `_consolidado/templates/dotenv/`
- [ ] **Criar Checklist**: `checklists/node/dependency-audit.md`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `README.md:231-236` — "Load your deployment specific configurations from environment variables and never add them to the codebase as constants. You have tokens, passwords and other valuable information in there. Your config should be correctly separated from the app internals as if the codebase could be made public at any moment. `.env` files to store your variables and add them to `.gitignore` to be excluded. Instead, commit a `.env.example` which serves as a guide for developers."

> `README.md:242` — "It's recommended to validate environment variables before your app starts. Look at this sample using `joi` to validate provided values. It may save others from hours of troubleshooting."

> `README.md:430-435` — "Use a `./config` folder and don't make different config files for different environments. It doesn't scale cleanly, as more deploys of the app are created, new environment names are necessary. Values to be used in config files should be provided by environment variables."

> `README.md:563-567` — "Produce readable production logging. Ideally use logging libraries to be used in production mode (such as winston or node-bunyan). It makes your troubleshooting less unpleasant with colorization, timestamps, log to a file in addition to the console or even logging to a file that rotates daily."

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 4 | Environments, env vars, Docker, logging, branch protection — tudo platform |
| **Qualidade** | 4 | Bem argumentado (why/how), samples práticos |
| **Atualidade** | 2 | Flow, npm-shrinkwrap, Yarn-sem-pnpm, sem CI, sem K8s |
| **Ação** | 4 | .env.example, config validation, lockfile policy, checklists |
| **Completude** | 2 | Sem CI/CD, sem K8s, sem IaC, sem secrets prod-grade, sem observabilidade depth |
| **TOTAL** | **16/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/trevor/extractions/project-guidelines.md`
- [x] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Template v1.0 — Atualize se precisar de campos extras para seu domínio.*