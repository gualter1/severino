# TREVOR — CONSOLIDATED (DevOps / Platform)

**Lead**: Trevor | **Última atualização**: 2026-10-09 (Batch 2 Wave 3 — 10 repos processados)
**Status**: ✅ Aprovado e Finalizado (Pronto para desbloquear o template CI/CD)

---

## 1. SCOREBOARD COMPLETO (Batch 1 + Wave 1 + Wave 3)

| Repo | Score /25 | Veredito | Top Contribuição |
|------|-----------|----------|------------------|
| `oh-my-openagent` | **24** | ✅ Priorizar extração completa | Fast-path CI workflow classification, QA Sandbox (XDG + Codex Home), Universal dev setup |
| `cc-switch` | **24** | ✅ Priorizar extração completa | Multi-harness config reconciliation, Local HTTP proxy with API format conversion, Tauri desktop threat model |
| `dify` | **24** | ✅ Priorizar extração completa | Monorepo CI (path routing), multi-arch build-push, compose prod, OTEL+Langfuse+Sentry |
| `nodebestpractices` | **23** | ✅ Priorizar extração completa | Docker hardening (multi-stage, secrets, scan, .dockerignore, graceful shutdown) |
| `context-mode` | **22** | ✅ Priorizar extração completa | CI multi-OS, bundle pipeline, version-sync multi-plugin, security model |
| `claude-code-best-practice` | **17** | ⚠️ Extrair seletivo | Claude Code permissions/hooks/MCP allowlist |
| `ios-good-practices` | **17** | ⚠️ Extrair seletivo | Multi-env, xcconfig, signing/provisioning, dSYM retention |
| `project-guidelines` | **16** | ⚠️ Extrair seletivo | Env separation, joi validation, lockfiles, logging |
| `android-best-practices` | **14** | ⚠️ Extrair seletivo | Gradle signing, ProGuard mapping retention |
| `react-boilerplate` | **13** | ⚠️ Extrair seletivo | nginx SPA, express gzip, Travis→GHA migration |

---

## 2. PADRÕES OURO (Extraídos para templates / checklists / runbooks)

### 2.1 CI/CD & Pipeline Patterns
- **Fast-path CI workflow classification** (`oh-my-openagent`): Executa testes completos apenas em mudanças que afetam o runtime; documentação, metadados e arquivos web rodam apenas legs leves (ubuntu-only), economizando runner minutes. → `templates/github-actions/fast-path-ci.yml`
- **Monorepo path-based routing** (dify `main-ci.yml`): `dorny/paths-filter` → 10 componentes → reusable workflows + finalizers fail-closed + skip-duplicate-actions. → `templates/github-actions/monorepo-main-ci.yml`
- **Multi-arch build-push** (dify `build-push.yml`): amd64+arm64, Depot runners, api/web/agent/sandbox. → `templates/github-actions/multiarch-build-push.yml`
- **Multi-OS CI** (context-mode `ci.yml`): ubuntu/macos/windows + Node 22 + Python 3.12 + Go + Elixir. → `templates/github-actions/multi-os-ci.yml`
- **Quality gates TS** (context-mode): typecheck → build → bundle → assert-bundle → vitest com fallback de teardown race. → `checklists/ts/quality-gates.md`
- **Docker build em PR sem push** (dify `docker-build.yml`). → `templates/github-actions/docker-build-pr.yml`
- **Bundle auto-commit** (context-mode `bundle.yml`) — Com PR + auto-merge. → `templates/github-actions/bundle-auto-commit.yml`

### 2.2 Docker, Containers & Sandbox Security
- **Isolated QA Sandbox (XDG + Codex Home)** (`oh-my-openagent`): Isola testes sob `mktemp` dirs para que `~/.config/opencode` e `~/.codex` da máquina hospedeira fiquem totalmente intocados, garantindo hermeticidade. → `agents/trevor/secrets-management/qa-sandbox-isolation.md`
- **Multi-stage Node** (nodebestpractices): build + runtime alpine, `USER node`, `COPY --chown`, `npm ci --frozen-lockfile --production`. → `templates/docker/Dockerfile.multi-stage.node`
- **Next.js prod** (dify `web/Dockerfile`): pnpm + corepack, `NEXT_TELEMETRY_DISABLED=1`, standalone output. → `templates/docker/Dockerfile.nextjs.prod`
- **FastAPI + uv prod** (dify `api/Dockerfile`): `uv sync --frozen --no-dev --no-editable`, python 3.12-slim, TZ=UTC, UTF-8. → `templates/docker/Dockerfile.fastapi.uv.prod`
- **Secrets em build**: nunca `--build-arg` para tokens; usar `--mount=type=secret` ou multi-stage. → `agents/trevor/secrets-management/docker-secrets.md`
- **.dockerignore Node** (nodebestpractices): node_modules, .git, .env, .aws, coverage, dist. → `templates/docker/.dockerignore.node`
- **Scan de imagem** (Trivy/Anchore/Snyk) antes do prod + threshold alto. → `checklists/docker/image-scanning.md`
- **Graceful shutdown / PID1**: `CMD ["node","index.js"]` (não `npm start`), Tini se necessário. → `templates/docker/entrypoint-graceful.sh`
- **Base images**: alpine (~39MB) vs full (~345MB); Node par = LTS. → ADR-003

### 2.3 Multi-Harness & Desktop Platform Patterns (`cc-switch` & `oh-my-openagent`)
- **Multi-Harness Switch Engine & Config Reconciler** (`cc-switch`): Gerenciamento centralizado de múltiplos harnesses de IA (Claude Code, Claude Desktop, Codex, Gemini CLI, OpenCode, OpenClaw, etc.) com troca em 1 clique e reconciliação automática de JSON/TOML/YAML. → `agents/trevor/patterns/multi-harness-switching.md`
- **Local HTTP Proxy with API Format Conversion & Failover** (`cc-switch`): Proxy HTTP local configurável para tradução de formatos de API de IA (ex: Anthropic <-> OpenAI) e failover transparente entre provedores. Bound padrão em loopback, com hardening rigoroso para interfaces não-loopback. → `agents/trevor/architecture/local-proxy-failover.md`
- **Cross-Harness Universal Setup (`setup.sh`)** (`oh-my-openagent`): Script universal de bootstrap de ambiente para múltiplos harnesses de IA, garantindo dependências sincronizadas, chaves configuradas e ferramentas gerenciadas. → `templates/devops/universal-dev-setup.sh`
- **Telemetry Opt-out & Compliance** (`oh-my-openagent`): Mecanismos estritos de opt-out para telemetria em ferramentas de desenvolvimento (PostHog/analytics). → `agents/trevor/observability/telemetry-optout.md`
- **Tauri Desktop Security Model & Trust Boundary Scope** (`cc-switch`): Isolamento rigoroso de IPC e proxy local, blindagem de desktop apps contra execução de comandos arbitrários e controle de escopo de permissões. → `agents/trevor/security/desktop-app-threat-model.md`

### 2.4 Mobile Build/Release
- **Android signing**: `gradle.properties` (não commitado) + `signingConfigs` com try/catch; debug keystore compartilhado OK. → `templates/gradle/signing-config.gradle`
- **Android release**: `minifyEnabled true` + ProGuard custom + **salvar `mapping.txt` de cada release**. → `runbooks/android/proguard-mapping-retention.md`
- **Android build-types**: `applicationIdSuffix` + `versionNameSuffix` debug vs release. → `agents/trevor/multi-env/android-build-types.md`
- **iOS multi-env**: dev/test/staging/App Store com bundle ID, base URL, log level, provisioning distintos. → `agents/trevor/multi-env/ios-environments.md`
- **iOS xcconfig**: `Common.xcconfig` + `#include`, comentários, merge-friendly. → `templates/xcode/Common.xcconfig`
- **iOS provisioning debug** (Hockenberry Provisioning + Quick Look + `embedded.mobileprovision`). → `runbooks/ios/provisioning-debug.md`
- **iOS dSYM retention**: salvar `.xcarchive` de cada release. → `runbooks/ios/dsym-retention.md`
- **Warnings-as-errors**: `-Wall -Wextra` (ObjC) + `-warnings-as-errors` (Swift) + Clang Analyzer deep-on-build. → `agents/trevor/quality-gates/clang-analyzer-config.md`

### 2.5 Environments / Config / Secrets
- **12-factor**: dev/test/prod separados; config via env vars; `.env` gitignored + `.env.example` commitado; nunca segredos no código. (project-guidelines) → `templates/dotenv/.env.example`
- **Validação no boot** com `joi` (configWithTest.sample.js). → `templates/config/config-validation.js`
- **Config único** (`./config`), não por env; valores via env vars. → `templates/config/config-structure.md`
- **Consistência Node**: `engines` + `.nvmrc` + preinstall check. → `templates/dotenv/.nvmrc`
- **Lockfiles obrigatórios** (`package-lock.json` + `npm ci`). → `checklists/node/lockfile-policy.md`
- **Dify env split**: `.env.example` (mínimo Compose) + `docker/envs/*.env.example` (opcionais), `.env` sobrescreve. → `agents/trevor/secrets-management/dify-env-split.md`

### 2.6 Observabilidade & Deploy
- **Dify stack**: OTEL (flask/celery/httpx/redis/sqlalchemy + B3) + Langfuse tracing + Sentry (API/WEB, traces+profiles sample rates). → `agents/trevor/observability/dify-otel-langfuse-sentry.md`
- **Node prod**: `NODE_ENV=production` (até 3x throughput), APM para UX end-to-end, healthcheck/maintenance endpoint, smart logging (request IDs, structured, winston/bunyan). → `agents/trevor/observability/node-structured-logging.md`
- **DB migration test** (dify): reusable workflow, `flask db upgrade/downgrade --sql`, compose middlewares. → `templates/github-actions/db-migration-test.yml`
- **CLI release** (dify): dispatch + release trigger, dry-run, checksums, R2, prune. → `templates/github-actions/cli-release.yml`
- **Version-sync multi-plugin** (context-mode): 1 script → 9 manifests. → `runbooks/release/version-sync-multi-plugin.md`
- **Frontend**: nginx SPA HTTPS + Apache fallback + express gzip precompressed. → `templates/nginx/spa-https.conf`
- **SSH deploy** (dify `deploy-dev.yml`) = ANTI-PATTERN → migrar para ArgoCD/Flux. → ADR-004

### 2.7 AI Tooling (Domínio Platform)
- **Claude Code permissions** (allow/deny/ask) + hooks + MCP allowlist. → `templates/claude-code/settings.json`
- **MCP security model** (context-mode `security.ts`): block curl/wget, allowlist, path traversal. → `agents/kaspersky/mcp-security-model.md`
- **Multi-adapter configs** (10+ IDEs/CLIs). → `templates/mcp/adapter-configs/`

---

## 3. GAPS CRÍTICOS & ROADMAP DE RESOLUÇÃO

| # | Gap | Repos afetados | Ação / Status |
|---|-----|----------------|---------------|
| 1 | Sem GitOps (ArgoCD/Flux) | dify, todos | ADR-004 + `templates/helm/` + Image Updater (Em andamento) |
| 2 | Sem K8s manifests / Helm / Terraform | todos | `templates/helm/app/` + `terraform/modules/` (Em andamento) |
| 3 | Sem SBOM/SLSA/cosign | dify, context-mode, node | syft + cosign + provenance no build-push (Planejado) |
| 4 | Sem canary/blue-green (Argo Rollouts) | todos | `charts/*/rollout.yaml` (Planejado) |
| 5 | Sem DR/backup (RTO/RPO) | dify | `runbooks/dify/disaster-recovery.md` (Planejado) |
| 6 | Sem Fastlane/Match moderne iOS | ios-good-practices | `templates/fastlane/` + GHA workflow |
| 7 | Sem AAB + Play Internal Testing | android | `templates/github-actions/android-ci.yml` |
| 8 | Sem device farm CI (FTL / GMD) | android | matrix de devices no workflow |
| 9 | Sem feature flags | todos frontend/mobile | Unleash/LaunchDarkly pattern |
| 10 | Sem cost optimization | todos | VPA/HPA, spot, budgets |
| 11 | Sem chaos engineering | dify | LitmusChaos experiments |
| 12 | Sem security scanning iOS/Android (MobSF/Semgrep) | mobile | SAST steps |
| 13 | Sem release automation (semantic-release/changesets) | context-mode, react | `release.yml` |
| 14 | Sem CodeQL/Semgrep/Dependabot global | quase todos | org-level security workflows |

---

## 4. ADRs APROVADAS / PROPOSTAS

- [x] **ADR-001**: Android CI — migrar Travis/Jenkins → GitHub Actions + Bitrise hybrid (Aprovado)
- [x] **ADR-002**: iOS CI runner — Xcode Cloud vs Bitrise vs GHA macOS runners (Aprovado)
- [x] **ADR-003**: Node base image padrão — alpine vs slim vs distroless (Aprovado)
- [x] **ADR-004**: Dify GitOps — migrar SSH deploy → ArgoCD/Flux + Helm (Aprovado)
- [x] **ADR-005**: LLM platform observability — padronizar OTEL + Langfuse + Sentry (Aprovado)
- [x] **ADR-006**: MCP plugin distribution — npm vs Docker vs GHCR vs marketplace (Aprovado)

---

## 5. APROVAÇÃO FINAL DO GERENTE

> **Status**: ✅ **APROVADO E CONSOLIDADO**
> **Autorizado por**: Severino (Gerente) / Trevor (Lead Platform Engineer)
> **Desbloqueios**: 
> 1. Template de CI/CD finalizado (`templates/github-actions/fast-path-ci.yml` e `monorepo-main-ci.yml`).
> 2. Padrões de Multi-Harness Reconciliation e QA Sandbox liberados para adoção geral.
> 3. Transição de infraestrutura para GitOps e Kubernetes liberada para execução no Batch 3.

---

## 6. FONTES DE EXTRAÇÃO

- `extractions/android-best-practices.md` (14/25)
- `extractions/ios-good-practices.md` (17/25)
- `extractions/claude-code-best-practice.md` (17/25)
- `extractions/project-guidelines.md` (16/25)
- `extractions/nodebestpractices.md` (23/25)
- `extractions/react-boilerplate.md` (13/25)
- `extractions/dify.md` (24/25)
- `extractions/context-mode.md` (22/25)
- `extractions/oh-my-openagent.md` (24/25)
- `extractions/cc-switch.md` (24/25)

*CONSOLIDATED v1.0 (Batch 2 Wave 3 Final) — Aprovado e pronto para produção.*
