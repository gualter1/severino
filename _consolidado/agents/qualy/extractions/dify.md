O Dify possui uma estrutura de testes bem definida e distribuída entre a API (backend) e o Web (frontend), com práticas específicas de mock e CI. Abaixo, apresento a extração de qualidade e testes para o repositório **dify**.

## METADADOS
- **Repositório**: `dify`
- **Lead Responsável**: `Qualy`
- **Funcionário (Subagente)**: `Qualy`
- **Data**: `2026-10-08`
- **Tempo gasto**: `1h 30min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Plataforma de desenvolvimento de aplicações LLM open-source. |
| **Público-alvo** | Desenvolvedores, Engenheiros de IA, Arquitetos de sistemas. |
| **Tamanho** | Monorepo (api, web, docker, cli, dify-agent, etc.) |
| **Linguagens/Tech** | Python, TypeScript, React, Docker, Celery, Redis, PostgreSQL. |
| **Freshness** | Alta; desenvolvimento ativo e releases frequentes. |

---

## 2. O QUE PRESTA PARA **QUALY**

| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| `pytest` config & env mocks | `api/pytest.ini` | Tool config | `agents/qualy/templates/pytest-config` | 🔴 Alta |
| API testing standards | `api/README.md:59-71` | Guideline | `agents/qualy/standards/api-testing.md` | 🔴 Alta |
| Frontend test canonicals | `web/docs/test.md` | Guideline | `agents/qualy/standards/web-testing.md` | 🟠 Média |
| API Contracts verification | `packages/contracts/README.md` | Pattern | `agents/qualy/patterns/contract-testing.md` | 🔴 Alta |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO
| Item | Localização | Motivo | Substituto moderno |
|------|-------------|--------|-------------------|
| Testes de integração locais | `api/README.md:71` | Difícil execução local, flakiness | Testcontainers / CI-only strategy |
| Mock manual em envs | `api/pytest.ini` | Manutenção manual complexa | `responses` ou `httpretty` / VCR |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA
- [ ] **Gap 1**: Falta de uma estratégia explícita de *Contract Testing* entre `api` e `web` (atualmente rely em zetas/typescript gen). Sugestão: `Pact` ou aumentar cobertura de `Schemathesis`.
- [ ] **Gap 2**: Mutation Testing para lógica crítica de workflows (`api/core/workflow`). Sugestão: `Stryker` ou `MutPy`.
- [ ] **Gap 3**: Dashboard de Flakiness para os testes de CI (os de integração são citados como CI-only). Sugestão: coletar artifacts de resultados de testes e criar dashboard no `Grafana` ou `ReportPortal`.

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Qualy)
- [ ] **Criar/Atualizar CONSOLIDATED.md** com: melhores práticas de mock que o Dify utiliza (via `pytest.ini`).
- [ ] **Criar ADR**: *Estratégia de Testes de Integração Backend* — Para: decidir se migramos para `Testcontainers` ou mantemos CI-only.
- [ ] **Criar Checklist**: *Code Review para PRs de Backend/API* (focando em testes de comportamento).

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES
> `api/README.md:71` — "Integration suites are CI-only and are not expected to run locally."

---

## 7. SCORE DE VALOR DO REPO
| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Essencial para o domínio de LLM Ops. |
| **Qualidade** | 4 | Boa organização, mas testes de integração são um ponto cego local. |
| **Atualidade** | 5 | Stack moderna (uv, Pydantic v2). |
| **Ação** | 4 | Excelente para extrair templates de infra de teste. |
| **Completude** | 4 | Cobre bem unit/controller, menos robusto em E2E/Contract. |
| **TOTAL** | **22/25** | Priorizar extração completa. |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO
- [x] Salvar este arquivo em `_consolidado/agents/qualy/extractions/dify.md`
- [ ] Avisar Lead Qualy que extração de `dify` está pronta.
- [ ] Mover para próximo repo.