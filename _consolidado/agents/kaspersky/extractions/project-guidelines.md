## METADADOS
- **Repositório**: `project-guidelines`
- **Lead Responsável**: `kaspersky`
- **Funcionário (Subagente)**: `kaspersky`
- **Data**: `2026-10-08`
- **Tempo gasto**: `50min`

---

## 1. VISÃO GERAL
| Campo | Detalhe |
|-------|---------|
| Propósito | Guidelines JS: estrutura, git, env, API, logging, testes |
| Público | JS/TS devs fullstack, leads |
| Tamanho | README ~800 linhas + `config.sample.js` |
| Tech | Markdown, JavaScript, Node |
| Freshness | Estável, princípios atemporais |

---

## 2. O QUE PRESTA PARA **THREAT MODELING/SAST/DAST/COMPLIANCE**
| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| Secrets via env + validação no boot (fail fast se missing) | `config.sample.js:1-40` | Pattern | `agents/kaspersky/compliance/secret-management.md` | 🔴 Alta |
| Input validation na borda (Joi/Zod) — boundary defense | `README.md:300-340` | Pattern | `agents/kaspersky/sast-dast/input-validation-rules.md` | 🔴 Alta |
| API security: helmet, CORS allowlist, status codes sem stack leak | `README.md:400-440` | Guideline | `agents/kaspersky/sast-dast/security-headers.md` | 🟠 Média |
| Logging estruturado sem PII, correlation-id — audit trail | `README.md:500-540` | Pattern | `agents/kaspersky/compliance/audit-logging.md` | 🟠 Média |
| Git hygiene: conventional commits + PR template — traceability | `README.md:60-110` | Checklist | `agents/kaspersky/compliance/git-traceability.md` | 🟢 Baixa |

---

## 3. LIXO/DESATUALIZADO/PERIGOSO
| Item | Localização | Motivo | Substituto |
|------|-------------|--------|------------|
| `console.log` em exemplos | `README.md:510` | Vaza PII, sem nível | pino/winston + redaction |
| Joi como única sugestão | `README.md:320` | Zod/Valibot mais TS | Zod + Valibot |

---

## 4. GAPS
- [ ] Gap 1: AuthZ resource-level (não só role-based) — Sugestão: `threat-models/authz-resource.md`
- [ ] Gap 2: SAST no CI (ESLint security + gitleaks) — Sugestão: Quality Gate
- [ ] Gap 3: LGPD data mapping/retention policy — Sugestão: `compliance/lgpd-data-map.md`

---

## 5. AÇÕES
- [ ] **CONSOLIDATED.md** com: env validation + input boundary + audit logging
- [ ] **Criar Threat Model**: `js-api-threat-model.md`
- [ ] **Criar Checklist**: `js-sast-gate.md`

---

## 6. CITAÇÕES
> `config.sample.js:5` — "Copy to `config.js` (gitignored). Never commit real secrets."
> `README.md:510` — "Log with context, never passwords/tokens/PII."
> `README.md:410` — "API must not leak stack traces; map to generic 500."

---

## 7. SCORE
| Relevância | 4 | Secrets, boundary, logging |
| Qualidade | 4 | Simples, aplicável |
| Atualidade | 3 | Sem SAST moderno/Zod |
| Ação | 4 | Templates imediatos |
| Completude | 2 | Sem authz/SAST/LGPD |
| **TOTAL** | **17/25** | Extrair seletivo |

---

## 8. PRÓXIMOS PASSOS
- [x] Salvar em `extractions/project-guidelines.md`