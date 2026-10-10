## METADADOS
- **Repositório**: `project-guidelines`
- **Lead Responsável**: `tranquilao`
- **Funcionário (Subagente)**: `tranquilao`
- **Data**: `2026-10-08`
- **Tempo gasto**: `55min`

---

## 1. VISÃO GERAL
| Campo | Detalhe |
|-------|---------|
| Propósito | Guidelines JS: estrutura, git, env, API, logging, testes |
| Público | JS/TS devs fullstack, leads |
| Tamanho | README ~800 linhas + `config.sample.js` |
| Tech | Markdown, JavaScript, Node |
| Freshness | Estável, princípios atemporais, sem updates recentes profundos |

---

## 2. O QUE PRESTA
| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| Secrets via env (`config.sample.js` + `.env` gitignored, validação no boot) | `README.md:120-160` + `config.sample.js:1-40` | Template | `agents/tranquilao/checklists/secrets-management.md` | 🔴 Alta |
| Validação de input na borda (Joi/Zod) antes de service | `README.md:300-340` | Guideline | `agents/tranquilao/checklists/input-validation.md` | 🔴 Alta |
| API security: status codes sem vazar stack, `helmet`, CORS allowlist | `README.md:400-440` | Guideline | `agents/tranquilao/network-security/api-hardening.md` | 🟠 Média |
| Logging estruturado sem PII, correlation-id | `README.md:500-540` | Pattern | `agents/tranquilao/checklists/logging-sanitization.md` | 🔴 Alta |
| Git hygiene: conventional commits + PR template com security checklist | `README.md:60-110` | Checklist | `agents/tranquilao/checklists/pr-template-security.md` | 🟠 Média |
| Separação config por env (dev/stage/prod) sem segredos no repo | `config.sample.js:1-40` | Code snippet | `templates/node/config-loader/` | 🟠 Média |

---

## 3. LIXO/DESATUALIZADO/PERIGOSO
| Item | Localização | Motivo | Substituto |
|------|-------------|--------|------------|
| `console.log` em exemplos | `README.md:510` | Vaza PII, sem nível | pino/winston + redaction |
| Joi como única sugestão | `README.md:320` | Zod/Valibot mais TS-friendly | Zod + Valibot |

---

## 4. GAPS
- [ ] Gap 1: AuthZ resource-level ausente — Sugestão: `authz-checklist.md` (OWASP ASVS 4.x)
- [ ] Gap 2: SAST no CI (ESLint security, gitleaks) — Sugestão: Quality Gate
- [ ] Gap 3: LGPD data mapping/retention — Sugestão: `compliance/lgpd-data-map.md`

---

## 5. AÇÕES
- [ ] **CONSOLIDATED.md** com: env validation pattern + logging redaction + PR security checklist
- [ ] **Criar Template**: `config-loader-zod.ts` — Em: `templates/node/config/`
- [ ] **Criar Checklist**: `js-pr-security-checklist.md`

---

## 6. CITAÇÕES
> `config.sample.js:5` — "Copy to `config.js` (gitignored). Never commit real secrets."
> `README.md:510` — "Log with context, never passwords/tokens/PII."
> `README.md:410` — "API must not leak stack traces; map to generic 500."

---

## 7. SCORE
| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| Relevância | 4 | Secrets, logging, API hygiene |
| Qualidade | 4 | Simples e aplicável |
| Atualidade | 3 | Sem SAST moderno/Zod |
| Ação | 4 | Templates imediatos |
| Completude | 2 | Sem authz/SAST/LGPD |
| **TOTAL** | **17/25** | Extrair seletivo |

---

## 8. PRÓXIMOS PASSOS
- [x] Salvar em `extractions/project-guidelines.md`