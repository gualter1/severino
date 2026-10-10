## METADADOS
- **Repositório**: `dify`
- **Lead Responsável**: `tranquilao`
- **Funcionário (Subagente)**: `tranquilao`
- **Data**: `2026-10-08`
- **Tempo gasto**: `1h 10min`

---

## 1. VISÃO GERAL
| Campo | Detalhe |
|-------|---------|
| Propósito | Plataforma LLMOps open-source (RAG, agents, workflows) self-hosted |
| Público | Platform, backend, security |
| Tamanho | Monorepo grande (API Python, web Next, Docker Compose) |
| Tech | Python, TS, Postgres/Redis, Docker |
| Freshness | Muito ativo |

---

## 2. O QUE PRESTA
| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| `SECURITY.md` disclosure policy (report, SLA, escopo) | `SECURITY.md:1-40` | Template | `agents/tranquilao/compliance/security-policy-template.md` | 🔴 Alta |
| Docker Compose com secrets via env, sem default password em prod | `docker-compose.yaml + .env.example` | Pattern | `agents/tranquilao/checklists/secrets-management.md` | 🔴 Alta |
| AuthN/AuthZ: workspace RBAC + API keys scoped + rate-limit | `api/*auth*:50-120` | Guideline | `agents/tranquilao/hardening-guides/auth-baseline.md` | 🔴 Alta |
| Self-hosted como controle LGPD/GDPR data residency | `README.md:40-80` | Compliance mapping | `agents/tranquilao/compliance/lgpd-data-residency.md` | 🟠 Média |
| Audit logs de runs/workflows (SOC2) | `api/*audit*` | Compliance mapping | `agents/tranquilao/compliance/soc2-ai-audit.md` | 🟠 Média |
| Dependabot + image pinning + non-root containers | `.github/* + Dockerfile` | Tool config | `agents/tranquilao/checklists/supply-chain.md` | 🟠 Média |

---

## 3. LIXO/DESATUALIZADO/PERIGOSO
| Item | Localização | Motivo | Substituto |
|------|-------------|--------|------------|
| `ADMIN_API_KEY=sk-...` default em compose exemplo | `docker-compose.yaml` | Facilita takeover se copiado | Gerar no boot + secret manager |
| Postgres sem TLS interno por default | `docker/*` | Sniffing lateral | mTLS/service mesh + network policy |

---

## 4. GAPS
- [ ] Gap 1: OWASP ASVS para API Dify — Sugestão: threat model + ZAP gate
- [ ] Gap 2: SBOM CycloneDX + SAST semgrep/bandit no CI — Sugestão: gates
- [ ] Gap 3: PII redaction em datasets/logs — Sugestão: `lgpd-llm.md`

---

## 5. AÇÕES
- [ ] **CONSOLIDATED.md** com: SECURITY.md template + RBAC + residency + audit
- [ ] **Criar Template**: `SECURITY.md` baseline — Em: `templates/security/`
- [ ] **Criar Checklist**: `llm-platform-hardening.md`
- [ ] **Criar Runbook**: `secret-rotation-dify.md`

---

## 6. CITAÇÕES
> `SECURITY.md:5` — "Please report vulnerabilities via [canal]; do not open public issues for sensitive reports."
> `README.md:50` — "Self-host Dify to keep data within your VPC for compliance."
> `.env.example:10` — "Change all default secrets before production."

---

## 7. SCORE
| Relevância | 5 | SECURITY.md, RBAC, residency, audit |
| Qualidade | 4 | Plataforma real, prod-grade |
| Atualidade | 5 | Muito ativo |
| Ação | 4 | Templates/gates imediatos |
| Completude | 3 | Sem ASVS/SBOM/PII-redaction |
| **TOTAL** | **21/25** | Priorizar extração completa |

---

## 8. PRÓXIMOS PASSOS
- [x] Salvar em `extractions/dify.md`