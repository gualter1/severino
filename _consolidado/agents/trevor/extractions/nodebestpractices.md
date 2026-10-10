# TEMPLATE DE EXTRAÇÃO — Para Funcionários (Subagentes)

**Use este template para cada repositório que analisar.**
Salve em: `_consolidado/agents/{seu_lead}/extractions/{nome-do-repo}.md`

---

## METADADOS
- **Repositório**: `nodebestpractices`
- **Lead Responsável**: `trevor`
- **Funcionário (Subagente)**: `trevor`
- **Data**: `2026-10-08`
- **Tempo gasto**: `1h 15min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Maior coleção de Node.js best practices (Goldberg/Yoni) — Docker, CI, produção, testes, segurança, performance, arquitetura |
| **Público-alvo** | Node.js devs, SREs, platform engineers |
| **Tamanho** | 1976 linhas README + ~80 seções em `sections/` (Docker, Production, Testing, Security) |
| **Linguagens/Tech** | Markdown, JS/TS snippets, Dockerfile, GitHub Actions |
| **Freshness** | Alto (multi-language, sections atualizados, cobre Docker moderno, APM, Snyk, Trivy) |

---

## 2. O QUE PRESTA PARA **DEVOPS/PLATFORM** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| **Docker: multi-stage builds** (build + runtime alpine) | `sections/docker/multi_stage_builds.md:34-121` | Template | `templates/docker/Dockerfile.multi-stage.node` | 🔴 Alta |
| **Docker: evitar secrets em build args** — usar `--mount=type=secret` ou multi-stage | `sections/docker/avoid-build-time-secrets.md:12-60` | Pattern | `agents/trevor/secrets-management/docker-secrets.md` | 🔴 Alta |
| **Docker: scan final image** (Trivy, Anchore, Snyk) antes do prod | `sections/docker/scan-images.md:11-24` | Tool config | `checklists/docker/image-scanning.md` | 🔴 Alta |
| **Docker: .dockerignore** (secrets, node_modules, .git, .env) | `sections/docker/docker-ignore.md:11-30` | Template | `templates/docker/.dockerignore.node` | 🔴 Alta |
| **Docker: imagens base pequenas** (Alpine ~39MB vs 345MB) | `sections/docker/smaller_base_images.md:4-5` | Guideline | `agents/trevor/docker/base-image-selection.md` | 🟠 Média |
| **Docker: graceful shutdown** (SIGTERM, PID1, Tini, stoppable) | `sections/docker/graceful-shutdown.md:12-51` | Code snippet | `templates/docker/entrypoint-graceful.sh` | 🟠 Média |
| **Docker: bootstrap using node** (não npm start) para PID1 | `sections/docker/bootstrap-using-node.md` | Pattern | `agents/trevor/docker/pid1-node.md` | 🟢 Baixa |
| **Production: APM products** (end-to-end user experience) | `sections/production/apmproducts.md:5-24` | Guideline | `agents/trevor/observability/apm-selection.md` | 🟠 Média |
| **Production: stateless + healthcheck endpoint** | `sections/production/bestateless.md` + `createmaintenanceendpoint.md` | Pattern | `agents/trevor/observability/healthcheck-patterns.md` | 🟠 Média |
| **Production: delegate to proxy (nginx)** para SSL, gzip, static | `sections/production/delegatetoproxy.md` | Guideline | `templates/nginx/node-reverse-proxy.conf` | 🟢 Baixa |
| **Production: lock dependencies** (`package-lock.json` / `yarn.lock`) | `sections/production/lockdependencies.md` | Checklist | `checklists/node/lockfile-policy.md` | 🟠 Média |
| **Production: install for production only** (`npm ci --production`) | `sections/production/installforproduction.md` | Tool config | `checklists/node/prod-install.md` | 🟠 Média |
| **Production: set NODE_ENV=production** (3x throughput) | `sections/production/setnodeenv.md:7-15` | Guideline | `agents/trevor/env/node-env-production.md` | 🔴 Alta |
| **Production: monitor/log/smart logging** (request IDs, structured) | `sections/production/smartlogging.md` + `logrouting.md` | Pattern | `agents/trevor/observability/node-structured-logging.md` | 🟠 Média |
| **Production: detect vulnerabilities** (Snyk, npm audit, Dependabot) | `sections/production/detectvulnerabilities.md` | Tool config | `checklists/node/vulnerability-scanning.md` | 🔴 Alta |
| **CI Tools: citools** (GitHub Actions, CircleCI, GitLab, Bitbucket) | `sections/testingandquality/citools.md` | Guideline | `agents/trevor/ci-cd/node-ci-comparison.md` | 🟢 Baixa |
| **Testing: mock external services** (nock, MSW) | `sections/testingandquality/mock-external-services.md` | Pattern | `agents/qualy/mock-external-services.md` | 🟢 Baixa |
| **CI: lint markdown + update badge automation** | `.github/workflows/lint-and-generate-html-from-markdown.yml` + `update-date-in-last-update-badge.yml` | Tool config | `templates/github-actions/markdown-lint.yml` | 🟢 Baixa |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Node 12/14 referenciado em Dockerfile examples | `sections/docker/multi_stage_builds.md:38` | Node 12/14 EOL; usar LTS (20/22) | `FROM node:22-alpine` |
| `yarn install --frozen-lockfile` como padrão | `sections/docker/multi_stage_builds.md:42` | npm/pnpm são mais comuns; yarn v1 EOL | `npm ci` ou `pnpm install --frozen-lockfile` |
| `sudo apt-get install rpm` para instalar Trivy | `sections/docker/scan-images.md:18` | Instalação manual não reprodutível em CI | `aquasecurity/trivy-action` ou `docker://aquasec/trivy` |
| Travis CI / CircleCI / GitLab CI como CI tools | `sections/testingandquality/citools.md` | GitHub Actions domina; exemplos antigos | Focar em GHA + `nektos/act` local |
| PM2 como process manager | `sections/production/restart-and-replicate-processes.md` | Em K8s/Docker Swarm usa-se restart policies; PM2 para VMs bare-metal | Systemd / K8s `restartPolicy: Always` |
| `npm audit` apenas | `sections/production/detectvulnerabilities.md` | Não pega transitive deps bem | `npm audit` + `snyk test` + `dependabot` + `trivy fs` |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] **Gap 1: SBOM generation (CycloneDX/SPDx) + assinatura cosign/slsa** — Sugestão: `cyclonedx-gomod` / `@cyclonedx/bom` no pipeline
- [ ] **Gap 2: K8s deployment manifests (Deployment, Service, HPA, PDB)** — Sugestão: Helm chart base para Node apps
- [ ] **Gap 3: Observabilidade nativa OpenTelemetry (auto-instrumentation)** — Sugestão: `@opentelemetry/sdk-node` + `OTEL_EXPORTER_OTLP_ENDPOINT`
- [ ] **Gap 4: Cost-awareness (right-sizing, VPA, cluster autoscaler)** — Sugestão: Guidelines de resources requests/limits
- [ ] **Gap 5: Supply chain security (SLSA, sigstore, provenance)** — Sugestão: `slsa-framework/slsa-github-generator` no release
- [ ] **Gap 6: GitOps (ArgoCD/Flux) para Node apps** — Sugestão: Example ApplicationSet + Kustomize

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: Seção Node.js Platform — Docker hardening, multi-stage, secrets, scanning, prod patterns, APM
- [ ] **Criar Template**: `templates/docker/Dockerfile.multi-stage.node` — Em: `_consolidado/templates/docker/`
- [ ] **Criar Template**: `templates/docker/.dockerignore.node` — Em: `_consolidado/templates/docker/`
- [ ] **Criar Checklist**: `checklists/docker/image-scanning.md` + `checklists/node/prod-install.md`
- [ ] **Criar ADR**: `ADR-003-node-base-image-alpine-vs-slim` — Para: Escolher base image padrão

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `sections/docker/avoid-build-time-secrets.md:8` — "A Docker image isn't just a bunch of files but rather multiple layers revealing what happened during build-time. In a very common scenario, developers need the npm token during build time (mostly for private registries) - this is falsely achieved by passing the token as a build time args."

> `sections/docker/multi_stage_builds.md:5` — "Multi-stage builds allow to separate build- and runtime-specific environment details... Splitting up your Dockerfiles into multiple stages will help to reduce final image and container size as you'll only ship what you really need to run your application."

> `sections/docker/scan-images.md:7` — "Scanning the code for vulnerabilities is a valuable act but it doesn't cover all the potential threats. Why? Because vulnerabilities also exist on the OS level and the app might execute those binaries like Shell, Tarball, OpenSSL."

> `sections/production/setnodeenv.md:14-15` — "Setting NODE_ENV to production makes your application 3 times faster!"

> `sections/docker/graceful-shutdown.md:7-8` — "In a Dockerized runtime like Kubernetes, containers are born and die frequently... It's achieved by sending a notice (SIGTERM signal) to the process with a 30 second grace period."

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Docker, produção, CI, testes, segurança, observabilidade — cobertura end-to-end |
| **Qualidade** | 5 | Exemplos práticos, anti-patterns, referências a blogs/tools reais |
| **Atualidade** | 4 | Trivy, Snyk, multi-stage, Alpine, APM — mas Node 12/14 em alguns exemplos |
| **Ação** | 5 | Gera Dockerfiles, .dockerignore, checklists, nginx config usáveis AGORA |
| **Completude** | 4 | Cobre build → deploy → run → monitor → secure — faltam K8s/GitOps/SBOM |
| **TOTAL** | **23/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/trevor/extractions/nodebestpractices.md`
- [x] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Template v1.0 — Atualize se precisar de campos extras para seu domínio.*