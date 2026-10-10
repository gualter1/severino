## METADADOS
- **Repositório**: `nodebestpractices`
- **Lead Responsável**: `kaspersky`
- **Funcionário (Subagente)**: `kaspersky`
- **Data**: `2026-10-08`
- **Tempo gasto**: `2h 15min`

---

## 1. VISÃO GERAL
| Campo | Detalhe |
|-------|---------|
| Propósito | Maior curadoria Node.js: 80+ best practices (security 6.1-6.27 é ouro) |
| Público | Backend Node, architects, security |
| Tamanho | README ~1372 linhas + `sections/security/*` (~30 arquivos) |
| Tech | Markdown, JS/TS, Docker, ESLint configs |
| Freshness | Ativo, atualizado 2024-2025 |

---

## 2. O QUE PRESTA PARA **THREAT MODELING/SAST/DAST/COMPLIANCE**
| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| Seção 6 completa: threat modeling implícito (input validation, auth, secrets, crypto) | `README.md:900-1100` + `sections/security/*` | Threat model | `agents/kaspersky/threat-models/nodejs-full.md` | 🔴 Alta |
| Input validation boundary (Joi/Zod) — previne XSS, injection, prototype pollution | `sections/security/validation.md` | Pattern | `agents/kaspersky/sast-dast/input-validation-rules.md` | 🔴 Alta |
| Secret management: rotation, vault, nunca no code, env separation | `sections/security/secretmanagement.md` | Guideline | `agents/kaspersky/compliance/secret-management.md` | 🔴 Alta |
| Auth: bcrypt cost 12, JWT short + refresh rotation, 2FA, rate-limit | `sections/security/auth.md` | Guideline | `agents/kaspersky/hardening-guides/auth-baseline.md` | 🔴 Alta |
| Helmet CSP/HSTS/COOP/COEP + CORS allowlist + rate-limit | `sections/security/helmet-rate-limit.md` | Tool config | `agents/kaspersky/sast-dast/security-headers.md` | 🔴 Alta |
| ORM parameterized queries — previne SQL/NoSQL injection | `sections/security/sql-injection.md` | Anti-pattern | `agents/kaspersky/sast-dast/orm-safe-patterns.md` | 🔴 Alta |
| Dependency security: `npm audit` + Snyk + OSV + Dependabot + lockfile | `sections/security/dependencies.md` | Tool config | `agents/kaspersky/sast-dast/supply-chain-gates.md` | 🟠 Média |
| Error handling sem stack trace leak (ASVS 7.x) | `README.md:600-700` | Pattern | `agents/kaspersky/checklists/error-handling.md` | 🟠 Média |
| `eslint-plugin-security` rules (detect-eval, child-process, non-literal-regex) | `sections/security/lintrules.md` | SAST config | `agents/kaspersky/sast-dast/eslint-security-rules.md` | 🔴 Alta |

---

## 3. LIXO/DESATUALIZADO/PERIGOSO
| Item | Localização | Motivo | Substituto |
|------|-------------|--------|------------|
| `npm audit` only | `security.md:10` | Cobertura parcial transitive | audit + Snyk + OSV-Scanner + Dependabot |
| JWT sem `jti` + revocation | `sections/security/auth.md` | Sem logout global | Redis denylist + short expiry + rotation |
| `express-validator` legado | `sections/security/validation.md` | Zod mais TS-strict | Zod/Valibot |

---

## 4. GAPS
- [ ] Gap 1: Threat model STRIDE explícito para Node API — Sugestão: `threat-models/nodejs-stride.md`
- [ ] Gap 2: OWASP ASVS 4.x mapping para Node — Sugestão: `compliance/asvs-node-mapping.md`
- [ ] Gap 3: DAST (OWASP ZAP) no CI pipeline — Sugestão: runbook
- [ ] Gap 4: SBOM CycloneDX + SLSA provenance — Sugestão: `supply-chain.md`
- [ ] Gap 5: LGPD/SOC2 audit log mapping — Sugestão: `compliance/lgpd-soc2-node.md`

---

## 5. AÇÕES
- [ ] **CONSOLIDATED.md** com: Node threat model baseline + SAST gates + supply chain
- [ ] **Criar Threat Model**: `nodejs-stride.md` — Em: `threat-models/`
- [ ] **Criar SAST Ruleset**: semgrep/eslint rules — Em: `sast-dast/`
- [ ] **Criar ADR**: `ADR-node-security-baseline` (com Tranquilão)

---

## 6. CITAÇÕES
> `README.md:950` — "Embrace linter security rules: `eslint-plugin-security` to catch `eval`, `child_process`, insecure regex."
> `sections/security/secretmanagement.md:12` — "Secrets must live outside code — env/secret manager, rotated, never committed."
> `sections/security/validation.md:8` — "Validate and sanitize all input with Joi/Zod on the boundary."

---

## 7. SCORE
| Relevância | 5 | Core security backend |
| Qualidade | 5 | Profundo, 6.1-6.27 |
| Atualidade | 4 | Ativo |
| Ação | 5 | Gates/templates imediatos |
| Completude | 4 | Falta ASVS/DAST/SBOM |
| **TOTAL** | **23/25** | **OURO** — Priorizar extração completa |

---

## 8. PRÓXIMOS PASSOS
- [x] Salvar em `extractions/nodebestpractices.md`