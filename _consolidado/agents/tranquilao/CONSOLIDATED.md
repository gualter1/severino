# TRANQUILÃO — CONSOLIDATED (Security / Hardening / Quality Gates / Compliance)

**Lead**: Tranquilão | **Última atualização**: 2026-10-08 (Batch 1 — 8 repos)
**Status**: ✅ Aprovado pelo Gerente — Fonte da verdade do domínio

---

## 1. SCOREBOARD BATCH 1

| Repo | Score /25 | Veredito | Top Contribuição |
|------|-----------|----------|------------------|
| `nodebestpractices` | **23** | ✅ Priorizar extração completa | Node Security Baseline (Seção 6.1-6.27): helmet, rate-limit, bcrypt, JWT, Zod, parameterized queries |
| `dify` | **21** | ✅ Priorizar extração completa | SECURITY.md template, RBAC workspace, data residency, audit logs, supply chain gates |
| `javascript-testing-best-practices` | **21** | ✅ Priorizar extração completa | Coverage gates 80/70, mutation testing, SAST CI, authz matrix tests |
| `android-best-practices` | **20** | ✅ Priorizar extração completa | ProGuard/R8 baseline, NSC + certificate pinning, Keystore, logging sanitization |
| `ios-good-practices` | **19** | ✅ Priorizar extração completa | Keychain baseline, ATS + TLS pinning, biometric, data protection, logging privacy |
| `claude-code-best-practice` | **19** | ⚠️ Extrair seletivo | AI agent sandbox, permissions allowlist, HITL, audit log SOC2 |
| `awesome-llm-apps` | **17** | ⚠️ Extrair seletivo | LLM secrets via env, guardrails parciais, eval gate, PII redaction |
| `project-guidelines` | **17** | ⚠️ Extrair seletivo | Env validation + Zod, input boundary, API hardening, logging redaction, PR security checklist |

---

## 2. BASELINES DE SEGURANÇA CONSOLIDADAS (Extrair para Templates/Checklists/Runbooks)

### 2.1 Mobile Hardening (Android + iOS)

| Baseline | Android | iOS | Destino |
|----------|---------|-----|---------|
| **Obfuscação/Minify Release** | ProGuard/R8 obrigatório (`minifyEnabled true`, `shrinkResources true`), **reter `mapping.txt` por release** | Compiler hardening nativo (`-fstack-protector-strong`, `-fPIE -pie`) | `hardening-guides/android-proguard.md` + `hardening-guides/ios-compiler-hardening.md` |
| **Network Security** | `network_security_config.xml`: `cleartextTrafficPermitted=false` + `<pin-set>` (mínimo 2 backup pins) | ATS strict (`NSAllowsArbitraryLoads=false`) + Certificate Pinning (TrustKit/Alamofire) | `network-security/android-nsc.md` + `network-security/ios-ats-pinning.md` |
| **Secrets/Crypto Storage** | Android Keystore / Keymaster + `EncryptedSharedPreferences` (API 23+) | Keychain `kSecClassGenericPassword` + `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` + Secure Enclave | `hardening-guides/android-keystore.md` + `hardening-guides/ios-keychain.md` |
| **Biometric Auth** | `BiometricPrompt` + `CryptoObject` | `LocalAuthentication` + Keychain `accessControl` (Secure Enclave) | `compliance/biometric-auth.md` |
| **Logging Sanitization** | `Timber` Tree release remove `Log.d`, sanitiza PII/tokens | `os_log` com `%{private}@`, strip `print()` em release | `checklists/logging-sanitization.md` |
| **Anti-Tamper** | SafetyNet → **Play Integrity API** (gap: RASP/root detection baseline) | Jailbreak detection (não como única defesa) + debugger detection | `hardening-guides/android-rasp.md` + `hardening-guides/ios-tamper.md` |
| **Backup/Exfiltration** | `android:allowBackup=false` + `fullBackupContent=@xml/backup_rules` | `NSFileProtectionComplete` + Privacy Manifests (`PrivacyInfo.xcprivacy`) — **GAP** | `compliance/data-protection-ios.md` + `compliance/data-minimization-android.md` |

### 2.2 Backend/Node Security Baseline (nodebestpractices Seção 6.1-6.27)

| Controle | Implementação | Destino |
|----------|---------------|---------|
| **Security Headers** | `helmet` (CSP, HSTS, COOP, COEP) + `cors` allowlist | `network-security/api-hardening.md` |
| **Rate Limiting** | `express-rate-limit` (IP + user) + slow-down | `network-security/api-hardening.md` |
| **Input Validation** | Zod/Valibot na borda (antes de service) + `validator.js` sanitization anti-XSS | `checklists/input-validation.md` |
| **Auth** | `bcrypt` cost 12, JWT short-lived (15min) + refresh rotation (7d) + `jti` revocation (Redis), 2FA | `hardening-guides/auth-baseline.md` |
| **SQL/NoSQL Injection** | ORM parameterized (Prisma/Sequelize/Knex) — zero concatenação | `checklists/sast-gates.md` |
| **Crypto** | Evitar `md5`, `sha1` — usar `node:crypto` (AES-GCM, RSA-OAEP, Ed25519) | `checklists/sast-gates.md` |
| **Dangerous Patterns** | `eslint-plugin-security`: `detect-eval`, `detect-child-process`, `detect-non-literal-regex` | `checklists/sast-gates.md` |
| **Error Handling** | `boom`/`http-errors` — nunca vazar stack trace (ASVS 7.x) | `checklists/error-handling.md` |
| **Supply Chain** | `npm audit` + `snyk` + `OSV-Scanner` + Dependabot + `package-lock.json` pinnado + gitleaks/trufflehog pre-commit | `checklists/supply-chain.md` |

### 2.3 LLM/AI Security (claude-code, awesome-llm-apps, dify)

| Controle | Implementação | Destino |
|----------|---------------|---------|
| **Agent Sandbox** | Permissions least-privilege (`settings.json` allow/deny), nunca `--dangerously-skip-permissions` em prod | `hardening-guides/ai-agent-sandbox.md` |
| **HITL (Human-in-the-loop)** | Aprovação humana para `bash`, network, file-write sensível | `checklists/ai-agent-gate.md` |
| **Prompt/Output Guardrails** | Input sanitization + output validation (anti-prompt-injection), rate-limit/custo guard | `hardening-guides/llm-guardrails.md` |
| **PII Redaction** | Redaction antes de enviar a LLM (LGPD/GDPR) | `compliance/lgpd-llm.md` |
| **Eval Gate** | Eval adversarial antes de merge de prompt/model | `checklists/quality-gates.md` |
| **Audit Log (SOC2)** | Log de ações do agent (quem, o que, quando, contexto) | `compliance/soc2-ai-audit.md` |
| **Secrets** | API keys só via env, nunca no prompt/contexto, rotation automática | `checklists/secrets-management.md` |
| **Supply Chain AI** | SBOM de skills/mcp-servers, pin SHA, review `curl \| bash` | `checklists/supply-chain.md` |
| **Dify Platform** | `SECURITY.md` disclosure policy, workspace RBAC, API keys scoped, self-hosted data residency, audit logs | `templates/security/SECURITY.md` + `compliance/lgpd-data-residency.md` |

### 2.4 Cross-Cutting Quality Gates (javascript-testing-best-practices)

| Gate | Threshold | Tool | Destino |
|------|-----------|------|---------|
| **Coverage** | ≥ 80% linhas / ≥ 70% branches | Vitest/Jest + `--coverage` | `checklists/quality-gates.md` |
| **Mutation Testing** | Security-critical paths (auth, crypto, payments) | Stryker | `checklists/quality-gates.md` |
| **SAST** | `eslint-plugin-security` + `npm audit` + Snyk/OSV | CI fail on high | `checklists/sast-gates.md` |
| **Secrets Scan** | gitleaks/trufflehog pre-commit + CI | `checklists/supply-chain.md` |
| **AuthZ Tests** | Matrix resource-level (não só role) | Pact/integration tests | `checklists/authz-tests.md` |
| **Contract Testing** | Pact consumer-driven para API anti-breaking-change | `checklists/api-contract-gate.md` |
| **Flaky Quarantine** | E2E afetados obrigatórios por PR + auto-quarantine | `checklists/quality-gates.md` |
| **Test Data** | Fixtures sintéticas, sem PII em snapshots | `compliance/test-data-lgpd.md` |

---

## 3. ANTI-PATTERNS / LIXO IDENTIFICADO (Bloquear em PR)

| Anti-Pattern | Origem | Substituto Moderno |
|--------------|--------|-------------------|
| `gradle.properties` com senhas commitado | android-best-practices | `local.properties` (gitignored) + CI secrets |
| `android:allowBackup=true` default | android-best-practices | `allowBackup=false` + backup rules |
| SafetyNet Attestation | android-best-practices | **Play Integrity API** |
| CocoaPods como default | ios-good-practices | **SPM + Package.resolved** |
| `NSAllowsArbitraryLoads=true` | ios-good-practices | Exceções por domínio + justificativa |
| Keychain `kSecAttrAccessibleAlways` | ios-good-practices | `WhenUnlockedThisDeviceOnly` |
| `console.log` / `print()` em prod | project-guidelines, ios | pino/winston + `os_log` privacy |
| Joi como única validação | project-guidelines | **Zod/Valibot** (TS-friendly) |
| `npm audit` only como gate | nodebestpractices, js-testing | audit + Snyk + OSV + Dependabot |
| `jsonwebtoken` sem `jti` revocation | nodebestpractices | Redis denylist + short expiry + rotation |
| `express-validator` legado | nodebestpractices | **Zod/Valibot** |
| `--dangerously-skip-permissions` em prod | claude-code | allowlist + sandbox + HITL |
| `curl \| bash` sem review | claude-code | Pin SHA + review |
| `.env` com keys commitadas | awesome-llm-apps | `.env.example` + secret manager |
| `temperature=0` como "security" | awesome-llm-apps | Guardrails + eval adversarial |
| `ADMIN_API_KEY` default no compose | dify | Gerar no boot + secret manager |
| Postgres sem TLS interno | dify | mTLS/service mesh + network policy |

---

## 4. GAPS CRÍTICOS (Backlog do Tranquilão)

| # | Gap | Domínio | Ação Proposta |
|---|-----|---------|---------------|
| 1 | **RASP/anti-tamper/root detection baseline** | Android | `hardening-guides/android-rasp.md` |
| 2 | **OWASP MASVS v2 mapping** (Android + iOS) | Mobile | `compliance/masvs-matrix-android.md` + `masvs-matrix-ios.md` |
| 3 | **Privacy Manifests** (`PrivacyInfo.xcprivacy`) iOS 17+ | iOS | `compliance/ios-privacy-manifest.md` + template |
| 4 | **SBOM CycloneDX** (Gradle, npm, pip, Go) | Supply Chain | `checklists/supply-chain.md` + syft integration |
| 5 | **DAST (OWASP ZAP) no CI** | Backend/API | Runbook `dast-zap-ci.md` |
| 6 | **Secrets scanning** (gitleaks/trufflehog) pre-commit | Supply Chain | `checklists/supply-chain.md` |
| 7 | **LGPD/SOC2 audit logs mapping** | Compliance | `compliance/lgpd-node-mapping.md` + `soc2-ai-audit.md` |
| 8 | **OWASP LLM Top 10 mapping** | AI/LLM | `compliance/owasp-llm-top10.md` |
| 9 | **OWASP ASVS 4.x para API Dify** | Platform | Threat model + ZAP gate |
| 10 | **PII redaction em datasets/logs LLM** | AI/Compliance | `compliance/lgpd-llm.md` + `test-data-lgpd.md` |
| 11 | **Prompt injection / indirect injection defenses** | AI | `ai-prompt-security.md` + threat model |
| 12 | **Fuzzing para parsers/validators** | Quality Gates | Adicionar a quality-gate |
| 13 | **App Attestation** (DeviceCheck/App Attest) | iOS | `hardening-guides/ios-app-attest.md` |
| 14 | **SAST Swift** (semgrep/swiftlint security rules) | iOS | `sast-dast/ios-semgrep-rules.md` |
| 15 | **AuthZ resource-level** (não só role-based) | Backend | `authz-checklist.md` (OWASP ASVS 4.x) |

---

## 5. ADRs PROPOSTAS (para cross-cutting)

| ADR | Título | Domínios Envolvidos | Status |
|-----|--------|---------------------|--------|
| ADR-007 | Node Security Baseline (helmet+bcrypt+Zod+parameterized) obrigatório | Tranquilão + Kaspersky + Towards | 🟡 Pronta |
| ADR-008 | Coverage Gate 80/70 + Mutation Testing em paths críticos | Tranquilão + Qualy | 🟡 Pronta |
| ADR-009 | Android/iOS Security Baseline (ProGuard/R8 + NSC + Keychain/ATS) | Tranquilão + Trevor + Niamaia | 🟡 Pronta |
| ADR-010 | AI Agent Sandbox Obrigatório (permissions + HITL + audit) | Tranquilão + Kaspersky + Towards | 🟡 Pronta |
| ADR-011 | OWASP LLM Top 10 Gate para apps LLM | Tranquilão + Kaspersky + Towards | 🟡 Pronta |
| ADR-012 | LLM Platform Hardening (Dify baseline: SECURITY.md + RBAC + residency) | Tranquilão + Kaspersky + Trevor | 🟡 Pronta |
| ADR-013 | Supply Chain Gates (SBOM + SLSA + cosign + gitleaks) | Tranquilão + Trevor + Kaspersky | 🟡 Pronta |
| ADR-014 | Logging Sanitization Obrigatória (PII/tokens) | Tranquilão + Todos | 🟡 Pronta |

---

## 6. TEMPLATES / CHECKLISTS / RUNBOOKS / SKILLS A CRIAR

### Templates
- `templates/android/security/network-security-config.xml.template`
- `templates/ios/security/Info.plist-security-baseline`
- `templates/ios/security/PrivacyInfo.xcprivacy.template`
- `templates/node/config/config-loader-zod.ts`
- `templates/security/SECURITY.md.baseline`
- `templates/docker/.dockerignore.node` (já no Trevor)
- `templates/claude-code/settings.json.baseline`

### Checklists
- `checklists/android-security-pr-checklist.md`
- `checklists/ios-security-pr-checklist.md`
- `checklists/js-pr-security-checklist.md`
- `checklists/node-sast-pr-gate.md`
- `checklists/supply-chain-gate.md`
- `checklists/quality-gate-js.md` (coverage 80/70 + Stryker + SAST)
- `checklists/authz-tests.md`
- `checklists/api-contract-gate.md`
- `checklists/logging-sanitization.md`
- `checklists/secrets-management.md`
- `checklists/ai-agent-security-gate.md`
- `checklists/llm-app-security-gate.md`
- `checklists/llm-platform-hardening.md`
- `checklists/pr-template-security.md`

### Runbooks
- `runbooks/android/proguard-mapping-retention.md` (com Trevor)
- `runbooks/ios/provisioning-debug.md` (com Trevor)
- `runbooks/ios/dsym-retention.md` (com Trevor)
- `runbooks/dify/secret-rotation.md`
- `runbooks/dify/disaster-recovery.md` (com Trevor)
- `runbooks/dast-zap-ci.md`
- `runbooks/secret-rotation-dify.md`

### Skills
- `skills/android-hardening-audit/`
- `skills/node-security-audit/`
- `skills/ai-agent-security-audit/`
- `skills/llm-app-security-review/`

---

## 7. FONTES (Extrações Aprovadas)

- `extractions/android-best-practices.md` (20/25)
- `extractions/ios-good-practices.md` (19/25)
- `extractions/nodebestpractices.md` (23/25)
- `extractions/project-guidelines.md` (17/25)
- `extractions/javascript-testing-best-practices.md` (21/25)
- `extractions/claude-code-best-practice.md` (19/25)
- `extractions/awesome-llm-apps.md` (17/25)
- `extractions/dify.md` (21/25)

---

## 8. PRÓXIMOS PASSOS (Batch 2)

- [ ] Popular todos templates/checklists/runbooks acima
- [ ] Submeter ADRs 007-014 para aprovação cross-cutting (Severino)
- [ ] Criar skills de auditoria
- [ ] Processar repos Batch 2: `ECC`, `agent-skills`, `anthropics_skills`, `mattpocock_skills`, `skillpper`, `obsidian-skills`, `archify`, `context-mode`

---

*CONSOLIDATED v1.0 (Batch 1 aprovado) — Tranquilão*