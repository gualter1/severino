# KASPERSKY — CONSOLIDATED (Threat Modeling / SAST-DAST / Compliance)

**Lead**: Kaspersky | **Última atualização**: 2026-10-08 (Batch 1 — 8 repos)
**Status**: ✅ Aprovado pelo Gerente — Fonte da verdade do domínio

---

## 1. SCOREBOARD BATCH 1

| Repo | Score /25 | Veredito | Top Contribuição |
|------|-----------|----------|------------------|
| `nodebestpractices` | **23** | ✅ Priorizar extração completa | Node.js Threat Model + SAST gates + Supply chain (Seção 6.1-6.27) |
| `dify` | **21** | ✅ Priorizar extração completa | SECURITY.md template, Multi-tenant RBAC, Data isolation (RLS), RAG pipeline threats |
| `javascript-testing-best-practices` | **21** | ✅ Priorizar extração completa | Security quality gates (coverage 80/70, mutation, SAST, authz matrix) |
| `android-best-practices` | **18** | ✅ Extrair completo | IPC/Intent threat model, Deep link validation, Play Integrity, Crypto baseline |
| `ios-good-practices` | **18** | ✅ Extrair completo | App Sandbox hardening, Keychain/ATS/Pinning, Privacy Manifests gap, Biometric |
| `claude-code-best-practice` | **19** | ⚠️ Extrair seletivo | AI agent permissions model, Sandbox, HITL, Audit log SOC2 |
| `awesome-llm-apps` | **17** | ⚠️ Extrair seletivo | LLM secrets, Guardrails parciais, Eval gate, PII redaction, RAG poisoning |
| `project-guidelines` | **17** | ⚠️ Extrair seletivo | Env validation, Input boundary, API security headers, Audit logging |

---

## 2. THREAT MODELS CONSOLIDADOS (Extrair para `threat-models/`)

### 2.1 Mobile Threat Models

| Modelo | Plataforma | Componentes-chave | Destino |
|--------|------------|-------------------|---------|
| **Android Full STRIDE** | Android | IPC/Intent (exported=false, signature perms), Deep links (autoVerify), Permissions (least privilege, runtime), Network (NSC + Pinning), Crypto (Keystore), Device Attestation (Play Integrity), WebView (SafeBrowsing + CSP), Backup (allowBackup=false) | `threat-models/android-full-stride.md` |
| **iOS Full STRIDE** | iOS | App Sandbox (entitlements hardening), Keychain (WhenUnlockedThisDeviceOnly), ATS + Pinning, Biometric (Secure Enclave), Privacy Manifests (iOS 17+), App Attestation (DeviceCheck), Jailbreak detection (layered) | `threat-models/ios-full-stride.md` |

### 2.2 Backend/API Threat Models

| Modelo | Tecnologia | Componentes-chave | Destino |
|--------|------------|-------------------|---------|
| **Node.js API STRIDE** | Node.js | Input Validation Boundary (Zod), Auth (bcrypt 12, JWT rotation, 2FA), Security Headers (Helmet CSP/HSTS/COOP/COEP), Rate Limiting, ORM Parameterized, Secret Management (vault, rotation), Supply Chain (audit+Snyk+OSV+Dependabot), Error Handling (no stack leak), SAST Gates (eslint-plugin-security) | `threat-models/nodejs-stride.md` |
| **JS API Threat Model** | JavaScript/Node | Env Validation (fail-fast), Input Boundary (Zod), API Security (helmet, CORS), Audit Logging (correlation-id), Git Traceability, AuthZ Resource-level | `threat-models/js-api-threat-model.md` |

### 2.3 AI/LLM Threat Models

| Modelo | Contexto | Componentes-chave | Destino |
|--------|----------|-------------------|---------|
| **AI Agent Full** | Claude Code / Agents | Permissions Model (allow/deny), Sandbox (fs/net scope), HITL (bash/net/write), Secrets (env only), Audit Log (SOC2), Code Review Gate, Prompt Injection Defenses, SBOM Skills | `threat-models/ai-agent-full.md` |
| **LLM App Full** | awesome-llm-apps | Secrets (env), Guardrails (input sanitization + output validation), Eval Gate, PII Redaction, Rate/Cost Limit, RAG Poisoning (doc injection), Agent Hijacking (tool misuse), OWASP LLM Top 10 | `threat-models/llm-app-full.md` |
| **RAG Poisoning** | RAG pipelines | Document Injection, Embedding Manipulation, Retrieval Poisoning, Generator Hijacking | `threat-models/rag-poisoning.md` |
| **RAG Pipeline** | Dify / LLMOps | Doc Processing → Chunking → Embedding → Retrieval → Generation → Threat surface each stage | `threat-models/rag-pipeline.md` |
| **Multi-Tenant RBAC** | Dify / SaaS | Workspace Isolation, API Key Scoping, Rate Limit per Tenant, Data Isolation (RLS + Container), Audit Logs | `threat-models/multi-tenant-rbac.md` |
| **Dify Platform Full** | Dify LLMOps | SECURITY.md disclosure, Multi-tenant RBAC, Data Isolation (RLS), Self-hosted Residency, Audit Logs, Supply Chain, RAG Pipeline Threats, Model Theft | `threat-models/dify-platform-full.md` |

### 2.4 Cross-Cutting Threat Models

| Modelo | Domínio | Destino |
|--------|---------|---------|
| **AuthZ Resource-Level** | Backend/API | `threat-models/authz-resource.md` |
| **Prompt Injection** | AI/LLM | `threat-models/prompt-injection.md` |

---

## 3. SAST/DAST RULESETS & GATES (Extrair para `sast-dast/`)

### 3.1 SAST Configurations por Linguagem

| Linguagem | Ferramentas | Regras Críticas | Destino |
|-----------|-------------|-----------------|---------|
| **JavaScript/TypeScript** | `eslint-plugin-security` | `detect-eval`, `detect-child-process`, `detect-non-literal-regex`, `detect-possible-timing-attacks` | `sast-dast/eslint-security-rules.md` |
| **Node.js** | Semgrep + ESLint Security | Prototype pollution, Path traversal, Command injection, Insecure crypto (md5/sha1), Hardcoded secrets | `sast-dast/semgrep-rules-nodejs.yaml` |
| **Python** | Bandit + Semgrep | Pickle deserialization, Subprocess with shell, SQL injection, Hardcoded passwords, Flask debug | `sast-dast/semgrep-rules-python.yaml` |
| **Swift/iOS** | SwiftLint + Semgrep | Keychain misuse, ATS bypass, Insecure storage, Force unwrap, Print in prod | `sast-dast/ios-semgrep-rules.yaml` |
| **Kotlin/Android** | Detekt + Semgrep | AllowBackup, WebView config, IPC export, Crypto misuse, Logging PII | `sast-dast/android-semgrep-rules.yaml` |

### 3.2 DAST / Runtime Testing

| Alvo | Ferramenta | Configuração | Destino |
|------|------------|--------------|---------|
| **Web/API** | OWASP ZAP | Active scan + Authenticated scan + API spec import | `dast-dast/zap-config.yaml` |
| **Mobile** | MobSF | Static + Dynamic analysis, API extraction | `dast-dast/mobsf-config.md` |
| **LLM Apps** | Custom + Garak | Prompt injection, Jailbreak, PII leakage, Tool misuse | `dast-dast/llm-testing.md` |

### 3.3 Quality Gates Consolidados (com Tranquilão + Qualy)

| Gate | Threshold | Tool | Ação se Falhar |
|------|-----------|------|----------------|
| **SAST High/Critical** | 0 findings | Semgrep/ESLint/Detekt/Bandit | Block PR |
| **Dependency Vulnerabilities** | 0 High/Critical | Snyk/OSV/Dependabot | Block PR |
| **Secrets Detection** | 0 findings | gitleaks/trufflehog | Block Commit |
| **Coverage Security Paths** | ≥ 90% auth/crypto/payments | Vitest/Jest + Stryker | Block PR |
| **Mutation Score** | ≥ 80% critical paths | Stryker | Warn |
| **DAST Critical** | 0 findings | OWASP ZAP | Block Release |
| **SBOM Generated** | CycloneDX valid | Syft | Block Release |
| **SLSA Level** | ≥ Level 2 | SLSA GitHub Actions | Warn |

---

## 4. COMPLIANCE MAPPINGS (Extrair para `compliance/`)

| Standard | Escopo | Mapeamento | Destino |
|----------|--------|------------|---------|
| **OWASP MASVS v2** | Android + iOS | Requirements → Controles implementados + Gaps | `compliance/masvs-matrix-android.md` + `masvs-matrix-ios.md` |
| **OWASP ASVS 4.x** | Backend/API | L1/L2/L3 → Controles Node.js + Gaps | `compliance/asvs-node-mapping.md` |
| **OWASP LLM Top 10** | AI/LLM | LLM01-LLM10 → Mitigações (Guardrails, Eval, Redaction, Rate-limit) | `compliance/owasp-llm-top10.md` |
| **LGPD/GDPR** | Todos | Data Mapping, Consent, DSR, Retention, PII Redaction, DPIA | `compliance/lgpd-data-map.md` + `lgpd-llm.md` + `test-data-lgpd.md` |
| **SOC2 Type II** | Platform/AI | CC6.1-CC6.8 → Audit Logs, Access Control, Encryption, Incident Response | `compliance/soc2-ai-audit.md` + `soc2-node-mapping.md` |
| **PCI-DSS** | Payments | Req 1-12 → Network, Crypto, Access, Monitoring | `compliance/pci-dss-mapping.md` (futuro) |
| **Play Integrity / App Attest** | Mobile | Device Attestation → Anti-tamper, Anti-fraud | `compliance/play-integrity.md` + `ios-app-attest.md` |
| **Privacy Manifests** | iOS 17+ | `PrivacyInfo.xcprivacy` → Data Types, Tracking Domains, Reasons | `compliance/ios-privacy-manifest.md` |

---

## 5. ANTI-PATTERNS / LIXO IDENTIFICADO (Bloquear em Threat Review)

| Anti-Pattern | Origem | Risco | Mitigação Obrigatória |
|--------------|--------|-------|----------------------|
| SafetyNet Attestation | android-best-practices | Deprecated 2024 | Migrar para Play Integrity API |
| `allowBackup=true` default | android-best-practices | Data exfiltration via adb | `allowBackup=false` + backup rules |
| WebView `setJavaScriptEnabled(true)` sem validação | android-best-practices | XSS surface | SafeBrowsing + CSP + Input Validation |
| CocoaPods como default | ios-good-practices | Supply chain risk | SPM + Package.resolved |
| `NSAllowsArbitraryLoads=true` | ios-good-practices | MITM / Cleartext | Exceções por domínio + justificativa |
| Keychain `kSecAttrAccessibleAlways` | ios-good-practices | Key extraction | `WhenUnlockedThisDeviceOnly` |
| `npm audit` only | nodebestpractices, js-testing | Misses transitive | audit + Snyk + OSV + Dependabot |
| JWT sem `jti` + revocation | nodebestpractices | No global logout | Redis denylist + short expiry + rotation |
| `express-validator` legado | nodebestpractices | Less TS-safe | Zod/Valibot |
| `--dangerously-skip-permissions` em prod | claude-code | Total bypass | allowlist + sandbox + HITL |
| `curl \| bash` sem review | claude-code | Supply chain | Pin SHA + review |
| `.env` com keys commitadas | awesome-llm-apps | Secret leak | `.env.example` + secret manager |
| `temperature=0` como "security" | awesome-llm-apps | False confidence | Guardrails + eval adversarial |
| `ADMIN_API_KEY` default no compose | dify | Takeover if copied | Gerar no boot + secret manager |
| Postgres sem TLS interno | dify | Lateral sniffing | mTLS/service mesh + network policy |

---

## 6. GAPS CRÍTICOS (Backlog do Kaspersky)

| # | Gap | Domínio | Ação Proposta |
|---|-----|---------|---------------|
| 1 | **Threat Models STRIDE completos** (Android, iOS, Node.js, AI Agent, LLM App, RAG, Multi-tenant, Dify) | Threat Modeling | Criar 9 threat models em `threat-models/` |
| 2 | **OWASP MASVS v2 Mapping** (Android + iOS) | Mobile Compliance | `compliance/masvs-matrix-android.md` + `masvs-matrix-ios.md` |
| 3 | **OWASP ASVS 4.x Mapping** (Node.js) | Backend Compliance | `compliance/asvs-node-mapping.md` |
| 4 | **OWASP LLM Top 10 Mapping** | AI Compliance | `compliance/owasp-llm-top10.md` |
| 5 | **Privacy Manifests** (`PrivacyInfo.xcprivacy`) iOS 17+ | iOS Compliance | Template + Checklist |
| 4 | **App Attestation** (DeviceCheck/App Attest) | iOS Hardening | `hardening-guides/ios-app-attest.md` |
| 5 | **Play Integrity API** Migration (substitui SafetyNet) | Android Compliance | `compliance/play-integrity.md` |
| 6 | **RASP/Anti-tamper/Root Detection** Baseline | Android Hardening | `hardening-guides/android-rasp.md` |
| 7 | **SAST Rulesets Custom** (Semgrep per linguagem) | SAST | `sast-dast/{android,ios,nodejs,python,swift}-semgrep-rules.yaml` |
| 8 | **DAST Pipeline** (OWASP ZAP + MobSF + Garak) | DAST | Runbooks + CI integration |
| 9 | **SBOM + SLSA + Cosign** (Supply Chain) | Supply Chain | `checklists/supply-chain.md` + syft/cosign CI |
| 10 | **LGPD/SOC2 Audit Log Mapping** | Compliance | `compliance/lgpd-*.md` + `soc2-*.md` |
| 11 | **PII Redaction** em datasets/logs LLM | AI Compliance | `compliance/lgpd-llm.md` + `test-data-lgpd.md` |
| 12 | **Prompt Injection / Indirect Injection** Defenses | AI Threat Model | `threat-models/prompt-injection.md` + guardrails |
| 13 | **Fuzzing** para parsers/validators | Quality Gates | Adicionar a quality-gate |
| 14 | **Model Theft / Extraction** via API | AI Platform | Rate-limit + watermarking |
| 15 | **AuthZ Resource-Level** (não só role-based) | Backend/API | `threat-models/authz-resource.md` + `authz-checklist.md` |

---

## 6. ADRs PROPOSTAS (para cross-cutting)

| ADR | Título | Domínios Envolvidos | Status |
|-----|--------|---------------------|--------|
| ADR-007 | Node Security Baseline (helmet+bcrypt+Zod+parameterized) obrigatório | Kaspersky + Tranquilão + Towards | 🟡 Pronta |
| ADR-008 | Coverage Gate 80/70 + Mutation Testing em paths críticos | Kaspersky + Tranquilão + Qualy | 🟡 Pronta |
| ADR-009 | Android/iOS Security Baseline (ProGuard/R8 + NSC + Keychain/ATS) | Kaspersky + Tranquilão + Trevor + Niamaia | 🟡 Pronta |
| ADR-010 | AI Agent Sandbox Obrigatório (permissions + HITL + audit) | Kaspersky + Tranquilão + Towards | 🟡 Pronta |
| ADR-011 | OWASP LLM Top 10 Gate para apps LLM | Kaspersky + Tranquilão + Towards | 🟡 Pronta |
| ADR-012 | LLM Platform Hardening (Dify baseline: SECURITY.md + RBAC + residency) | Kaspersky + Tranquilão + Trevor | 🟡 Pronta |
| ADR-013 | Supply Chain Gates (SBOM + SLSA + cosign + gitleaks) | Kaspersky + Trevor + Tranquilão | 🟡 Pronta |
| ADR-014 | Logging Sanitization Obrigatória (PII/tokens) | Kaspersky + Tranquilão + Todos | 🟡 Pronta |
| ADR-015 | Threat Modeling Obrigatório (STRIDE) para novos serviços | Kaspersky + Niamaia + Trevor | 🟡 Pronta |
| ADR-016 | SAST/DAST Gates Obrigatórios no CI | Kaspersky + Qualy + Trevor | 🟡 Pronta |
| ADR-017 | Compliance Mapping (MASVS/ASVS/LLMM Top 10) por domínio | Kaspersky + Tranquilão + Guanabara | 🟡 Pronta |

---

## 7. TEMPLATES / CHECKLISTS / RUNBOOKS / SKILLS A CRIAR

### Threat Models
- `threat-models/android-full-stride.md`
- `threat-models/ios-full-stride.md`
- `threat-models/nodejs-stride.md`
- `threat-models/js-api-threat-model.md`
- `threat-models/ai-agent-full.md`
- `threat-models/llm-app-full.md`
- `threat-models/rag-poisoning.md`
- `threat-models/rag-pipeline.md`
- `threat-models/multi-tenant-rbac.md`
- `threat-models/dify-platform-full.md`
- `threat-models/authz-resource.md`
- `threat-models/prompt-injection.md`

### SAST/DAST Rulesets
- `sast-dast/eslint-security-rules.md`
- `sast-dast/semgrep-rules-nodejs.yaml`
- `sast-dast/semgrep-rules-python.yaml`
- `sast-dast/semgrep-rules-android.yaml`
- `sast-dast/semgrep-rules-ios.yaml`
- `sast-dast/zap-config.yaml`
- `dast-dast/mobsf-config.md`
- `dast-dast/llm-testing.md`

### Compliance
- `compliance/masvs-matrix-android.md`
- `compliance/masvs-matrix-ios.md`
- `compliance/asvs-node-mapping.md`
- `compliance/owasp-llm-top10.md`
- `compliance/lgpd-data-map.md`
- `compliance/lgpd-llm.md`
- `compliance/test-data-lgpd.md`
- `compliance/soc2-ai-audit.md`
- `compliance/soc2-node-mapping.md`
- `compliance/play-integrity.md`
- `compliance/ios-privacy-manifest.md`
- `compliance/ios-app-attest.md`

### Checklists
- `checklists/android-threat-review.md`
- `checklists/ios-security-pr-checklist.md`
- `checklists/js-sast-gate.md`
- `checklists/security-quality-gate-js.md`
- `checklists/ai-agent-security-gate.md`
- `checklists/llm-app-security-gate.md`
- `checklists/llm-platform-hardening.md`
- `checklists/ai-eval-gate.md`
- `checklists/ai-code-review.md`
- `checklists/authz-tests.md` (com Tranquilão/Qualy)

### Runbooks
- `runbooks/dast-zap-ci.md`
- `runbooks/mobsf-mobile-scan.md`
- `runbooks/secret-rotation-dify.md`
- `runbooks/incident-response-ai.md`
- `runbooks/threat-model-workshop.md`

### Skills
- `skills/threat-modeling-workshop/`
- `skills/sast-dast-config/`
- `skills/compliance-mapping/`
- `skills/ai-security-review/`

---

## 8. FONTES (Extrações Aprovadas)

- `extractions/android-best-practices.md` (18/25)
- `extractions/ios-good-practices.md` (18/25)
- `extractions/nodebestpractices.md` (23/25) — **OURO**
- `extractions/project-guidelines.md` (17/25)
- `extractions/javascript-testing-best-practices.md` (21/25)
- `extractions/claude-code-best-practice.md` (19/25)
- `extractions/awesome-llm-apps.md` (17/25)
- `extractions/dify.md` (21/25)

---

## 9. PRÓXIMOS PASSOS (Batch 2)

- [ ] Popular todos threat models, SAST rulesets, compliance mappings acima
- [ ] Submeter ADRs 007-017 para aprovação cross-cutting (Severino)
- [ ] Criar skills de threat modeling, SAST/DAST config, compliance mapping
- [ ] Processar repos Batch 2: `ECC`, `agent-skills`, `anthropics_skills`, `mattpocock_skills`, `skillpper`, `obsidian-skills`, `archify`, `context-mode`, `openclaude`, `oh-my-openagent`, `planning-with-files`

---

*CONSOLIDATED v1.0 (Batch 1 aprovado) — Kaspersky*