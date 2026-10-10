# ADR-001: Feature-based Packaging as Default

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino (Leader) | **Domínios**: Niamaia + Towards + Trevor + Turing

---

## Contexto
Múltiplos repos (android-best-practices, nodebestpractices, react-boilerplate, ios-good-practices) convergem para **feature-based packages/modules** como padrão de organização de código, em vez de camadas técnicas (controllers/models/services).

## Decisão
**Adotar feature-based packaging como padrão obrigatório** para todos novos serviços/features:
- Cada feature = diretório autônomo com sua própria estrutura (entry-points, domain, data-access, tests)
- Limites claros entre features (bounded contexts)
- Shared kernel apenas para contratos comuns (types, interfaces)

## Alternativas Consideradas
| Alternativa | Prós | Contras | Decisão |
|-------------|------|---------|---------|
| Layered (controllers/services/models) | Familiar, simples | Acoplamento, hard to test, god classes | ❌ Rejeitada |
| Feature-based | Isolamento, testabilidade, onboarding | Mais dirs iniciais | ✅ Aprovada |
| Modular Monorepo (Nx/Turborepo) | Build caching, boundaries | Overhead tooling | 🔄 Futuro (ADR separado) |

## Consequências
- **Positivas**: Melhor isolation, parallel development, easier onboarding, clear ownership
- **Negativas**: Mais boilerplate inicial, requires discipline para não vazar deps cross-feature
- **Riscos**: Feature creep (features too small) → Mitigação: mínimo 3 arquivos/domain logic por feature

## Implementação
- Template: `templates/feature-skeleton/` (por platform: mobile, backend, frontend)
- Lint rule: ban import cross-feature sem explicit boundary
- Code review checklist: "Feature boundary respected?"

---

# ADR-002: Async Store Layer Pattern

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Niamaia + Towards + Turing

---

## Contexto
Repos iOS (ios-good-practices), Node.js (nodebestpractices) e Frontend (awesome-llm-apps, react-boilerplate) convergem para **Store Layer assíncrona** como boundary entre UI/API e lógica de negócio.

## Decisão
**Padronizar Async Store Layer** como camada obrigatória:
- **Mobile**: `Store` protocol com `SignalProducer` / `Combine` / `async-await` (nunca callbacks)
- **Backend**: Repository/Service pattern com `async/await` + cancellation support
- **Frontend**: TanStack Query (server state) + Zustand (client state) — ambos async-first
- **AI Agents**: Tool calls com timeout + cancellation tokens

## Interfaces Padronizadas
```typescript
// Backend/Node
interface Store<T> {
  find(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

// Frontend (TanStack Query)
const useStore = (id: string) => useQuery({ queryKey: ['store', id], queryFn: () => api.get(id) });

// Mobile (Swift)
protocol Store {
  func fetch(_ id: String) async throws -> Entity?
}
```

## Consequências
- **Elimina**: callback hell, race conditions, memory leaks
- **Permite**: retry policies, optimistic updates, offline-first, time-travel debugging

---

# ADR-003: Multi-Agent Orchestration Pattern

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Towards + Kaspersky + Turing + Guanabara

---

## Contexto
Claude Code, awesome-llm-apps, dify demonstram necessidade de **orquestração multi-agente** para features complexas.

## Decisão
**Adotar padrão Planner-Executor-Critic** com isolamento via Git Worktrees:
1. **Planner Agent**: Decomposição da feature em tarefas atômicas + dependency graph
2. **Executor Agents** (paralelos): Cada um em worktree isolado, reporta via ledger
3. **Critic Agent**: Review integrado (security, quality, architecture) antes de merge
4. **Orchestrator (Severino)**: Aprova plano, monitora progresso, resolve conflitos

## Regras de Isolamento
- Cada agent = worktree + branch dedicada
- Comunicação via ledger (arquivo JSONL append-only)
- Zero shared mutable state entre agents
- Merge apenas após aprovação do Critic + CI verde

## Consequências
- **Garante**: parallelismo seguro, auditabilidade, rollback granular
- **Custo**: overhead de setup worktrees (~30s), disk space

---

# ADR-004: Git Worktrees Isolation for Parallel Development

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Towards + Severino + Trevor + Guanabara

---

## Contexto
Claude Code best practices + awesome-llm-apps + context-mode mostram **Git Worktrees** como mecanismo nativo de isolamento para desenvolvimento paralelo (humanos + agents).

## Decisão
**Git Worktrees obrigatórios** para:
- Features paralelas (>2 devs/agents na mesma base)
- Agent teams (cada agent = worktree)
- Hotfixes paralelos a feature development
- Experiment spikes (throwaway worktrees)

## Setup Padrão
```bash
# Feature worktree
git worktree add ../feature-xyz feature/xyz

# Agent worktree (auto-cleanup on done)
git worktree add ../agent-planner-$(date +%s) agent/planner
```

## Cleanup Policy
- Worktrees de agents: auto-remove após merge/rejection
- Worktrees de features: manter até merge + 7 dias
- Script de limpeza semanal: `git worktree prune --expire=7.days.ago`

---

# ADR-005: Vite + UnoCSS + Vitest as Frontend Standard

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Turing + Trevor + Qualy

---

## Contexto
Turing (AionUi, ui-ux-pro-max-skill) + Trevor (context-mode CI) + Qualy (testing strategy) convergem para stack moderna.

## Decisão
| Camada | Padrão | Legado (não usar em novos projetos) |
|--------|--------|--------------------------------------|
| **Build** | Vite 5+ / Turbopack (Next.js) | Webpack 5 |
| **Styling** | UnoCSS utility-first + CSS Variables (tokens) | CSS Modules / styled-components / Tailwind (runtime) |
| **Testing** | Vitest 2+ (unit) + Playwright (E2E + visual) | Jest / Cypress |
| **Type Safety** | TypeScript strict, `type` over `interface`, no `any` | Loose TS |
| **Package Manager** | pnpm + Turborepo (monorepo) / Bun (scripts) | npm / yarn |
| **CI** | GitHub Actions + `just push` pipeline | Travis / Jenkins / manual |

## Consequências
- **Build 10x mais rápido** (Vite vs Webpack)
- **Bundle menor** (UnoCSS atomic CSS vs runtime CSS-in-JS)
- **Testes 5x mais rápidos** (Vitest vs Jest)

---

# ADR-006: WCAG 2.1 AA Baseline Mandatory

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Turing + Tranquilão + Qualy

---

## Contexto
Turing (ui-ux-pro-max-skill, AionUi) + Tranquilão (security/quality gates) + Qualy (accessibility testing) exigem baseline de acessibilidade.

## Decisão
**WCAG 2.1 AA obrigatório** para todos os entregáveis user-facing:
- **CI Gate**: axe-core em Playwright + Lighthouse CI
- **Focus Management**: `focus-visible` em todos elementos interativos
- **Semantic HTML**: heading hierarchy, landmarks, form labels
- **Color Contrast**: 4.5:1 normal, 3:1 large text
- **Keyboard Navigation**: Tab order lógico, skip links, focus trap em modais
- **Screen Reader**: ARIA labels onde semântica nativa insuficiente

## Tooling
- `npm run a11y` → roda axe-core + lighthouse
- Storybook com addon-a11y para component review
- Design tokens exportados para Figma (garante contraste)

---

# ADR-007: Node Security Baseline

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Tranquilão + Kaspersky + Towards + Qualy

---

## Contexto
Tranquilão (nodebestpractices Seção 6), Kaspersky (Node.js STRIDE), Towards (nodebestpractices security), Qualy (SAST gates) convergem.

## Decisão
**Node Security Baseline obrigatório** em todos serviços Node.js:

| Controle | Implementação | Threshold |
|----------|---------------|-----------|
| **Security Headers** | `helmet` (CSP strict, HSTS, COOP, COEP) + `cors` allowlist | CI gate |
| **Rate Limiting** | `express-rate-limit` (IP+user) + `slow-down` | CI gate |
| **Input Validation** | Zod/Valibot na borda (antes de service) | Code review |
| **Auth** | `bcrypt` cost 12, JWT 15min + refresh 7d + `jti` revocation (Redis) + 2FA | Code review |
| **SQL/NoSQL Injection** | ORM parameterized apenas (Prisma/Sequelize/Knex) | SAST gate |
| **Crypto** | `node:crypto` AES-GCM/RSA-OAEP/Ed25519 — sem md5/sha1 | SAST gate |
| **Dangerous Patterns** | `eslint-plugin-security`: detect-eval, child-process, non-literal-regex | SAST gate |
| **Error Handling** | `http-errors` — nunca vazar stack (ASVS 7.x) | Code review |
| **Supply Chain** | `npm audit` + Snyk + OSV + Dependabot + gitleaks pre-commit | CI gate |

---

# ADR-008: Coverage Gate 80/70 + Mutation Testing

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Tranquilão + Kaspersky + Qualy

---

## Contexto
Tranquilão, Kaspersky, Qualy convergem para quality gates rigorosos.

## Decisão
| Gate | Threshold | Ação se Falhar | Ferramenta |
|------|-----------|----------------|------------|
| **Line Coverage** | ≥ 80% | Block PR | Vitest/Jest/Pytest |
| **Branch Coverage** | ≥ 70% | Block PR | Vitest/Jest/Pytest |
| **Mutation Score (Critical Paths)** | ≥ 80% auth/crypto/payments | Block PR | Stryker/MutPy |
| **Mutation Score (Overall)** | ≥ 60% | Warn | Stryker/MutPy |

## Critical Paths Definition
- Auth/Crypto/Payments modules
- API boundary handlers
- Data transformation pipelines
- Security middleware

---

# ADR-009: Android/iOS Security Baseline

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Tranquilão + Kaspersky + Trevor + Niamaia

---

## Contexto
Mobile hardening convergente entre Tranquilão, Kaspersky, Trevor (CI), Niamaia (architecture).

## Decisão

### Android
| Baseline | Implementação |
|----------|---------------|
| **Obfuscação** | ProGuard/R8 obrigatório (`minifyEnabled true`, `shrinkResources true`), **salvar `mapping.txt` por release** |
| **Network** | `network_security_config.xml`: cleartext=false + pinning (2+ backup pins) |
| **Secrets** | Keystore + `EncryptedSharedPreferences` (API 23+) |
| **Backup** | `allowBackup=false` + `fullBackupContent=@xml/backup_rules` |
| **Attestation** | Play Integrity API (não SafetyNet) |

### iOS
| Baseline | Implementação |
|----------|---------------|
| **Compiler Hardening** | `-fstack-protector-strong`, `-fPIE -pie` |
| **Network** | ATS strict + Certificate Pinning (TrustKit/Alamofire) |
| **Secrets** | Keychain `WhenUnlockedThisDeviceOnly` + Secure Enclave |
| **Biometric** | `LocalAuthentication` + Keychain accessControl |
| **Privacy** | `PrivacyInfo.xcprivacy` (iOS 17+) |
| **Attestation** | DeviceCheck / App Attest |

---

# ADR-010: AI Agent Sandbox Obrigatório

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Tranquilão + Kaspersky + Towards + Guanabara

---

## Contexto
Claude Code, awesome-llm-apps, dify demonstram riscos de agents sem isolamento.

## Decisão
**Todo AI Agent em produção deve ter**:

| Controle | Implementação |
|----------|---------------|
| **Permissions Model** | `settings.json` allow/deny list — nunca `--dangerously-skip-permissions` |
| **Filesystem Scope** | Chroot/container com allowlist de paths (read/write/execute) |
| **Network Scope** | Allowlist de domínios/portas — deny by default |
| **HITL** | Aprovação humana para: bash, network write, file write sensível, tool calls > threshold |
| **Audit Log** | JSONL com: agent_id, action, params_hash, result_summary, timestamp, user_id |
| **Secrets** | Apenas via env var injection — nunca no prompt/contexto |
| **SBOM** | Skills/MCP servers pinned por SHA, review `curl \| bash` |
| **Cost Guard** | Token budget por agent/run, alerta em 80% |

---

# ADR-011: OWASP LLM Top 10 Gate

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Tranquilão + Kaspersky + Towards

---

## Contexto
Kaspersky (OWASP LLM Top 10 mapping), Tranquilão (LLM security), Towards (agent orchestration).

## Decisão
**Todo LLM App/Agent em produção deve passar no gate OWASP LLM Top 10**:

| LLM Risk | Mitigação Obrigatória | Validação |
|----------|----------------------|-----------|
| **LLM01 Prompt Injection** | Input sanitization + output validation + allowlist tools | Eval adversarial |
| **LLM02 Insecure Output** | Structured output (JSON Schema/Pydantic) + validation | Contract test |
| **LLM03 Training Data Poisoning** | Data provenance + hash verification + eval gate | CI gate |
| **LLM04 Model DoS** | Token budget + rate limit + timeout per request | Monitoring |
| **LLM05 Supply Chain** | SBOM skills/models + pin SHA + cosign verify | CI gate |
| **LLM06 PII Leakage** | Redaction pipeline antes de enviar a LLM | Automated test |
| **LLM07 Insecure Plugins** | MCP allowlist + capability-based permissions | Code review |
| **LLM08 Excessive Agency** | Tool allowlist + confirmation for destructive actions | HITL gate |
| **LLM09 Overreliance** | Human review for high-stakes outputs | Workflow gate |
| **LLM10 Model Theft** | Rate limiting + watermarking + API key rotation | Monitoring |

---

# ADR-012: LLM Platform Hardening (Dify Baseline)

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Tranquilão + Kaspersky + Trevor

---

## Contexto
Dify como plataforma LLMOps de referência (Tranquilão 21/25, Kaspersky 21/25, Trevor 24/25).

## Decisão
**Dify Baseline obrigatório** para qualquer plataforma LLM self-hosted:

| Controle | Implementação |
|----------|---------------|
| **SECURITY.md** | Disclosure policy + SLA + escopo |
| **Multi-tenant RBAC** | Workspace isolation + API key scoping + rate limit per tenant |
| **Data Isolation** | RLS (Row Level Security) + container-level isolation |
| **Self-hosted Residency** | Dados não saem da infra do cliente |
| **Audit Logs** | Immutable log de todas ações (admin, user, agent) |
| **Supply Chain** | SBOM + SLSA + image signing |
| **RAG Pipeline Security** | Doc validation + embedding sanitization + retrieval guards |

---

# ADR-013: Supply Chain Gates (SBOM + SLSA + Cosign + Gitleaks)

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Tranquilão + Kaspersky + Trevor + Qualy

---

## Contexto
Supply chain security convergente: Tranquilão (npm audit + Snyk + OSV), Kaspersky (SLSA), Trevor (SBOM/cosign), Qualy (dependency audit).

## Decisão
**Pipeline Supply Chain obrigatório**:

| Stage | Ferramenta | Threshold |
|-------|------------|-----------|
| **SBOM Generation** | Syft (CycloneDX) | Block Release se ausente |
| **Vulnerability Scan** | Snyk + OSV + Trivy | 0 High/Critical |
| **SLSA Provenance** | SLSA GitHub Actions Level 2+ | Warn se < Level 2 |
| **Image Signing** | Cosign (keyless) | Block Release se não assinado |
| **Secrets Scan** | Gitleaks + TruffleHog | Block Commit |
| **Dependency Pinning** | `package-lock.json` / `pnpm-lock.yaml` / `Package.resolved` | CI gate |

---

# ADR-014: Logging Sanitization Obrigatória

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Tranquilão + Kaspersky + Todos

---

## Contexto
PII/tokens vazando em logs identificado em múltiplos domínios.

## Decisão
**Logging Sanitization obrigatória** em todos os serviços:

| Regra | Implementação |
|-------|---------------|
| **PII Redaction** | CPF, CNPJ, email, phone, credit card, tokens, passwords → `[REDACTED]` |
| **Structured Logs** | JSON com `level`, `timestamp`, `service`, `trace_id`, `span_id` |
| **No Secrets** | Nunca logar: Authorization headers, cookies, DB passwords, API keys |
| **Log Levels** | DEBUG/TRACE apenas em dev/staging; PROD = INFO/WARN/ERROR |
| **Retention** | 30 dias hot, 1 ano cold (compliance) |
| **Tooling** | Pino/Winston (Node), zap (Go), structlog (Python), os_log (iOS), Timber (Android) |

---

# ADR-015: Threat Modeling Obrigatório (STRIDE)

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Kaspersky + Niamaia + Trevor

---

## Contexto
Kaspersky (threat models), Niamaia (architecture decisions), Trevor (platform security).

## Decisão
**Todo novo serviço deve ter Threat Model STRIDE aprovado** antes de ir para produção:

| Fase | Responsável | Entregável |
|------|-------------|------------|
| **Design** | Arquiteto (Niamaia) + Kaspersky | `threat-models/{service}-stride.md` |
| **Review** | Kaspersky + Trevor | Aprovação escrita |
| **Implementation** | Dev team | Security controls como código |
| **Validation** | Kaspersky + Qualy | SAST/DAST gates + penetration test (se high-risk) |

## Template Obrigatório
- Assets & Trust Boundaries
- STRIDE per component (Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation)
- Mitigations mapped to controls
- Residual risk acceptance (se houver)

---

# ADR-016: SAST/DAST Gates Obrigatórios no CI

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Kaspersky + Qualy + Trevor

---

## Contexto
Kaspersky (SAST/DAST rulesets), Qualy (quality gates), Trevor (CI/CD pipelines).

## Decisão
**Pipeline CI obrigatório** com gates:

| Stage | Ferramenta | Config | Fail Condition |
|-------|------------|--------|----------------|
| **SAST JS/TS** | ESLint Security + Semgrep | `eslint-security-rules.md` + `semgrep-rules-nodejs.yaml` | 0 High/Critical |
| **SAST Python** | Bandit + Semgrep | `semgrep-rules-python.yaml` | 0 High/Critical |
| **SAST Mobile** | Detekt/SwiftLint + Semgrep | `semgrep-rules-android.yaml` / `ios-semgrep-rules.yaml` | 0 High/Critical |
| **Secrets** | Gitleaks + TruffleHog | Pre-commit + CI | 0 findings |
| **Dependency** | Snyk + OSV + Dependabot | `package-lock.json` pinned | 0 High/Critical |
| **DAST Web/API** | OWASP ZAP | Active + Authenticated scan | 0 Critical |
| **DAST Mobile** | MobSF | Static + Dynamic | 0 Critical |
| **DAST LLM** | Garak + Custom | Prompt injection + PII leakage | 0 Critical |

---

# ADR-017: Compliance Mapping por Domínio

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Kaspersky + Tranquilão + Guanabara

---

## Contexto
Kaspersky (MASVS/ASVS/LLM Top 10), Tranquilão (compliance gaps), Guanabara (teaching/onboarding compliance).

## Decisão
**Cada domínio deve manter Compliance Mapping vivo**:

| Domínio | Standard | Mapping File | Owner |
|---------|----------|--------------|-------|
| **Mobile** | OWASP MASVS v2 | `compliance/masvs-matrix-android.md` + `ios` | Kaspersky + Tranquilão |
| **Backend/API** | OWASP ASVS 4.x | `compliance/asvs-node-mapping.md` | Kaspersky + Tranquilão |
| **AI/LLM** | OWASP LLM Top 10 | `compliance/owasp-llm-top10.md` | Kaspersky + Tranquilão |
| **Data/Privacy** | LGPD/GDPR | `compliance/lgpd-data-map.md` + `lgpd-llm.md` | Tranquilão + Guanabara |
| **Platform** | SOC2 Type II | `compliance/soc2-ai-audit.md` + `soc2-node-mapping.md` | Kaspersky + Trevor |
| **Mobile Attestation** | Play Integrity / App Attest | `compliance/play-integrity.md` + `ios-app-attest.md` | Kaspersky + Tranquilão |

---

# ADR-018: Warnings-as-Errors em Todas as Plataformas

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Qualy + Tranquilão + Kaspersky + Trevor + Turing

---

## Contexto
Qualy (ios-good-practices), Tranquilão (SAST), Kaspersky (SAST gates), Trevor (Clang Analyzer), Turing (TS strict).

## Decisão
**Warnings-as-Errors obrigatório** em todas as plataformas:

| Plataforma | Configuração |
|------------|--------------|
| **TypeScript** | `"strict": true`, `"noUncheckedIndexedAccess": true`, `"exactOptionalPropertyTypes": true` |
| **Swift** | `SWIFT_TREAT_WARNINGS_AS_ERRORS = YES`, `-Wall -Wextra` |
| **Kotlin** | `-Xlint:all`, `-Werror` |
| **Python** | `-W error`, `ruff` / `mypy --strict` |
| **Go** | `-vet=all`, `staticcheck` |
| **CI** | Fail build on qualquer warning |

---

# ADR-019: Onboarding Standard (Glossário + Git + Env + Deps + Tests + Structure + Style + Logging + API + A11y)

**Status**: ✅ **APROVADO** | **Data**: 2026-10-08 | **Autor**: Severino | **Domínios**: Guanabara + Niamaia + Trevor + Qualy + Turing

---

## Contexto
Guanabara (project-guidelines, ios-good-practices, android-best-practices) extraiu onboarding completo end-to-end.

## Decisão
**Onboarding Standard obrigatório** para todo novo dev (primeira semana):

| Dia | Tópico | Material | Validação |
|-----|--------|----------|-----------|
| 1 | **Git + Workflow** | `onboarding/git-workflow.md` + `analogies/git-workflow.md` | Commit + PR mock |
| 2 | **Environment** | `onboarding/env-config.md` + `templates/dotenv/.env.example` | Boot válido |
| 3 | **Dependencies** | `onboarding/dep-management.md` + `checklists/dependency-health-check.md` | Audit limpo |
| 4 | **Testing** | `onboarding/testing-pyramid.md` + `checklists/quality-gate-js.md` | Test passing |
| 5 | **Structure + Style** | `onboarding/project-structure.md` + `templates/feature-skeleton/` | Feature mock |
| 6 | **Logging + API** | `onboarding/logging-api.md` + `checklists/api-security-basics.md` | Log sanitizado |
| 7 | **Accessibility** | `onboarding/a11y-basics.md` + `checklists/a11y-basics.md` | Axe-core pass |
| 8 | **Security** | `onboarding/security-baseline.md` + `checklists/pr-security-checklist.md` | PR approved |
| 9 | **Platform** | `onboarding/ci-cd.md` + `runbooks/local-quality-loop.md` | Pipeline green |
| 10 | **Grill-me** | Guanabara session: explicar 3 conceitos para "leigo" | Aprovação Guanabara |

---

*ADRs 001-019 aprovados por Severino (Leader) em 2026-10-08. Próxima revisão: 2027-04-08 (6 meses).*

---

# ADR-020: Skill Versioning com SemVer para Prompts

**Status**: ✅ **APROVADO** (Grill-Me Session 1) | **Data**: 2026-10-09 | **Autores**: Guanabara, Towards, Niamaia, Trevor | **Decisor**: Severino

---

## Contexto
No ecossistema de agent skills (`skillpper`, ECC, etc.), as skills evoluem como código. No entanto, faltava um contrato de versionamento consistente (`version` no frontmatter), o que causava quebras em cadeia quando prompts ou dependências mudavam de comportamento sem aviso prévio aos consumidores.

## Decisão
Adotar **Semantic Versioning (SemVer) estrito** no frontmatter YAML de todo `SKILL.md`:
- **MAJOR (`X.0.0`)**: Mudança breaking em interface, triggers, ou contrato de output.
- **MINOR (`0.X.0`)**: Adição de nova capacidade ou comportamento retrocompatível.
- **PATCH (`0.0.X`)**: Correção de bug, ajuste de instrução ou melhoria de texto sem mudança de contrato.
- **Registry / Consumidor**: O registry serve múltiplas versões simultaneamente. Consumidores podem fixar versão (`foo@1.2.0`) ou usar ranges (`foo@^1.0.0`).
- **Validação CI**: Workflow `.github/workflows/skill-lint.yml` valida frontmatter contra schema JSON e obriga changelog entry.

## Consequências
- **Positivas**: Fim de quebras surpresas em agentes; rastreabilidade de mudanças; suporte a rollbacks determinísticos.
- **Negativas**: Pequeno overhead de manutenção de versão em cada skill (mitigado por automação no CI).
- **Riscos Mitigados**: Quebra silenciosa de prompts em produção.

---

# ADR-021: Three-Shape Plugin Model

**Status**: ✅ **APROVADO** (Grill-Me Session 2) | **Data**: 2026-10-09 | **Autores**: Guanabara, Niamaia, Towards, Turing, Trevor | **Decisor**: Severino

---

## Contexto
Plugins e skills em agentes podem rodar em diferentes ambientes (CLI shell hooks, in-process TypeScript runtime, ou arquivos estáticos de instruções Markdown). Falta de padronização gerava duplicação de lógica e incompatibilidade entre harness environments (Claude Code, OpenCode, Cursor).

## Decisão
Adotar o **Three-Shape Plugin Model**:
- **Shape A (Shell-Hook)**: CLI scripts e ganchos de sistema executados via shell.
- **Shape B (In-Process)**: Runtime direto em TypeScript/JavaScript com acesso completo a APIs.
- **Shape C (Instructions-File)**: Arquivos `.md` puros (SKILL.md / .mdc) injetados no contexto do LLM.
- **Arquitetura (Core + Adapters)**: Port & Adapters. O núcleo do plugin (`PluginCore`) é 100% agnóstico e sem dependências. Cada Shape implementa um adaptador fino que traduz o contexto do harness para o Core.
- **Prioridade Runtime**: O harness detecta automaticamente o ambiente mais leve disponível, com suporte a override explícito via flag de debug.

## Consequências
- **Positivas**: Reúso máximo de código de negócio; suporte a múltiplos harnesses com 1 único codebase; testabilidade isolada do Core.
- **Negativas**: Complexidade inicial de scaffolding de adaptadores.
- **Riscos Mitigados**: Lock-in a um único harness de IA; duplicação de lógica de negócio entre plugins CLI e Web.

---

# ADR-022: Zero-Dependency Dual-Compat (V1/V2)

**Status**: ✅ **APROVADO** (Grill-Me Session 3) | **Data**: 2026-10-09 | **Autores**: Guanabara, Kaspersky, Trevor, Niamaia, Towards | **Decisor**: Severino

---

## Contexto
Plugins precisam rodar tanto no OpenCode V1 (legacy, callbacks) quanto V2 (moderno, promises/async), sem duplicar código ou depender de bibliotecas de terceiros (`dependencies` no `package.json`). Dependências externas aumentam superfície de ataque (supply chain), bundle size e complexidade de build.

## Decisão
Duas regras obrigatórias para todos os plugins/skills publicados:

### 1. Zero-Dependency Enforcement
- **Regra**: `package.json` **não deve conter** campo `dependencies` (apenas `devDependencies` para tooling).
- **CI Gate**: Pipeline falha se `npm ls --prod --parseable` retornar qualquer linha.
- **Exceção**: Apenas via **waiver assinado** por Kaspersky + Trevor (máx 30 dias, expiração automática), com issue link e justificativa documentada em `SECURITY.md`.
- **Alternativa aprovada**: Vendor código necessário no core do plugin ou expor interface para o harness prover.

### 2. Dual-Compat V1/V2 via Bridge Pattern
- **Arquitetura**: `compat-layer.ts` implementa Bridge Pattern.
  - `PluginAPI` = interface estável (contrato do core).
  - `V1Adapter` = traduz callbacks V1 → promises.
  - `V2Adapter` = passa direto (API nativa).
- **Detecção runtime** (<1ms): `typeof opencode?.v2 !== 'undefined' ? 'v2' : 'v1'`.
- **Build único**: Single artifact, entrypoint único, adapters internos.
- **Testes**: Suite parametrizada roda contra V1 e V2 no CI.

## Consequências
- **Positivas**: Segurança supply chain (0 deps runtime); longevidade (roda em V1 e V2); manutenibilidade (core único); SLSA provenance simplificado.
- **Negativas**: Requer disciplina para não usar libs externas; adapters exigem manutenção se APIs V1/V2 divergirem.
- **Riscos Mitigados**: Supply chain attacks; vendor lock-in; fragmentação V1 vs V2.

## Implementação de Referência
- `_consolidado/cross-cutting/templates/skill-template/src/compat-layer.ts`
- CI rule: `skill-review.yaml` rule `DEP001`

---

# ADR-023: Skill Marketplace Governance

**Status**: ✅ **IMPLEMENTADA** (Grill-Me Session 5 - Q1 2027 Week 1 → Implementada 2026-10-09) | **Data**: 2027-01-06 | **Autores**: Guanabara, Towards, Kaspersky, Trevor, Niamaia | **Decisor**: Severino

---

## Contexto
Com a consolidação de `skillpper` e ECC como registries comunitários, a publicação desgovernada de skills gerou riscos: namespace squatting, skills maliciosas (`curl | bash` sem pin), ausência de validação estática e curadoria inconsistente. Era necessário um modelo de governança que equilibrasse abertura comunitária com segurança supply chain e qualidade técnica.

## Decisão
Adotar **Skill Marketplace Governance** em três camadas:

### 1. Papéis & Permissões
- **Author**: publica skills (namespace `author/skill-name`), versiona via SemVer (ADR-020).
- **Reviewer**: valida automaticamente (lint, schema, `dependencies` zero-dep ADR-022) + revisão manual de segurança (Kaspersky/Tranquilão).
- **Curator (Severino + Niamaia)**: promove para `curated/` após votação comunitária e audit SBOM/cosign.

### 2. Lifecycle & Gates
- **Submission** → `skill-lint.yml` (frontmatter schema, SemVer, changelog) → **Security Scan** (gitleaks, Trivy, cosign verify) → **Community Voting** (upvote/downvote + review checklist) → **Curated** (SLSA L2+ provenance, pin SHA).
- **Deprecation**: 30 dias de aviso, redirect de namespace, archive imutável.

### 3. Namespace & Trust
- Namespace hierárquico (`curated/`, `community/`, `experimental/`), reserva de nome por 90 dias, typosquatting detection.
- Trust score por skill (downloads, audit pass, curator badge).

## Consequências
- **Positivas**: Marketplace confiável, discovery padronizado, redução de supply chain attacks, incentivo a qualidade via curadoria.
- **Negativas**: Latência de publicação curated (~2 dias), overhead de review para skills críticas.
- **Riscos Mitigados**: Malware via skills, fragmentação de registries, quebra silenciosa por versionamento ad-hoc.

## Implementação
- **Status**: ✅ Implementada (2026-10-09)
- **Repositório**: `Repositorios/skillpper` (023)
- **Pipeline CI**: `skill-marketplace.yml` (publish → validate → sign → index)
- **Componentes**: Skill Registry + Yank Policy + Trust Score + Namespace Governance (`curated/` / `community/` / `experimental/`)
- **Gates**: `skill-lint.yml` (frontmatter SemVer ADR-020) + `dependencies` zero-dep check (ADR-022) + gitleaks/Trivy/cosign + SLSA L2+ provenance
- **Evidência**: pipeline publish→validate→sign→index operacional; Yank Policy com archive imutável e redirect de namespace

---

# ADR-024: Agent-to-Agent Protocol (MCP v2)

**Status**: ✅ **IMPLEMENTADA** (Grill-Me Session 6 - Q1 2027 Week 1 → Implementada 2026-10-09) | **Data**: 2027-01-07 | **Autores**: Towards, Trevor, Kaspersky, Turing, Niamaia | **Decisor**: Severino

---

## Contexto
Orquestração multi-agente (ADR-003) e isolamento por worktrees (ADR-004) exigem comunicação estruturada entre agentes heterogêneos (humanos, Claude Code, OpenCode, Cursor). MCP v1 (Model Context Protocol) cobre tool-calling client→server, mas não padroniza **agent-to-agent** bidirecional, negociação de capacidades, streaming ou autenticação mútua.

## Decisão
Adotar **MCP v2 - Agent-to-Agent Protocol** como padrão obrigatório para comunicação inter-agentes:

### 1. Transporte & Sessão
- **Transporte**: JSON-RPC 2.0 sobre WebSocket + STDIO fallback (compat V1), com framing binário opcional para payloads >1MB.
- **Sessão**: handshake `capabilities` + `agent_card` (id, role, skills, budget), keepalive 30s, revogação via `session/revoke`.

### 2. Capacidades & Negociação
- **Capability Advertisement**: cada agente expõe `tools`, `skills`, `models`, `permissions` em `agent_card`.
- **Negociação**: `negotiate` RPC seleciona interseção de capacidades; fallback para mínimo comum (plain text + tool allowlist).

### 3. Segurança & Observabilidade
- **mTLS** inter-agente + JWT `agent_token` (TTL 15min, `jti` em Redis), allowlist de peers, rate limit por agente.
- **Audit**: todo `tool_call` e `message` logado em JSONL com `trace_id` correlacionado (OpenTelemetry), integrado ao Sandbox (ADR-010).

### 4. Compatibilidade
- **Bridge V1→V2**: `mcp-compat-layer.ts` traduz MCP v1 callbacks → promises V2; detecção runtime <2ms; single artifact.

## Consequências
- **Positivas**: Interoperabilidade real entre harnesses, streaming bidirecional, orquestração escalável, audit end-to-end.
- **Negativas**: Complexidade de mTLS em dev local (mitigado por `mcp dev --insecure`), overhead de handshake (~50ms).
- **Riscos Mitigados**: Agent impersonation, tool injection cross-agent, silos de protocolo proprietário.

## Implementação
- **Status**: ✅ Implementada (2026-10-09)
- **Repositório**: `_consolidado/cross-cutting` (024/025)
- **Pipeline CI**: `compat-layer-ci.yml` / `skill-marketplace.yml`
- **Componentes**: JSON-RPC 2.0 sobre WebSocket + STDIO fallback, `agent_card` + `capabilities` handshake, `negotiate` RPC, mTLS + JWT `agent_token` (TTL 15min, `jti` Redis), rate limit por agente, OpenTelemetry `trace_id` correlacionado, `mcp-compat-layer.ts` bridge V1→V2
- **Resiliência**: retry com backoff, circuit breaker, timeout por tool_call, keepalive 30s, `session/revoke`
- **Segurança**: Sandbox (ADR-010) + audit JSONL + allowlist de peers
- **Evidência**: schema, registry, SDK, resilience e sandbox/sanitization operacionais; detecção runtime <2ms

---

# ADR-025: Cross-Harness Skill Portability

**Status**: ✅ **IMPLEMENTADA** (Grill-Me Session 7 - Q1 2027 Week 1 → Implementada 2026-10-09) | **Data**: 2027-01-08 | **Autores**: Trevor, Towards, Turing, Guanabara, Niamaia | **Decisor**: Severino

---

## Contexto
Skills escritas para Claude Code (`SKILL.md`) não rodavam em OpenCode/Cursor sem reescrita, gerando duplicação e lock-in. Three-Shape Model (ADR-021) resolveu a arquitetura interna, mas faltava um contrato de **portabilidade cross-harness**: como garantir que uma skill publicada rode identicamente em qualquer harness com paridade de testes e segurança.

## Decisão
Adotar **Cross-Harness Skill Portability** como requisito de publicação:

### 1. Skill Spec Harness-Agnóstico
- **Contrato único**: `SKILL.md` + `skill.json` (frontmatter com `version` SemVer ADR-020, `shapes` suportados, `permissions` declarativas). Core agnóstico (ADR-021) — zero-dep (ADR-022).
- **Harness Adapter**: cada harness implementa `HarnessAdapter` fino (ClaudeCodeAdapter, OpenCodeAdapter, CursorAdapter) que traduz `context` → `PluginCore`.

### 2. Conformance & CI
- **Conformance Suite**: `skill-conformance` roda a mesma suite parametrizada em 3 harnesses (Claude Code, OpenCode, Cursor) no CI; falha se divergência >0.
- **Matriz de compatibilidade** publicada no registry (`compat: { claude: "1.2+", opencode: "v2", cursor: "0.45+" }`).

### 3. Distribuição
- **Single artifact** (core + adapters) via marketplace (ADR-023); MCP v2 (ADR-024) para discovery cross-harness.

## Consequências
- **Positivas**: Write once, run anywhere entre harnesses; fim de lock-in; reuse máximo; testes determinísticos.
- **Negativas**: Menor denominador comum limita APIs harness-específicas (mitigado por `capabilities` opcionais com fallback).
- **Riscos Mitigados**: Fragmentação de ecossistema, duplicação de skills, vendor lock-in.

## Implementação
- **Status**: ✅ Implementada (2026-10-09)
- **Repositório**: `_consolidado/cross-cutting` (024/025)
- **Pipeline CI**: `skill-portability.yml`
- **Componentes**: `PluginCore` agnóstico (zero-dep ADR-022) + `ShapeAdapter` (ClaudeCodeAdapter / OpenCodeAdapter / CursorAdapter) + `CapabilityDetector` + `skill.json` / `SKILL.md` harness-agnóstico
- **Conformance**: suite parametrizada `skill-conformance` roda identicamente em Claude Code + OpenCode + Cursor; falha se divergência >0; matriz `compat: { claude: "1.2+", opencode: "v2", cursor: "0.45+" }` publicada no registry
- **Distribuição**: single artifact (core + adapters) via marketplace (ADR-023) + discovery MCP v2 (ADR-024)
- **Evidência**: portabilidade validada em CI matrix 3 harnesses; write-once-run-anywhere operacional

---

---

# ADR-026: Template `feature-skeleton` V2 — Incorporar Gaps do Full Pilot

**Status**: ✅ **APROVADO** | **Data**: 2027-04-09 | **Autores**: Towards, Niamaia, Trevor, Turing, Tranquilão | **Decisor**: Severino

---

## Resumo
Evolução do template canônico `feature-skeleton` para V2 incorporando gaps identificados no Full Pilot (3 projetos: nodebestpractices, AionUi, ECC).

## Principais Mudanças vs V1
- **TS Config**: `moduleResolution: "Bundler"`, `allowImportingTsExtensions: true`, `exactOptionalPropertyTypes: false`, `noUnusedLocals/Parameters: false`, `isolatedModules: false`, `noEmit: true`
- **Barrel Exports**: `index.ts` em cada layer (domain, application, infrastructure, interfaces)
- **ESLint**: `no-console: warn` global + `off` em `src/infrastructure/logging/**`
- **Vitest**: Coverage focado em `src/domain/**`, `src/application/**`, `src/infrastructure/**` (exclui interfaces, cli, grpc, external, logging)
- **Scripts**: `validate` command, `build: "tsc -b"`
- **CI**: `feature-ci.yml` reutilizável (lint + typecheck + test:coverage + security + docker + validate)

## Implementação
- **Arquivo**: `_consolidado/cross-cutting/templates/feature-skeleton/` (atualizado para V2)
- **Migração**: Script `migrate-v1-to-v2.js` para features existentes
- **Validação**: `validate-feature-structure.js --strict` atualizado

---

# ADR-027: Multi-Language `feature-skeleton` Variants (Go, Rust, Python)

**Status**: ✅ **APROVADO** (Grill-Me Session 9 Outcome) | **Data**: 2027-04-09 | **Autores**: Niamaia, Towards, Qualy, Trevor | **Decisor**: Severino

---

## Resumo
Variantes oficiais do `feature-skeleton` para Go, Rust e Python mantendo estrutura unificada, contratos compartilhados (OpenAPI/AsyncAPI/MCP), quality gates idênticos (80/70 coverage + mutation) e CI multi-language.

## Stacks por Linguagem
| Linguagem | Build | Test | Coverage | Mutation | HTTP | gRPC | Config | Logging |
|-----------|-------|------|----------|----------|------|------|--------|---------|
| **Go** | `go build` + `golangci-lint` | `testify` + `go test -cover` | `go tool cover` | `gremlins` | `gin`/`chi` | `grpc-go` | `viper` | `zerolog` |
| **Rust** | `cargo build` + `clippy` | `cargo test` + `cargo-tarpaulin` | `tarpaulin --fail-under 80` | `cargo-mutants` | `axum` | `tonic` | `config-rs` | `tracing` |
| **Python** | `uv` + `pyproject.toml` | `pytest` + `pytest-asyncio` | `pytest-cov --fail-under=80` | `mutmut` | `FastAPI` | `grpcio` | `pydantic-settings` | `structlog` |

## Contract Sharing
- OpenAPI/AsyncAPI como fonte da verdade → codegen por linguagem (`oapi-codegen`, `asyncapi-codegen`, `openapi-python-client`)
- JSON Schema para validação cross-language
- MCP Manifest compartilhado para discovery (ADR-025)

## CI Unificado
- `feature-ci.yml` com detecção automática de linguagem via `go.mod` / `Cargo.toml` / `pyproject.toml` / `package.json`
- Quality gates idênticos via toolchain nativa

---

# ADR-028: DX Metrics & Template-to-Production Telemetry

**Status**: ✅ **APROVADO** | **Data**: 2027-04-09 | **Autores**: Towards, Niamaia, Trevor, Qualy, Guanabara | **Decisor**: Severino

---

## Resumo
Pipeline de telemetria anônima (opt-in) para medir eficiência do template `feature-skeleton`: time-to-green, rework rate, gap frequency, language adoption.

## Métricas Coletadas
- `template.init.duration_ms`, `template.first_test.duration_ms`
- `template.lint_fix_count`, `template.typecheck_errors`
- `template.coverage_first_run` (lines/branches)
- `feature.time_to_prod_days`, `feature.rework_commits`

## Privacidade
- Opt-in explícito (`DX_TELEMETRY_ENABLED=true`)
- Zero PII (feature names hasheados SHA256 prefix 8)
- Retenção 90 dias, agregação diária

## Dashboard
- Grafana + Prometheus: Template Adoption Rate, Time-to-Green P50/P95, Rework Rate, Gap Frequency Top 5

---

# ADR-029: MCP v2 SDK para Desenvolvedores de Agentes

**Status**: ✅ **APROVADO** | **Data**: 2027-04-09 | **Autores**: Towards, Trevor, Turing, Niamaia | **Decisor**: Severino

---

## Resumo
SDK oficial `@severino/mcp-v2-sdk` (monorepo pnpm + Turborepo) para desenvolvimento de agents compatíveis com MCP v2 (ADR-024).

## Pacotes
| Pacote | Descrição |
|--------|-----------|
| `core` | Types, interfaces, schemas (zero-dep) |
| `client` | AgentClient — conecta a outros agents |
| `server` | AgentServer — expõe capabilities |
| `transport/websocket|stdio|http` | Transports |
| `crypto` | mTLS, JWT agent_token, key rotation |
| `resilience` | Retry, circuit breaker, timeout, keepalive |
| `testing` | MockServer, MockClient, fixtures, contract tests |
| `cli` | `mcp-v2 dev`, `inspect`, `certify`, `init` |

## Developer Experience
```typescript
const client = createAgentClient({ agentCard, transport: 'websocket', endpoint });
const result = await client.invoke('payment.charge', { amount: 1000 }, { timeout: 5000, retries: 3 });
```

## Distribuição
- npm `@severino/mcp-v2-sdk` + GitHub Packages
- SemVer (ADR-020), SLSA L2+, cosign (ADR-023 pipeline)
- Go/Rust/Python bindings via codegen (ADR-027)

---

# ADR-030: Agent Observability Padrão (OpenTelemetry + JSONL Audit + Trace Correlation)

**Status**: ✅ **APROVADO** | **Data**: 2027-04-09 | **Autores**: Trevor, Towards, Kaspersky, Niamaia, Qualy | **Decisor**: Severino

---

## Resumo
Stack de observabilidade unificada para agentes: OTel Metrics/Logs/Traces + JSONL Audit Sanitizado + W3C TraceContext correlation.

## Three Pillars
| Pilar | Implementação |
|-------|---------------|
| **Metrics** | OTel → Prometheus (latência, tokens, errors, handoffs) |
| **Logs** | JSONL estruturado + sanitization (ADR-014) + `trace_id`/`span_id` |
| **Traces** | OTel Traces (W3C TraceContext) cross-agent |

## JSONL Audit Schema (Obrigatório)
```json
{
  "timestamp": "2027-04-09T10:23:45.123Z",
  "level": "INFO",
  "service": "payment-processor",
  "trace_id": "0af7651916cd43dd8448eb211c80319c",
  "span_id": "b7ad6b7169203331",
  "agent_id": "payment-processor@v1.2.3",
  "event": "tool_call",
  "tool": "payment.charge",
  "duration_ms": 245,
  "sanitized": true
}
```

## MCP v2 Integration
- Handshake propaga `traceparent`/`tracestate`
- Tool calls incluem trace context
- OTel Collector sidecar em `feature-ci.yml`

## Dashboard/Alertas
- Agent Health (error_rate > 5%), Token Economics (cost > $10/hr), Tool Performance (p99 > 10s), Cross-Agent Flow (handoff failure > 2%), Security (sanitization_failures > 0)

---

*ADRs 001-030 aprovados (25 aprovadas, 3 implementadas em produção — ADR-023/024/025 ✅ em 2026-10-09, 5 novas ADRs 026-030 baseadas em learnings do Full Pilot) por Severino (Leader). Próxima revisão Tech Radar: 2027-07-08 (Q3 2027).*