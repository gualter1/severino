## METADADOS
- **Repositório**: `awesome-llm-apps`
- **Lead Responsável**: `qualy`
- **Funcionário (Subagente)**: `Qualy`
- **Data**: `2026-10-08`
- **Tempo gasto**: `1h 30min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | 100+ open-source AI agents, agent skills, e RAG apps. |
| **Público-alvo** | Devs, arquitetos de IA, entusiastas de agentes. |
| **Tamanho** | > 100 pastas de projetos individuais, alta complexidade, estrutura modular. |
| **Linguagens/Tech** | Python, JavaScript/Node.js, Markdown, YAML. |
| **Freshness** | Ativo e em expansão semanal. |

---

## 2. O QUE PRESTA PARA **QUALY**

| Item | Localização | Tipo | Destino sugerido | Prioridade |
|------|-------------|------|------------------|------------|
| Testes determinísticos de skills | `agent_skills/evals/*/test_*.py` | Pattern/Tool | `agents/qualy/test-patterns/` | 🔴 Alta |
| Estrutura de "JSON contract" | `voice_ai_agents/insurance_claim_live_agent_team/schemas.py` | Compliance | `agents/qualy/contract-testing/` | 🔴 Alta |
| Testes de integração de LLM | `earnings_call_analyst_agent/tests/test_core_contracts.py` | Code snippet | `agents/qualy/llm-integration-tests/` | 🔴 Alta |
| Lint de skills (especificação) | `agent_skills/evals/tools/skill_lint.py` | Tool config | `agents/qualy/lint-rules/` | 🟠 Média |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno |
|------|-------------|--------|--------------------|
| Uso de prints para debug em testes | Vários arquivos `test_*.py` | Difícil de rastrear em CI | Logger estruturado |
| Falta de Testcontainers | Diversos exemplos de DB/Redis | Mock frágil | Testcontainers |

---

## 4. GAPS — O QUE O REPO NÃO COBRE

- [ ] **Estratégia de Performance (k6)**: Não há baseline clara de performance para os agentes.
- [ ] **Contract Testing Formal**: O "JSON contract" citado é informal. Precisa de um framework como Pact.
- [ ] **Chaos Engineering**: Nenhuma injeção de falha documentada ou automatizada em agentes críticos.

---

## 5. AÇÕES PROPOSTAS PARA QUALY (LEAD)

- [ ] **Criar Template**: `LLM-Contract-Test.md` — Para garantir que todo novo agente valide o esquema de saída.
- [ ] **Criar Runbook**: `CI-Test-Failure-Response.md` — Para o CI de `skill-evals.yml`.
- [ ] **Criar Check-list**: `Quality-Gate-Skill-Submission.md` — Para validar novas skills.

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES

> `earnings_call_analyst_agent/tests/test_core_contracts.py:1`: "Deterministic tests for first-reader's bundled scripts (eval tier 2b)."
> `voice_ai_agents/insurance_claim_live_agent_team/schemas.py:1`: "Structured data contracts for the insurance claim intake workflow."

---

## 7. SCORE DE VALOR DO REPO

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Altíssima para IA e agentes |
| **Qualidade** | 4 | Bem testado, mas descentralizado |
| **Atualidade** | 5 | Extremamente moderno |
| **Ação** | 4 | Muitas lições aprendidas (evals) |
| **Completude** | 3 | Falta QA de infra e performance |
| **TOTAL** | **21/25** | **Priorizar extração completa** |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar extração em `_consolidado/agents/qualy/extractions/awesome-llm-apps.md`
- [ ] Mover para próximo repo na fila.