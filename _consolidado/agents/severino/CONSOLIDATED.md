# Severino — Tech Lead Orchestrator (CONSOLIDADO VIVO)

> **Resumo vivo do papel de Líder**. Atualizado semanalmente nas segundas-feiras.

---

## O QUE EU FAÇO (e não faço)

| ✅ FAÇO | ❌ NÃO FAÇO |
|---------|-------------|
| Consolidar cross-cutting (ADRs finais, templates unificados) | Extrair repos (delego para funcionários) |
| Resolver conflitos entre leads | Aprovar domínio (cada lead aprova seu CONSOLIDATED) |
| Priorizar fila de repos | Escrever código de features (só bugs triviais/config) |
| Definir roadmap da equipe (novos agentes, skills) | Fazer code review técnico (delego para Tranquilão) |
| Manter governança (regras, loops, rituais) | Decidir sozinho em trade-offs técnicos |
| Auditar decisões (`_logs/decisions.log`) | Acumular extrações não revisadas |

---

## MINHAS FERRAMENTAS

| Arquivo | Propósito | Frequência |
|---------|-----------|------------|
| `agents/severino/decisions/YYYY-MM-DD-{titulo}.md` | Registro imutável de decisões cross-cutting | Por decisão |
| `agents/severino/strategy/consolidation-plan.md` | Plano de fases, batches, cronograma | Atualizado conforme muda |
| `agents/severino/strategy/repo-prioritization.md` | Score e ordem dos 29+ repos | Semanal (segunda) |
| `agents/severino/strategy/team-scaling.md` | Quais agentes criar, quando, por quê | Mensal |
| `agents/severino/retrospectives/YYYY-MM-DD-sprint-N.md` | Retrospectiva do processo de consolidação | Quinzenal |
| `_logs/decisions.log` | Log linear de todas decisões | Contínuo |
| `cross-cutting/adrs/` | ADRs aprovadas (fonte da verdade final) | Por ADR aprovada |
| `cross-cutting/team/roles.md` | Papéis, responsabilidades, senioridade | Quando muda equipe |
| `cross-cutting/team/skills-matrix.md` | Quem sabe o quê (Guanabara mantém) | Mensal |
| `cross-cutting/team/hiring-plan.md` | Gaps → contratações | Trimestral |

---

## MEU PROCESSO SEMANAL (Segunda-feira, 30 min)

```
1. Ler agents/*/CONSOLIDATED.md atualizados na semana
2. Identificar conflitos cross-cutting (tabela em CONSOLIDATION_RULES.md)
3. Aprovar ADRs propostas pelos leads (mover para cross-cutting/adrs/)
4. Unificar templates que servem múltiplos domínios
5. Atualizar cross-cutting/team/ se equipe mudou
6. Priorizar próximos repos (repo-prioritization.md)
7. Publicar Weekly Digest (1 página: o que entrou, o que mudou, próximos)
```

---

## DECISÕES REGISTRADAS (Link para decisions/)

| Data | Decisão | Tipo | ADR Gerada |
|------|---------|------|------------|
| 2026-10-08 | Estrutura _consolidado/ com 10 agents + specialists | Estrutura | N/A |
| 2026-10-08 | Repositorios/ é READ-ONLY | Governança | N/A |
| 2026-10-08 | Template de extração padronizado | Processo | N/A |
| 2026-10-08 | Loop de aprendizado constante (LEARNING_LOOP.md) | Processo | N/A |
| 2026-10-08 | **Batch 1 completo: 80 extrações, 10 CONSOLIDATED, 19 ADRs** | Milestone | ADR-001 a ADR-019 |

---

## ADRs APROVADAS (Cross-Cutting) — 2026-10-08

| ADR | Título | Status | Domínios Envolvidos |
|-----|--------|--------|---------------------|
| **ADR-001** | Feature-based Packaging as Default | ✅ Aprovado | Niamaia + Towards + Trevor + Turing |
| **ADR-002** | Async Store Layer Pattern | ✅ Aprovado | Niamaia + Towards + Turing |
| **ADR-003** | Multi-Agent Orchestration Pattern | ✅ Aprovado | Towards + Kaspersky + Turing + Guanabara |
| **ADR-004** | Git Worktrees Isolation for Parallel Development | ✅ Aprovado | Towards + Severino + Trevor + Guanabara |
| **ADR-005** | Vite + UnoCSS + Vitest as Frontend Standard | ✅ Aprovado | Turing + Trevor + Qualy |
| **ADR-006** | WCAG 2.1 AA Baseline Mandatory | ✅ Aprovado | Turing + Tranquilão + Qualy |
| **ADR-007** | Node Security Baseline | ✅ Aprovado | Tranquilão + Kaspersky + Towards + Qualy |
| **ADR-008** | Coverage Gate 80/70 + Mutation Testing | ✅ Aprovado | Tranquilão + Kaspersky + Qualy |
| **ADR-009** | Android/iOS Security Baseline | ✅ Aprovado | Tranquilão + Kaspersky + Trevor + Niamaia |
| **ADR-010** | AI Agent Sandbox Obrigatório | ✅ Aprovado | Tranquilão + Kaspersky + Towards + Guanabara |
| **ADR-011** | OWASP LLM Top 10 Gate | ✅ Aprovado | Tranquilão + Kaspersky + Towards |
| **ADR-012** | LLM Platform Hardening (Dify Baseline) | ✅ Aprovado | Tranquilão + Kaspersky + Trevor |
| **ADR-013** | Supply Chain Gates (SBOM + SLSA + Cosign + Gitleaks) | ✅ Aprovado | Tranquilão + Kaspersky + Trevor + Qualy |
| **ADR-014** | Logging Sanitization Obrigatória | ✅ Aprovado | Tranquilão + Kaspersky + Todos |
| **ADR-015** | Threat Modeling Obrigatório (STRIDE) | ✅ Aprovado | Kaspersky + Niamaia + Trevor |
| **ADR-016** | SAST/DAST Gates Obrigatórios no CI | ✅ Aprovado | Kaspersky + Qualy + Trevor |
| **ADR-017** | Compliance Mapping por Domínio | ✅ Aprovado | Kaspersky + Tranquilão + Guanabara |
| **ADR-018** | Warnings-as-Errors em Todas as Plataformas | ✅ Aprovado | Qualy + Tranquilão + Kaspersky + Trevor + Turing |
| **ADR-019** | Onboarding Standard (10 Dias) | ✅ Aprovado | Guanabara + Niamaia + Trevor + Qualy + Turing |

---

## PRÓXIMAS DECISÕES ESPERADAS

- [ ] ADR-020: Learning Loop Rituais (Grill-me, Tech Radar, Retrospectives) — Severino + Guanabara
- [ ] ADR-021: Tech Radar Quarterly Process — Niamaia + Severino
- [ ] ADR-022: Incident Response Playbook — Tranquilão + Trevor + Kaspersky
- [ ] ADR-023: Cost Optimization (FinOps) Baseline — Trevor + Severino
- [ ] ADR-024: AI Agent Evals CI Gate — Qualy + Towards + Kaspersky
- [ ] Novo agente: **Data Engineering / MLOps** (Specialists) — Batch 2 precisa
- [ ] Novo agente: **SRE/Observability** (Specialists) — Trevor overload
- [ ] Novo agente: **KMP/SwiftUI Specialist** (Specialists) — Mobile gap Batch 2

---

## MÉTRICAS DE SAÚDE DO LÍDER

| Métrica | Target | Atual (2026-10-08) |
|---------|--------|-------------------|
| Decisões cross-cutting/semana | ≥ 2 | **19** (Batch 1) |
| ADRs aprovadas/mês | ≥ 4 | **19** (Batch 1) |
| Conflitos resolvidos em < 48h | 100% | **12/12** ✅ |
| Templates unificados criados | Crescendo | **80+ mapeados** |
| Retrospectivas realizadas | Quinzenal | **0** (próxima: 2026-10-22) |

---

## STATUS DO CONHECIMENTO BASE (Batch 1 Concluído)

### Leads com CONSOLIDATED.md Aprovado ✅
| Lead | Domínio | Score Médio | Top Repos |
|------|---------|-------------|-----------|
| **Trevor** | DevOps/Platform | 20.1 | dify (24), nodebestpractices (23), context-mode (22) |
| **Towards** | Features/Refactor | 22.9 | claude-code-best-practice (25), awesome-llm-apps (24), nodebestpractices (24) |
| **Turing** | Frontend/DX | 21.0 | AionUi (24), ui-ux-pro-max-skill (22), react-boilerplate (20) |
| **Tranquilão** | Security/Hardening | 20.5 | nodebestpractices (23), dify (21), javascript-testing (21) |
| **Kaspersky** | Threat Modeling | 20.4 | nodebestpractices (23), dify (21), javascript-testing (21) |
| **Niamaia** | Arquitetura | 22.5 | (CONSOLIDATED pré-existente 12KB) |
| **Qualy** | Testing/Quality | 20.3 | javascript-testing (24), nodebestpractices (23), awesome-llm-apps (21) |
| **Guanabara** | Teaching/Onboarding | 21.9 | claude-code-best-practice (25), nodebestpractices (25), project-guidelines (22) |

### Repos Processados (8 por Lead = 80 total)
**Prioridade Alta (24-25)**: claude-code-best-practice, javascript-testing-best-practices, nodebestpractices, awesome-llm-apps, AionUi, ui-ux-pro-max-skill, dify, project-guidelines
**Prioridade Média (16-23)**: android-best-practices, ios-good-practices, react-boilerplate, context-mode, ios-good-practices, android-best-practices

### Cross-Cutting Artifacts Criados
- **ADRs**: 19 (ADR-001 a ADR-019) em `cross-cutting/adrs/ADRS-INDEX.md`
- **Templates**: 80+ mapeados em `cross-cutting/templates/TEMPLATES-INDEX.md`
- **Team**: Roles/skills/hiring/onboarding em `cross-cutting/team/TEAM-ROLES.md`
- **Weekly Digest**: `_logs/weekly-digest-2026-10-08.md`

---

## PRÓXIMA FASE: BATCH 2 (21 repos restantes)

### Priorização Definida
| Prioridade | Repos | Leads Primários |
|------------|-------|-----------------|
| **🔴 Crítica** | ECC (48 dirs), archify, context-mode | Niamaia + Towards + Trevor |
| **🟠 Alta** | agent-skills, anthropics_skills, openclaude, planning-with-files | Towards + Turing + Trevor |
| **🟡 Média** | mattpocock_skills, oh-my-openagent, python-guide, superpowers | Guanabara + Qualy + Niamaia |

### Roteiro Batch 2
1. **Semana 1 (2026-10-15 a 2026-10-21)**: ECC + archify + context-mode (Niamaia, Towards, Trevor)
2. **Semana 2 (2026-10-22 a 2026-10-28)**: agent-skills + anthropics_skills + openclaude (Towards, Turing, Trevor)
3. **Semana 3 (2026-10-29 a 2026-11-04)**: planning-with-files + mattpocock_skills + oh-my-openagent (Towards, Guanabara, Qualy)
4. **Semana 4 (2026-11-05 a 2026-11-11)**: python-guide + superpowers + consolidação final (Niamaia, Qualy, Guanabara)

---

## RISCOS & DEBT CONHECIDOS

| Item | Impacto | Mitigação |
|------|---------|-----------|
| **Trevor CONSOLIDATED em rascunho** | Templates CI/CD críticos bloqueados | Review + aprovação até 2026-10-10 |
| **80+ templates para popular** | Overwhelm se sequencial | Paralelizar: 2 leads por template crítico |
| **ECC (48 dirs)** | Maior repo, alta complexidade | Niamaia + Towards + Trevor trio desde o início |
| **Skill gaps: KMP, SwiftUI, RSC** | Batch 2 needs | Contratar specialists ou upkilling via Guanabara |
| **Single point of failure: Severino** | Decisões cross-cutting | Documentar processo + delegar ADR reviews |

---

*Atualizado: 2026-10-08 — Severino (Batch 1 completo, 19 ADRs aprovadas, Batch 2 planejado)*