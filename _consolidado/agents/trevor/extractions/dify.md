# TEMPLATE DE EXTRAÇÃO — Para Funcionários (Subagentes)

**Use este template para cada repositório que analisar.**
Salve em: `_consolidado/agents/{seu_lead}/extractions/{nome-do-repo}.md`

---

## METADADOS
- **Repositório**: `dify`
- **Lead Responsável**: `trevor`
- **Funcionário (Subagente)**: `trevor`
- **Data**: `2026-10-08`
- **Tempo gasto**: `1h 30min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Plataforma open-source para apps LLM, workflows agenticos, RAG pipelines — monorepo: API (Python/FastAPI), Web (Next.js), CLI (TypeScript), Agent runtime (Go), Docker Compose, E2E |
| **Público-alvo** | Platform engineers, ML engineers, DevOps, LLM app builders |
| **Tamanho** | ~300 workflows GitHub Actions, ~20 Dockerfiles, docker-compose.yaml multi-serviço, Makefile, uv/pnpm/go toolchains |
| **Linguagens/Tech** | Python 3.12 (uv), TypeScript (pnpm), Go 1.22, Next.js 14, Docker, PostgreSQL, Redis, Weaviate, Elasticsearch, Nginx, Certbot |
| **Freshness** | Muito alto (2026) — Depot runners, uv, pnpm workspaces, multi-arch builds, OpenTelemetry, Langfuse, Sentry |

---

## 2. O QUE PRESTA PARA **DEVOPS/PLATFORM** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| **Main CI Pipeline** (`main-ci.yml`): path-based test routing (api, cli, web, e2e, vdb, migration, sandbox, dify-agent), duplicate skip (`fkirc/skip-duplicate-actions`), Depot runners, concurrency cancel | `.github/workflows/main-ci.yml:1-673` | Template | `templates/github-actions/monorepo-main-ci.yml` | 🔴 Alta |
| **Style Check** (`style.yml`): conditional per-component (python-style, web-style, ts-common, superlinter), base-rev diff | `.github/workflows/style.yml` (referenciado) | Template | `templates/github-actions/style-check-monorepo.yml` | 🟠 Média |
| **Build & Push** (`build-push.yml`): multi-arch (amd64/arm64), api/web/agent/sandbox, Depot, cosign/slsa ready, tag + branch triggers | `.github/workflows/build-push.yml:1-60` | Template | `templates/github-actions/multiarch-build-push.yml` | 🔴 Alta |
| **Docker Build PR** (`docker-build.yml`): PR-only, multi-arch, Depot, no push | `.github/workflows/docker-build.yml:1-50` | Template | `templates/github-actions/docker-build-pr.yml` | 🟠 Média |
| **Deploy Dev** (`deploy-dev.yml`): workflow_run trigger on build-push success, SSH action (`appleboy/ssh-action`) | `.github/workflows/deploy-dev.yml:1-25` | Pattern | `agents/trevor/cd/ssh-deploy-trigger.md` | 🟠 Média |
| **DB Migration Test** (`db-migration-test.yml`): reusable workflow, `flask db upgrade/downgrade --sql`, compose middlewares | `.github/workflows/db-migration-test.yml:1-50` | Template | `templates/github-actions/db-migration-test.yml` | 🔴 Alta |
| **CLI Release** (`cli-release.yml`): workflow_dispatch + release trigger, dry-run, checksums, R2 upload, stale asset prune | `.github/workflows/cli-release.yml:1-40` | Template | `templates/github-actions/cli-release.yml` | 🟠 Média |
| **Docker Compose Production** (`docker-compose.yaml`): 15+ services (api, worker, web, db, redis, sandbox, plugin-daemon, agent, proxy, certbot, nginx, weaviate, oceanbase, seekdb), healthchecks, `restart: always`, volumes, networks | `docker/docker-compose.yaml` | Template | `templates/docker-compose/dify-production.yaml` | 🔴 Alta |
| **Web Dockerfile**: multi-stage (base → packages → builder → production), pnpm, corepack, node 24 alpine, standalone Next.js output, non-root user, env hardening | `web/Dockerfile:1-80` | Template | `templates/docker/Dockerfile.nextjs.prod` | 🔴 Alta |
| **API Dockerfile**: multi-stage (base → packages → production), uv sync frozen no-dev, python 3.12 slim-bookworm, libmpfr/gmpy2, non-root, UTF-8, tz=UTC | `api/Dockerfile:1-50` | Template | `templates/docker/Dockerfile.fastapi.uv.prod` | 🔴 Alta |
| **Observabilidade**: OpenTelemetry (distro, flask, celery, httpx, redis, sqlalchemy, b3 propagator), Langfuse tracing (`dify-trace-langfuse`), Sentry (API_SENTRY_DSN, WEB_SENTRY_DSN, profiles/traces sample rates) | `api/pyproject.toml` + `docker/.env.example` | Config | `agents/trevor/observability/dify-otel-langfuse-sentry.md` | 🔴 Alta |
| **Secrets Management**: `.env.example` + `docker/envs/*.env.example` split (middleware, secrets optional), `docker/.env` overrides | `docker/.env.example` + `AGENTS.md` | Pattern | `agents/trevor/secrets-management/dify-env-split.md` | 🟠 Média |
| **Makefile**: `dev/start-api`, `dev/start-web`, `dev/start-worker`, `dev/setup`, `dev/update-uv`, `dev/ty-check` | `Makefile` + `dev/` scripts | Runbook | `runbooks/dify/local-dev.md` | 🟢 Baixa |
| **Agent Runtime (Go)**: own Dockerfile, Go modules, multi-arch build | `dify-agent-runtime/` | Template | `templates/docker/Dockerfile.go.agent` | 🟢 Baixa |
| **pnpm workspace**: monorepo scripts (`check`, `lint:oxlint`, `lint:eslint`, `knip`, `dev`), catalog deps | `package.json` | Tool config | `agents/trevor/monorepo/pnpm-workspace.md` | 🟢 Baixa |
| **Dependabot** + **Stale bot** + **Labeler** + **Semantic PR** | `.github/dependabot.yml`, `.github/stale.yml`, `.github/labeler.yml`, `.github/workflows/semantic-pull-request.yml` | Tool config | `templates/github/bot-config/` | 🟢 Baixa |
| **Web Bundle Size** (`web-bundle-size.yml`): PR check, size limits | `.github/workflows/web-bundle-size.yml` | Quality gate | `checklists/frontend/bundle-size-budget.md` | 🟠 Média |
| **E2E Tests** (`web-e2e.yml`, `accessibility-e2e.yml`): compose middleware, Cypress/Playwright | `.github/workflows/web-e2e.yml` | Template | `templates/github-actions/e2e-compose.yml` | 🟠 Média |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Deploy via SSH + script custom (`appleboy/ssh-action`) | `deploy-dev.yml` | Frágil, sem rollback, sem GitOps | ArgoCD/Flux + Helm/Kustomize + Image Updater |
| `restart: always` sem healthcheck grace period em alguns serviços | `docker-compose.yaml` | Pode reiniciar loop sem readiness | Adicionar `healthcheck` + `depends_on: condition: service_healthy` |
| Node 24 (versão impar/edge) no Dockerfile | `web/Dockerfile:1` | Node par = LTS; 24 é experimental | `ARG NODE_VERSION=22` (LTS) |
| Sem K8s/Helm/Terraform no repo | — | Docker Compose não escala para prod multi-node | Adicionar `charts/dify/` + Terraform modules |
| Sem SBOM generation (Syft) + cosign signing | `build-push.yml` | Supply chain security gap | Adicionar `anchore/syft-action` + `sigstore/cosign-installer` |
| `docker build` sem `--sbom=true` / `--provenance=true` | `build-push.yml` | SLSA Level 1+ requer provenance | Habilitar BuildKit attestations |
| `uv sync --frozen --no-dev` mas sem `--no-editable` explícito | `api/Dockerfile:28` | Editables podem vazar dev deps | Adicionar `--no-editable` |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] **Gap 1: GitOps (ArgoCD/Flux) + Image Updater** — Sugestão: `charts/dify/` + `ImageRepository` + `ImagePolicy` para auto-sync tags
- [ ] **Gap 2: Terraform modules** (AWS/GCP/Azure) para infra gerenciada (RDS, ElastiCache, EKS, ALB, Cert Manager) — Sugestão: `terraform/modules/dify/`
- [ ] **Gap 3: Cost optimization** (VPA, HPA configs, spot instances, rightsizing recommendations) — Sugestão: `charts/dify/values-cost-optimized.yaml`
- [ ] **Gap 4: Disaster Recovery / Backup** (Velero, pgBackRest, RDS snapshots, RTO/RPO docs) — Sugestão: `runbooks/dify/disaster-recovery.md`
- [ ] **Gap 5: Security Hardening** (PodSecurityPolicies/OPA Gatekeeper, network policies, seccomp, non-root enforcement, read-only rootfs) — Sugestão: `templates/k8s/security-hardening.yaml`
- [ ] **Gap 6: Canary/Blue-Green deploy** (Argo Rollouts / Flagger) para API/Web — Sugestão: `charts/dify/rollout.yaml`
- [ ] **Gap 7: SBOM + SLSA provenance + cosign verify** no pipeline — Sugestão: Steps em `build-push.yml`
- [ ] **Gap 8: Chaos Engineering** (LitmusChaos) para validar resiliência — Sugestão: `charts/dify/chaos-experiments.yaml`
- [ ] **Gap 9: Feature Flags / Config Hot Reload** (Unleash / ConfigMap reload) — Sugestão: Integrar `unleash-proxy` no compose
- [ ] **Gap 10: LLM-specific observability** (token usage, cost per request, latency p99, eval metrics) — Sugestão: Dashboards Grafana + Prometheus rules

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: Seção "LLM Platform Ops" — Dify como reference architecture para multi-service AI platforms
- [ ] **Criar Template**: `templates/github-actions/monorepo-main-ci.yml` — Em: `_consolidado/templates/github-actions/`
- [ ] **Criar Template**: `templates/github-actions/multiarch-build-push.yml` — Em: `_consolidado/templates/github-actions/`
- [ ] **Criar Template**: `templates/docker-compose/dify-production.yaml` — Em: `_consolidado/templates/docker-compose/`
- [ ] **Criar Template**: `templates/docker/Dockerfile.nextjs.prod` + `Dockerfile.fastapi.uv.prod` + `Dockerfile.go.agent` — Em: `_consolidado/templates/docker/`
- [ ] **Criar Template**: `templates/helm/dify/` — Em: `_consolidado/templates/helm/dify/`
- [ ] **Criar ADR**: `ADR-004-dify-gitops-migration` — Para: Migrar de SSH deploy para ArgoCD/Flux
- [ ] **Criar ADR**: `ADR-005-llm-platform-observability` — Para: Padronizar OTEL + Langfuse + Sentry para apps LLM
- [ ] **Criar Runbook**: `runbooks/dify/db-migration.md` + `runbooks/dify/disaster-recovery.md`
- [ ] **Criar Skill**: `dify-platform-ops` — Em: `_consolidado/skills/dify-platform-ops/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `AGENTS.md` — "Run backend commands through `uv run --project api <command>`. Backend integration tests are CI-only and are not expected to run locally. Keep `docker/.env.example` limited to variables required for a default Docker Compose deployment to start."

> `.github/workflows/main-ci.yml:24-36` — "Keep orchestration on Depot to avoid GitHub-hosted runner queue delays. Skip Duplicate Checks using `fkirc/skip-duplicate-actions` with `concurrent_skipping: same_content_newer`."

> `.github/workflows/main-ci.yml:61-223` — Path filters para 10+ componentes (api, cli, web, e2e, vdb, sandbox-runtime, dify-agent, migration, styles) — "Check Changed Files determines which tests to run"

> `web/Dockerfile:48-55` — "FROM base AS production / ENV NODE_ENV=production / ENV DEPLOY_ENV=PRODUCTION / ENV CONSOLE_API_URL=http://127.0.0.1:5001 / ENV NEXT_TELEMETRY_DISABLED=1"

> `api/pyproject.toml` — OpenTelemetry instrumentations: `opentelemetry-instrumentation-{flask,celery,httpx,redis,sqlalchemy}@0.65b0`, `opentelemetry-propagator-b3`, `dify-trace-langfuse`

> `docker/.env.example` — `API_SENTRY_DSN=` / `API_SENTRY_TRACES_SAMPLE_RATE=1.0` / `WEB_SENTRY_DSN=` / `PLUGIN_SENTRY_ENABLED=false`

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Monorepo complexo, multi-lang, multi-arch, observabilidade nativa, CI/CD avançado |
| **Qualidade** | 5 | Workflows production-grade, Depot runners, path filtering, reusable workflows |
| **Atualidade** | 5 | uv, pnpm catalog, Node 22/24, Go 1.22, OTEL, Langfuse, multi-arch, SLSA-ready |
| **Ação** | 5 | Templates usáveis AGORA: CI, Dockerfiles, compose, helm (gap), k8s (gap) |
| **Completude** | 4 | Falta GitOps, K8s, Terraform, DR, Chaos, Canary, SBOM — mas base sólida |
| **TOTAL** | **24/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/trevor/extractions/dify.md`
- [x] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Template v1.0 — Atualize se precisar de campos extras para seu domínio.*