## METADADOS
- **Repositório**: `nodebestpractices`
- **Lead Responsável**: `tranquilao`
- **Funcionário (Subagente)**: `tranquilao`
- **Data**: `2026-10-08`
- **Tempo gasto**: `2h 00min`

---

## 1. VISÃO GERAL
| Campo | Detalhe |
|-------|---------|
| Propósito | Maior curadoria Node.js: 80+ best practices (projeto, error, testing, security 6.1-6.27) |
| Público | Backend Node, architects, security |
| Tamanho | README ~1372 linhas + `sections/security/*` (~30 arquivos) |
| Tech | Markdown, JS/TS, Docker, ESLint configs |
| Freshness | Ativo, atualizado 2024-2025 |

---

## 2. O QUE PRESTA
| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| Seção 6 Security completa (6.1-6.27): helmet, rate-limit, JWT rotation, bcrypt | `README.md:900-1100` + `sections/security/*` | Guideline | `agents/tranquilao/hardening-guides/node-security-baseline.md` | 🔴 Alta |
| `eslint-plugin-security` + lint rules (`security/detect-eval`, `detect-child-process`) | `sections/security/lintrules.md` | Tool config | `agents/tranquilao/checklists/sast-gates.md` | 🔴 Alta |
| Secret management: dotenv-vault, CI secrets, rotação | `sections/security/secretmanagement.md` | Pattern | `agents/tranquilao/checklists/secrets-management.md` | 🔴 Alta |
| Avoid `eval`, `vm`, `child_process` com input; `avoid insecure crypto (md5)` | `sections/security/avoideval.md` | Anti-pattern | `agents/tranquilao/checklists/sast-gates.md` | 🔴 Alta |
| Input validation Joi/Zod + `validator.js` sanitization anti-XSS | `sections/security/validation.md` | Code snippet | `agents/tranquilao/checklists/input-validation.md` | 🔴 Alta |
| Auth: bcrypt `cost 12`, JWT short-lived + refresh rotation, 2FA | `sections/security/auth.md` | Guideline | `agents/tranquilao/hardening-guides/auth-baseline.md` | 🔴 Alta |
| Rate-limit (`express-rate-limit`), `helmet` CSP/HSTS, CORS allowlist | `sections/security/helmet-rate-limit.md` | Tool config | `agents/tranquilao/network-security/api-hardening.md` | 🔴 Alta |
| ORM parameterized (Sequelize/Knex) zero concatenação SQL | `sections/security/sql-injection.md` | Anti-pattern | `agents/tranquilao/checklists/sast-gates.md` | 🔴 Alta |
| Error handling: boom/http-errors, não vazar stack (ASVS 7.x) | `README.md:600-700` | Pattern | `agents/tranquilao/checklists/error-handling.md` | 🟠 Média |
| `npm audit` + `snyk` + Dependabot + `package-lock.json` pinnado | `sections/security/dependencies.md` | Tool config | `agents/tranquilao/checklists/supply-chain.md` | 🟠 Média |

---

## 3. LIXO/DESATUALIZADO/PERIGOSO
| Item | Localização | Motivo | Substituto |
|------|-------------|--------|------------|
| `npm audit` only como gate | `security.md:10` | Não cobre transitive bem | audit + Snyk + OSV-Scanner + Dependabot |
| Exemplos `jsonwebtoken` sem `jti` revocation | `sections/security/auth.md` | Sem logout global | Redis denylist + rotation |
| `express-validator` legado em trechos | `sections/security/validation.md` | Zod mais TS-friendly | Zod/Valibot |

---

## 4. GAPS
- [ ] Gap 1: LGPD/SOC2 audit logs mapping — Sugestão: `compliance/lgpd-node-mapping.md`
- [ ] Gap 2: DAST (OWASP ZAP) no CI ausente — Sugestão: runbook
- [ ] Gap 3: Secrets scanning (gitleaks/trufflehog) pre-commit — Sugestão: Quality Gate
- [ ] Gap 4: SBOM CycloneDX npm — Sugestão: supply-chain

---

## 5. AÇÕES
- [ ] **CONSOLIDATED.md** com: Node security baseline (helmet+rate-limit+bcrypt+JWT+Zod+parameterized)
- [ ] **Criar ADR**: `ADR-node-security-baseline` — Para: tornar 6.1-6.27 gate obrigatório
- [ ] **Criar Checklist**: `node-sast-pr-gate.md` + `supply-chain-gate.md`
- [ ] **Criar Skill**: `node-security-audit`

---

## 6. CITAÇÕES
> `README.md:950` — "Embrace linter security rules: `eslint-plugin-security` to catch `eval`, `child_process`, insecure regex."
> `sections/security/secretmanagement.md:12` — "Secrets must live outside code — env/secret manager, rotated, never committed."
> `sections/security/validation.md:8` — "Validate and sanitize all input with Joi/Zod on the boundary."

---

## 7. SCORE
| Relevância | 5 | Core security backend |
| Qualidade | 5 | Profundo, exemplos, 6.1-6.27 |
| Atualidade | 4 | Ativo, pequenos legados |
| Ação | 5 | Gates/templates imediatos |
| Completude | 4 | Falta LGPD/DAST/secrets-scan |
| **TOTAL** | **23/25** | Priorizar extração completa |

---

## 8. PRÓXIMOS PASSOS
- [x] Salvar em `extractions/nodebestpractices.md`