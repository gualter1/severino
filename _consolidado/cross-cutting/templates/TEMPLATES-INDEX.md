# TEMPLATES UNIFICADOS — Cross-Cutting

**Status**: Consolidado de 10 domínios + Full Pilot (3 projetos) | **Última atualização**: 2027-04-09

---

## 📁 ESTRUTURA DE TEMPLATES

```
_consolidado/cross-cutting/templates/
├── frontend/
│   ├── vite-react-ts-unocss/          # ADR-005 (Turing + Trevor + Qualy)
│   ├── storybook-with-unocss/          # Turing
│   ├── justfile/                       # Turing (AionUi)
│   └── CLAUDE.frontend.md              # Turing (AI-assisted)
├── backend/
│   ├── feature-skeleton/               # ADR-001 → ADR-026 V2 (Niamaia + Towards)
│   │   ├── src/
│   │   │   ├── domain/ (index.ts barrel)
│   │   │   ├── application/ (index.ts barrel)
│   │   │   ├── infrastructure/
│   │   │   │   ├── persistence/
│   │   │   │   ├── messaging/
│   │   │   │   ├── external/
│   │   │   │   ├── logging/
│   │   │   │   └── observability/      # ADR-030 (otel + audit-logger)
│   │   │   └── interfaces/ (index.ts barrel)
│   │   ├── contracts/ (openapi, asyncapi, mcp-manifest)
│   │   ├── tests/ (unit, integration, contract)
│   │   ├── scripts/ (validate, dx-telemetry, migrate-v1-to-v2)
│   │   ├── .github/workflows/feature-ci.yml
│   │   ├── package.json (V2 scripts + deps)
│   │   ├── tsconfig.json (Bundler, exactOptionalPropertyTypes: false)
│   │   ├── vitest.config.ts (core layers only)
│   │   ├── eslint.config.js (no-console: warn + logging override)
│   │   └── CHANGELOG.md
│   ├── feature-skeleton-go/            # ADR-027 (Go variant)
│   │   ├── go.mod + Makefile
│   │   ├── src/ (same structure)
│   │   ├── tests/ (testify + go test -cover)
│   │   └── .github/workflows/feature-ci.yml (detects go)
│   ├── feature-skeleton-rust/          # ADR-027 (Rust variant)
│   │   ├── Cargo.toml + Makefile
│   │   ├── src/ (same structure)
│   │   ├── tests/ (cargo test + cargo-tarpaulin)
│   │   └── .github/workflows/feature-ci.yml (detects rust)
│   ├── feature-skeleton-python/        # ADR-027 (Python variant)
│   │   ├── pyproject.toml + uv.lock
│   │   ├── src/ (same structure)
│   │   ├── tests/ (pytest + pytest-cov + mutmut)
│   │   └── .github/workflows/feature-ci.yml (detects python)
│   ├── async-store-interface.ts        # ADR-002 (Niamaia + Towards + Turing)
│   ├── config-validation-zod.ts        # Tranquilão + Niamaia + Guanabara
│   ├── config-structure.md             # Trevor + Guanabara
│   ├── error-handling-guidelines.md    # Towards (nodebestpractices)
│   ├── secure-config-checklist.md      # Towards + Tranquilão
│   ├── graceful-shutdown-health-probes.md # Towards + Trevor
│   └── auth-baseline.md                # Tranquilão (bcrypt + JWT + rotation)
├── mobile/
│   ├── android/
│   │   ├── feature-skeleton/           # ADR-001 (Niamaia + Towards)
│   │   ├── proguard-rules.pro          # Tranquilão + Trevor
│   │   ├── signing-config.gradle       # Trevor
│   │   ├── network-security-config.xml.template # Tranquilão (ADR-009)
│   │   └── quality-gates.md            # Trevor + Qualy
│   ├── ios/
│   │   ├── xcconfig-starter/           # Trevor + Guanabara (Common/Debug/Release)
│   │   ├── Info.plist-security-baseline # Tranquilão (ADR-009)
│   │   ├── PrivacyInfo.xcprivacy.template # Tranquilão (ADR-009) + Guanabara
│   │   ├── viewcontroller-structure.swift # Guanabara
│   │   ├── constants.swift             # Guanabara (enum Config/Color)
│   │   ├── provisioning-debug.md       # Trevor + Guanabara
│   │   └── dsym-retention.md           # Trevor
│   └── feature-skeleton/               # ADR-001 cross-platform
├── docker/
│   ├── Dockerfile.multi-stage.node     # Trevor + Niamaia
│   ├── Dockerfile.nextjs.prod          # Trevor (dify)
│   ├── Dockerfile.fastapi.uv.prod      # Trevor (dify)
│   ├── Dockerfile.go.agent             # Trevor (context-mode)
│   ├── .dockerignore.node              # Trevor + nodebestpractices
│   ├── docker-compose.prod.yml         # Trevor (dify)
│   └── entrypoint-graceful.sh          # Trevor (Tini + PID1)
├── ci-cd/
│   ├── github-actions/
│   │   ├── monorepo-main-ci.yml        # Trevor (dify paths-filter)
│   │   ├── multiarch-build-push.yml    # Trevor (Depot runners)
│   │   ├── multi-os-ci.yml             # Trevor (context-mode ubuntu/mac/windows)
│   │   ├── docker-build-pr.yml         # Trevor (dify)
│   │   ├── bundle-auto-commit.yml      # Trevor (context-mode → PR + auto-merge)
│   │   ├── db-migration-test.yml       # Trevor (dify flask db upgrade)
│   │   ├── cli-release.yml             # Trevor (dify dispatch + R2)
│   │   ├── android-ci.yml              # Trevor (AAB + device farm)
│   │   ├── ios-ci.yml                  # Trevor (Fastlane Match + GHA macOS)
│   │   ├── react-ci.yml                # Trevor + Turing (Vite + Vitest + Playwright)
│   │   └── quality-gates.yml           # ADR-016 (SAST/DAST/Secrets/Deps)
│   ├── feature-ci.yml                  # ADR-026 V2 (lint + typecheck + test:coverage + security + docker + validate)
│   ├── fastlane/
│   │   ├── Fastfile                    # Trevor (iOS release automation)
│   │   ├── Matchfile                   # Trevor (certs provisioning)
│   │   └── Appfile                     # Trevor (app identifiers)
│   └── helm/
│       └── app/                        # Trevor (ADR-004 GitOps → ArgoCD/Flux)
├── security/
│   ├── SECURITY.md.baseline            # Tranquilão + Kaspersky (Dify baseline)
│   ├── claude-code/
│   │   └── settings.json.baseline      # Tranquilão + Trevor (allow/deny + hooks)
│   ├── mcp/
│   │   └── adapter-configs/            # Trevor (10+ IDEs/CLIs)
│   └── threat-model-template.md        # Kaspersky (STRIDE template)
├── claude/
│   ├── CLAUDE.md.template              # Guanabara + Towards (lean, <200 lines)
│   ├── commands/                       # Towards (custom commands)
│   └── skills/                         # Towards (progressive disclosure)
├── docs/
│   ├── readme-starter.md               # Guanabara (project-guidelines modernizado)
│   ├── api-endpoint-doc.md             # Guanabara (project-guidelines)
│   ├── TestPlan.md                     # Qualy (rastreabilidade req→test→auto)
│   └── rag-pipeline-blueprint.md       # Towards (awesome-llm-apps)
├── onboarding/
│   ├── git-workflow.md                 # Guanabara (feature-branch + rebase + conventions)
│   ├── env-config.md                   # Guanabara + Trevor (env separation + validation)
│   ├── dep-management.md               # Guanabara (lockfile + audit)
│   ├── testing-pyramid.md              # Qualy (unit→component→contract→e2e→visual)
│   ├── project-structure.md            # Guanabara + Niamaia (feature-based)
│   ├── logging-api.md                  # Guanabara + Trevor (sanitization + structured)
│   ├── a11y-basics.md                  # Guanabara + Turing (WCAG 2.1 AA)
│   ├── security-baseline.md            # Tranquilão + Kaspersky (ADR-007/009)
│   ├── ci-cd.md                        # Trevor + Guanabara (local loop + pipeline)
│   └── glossary.md                     # Guanabara (termos cross-domain)
├── testing/
│   ├── test-anatomy-template.md        # Guanabara (nome 3 partes + AAA)
│   ├── LLM-Contract-Test.md            # Qualy (awesome-llm-apps JSON schema)
│   ├── api-contract-gate.md            # Qualy + Tranquilão (Pact consumer-driven)
│   ├── quality-gate-js.md              # Qualy + Tranquilão (80/70 + Stryker + SAST)
│   └── authz-tests.md                  # Qualy + Tranquilão + Kaspersky (resource-level)
├── skills/
│   ├── onboarding-project-hygiene/     # Guanabara (Git→Env→Deps→Tests→Structure→Style→Logging→API→A11y)
│   ├── guanabara-ios-onboarding/       # Guanabara (Jr/Mid/Sr paths + quizzes)
│   ├── android-resources-palettes/     # Guanabara (colors/dimens/styles)
│   ├── dify-platform-ops/              # Trevor (Dify local dev + ops)
│   ├── mcp-plugin-platform-ops/        # Trevor (MCP security + distribution)
│   ├── android-release-automation/     # Trevor (signing + AAB + Play)
│   ├── claude-code-config-audit/       # Trevor (permissions + hooks review)
│   ├── react-performance-profiling/    # Turing
│   ├── a11y-testing/                   # Turing + Qualy (axe-core + Playwright)
│   ├── design-token-sync/              # Turing (Figma → JSON → UnoCSS → Storybook)
│   ├── ai-frontend-review/             # Turing (a11y + perf + design prompts)
│   ├── js-perf-patterns/               # Turing (debounce/throttle/memoize)
│   ├── android-hardening-audit/        # Tranquilão
│   ├── node-security-audit/            # Tranquilão
│   ├── ai-agent-security-audit/        # Tranquilão + Kaspersky
│   ├── llm-app-security-review/        # Tranquilão + Kaspersky
│   ├── threat-modeling-workshop/       # Kaspersky
│   ├── sast-dast-config/               # Kaspersky + Qualy + Trevor
│   ├── compliance-mapping/             # Kaspersky + Tranquilão + Guanabara
│   └── ai-security-review/             # Kaspersky (prompt injection + RAG poisoning)
├── mcp/
│   ├── mcp-v2-sdk/                     # ADR-029 (monorepo pnpm + Turborepo)
│   │   ├── packages/
│   │   │   ├── core/ (types, schemas)
│   │   │   ├── client/ (AgentClient)
│   │   │   ├── server/ (AgentServer)
│   │   │   ├── transport/ (websocket, stdio, http)
│   │   │   ├── crypto/ (mTLS, JWT)
│   │   │   ├── resilience/ (retry, CB, timeout)
│   │   │   ├── testing/ (MockServer, MockClient)
│   │   │   └── cli/ (dev, inspect, certify, init)
│   │   ├── turbo.json
│   │   └── .github/workflows/publish.yml
│   └── compat-layer/                   # ADR-022 (V1→V2 bridge)
└── dx/
    ├── dx-telemetry.js                 # ADR-028 (opt-in telemetry)
    ├── dx-telemetry-schema.json
    └── migrate-v1-to-v2.js             # ADR-026 (V1→V2 migration)
```

---

## 🎯 TEMPLATES CRÍTICOS (Q2 2027 — Pós Full Pilot)

| Template | ADR | Owner | Status | Prazo |
|----------|-----|-------|--------|-------|
| `feature-skeleton/` V2 | ADR-026 | Towards | ✅ **APROVADO** | 2027-04-16 |
| `feature-skeleton-go/` | ADR-027 | Towards | 🟡 **PLANNED** | 2027-05-15 |
| `feature-skeleton-rust/` | ADR-027 | Towards | 🟡 **PLANNED** | 2027-05-29 |
| `feature-skeleton-python/` | ADR-027 | Towards | 🟡 **PLANNED** | 2027-06-12 |
| `mcp-v2-sdk/` | ADR-029 | Towards | 🟡 **PLANNED** | 2027-08-21 |
| `dx-telemetry.js` + dashboard | ADR-028 | Trevor | 🟡 **PLANNED** | 2027-05-21 |
| `feature-skeleton/` V2 migration | ADR-026 | Towards | 🟡 **PLANNED** | 2027-04-30 |
| `observability/` (otel + audit) | ADR-030 | Towards | 🟡 **PLANNED** | 2027-05-07 |
| Multi-language `feature-ci.yml` | ADR-027 | Trevor | 🟡 **PLANNED** | 2027-06-19 |

---

## 🔄 GOVERNANÇA DE TEMPLATES

| Regra | Descrição |
|-------|-----------|
| **Versionamento** | Templates versionados no `_consolidado/templates/` com `CHANGELOG.md` |
| **Review** | Todo template novo/modificado passa por 2 leads (domain + cross-cutting) |
| **Depreciação** | Templates legados marcados com `DEPRECATED.md` + migração documentada |
| **Uso Obrigatório** | Novos projetos DEVEM usar templates aprovados (CI gate valida) |
| **Customização** | Permitida via `.template-config.json` por projeto (não fork) |
| **Migration Script** | `migrate-v1-to-v2.js` para features existentes (ADR-026) |

---

*Templates consolidados de 10 domínios + Full Pilot learnings — Severino (Leader) 2027-04-09*