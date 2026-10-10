<!-- ============================================================
TRANQUILÃO TEMPLATE: SECURITY.md canônico
Origem: ADR-007/009/010/011/012/013/014/015/016/017
Fontes: Tranquilão CONSOLIDATED (Node 23/25, Dify 21/25)
        + Kaspersky CONSOLIDATED (STRIDE, SAST/DAST, LGPD/SOC2)
        + Trevor CONSOLIDATED (QA sandbox, fast-path CI, telemetry opt-out)
        + Wave 3: oh-my-openagent (QA sandbox), cc-switch (Tauri), skillpper (SEC002/006/007)
COMO PARAMETRIZAR (antes do primeiro commit):
  1. Buscar/replace todos os `{{PLACEHOLDER}}` (lista em §0).
  2. Preencher Supported Versions com versões reais.
  3. Ajustar SLA apenas para MAIS restritivo (nunca afrouxar sem ADR).
  4. Remover este bloco HTML após parametrizar (manter em template).
CI-VALIDÁVEL: todos os `- [ ]` são greppáveis por `checklists/pr-security-checklist.md` + `quality-gates.yml`.
============================================================ -->

# Security Policy — {{ORG_NAME}}

> **Template version:** 1.0.0 | **Last updated:** {{LAST_UPDATED_YYYY-MM-DD}}
> **Owners:** Tranquilão (gatekeeper) + Kaspersky (threat/compliance) + Trevor (platform/CI)
> **ADRs vinculadas:** [ADR-007](#security-baseline-application--adr-007adr-009adr-014) · [ADR-009](#mobile-baseline--adr-009) · [ADR-010](#ai-agent-sandbox--adr-010) · [ADR-011](#llm-app-gate--adr-011) · [ADR-012](#llm-platform-hardening--adr-012) · [ADR-013](#supply-chain--adr-013) · [ADR-014](#logging-sanitization--adr-014) · [ADR-015](#threat-modeling--adr-015) · [ADR-016](#sastdast-gates--adr-016) · [ADR-017](#compliance-mapping--adr-017)

## §0 — Parametrização (deletar após preencher)

| Placeholder | Exemplo | Onde usar |
|-------------|---------|-----------|
| `{{ORG_NAME}}` | Acme Corp | Título, contato |
| `{{SECURITY_EMAIL}}` | security@domain.com | Reporting |
| `{{PGP_KEY_URL}}` | https://keys.openpgp.org/... | Reporting |
| `{{PGP_FINGERPRINT}}` | `ABCD 1234 ...` | Reporting |
| `{{SECURITY_ADVISORY_URL}}` | https://github.com/org/repo/security/advisories | Disclosure |
| `{{SLACK_SECURITY_CHANNEL}}` | #security-incidents (privado) | Resposta interna |
| `{{SUPPORT_EMAIL}}` | support@domain.com | Fallback não-segurança |
| `{{HALL_OF_FAME_URL}}` | https://domain.com/security/thanks | Reconhecimento |
| `{{DATA_DPO_EMAIL}}` | dpo@domain.com | LGPD DSR |
| `{{LAST_UPDATED_YYYY-MM-DD}}` | 2026-10-09 | Header |

---

## Supported Versions

<!-- CI: validado por release workflow — tag sem linha nesta tabela = Block Release. Manter N-2 + main. -->

| Version | Supported | Notes |
| ------- | --------- | ----- |
| `{{CURRENT_MAJOR}}.{{CURRENT_MINOR}}.x` (main) | ✅ | Security fixes + patches imediatos |
| `{{PREVIOUS_MAJOR}}.x` (LTS) | ✅ | Apenas critical/high por {{LTS_MONTHS}} meses |
| `< {{EOL_VERSION}}` | ❌ | EOL — atualize. Sem fix, sem advisory. |

> Política: suportamos **versão atual + 1 LTS anterior**. EOL anunciado com 90 dias em `CHANGELOG.md` + GitHub Release notes.

---

## Reporting a Vulnerability

**NÃO abra issue pública para vulnerabilidades. Use canal privado abaixo.**

- **Email:** {{SECURITY_EMAIL}}
- **PGP Key:** [{{PGP_FINGERPRINT}}]({{PGP_KEY_URL}}) — use para PoC/exploit/data sensível
- **Assunto sugerido:** `[SECURITY] <componente> — <breve descrição> (CVSS estimado: ___)`
- **Template de reporte:** incluir: descrição, impacto, passos de reprodução, PoC (redigido, sem exfiltrar PII real), versão/commit afetado, logs sanitizados, sugestão de mitigação (opcional)
- **GitHub Private Advisory (alternativo):** {{SECURITY_ADVISORY_URL}}/new

### Response SLA

| Etapa | Prazo | Responsável |
|-------|-------|-------------|
| Acknowledgment (recebemos) | **48h** | Tranquilão on-call |
| Triage + severidade (CVSS 3.1) | **7 dias** | Kaspersky + owner do componente |
| Fix — **Critical** (CVSS ≥ 9.0 / RCE / auth bypass / exfiltração massiva) | **30 dias** (hotfix; workaround em 7d) | Squad + Tranquilão |
| Fix — **High** (CVSS 7.0–8.9) | **60 dias** | Squad |
| Fix — **Medium/Low** | **90 dias / backlog priorizado** | Squad |
| Disclosure coordenado | Após fix + 14d para upgrade (ou 90d sem fix) | Tranquilão + Kaspersky |

### Escopo

**In scope:** código deste repo, APIs first-party, configs IaC/CI deste repo, containers publicados por este repo, integrações LLM/agent (prompts, tools, MCP servers) deste repo.
**Out of scope (sem bounty/reconhecimento):** DDoS volumétrico, spam/phishing de terceiros, findings de scanner automatizado sem PoC válido, versões EOL, social engineering de colaboradores.

### Safe Harbor & Disclosure

- Pesquisa de boa-fé dentro do escopo **não será perseguida** (não exfiltrar PII real, não degradar serviço, não pivotar para outros tenants).
- Disclosure coordenado: damos crédito em {{HALL_OF_FAME_URL}} (opt-in). CVE solicitado para High/Critical.
- DPO/LGPD: se a vuln envolver dados pessoais, notificamos DPO ({{DATA_DPO_EMAIL}}) e avaliamos comunicação à ANPD/titulares conforme Art. 48 LGPD.

---

## Security Baseline (Application) — ADR-007/ADR-009/ADR-014

> Fonte: Tranquilão §2.2 (nodebestpractices 23/25) + Kaspersky §2.2 (Node STRIDE) + project-guidelines (env/Zod).

### Application (Backend/API — ADR-007)

- [ ] **Security Headers:** `helmet` (CSP strict, HSTS, COOP, COEP) + `cors` com allowlist explícita (nunca `*` com credentials) — *CI: `quality-gates.yml` + header test*
- [ ] **Rate Limiting:** `express-rate-limit` (IP **+** user) + `slow-down` em auth/LLM endpoints — *CI: contract test de 429*
- [ ] **Input validation & sanitization (all entry points):** Zod/Valibot na borda (antes de service) + `validator.js` anti-XSS; validar query/body/params/headers/files — *Review: Tranquilão*
- [ ] **Output encoding (XSS prevention):** encoder por contexto (HTML/JS/URL); nunca `dangerouslySetInnerHTML` / `innerHTML` sem sanitizer allowlist — *SAST: `detect-non-literal-regex`*
- [ ] **Authentication:** `bcrypt` cost **12**, JWT **15min** + refresh **7d com rotação** + `jti` revocation (Redis denylist) + 2FA/MFA em rotas sensíveis — *Review + authz-tests*
- [ ] **Authorization:** RBAC/ABAC + **resource-level** (não só role-based); testar matriz IDOR (dono/outro-usuário/admin/anônimo) — *Test: `authz-tests.md`*
- [ ] **Secrets management:** só via env vars/vault (nunca hardcoded, nunca no prompt/contexto LLM); `.env` gitignored + `.env.example` commitado; validação no boot (fail-fast) — *CI: gitleaks + TruffleHog Block Commit*
- [ ] **SQL/NoSQL Injection:** ORM parameterized apenas (Prisma/Sequelize/Knex) — **zero concatenação** — *SAST gate: Block PR*
- [ ] **Crypto:** apenas `node:crypto` (AES-GCM / RSA-OAEP / Ed25519); proibido `md5`/`sha1`/`Math.random` para segurança — *SAST: Block PR (SEC006/skillpper)*
- [ ] **Dangerous Patterns:** `eslint-plugin-security` (`detect-eval`, `detect-child-process`, `detect-non-literal-regex`, `detect-possible-timing-attacks`); `eval`/`Function`/`exec`/`shell:true` só com review Tranquilão + justificativa `// why:` — *SAST: Block PR*
- [ ] **Error handling:** `http-errors`/`boom` — nunca vazar stack trace, SQL, paths internos ao client (ASVS 7.x); mapear para códigos genéricos + `trace_id` interno — *Review*
- [ ] **Dependency scanning:** SAST/DAST/SCA no CI — ver [ADR-016](#sastdast-gates--adr-016)
- [ ] **SBOM generation:** CycloneDX/SPDX via Syft — ver [ADR-013](#supply-chain--adr-013)
- [ ] **Container hardening:** multi-stage + distroless/alpine, `USER non-root`, read-only fs, sem `--build-arg` para tokens (`--mount=type=secret`), `.dockerignore` (node_modules/.git/.env/coverage/dist), scan Trivy antes de prod, `CMD ["node","index.js"]` (não `npm start`), Tini se PID1 — *Fonte: Trevor §2.2 + nodebestpractices*

### Mobile Baseline — ADR-009

- [ ] **Android:** R8/ProGuard (`minifyEnabled true`, `shrinkResources true`), reter `mapping.txt` por release; `network_security_config.xml` (`cleartext=false` + `<pin-set>` 2+ backup pins); Keystore + `EncryptedSharedPreferences` (API 23+); `allowBackup=false` + `backup_rules`; Play Integrity API (não SafetyNet); `exported=false` + signature perms em IPC — *CI: MobSF + semgrep-android*
- [ ] **iOS:** `-fstack-protector-strong`, `-fPIE -pie`, `SWIFT_TREAT_WARNINGS_AS_ERRORS=YES`; ATS strict + pinning (TrustKit/Alamofire); Keychain `WhenUnlockedThisDeviceOnly` + Secure Enclave; `NSFileProtectionComplete`; `PrivacyInfo.xcprivacy` (iOS 17+); DeviceCheck/App Attest — *CI: MobSF + semgrep-ios*
- [ ] **Ambos:** sem `console.log`/`print()` em prod; sem `Authorization`/`Cookie`/PII em logs; tokens sensíveis fora de `SharedPreferences`/`UserDefaults`; screenshot/clipboard protegidos em background — *Review: Tranquilão §3 Blockers*

### Logging Sanitization — ADR-014

- [ ] **PII Redaction:** CPF, CNPJ, email, phone, cartão, tokens, passwords → `[REDACTED]` antes de logar/enviar a LLM (LGPD) — *Test: redaction unit test*
- [ ] **Structured Logs:** JSON com `level`, `timestamp`, `service`, `trace_id`, `span_id`; PROD = INFO/WARN/ERROR (DEBUG/TRACE só dev/staging)
- [ ] **No Secrets:** nunca logar `Authorization`, cookies, DB passwords, API keys; `Timber` release tree + `os_log %{private}@`
- [ ] **Retention:** 30 dias hot, 1 ano cold (compliance); scrubbing automático de PII em crash reports

---

## AI Agent Sandbox — ADR-010

> Fonte: Tranquilão §2.3 (claude-code 19/25) + Kaspersky §2.3 (AI Agent Full) + Trevor (QA sandbox XDG + MCP security) + cc-switch (Tauri IPC).

- [ ] **Permissions Model:** `settings.json` allow/deny list — **nunca `--dangerously-skip-permissions` em prod**; deny by default — *CI: `claude-code-config-audit` skill*
- [ ] **Tool allowlist (deny by default):** block `curl|wget|bash -c` sem aprovação; MCP servers pinned por SHA; review obrigatório em `curl | bash` — *Gate: HITL*
- [ ] **Network egress control (allowlist only):** domínios/portas explícitos; proxy local (se existir, padrão cc-switch) bound em **loopback**; non-loopback exige hardening + justificativa — *Review: Kaspersky*
- [ ] **Filesystem isolation (worktree/chroot):** agent roda em worktree/container efêmero; allowlist de paths read/write/execute; QA sandbox sob `mktemp`/XDG para não tocar `~/.config` do host (oh-my-openagent) — *CI: fast-path + sandbox job*
- [ ] **Resource limits (CPU, memory, disk, time):** token budget por agent/run + alerta em 80%; timeout + cancellation tokens em toda tool call — *Monitor: OTEL/Langfuse*
- [ ] **HITL:** aprovação humana para bash, network write, file write sensível, tool calls > threshold — *Workflow gate*
- [ ] **Audit logging (all tool invocations):** JSONL append-only com `agent_id`, `action`, `params_hash`, `result_summary`, `timestamp`, `user_id` (SOC2 CC7) — *Compliance: `soc2-ai-audit.md`*
- [ ] **PII redaction in logs:** redaction pipeline antes de enviar contexto a LLM; nunca secrets no prompt — *Test: `lgpd-llm.md`*
- [ ] **Telemetry opt-out:** respeitar opt-out de telemetria em dev tools (PostHog/analytics) — *Fonte: Trevor §2.3*

## LLM App Gate — ADR-011

| LLM Risk | Mitigação Obrigatória | Validação |
|----------|----------------------|-----------|
| LLM01 Prompt Injection | Input sanitization + output validation + tool allowlist | Eval adversarial |
| LLM02 Insecure Output | Structured output (JSON Schema/Pydantic) + validation | Contract test |
| LLM06 PII Leakage | Redaction pipeline antes da LLM | Automated test (`lgpd-llm.md`) |
| LLM07 Insecure Plugins | MCP allowlist + capability-based permissions | Code review |
| LLM08 Excessive Agency | Tool allowlist + confirmação para ações destrutivas | HITL gate |
| Completo LLM01–LLM10 | Ver `compliance/owasp-llm-top10.md` | CI gate |

## LLM Platform Hardening — ADR-012

- [ ] **SECURITY.md disclosure policy + SLA + escopo** (este arquivo)
- [ ] **Multi-tenant RBAC:** workspace isolation + API key scoping + rate limit por tenant
- [ ] **Data Isolation:** RLS (Row Level Security) + container-level isolation; self-hosted residency (dados não saem da infra do cliente)
- [ ] **Audit Logs:** imutáveis para todas ações (admin, user, agent)
- [ ] **RAG Pipeline Security:** doc validation + embedding sanitization + retrieval guards (anti doc-injection/poisoning) — *Threat: `rag-poisoning.md`*

---

## Supply Chain — ADR-013

| Stage | Ferramenta | Threshold | CI |
|-------|------------|-----------|-----|
| SBOM Generation | Syft (CycloneDX) | Block Release se ausente | `multiarch-build-push.yml` |
| Vulnerability Scan | Snyk + OSV + Trivy (+ `npm/cargo/pip-audit`) | **0 High/Critical** | Block PR |
| SLSA Provenance | SLSA GitHub Actions Level 2+ | Warn se < L2 | Release |
| Image Signing | Cosign (keyless) | Block Release se não assinado | Release |
| Secrets Scan | Gitleaks + TruffleHog | **0 findings — Block Commit** | pre-commit + CI |
| Dependency Pinning | `package-lock.json` / `pnpm-lock.yaml` / `Package.resolved` + hash | CI gate | `lockfile-policy.md` |

- [ ] Signed commits (`git commit -S`) — recomendado para main
- [ ] Verified dependencies + lockfile integrity checks (`npm ci --frozen-lockfile`)
- [ ] Provenance attestation (SLSA Level 2+)
- [ ] `ADMIN_API_KEY`/defaults: gerar no boot + secret manager (nunca default commitado — anti-pattern Dify)
- [ ] Postgres/comunicação interna com TLS/mTLS + network policy (não plaintext)

---

## Threat Modeling — ADR-015

- [ ] **STRIDE analysis per component** (`threat-models/{service}-stride.md`: Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation)
- [ ] **Data flow diagrams (DFD)** + assets & trust boundaries
- [ ] **Attack surface review quarterly** (incl. desktop IPC Tauri + local proxy, se aplicável — cc-switch)
- [ ] **Mitigations tracked in ADRs** + residual risk acceptance assinada (Kaspersky + Trevor)
- [ ] Fluxo: Design (Niamaia+Kaspersky) → Review (Kaspersky+Trevor, aprovação escrita) → Implementation (controles como código) → Validation (Kaspersky+Qualy, SAST/DAST + pentest se high-risk)

---

## SAST/DAST Gates — ADR-016

| Stage | Ferramenta | Fail Condition |
|-------|------------|----------------|
| SAST JS/TS | ESLint Security + Semgrep (`semgrep-rules-nodejs.yaml`) | 0 High/Critical — Block PR |
| SAST Python | Bandit + Semgrep | 0 High/Critical — Block PR |
| SAST Mobile | Detekt/SwiftLint + Semgrep (android/ios rules) | 0 High/Critical — Block PR |
| Secrets | Gitleaks + TruffleHog | 0 findings — Block Commit |
| Dependency | Snyk + OSV + Dependabot | 0 High/Critical — Block PR |
| DAST Web/API | OWASP ZAP (active + authenticated + API spec) | 0 Critical — Block Release |
| DAST Mobile | MobSF (static + dynamic) | 0 Critical — Block Release |
| DAST LLM | Garak + custom (injection + PII leakage) | 0 Critical — Block Release |

---

## Compliance Mapping — ADR-017

| Control | Standard | Implementation | Evidência |
|---------|----------|----------------|-----------|
| Encryption at rest | LGPD Art.46 / SOC2 CC6.1 | AES-256 (DB, disk, backups); Keychain/Keystore mobile | IaC + KMS config |
| Encryption in transit | LGPD Art.46 / SOC2 CC6.1 | TLS 1.3 (externo) + mTLS/service mesh (interno); HSTS; pinning mobile | ZAP + NSC/ATS |
| Access logging | SOC2 CC7.2 | Structured audit logs + agent JSONL imutável; `trace_id` | Log retention 30d/1a |
| Data retention | LGPD Art.15-16 | Policy + automated deletion; DSR via {{DATA_DPO_EMAIL}} | `lgpd-data-map.md` |
| Auth & MFA | SOC2 CC6.1 / ASVS 2.x | bcrypt-12 + JWT rotation + MFA | `auth-baseline.md` |
| Input validation | ASVS 5.x / MASVS-STORAGE | Zod/Valibot boundary | SAST + tests |
| Multi-tenant isolation | SOC2 CC6.3 | Workspace RLS + container isolation | `multi-tenant-rbac.md` |
| LLM data minimization | LGPD Art.6 / LLM06 | PII redaction antes da LLM; sem PII em snapshots/fixtures | `lgpd-llm.md` + `test-data-lgpd.md` |
| Supply chain integrity | SOC2 CC8 / SLSA | SBOM + cosign + provenance L2+ | Release artifacts |
| Vulnerability mgmt | SOC2 CC7.1 | SAST/DAST/SCA gates + SLA deste arquivo | CI reports |

> Matrizes detalhadas: `compliance/masvs-matrix-{android,ios}.md` · `compliance/asvs-node-mapping.md` · `compliance/owasp-llm-top10.md` · `compliance/lgpd-data-map.md` · `compliance/soc2-ai-audit.md` · `compliance/play-integrity.md` · `compliance/ios-app-attest.md`.

---

## Security Checklist (PR Gate) — Tranquilão BLOCKERS

<!-- CI `quality-gates.yml` + `pr-security-checklist.md` validam automaticamente o que tem `CI:`. O resto é review humano obrigatório. -->

- [ ] No secrets in diff (CI: gitleaks + TruffleHog — 0 findings)
- [ ] No `eval` / `Function` / `exec` / `shell:true` without review + `// why:` (CI: eslint-plugin-security SEC002/006/007)
- [ ] No dangerous permissions added (Android perms, entitlements iOS, MCP scopes, CI `permissions:` mínimas) (CI: manifest diff)
- [ ] Dependency updates scanned (CI: Snyk + OSV — 0 High/Critical)
- [ ] Tests for authz paths (matriz resource-level: dono/outro/admin/anônimo) (CI: `authz-tests.md` obrigatório)
- [ ] No PII / stack traces / internals vazados ao client ou em logs (CI: redaction test + log grep)
- [ ] Input validation (Zod/Valibot) em toda nova entry point + contract test (Pact) sem breaking silencioso
- [ ] Migration DB backward-compat (add column nullable, não drop/rename sem expand-migrate-contract)
- [ ] Coverage não caiu (≥80% linha, ≥70% branch; ≥90% em auth/crypto/payments) + SAST 0 High/Critical

**Anti-patterns que bloqueiam merge (Tranquilão §3 / Kaspersky §5):** `allowBackup=true`, `NSAllowsArbitraryLoads=true`, Keychain `Always`, SafetyNet (usar Play Integrity), `--dangerously-skip-permissions` em prod, `curl | bash` sem pin SHA, `.env` com keys commitadas, `ADMIN_API_KEY` default, Postgres sem TLS interno, `temperature=0` como "segurança", JWT sem `jti` revocation, `npm audit only` como único gate.

---

## Acknowledgments

Agradecemos researchers que reportam responsavelmente. Com consentimento, listamos em {{HALL_OF_FAME_URL}}. Para dúvidas não-sensíveis: {{SUPPORT_EMAIL}}.

---

*Última revisão: {{LAST_UPDATED_YYYY-MM-DD}} · Donos: Tranquilão + Kaspersky + Trevor · Próxima revisão: +6 meses ou após incidente High/Critical.*