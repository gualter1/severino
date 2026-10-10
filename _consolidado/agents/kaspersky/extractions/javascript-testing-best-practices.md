## METADADOS
- **Repositório**: `javascript-testing-best-practices`
- **Lead Responsável**: `kaspersky`
- **Funcionário (Subagente)**: `kaspersky`
- **Data**: `2026-10-08`
- **Tempo gasto**: `1h 10min`

---

## 1. VISÃO GERAL
| Campo | Detalhe |
|-------|---------|
| Propósito | Guia testes JS: unit, integration, E2E, mutation, CI gates |
| Público | QA, JS devs, reviewers (Qualy + Tranquilão + Kaspersky) |
| Tamanho | readme ~2159 linhas |
| Tech | Markdown, Jest/Vitest, Cypress/Playwright, Stryker |
| Freshness | Ativo, moderno |

---

## 2. O QUE PRESTA PARA **THREAT MODELING/SAST/DAST/COMPLIANCE**
| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| Coverage gate 80/70 como Quality Gate — security-critical paths | `readme.md:180-220` | Guideline | `agents/kaspersky/checklists/quality-gates.md` | 🔴 Alta |
| Mutation testing Stryker para auth/crypto paths | `readme.md:1600-1650` | Tool config | `agents/kaspersky/sast-dast/mutation-testing.md` | 🟠 Média |
| `eslint-plugin-security` + `npm audit` no CI — SAST gate | `readme.md:1700-1750` | Tool config | `agents/kaspersky/sast-dast/sast-gate.md` | 🔴 Alta |
| Contract testing (Pact) — anti-breaking-change API | `readme.md:1800-1850` | Pattern | `agents/kaspersky/checklists/api-contract-gate.md` | 🟠 Média |
| Testes authz matrix (resource-level, não só role) | `readme.md:1900-1950` | Checklist | `agents/kaspersky/checklists/authz-tests.md` | 🔴 Alta |
| E2E afetados obrigatórios + flaky quarantine | `readme.md:2000-2100` | Guideline | `agents/kaspersky/checklists/quality-gates.md` | 🟠 Média |
| Não logar PII em fixtures/snapshots | `readme.md:1550-1580` | Anti-pattern | `agents/kaspersky/compliance/test-data-lgpd.md` | 🟠 Média |

---

## 3. LIXO/DESATUALIZADO/PERIGOSO
| Item | Localização | Motivo | Substituto |
|------|-------------|--------|------------|
| `npm audit` only | `readme.md:1720` | Cobertura parcial | audit + Snyk/OSV + Dependabot |
| Snapshots grandes sem redaction | `readme.md:1560` | Vaza PII em repo | Fixtures sintéticas + redaction |

---

## 4. GAPS
- [ ] Gap 1: SAST DAST para testes de security (ZAP/Burp) — Sugestão: runbook
- [ ] Gap 2: LGPD test-data management (anonimização) — Sugestão: `compliance/test-data-lgpd.md`
- [ ] Gap 3: Fuzzing para parsers/validators — Sugestão: adicionar a quality-gate

---

## 5. AÇÕES
- [ ] **CONSOLIDATED.md** com: coverage 80/70 + Stryker em auth/crypto + authz matrix tests
- [ ] **Criar Checklist**: `security-quality-gate-js.md` — Em: `agents/kaspersky/checklists/`
- [ ] **Criar ADR**: `ADR-security-testing-gate`

---

## 6. CITAÇÕES
> `readme.md:200` — "Set coverage thresholds: fail build under 80% lines, 70% branches."
> `readme.md:1725` — "Run `npm audit` + SAST in CI; fail on high severity."
> `readme.md:1920` — "Test authorization per resource, not just roles."

---

## 7. SCORE
| Relevância | 4 | Gates, authz tests, SAST |
| Qualidade | 5 | Exaustivo, exemplos |
| Atualidade | 4 | Moderno |
| Ação | 5 | Gates aplicáveis AGORA |
| Completude | 3 | Sem DAST/LGPD-test-data |
| **TOTAL** | **21/25** | Priorizar extração completa |

---

## 8. PRÓXIMOS PASSOS
- [x] Salvar em `extractions/javascript-testing-best-practices.md`