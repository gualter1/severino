# Facilitator Certification Cycle 3 — Kickoff Issues

**Período**: Q2 2027 (Abril–Junho 2027)  
**Meta**: Certificar 2 facilitadores adicionais  
**Base**: Sessão 10 Outcome + `FACILITATOR-CERTIFICATION-CYCLE-3.md`  
**Facilitador Master**: Guanabara

---

## 📋 Issues para Criação no GitHub

### Issue 1: Seleção de Candidatos (Semana 1)

```markdown
# [FACILITATOR-C3] Seleção de 2 Candidatos para Cycle 3

## Contexto
Per `FACILITATOR-CERTIFICATION-CYCLE-3.md`, precisamos de 2 leads voluntários para certificação como facilitadores Grill-Me.

## Candidatos Elegíveis (Leads não certificados)
- [ ] **Trevor** (Platform/IaC/CI/CD) — Disponibilidade: Seg/Qua 10h-12h
- [ ] **Turing** (Frontend/DX/Accessibility) — Disponibilidade: Ter/Qui 14h-16h  
- [ ] **Qualy** (Testing/Quality Gates) — Disponibilidade: Seg/Sex 10h-12h
- [ ] **Kaspersky** (Security/Threat Modeling) — Disponibilidade: Qua 14h-16h
- [ ] **Tranquilão** (Code Review/Compliance) — Disponibilidade: Ter 10h-12h

## Critérios de Seleção
1. Domínio complementar aos facilitadores atuais (Guanabara, Niamaia, Towards)
2. Disponibilidade confirmada para 10 semanas (Abr–Jun)
3. Interesse genuíno em facilitação socrática
4. Aprovação do Severino (Leader)

## Ação
- [ ] Cada candidato confirma interesse + disponibilidade até **2027-04-16**
- [ ] Severino aprova 2 selecionados até **2027-04-18**
- [ ] Anúncio oficial no `#team-facilitators` até **2027-04-21**

## Labels
`facilitator-program`, `cycle-3`, `selection`, `priority-high`
```

---

### Issue 2: Fase 1 — Assistir (Semanas 1-2)

```markdown
# [FACILITATOR-C3] Fase 1: Assistir Sessão 11 (ADR-026 Review)

## Candidatos Selecionados
- Candidato A: [nome]
- Candidato B: [nome]

## Atividade
Assistir à **Sessão 11 do Grill-Me** (tópico: ADR-026 Implementation Review) como observadores.

## Entregáveis (por candidato)
- [ ] Checklist de observação preenchido (template: `.github/grill-me/checklists/observation.yml`)
- [ ] Explicação em 1 frase (Feynman): "Qual o papel do facilitador vs participante?"
- [ ] Submissão até 48h após a sessão

## Critério de Sucesso
- Checklist completo + Feynman validado por Guanabara

## Agenda
- **Sessão 11**: 2027-04-22, 10h-12h (Facilitador: Guanabara)
- **Deadline entregáveis**: 2027-04-24

## Labels
`facilitator-program`, `cycle-3`, `phase-1`, `observation`
```

---

### Issue 3: Fase 2 — Co-facilitar (Semanas 3-6)

```markdown
# [FACILITATOR-C3] Fase 2: Co-facilitar (4 Sessões Shadowing)

## Estrutura
| Sessão | Candidato | Facilitador Shadow | Tópico Sugerido | Data Prevista |
|--------|-----------|-------------------|-----------------|---------------|
| A | Candidato A | Guanabara | ADR-026 Implementation Review | 2027-04-29 |
| B | Candidato A | Niamaia | ADR-028 DX Metrics Design | 2027-05-13 |
| C | Candidato B | Towards | ADR-029 MCP v2 SDK Architecture | 2027-05-20 |
| D | Candidato B | Guanabara | ADR-030 Observability Stack | 2027-05-27 |

## Por Sessão (por candidato)
- [ ] Prepara pauta 48h antes (template `.github/grill-me/templates/grill-me-session-template.md`)
- [ ] Conduz ≥50% das perguntas socráticas
- [ ] Gestão de tempo ±5min do planejado
- [ ] Zero dependências pendentes ao final
- [ ] Facilitador shadow preenche checklist (`.github/grill-me/checklists/shadowing.yml`)

## Critério de Aprovação por Sessão
- Score ≥4/5 em todos critérios da rubrica
- Feedback escrito do shadow facilitator

## Labels
`facilitator-program`, `cycle-3`, `phase-2`, `co-facilitation`
```

---

### Issue 4: Fase 3 — Solo Avaliado (Semanas 7-8)

```markdown
# [FACILITATOR-C3] Fase 3: Solo Avaliado (2 Sessões)

## Sessões Solo
| Candidato | Tópico Solo | Avaliadores | Data Prevista |
|-----------|-------------|-------------|---------------|
| Candidato A | ADR-027 Multi-Language feature-skeleton | Guanabara + Niamaia + Severino | 2027-06-03 |
| Candidato B | ADR-028/029/030 Integration Review | Guanabara + Towards + Trevor | 2027-06-10 |

## Rubrica de Avaliação (1-5 por critério)
| Critério | Peso | Mínimo |
|----------|------|--------|
| Preparação | 20% | ≥4 |
| Condução Socrática | 25% | ≥4 |
| Gestão de Tempo | 15% | ≥4 |
| Exit Criteria & Decisões | 20% | ≥4 |
| Feynman Closure | 10% | ≥4 |
| Debrief & Registro | 10% | ≥4 |

## Critério de Certificação
- **Média ponderada ≥4.0/5.0**
- **Zero critério <3**
- **Feynman validado por TODOS leads presentes**
- **Registro completo em `GRILL-ME-RESULTS.md` + `grill-me-schedule.md` + checklists CI**
- **Aprovação unânime: Guanabara + 1 facilitador certificado + Severino**

## Entregáveis Pós-Sessão (≤24h)
- [ ] `GRILL-ME-RESULTS.md` atualizado
- [ ] `grill-me-schedule.md` atualizado  
- [ ] Checklist de avaliação (`.github/grill-me/checklists/solo.yml`)
- [ ] Action items com donos/prazos

## Labels
`facilitator-program`, `cycle-3`, `phase-3`, `solo-evaluation`, `certification`
```

---

### Issue 5: Automação CI (Paralelo)

```markdown
# [FACILITATOR-C3] Automação CI — Templates + Validação

## Tarefas
- [ ] **Templates de Pauta** (`.github/grill-me/templates/`)
  - [ ] `grill-me-session-template.md`
  - [ ] `grill-me-debrief-template.md`
- [ ] **Checklists** (`.github/grill-me/checklists/`)
  - [ ] `observation.yml`
  - [ ] `shadowing.yml`
  - [ ] `solo.yml`
- [ ] **CI Validation** (`.github/workflows/grill-me-validation.yml`)
  - [ ] Valida formato `GRILL-ME-RESULTS.md`
  - [ ] Valida scores checklists (mínimos, pesos)
  - [ ] Track progress certificação por candidato
- [ ] **Scripts** (`scripts/`)
  - [ ] `validate-grill-me-results.js`
  - [ ] `validate-checklist-scores.js`
  - [ ] `check-certification-progress.js`

## Definition of Done
- Pipeline roda em PRs que tocam arquivos Grill-Me
- Falha se score <4 em qualquer critério obrigatório
- Dashboard simples no GitHub Actions summary

## Labels
`facilitator-program`, `cycle-3`, `automation`, `ci`, `priority-medium`
```

---

### Issue 6: Certificação + Atualização Team Roles (Semana 10)

```markdown
# [FACILITATOR-C3] Certificação Final + Team Roles Update

## Critérios Finais (ambos candidatos)
- [ ] Todas 4 sessões shadowing: score ≥4/5
- [ ] Sessão Solo: média ponderada ≥4/5, zero <3
- [ ] Feynman validado por todos leads na sessão solo
- [ ] Registro completo em 3 locais (GRILL-ME-RESULTS, schedule, checklists)
- [ ] Aprovação unânime: Guanabara + 1 facilitador certificado + Severino

## Entregáveis Finais
- [ ] Badge "Certified Grill-Me Facilitator" no perfil GitHub
- [ ] Anúncio no `#team-general` + `#team-facilitators`
- [ ] Atualização `_consolidado/cross-cutting/team/TEAM-ROLES.md`
  - Adicionar 2 facilitadores na seção "Facilitadores Certificados"
  - Atualizar responsabilidades pós-certificação
- [ ] Atualização `grill-me-schedule.md` com novos facilitadores disponíveis
- [ ] Calibração trimestral agendada (próxima: 2027-10)

## Pós-Certificação (Responsabilidades Contínuas)
- [ ] Facilitar ≥1 Grill-Me/mês
- [ ] Mentorar próximo ciclo (shadowing)
- [ ] Manter rubrica/checklists atualizados
- [ ] Participar de calibração trimestral

## Labels
`facilitator-program`, `cycle-3`, `certification`, `team-roles`, `done`
```

---

## 📅 Cronograma Consolidado

| Semana | Datas | Atividade | Issue |
|--------|-------|-----------|-------|
| 1-2 | Abr 14-25 | Seleção + Fase 1 (Assistir Sessão 11) | #1, #2 |
| 3-4 | Abr 28-Mai 9 | Fase 2 Sessão A (Cand A + Guanabara) | #3 |
| 5-6 | Mai 12-23 | Fase 2 Sessões B+C (Cand A+Niamaia, Cand B+Towards) | #3 |
| 7 | Mai 26-30 | Fase 2 Sessão D (Cand B + Guanabara) | #3 |
| 8-9 | Jun 2-13 | Fase 3 Solo (Cand A + Cand B) | #4 |
| 1-10 | Abr 14-Jun 20 | Automação CI (paralelo) | #5 |
| 10 | Jun 16-20 | Certificação + Team Roles | #6 |

---

## 🎯 Definition of Done — Cycle 3

- [ ] 2 facilitadores certificados com aprovação unânime
- [ ] Automação CI funcionando (templates + checklists + validação)
- [ ] `TEAM-ROLES.md` atualizado com 5 facilitadores total (Guanabara, Niamaia, Towards + 2 novos)
- [ ] Próxima calibração trimestral agendada (2027-10-08)
- [ ] Lessons learned documentadas em `FACILITATOR-CERTIFICATION-CYCLE-3-RETRO.md`

---

*Criado por: Severino (Leader) | Facilitador Master: Guanabara | Data: 2027-04-09*