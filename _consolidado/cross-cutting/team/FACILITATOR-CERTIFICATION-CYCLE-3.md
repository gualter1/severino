# Facilitator Certification Program — Cycle 3

**Período**: Q2 2027 (Abril–Junho 2027)  
**Base**: Sessão 10 Outcome (Grill-Me Certificação de Facilitadores)  
**Meta**: Certificar **2 facilitadores adicionais** até fim de Q2 2027  
**Facilitador Master**: Guanabara  
**Decisor**: Severino

---

## Contexto

A **Sessão 10 do Grill-Me (Q1 2027 Week 2)** definiu a trilha de certificação em 3 fases:
1. **Assistir** (1 sessão) — Observar facilitação completa
2. **Co-facilitar com Shadowing** (2 sessões) — Facilitar em parceria com facilitador certificado
3. **Solo Avaliado** (1 sessão) — Facilitar sozinho com checklist de avaliação

**Facilitadores já certificados**: Guanabara (Master), Niamaia, Towards
**Candidatos Cycle 3**: 2 leads voluntários (ex: Trevor, Turing, Qualy, Kaspersky, Tranquilão)

---

## Trilha de Certificação (3 Fases)

### Fase 1: Assistir (Semana 1-2)
| Atividade | Critério de Sucesso |
|-----------|---------------------|
| Assistir 1 sessão Grill-Me completa (prep + execução + debrief) | Checklist de observação preenchido: preparação da pauta, condução socrática, gestão de tempo, Feynman closure |
| Ler `GRILL-ME-RESULTS.md` + `grill-me-schedule.md` (últimas 5 sessões) | Explicar em 1 frase (Feynman) o papel do facilitador vs participante |

### Fase 2: Co-facilitar com Shadowing (Semana 3-6)
| Sessão | Candidato | Facilitador Shadow | Tópico Sugerido | Critério de Sucesso |
|--------|-----------|-------------------|-----------------|---------------------|
| **Sessão A** | Candidato 1 | Guanabara | ADR-026 Implementation Review | Conduz ≥50% das perguntas socráticas; gestão de tempo ±5min; zero dependências pendentes |
| **Sessão B** | Candidato 1 | Niamaia | ADR-028 DX Metrics Design | Mesma rubrica; feedback escrito do shadow facilitator |
| **Sessão C** | Candidato 2 | Towards | ADR-029 MCP v2 SDK Architecture | Mesma rubrica |
| **Sessão D** | Candidato 2 | Guanabara | ADR-030 Observability Stack | Mesma rubrica |

### Fase 3: Solo Avaliado (Semana 7-8)
| Candidato | Tópico Solo | Avaliadores | Critério de Aprovação |
|-----------|-------------|-------------|----------------------|
| Candidato 1 | ADR-027 Multi-Language feature-skeleton | Guanabara + Niamaia + Severino | **≥4/5** em todos critérios da rubrica; Feynman closure validado por todos leads |
| Candidato 2 | ADR-028/029/030 Integration Review | Guanabara + Towards + Trevor | **≥4/5** em todos critérios; zero "blockers" no debrief |

---

## Rubrica de Avaliação (1-5 por critério)

| Critério | Peso | Descrição |
|----------|------|-----------|
| **Preparação** | 20% | Pauta enviada 48h antes; analogias preparadas; opções A/B/C/D validadas; exit criteria claros |
| **Condução Socrática** | 25% | 1 pergunta por vez; não responde pelas leads; usa analogias antes do detalhe; navega divergências |
| **Gestão de Tempo** | 15% | Início/fim no horário; cada bloco ±5min do planejado; parking lot para tangentes |
| **Exit Criteria & Decisões** | 20% | Todas as perguntas ticatadas; decisões registradas; dependências resolvidas ou escaladas |
| **Feynman Closure** | 10% | Cada lead explica decisão em 1 frase simples; facilitador valida compreensão |
| **Debrief & Registro** | 10% | `GRILL-ME-RESULTS.md` atualizado em <24h; action items com donos/prazos; lições aprendidas |

**Nota Mínima**: 4.0/5.0 (média ponderada) — **sem nota <3 em nenhum critério**

---

## Automação via CI (Sessão 10 Outcome)

### 1. Templates de Pauta (`.github/grill-me/templates/`)
```
grill-me-session-template.md
├── Metadados (tópico, data, facilitador, participantes, duração)
├── Analogia do Dia
├── Perguntas-Chave (A/B/C/D) + Recomendação
├── Exit Criteria (checkboxes)
├── Feynman Prompts (1 por lead)
└── Debrief Template (decisões, action items, lições)
```

### 2. Checklist de Shadowing (`.github/grill-me/checklists/shadowing.yml`)
```yaml
session_id: "grill-me-011"
candidate: "trevor"
shadow_facilitator: "guanabara"
topic: "ADR-026 Implementation Review"
scores:
  preparation: 5
  socratic_conduct: 4
  time_management: 5
  exit_criteria: 5
  feynman_closure: 4
  debrief: 5
weighted_score: 4.7
approved: true
reviewer_notes: "Excelente analogia do 'chassi de carro' para feature-skeleton V2. Gestão de tempo impecável."
```

### 3. CI Validation (`.github/workflows/grill-me-validation.yml`)
```yaml
name: Grill-Me Validation
on:
  pull_request:
    paths:
      - '_consolidado/cross-cutting/team/GRILL-ME-RESULTS.md'
      - '_consolidado/cross-cutting/team/grill-me-schedule.md'
      - '.github/grill-me/checklists/**'
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate GRILL-ME-RESULTS format
        run: node scripts/validate-grill-me-results.js
      - name: Validate checklist scores
        run: node scripts/validate-checklist-scores.js
      - name: Check facilitator certification progress
        run: node scripts/check-certification-progress.js
```

---

## Candidatos Cycle 3 (Voluntários)

| Lead | Domínio | Disponibilidade | Preferência Tópico Solo | Status |
|------|---------|-----------------|------------------------|--------|
| **Trevor** | Platform/IaC/CI/CD | Seg/Qua 10h-12h | ADR-027 Multi-Language feature-skeleton (Go/Rust/Python CI) | 🟡 Inscrição aberta |
| **Turing** | Frontend/DX/Accessibility | Ter/Qui 14h-16h | ADR-028 DX Metrics + ADR-029 MCP v2 SDK | 🟡 Inscrição aberta |
| **Qualy** | Testing/Quality Gates | Seg/Sex 10h-12h | ADR-030 Agent Observability | 🟡 Inscrição aberta |
| **Kaspersky** | Security/Threat Modeling | Qua 14h-16h | ADR-026/029 Security Review | 🟡 Inscrição aberta |
| **Tranquilão** | Code Review/Compliance | Ter 10h-12h | ADR-030 Compliance Integration | 🟡 Inscrição aberta |

**Seleção**: 2 candidatos com melhor fit de domínio + disponibilidade confirmada até **2027-04-16**

---

## Cronograma Cycle 3

| Semana | Atividade | Entregável |
|--------|-----------|------------|
| **1-2** (Abr 14-25) | Fase 1: Assistir (Sessão 11 - ADR-026 Review) | Checklist observação + Feynman 1 frase |
| **3-4** (Abr 28-Mai 9) | Fase 2: Co-facilitar Sessão A (Cand 1 + Guanabara) | Checklist shadowing + feedback escrito |
| **5-6** (Mai 12-23) | Fase 2: Co-facilitar Sessão B/C (Cand 1 + Niamaia / Cand 2 + Towards) | 2 checklists shadowing |
| **7** (Mai 26-30) | Fase 2: Co-facilitar Sessão D (Cand 2 + Guanabara) | Checklist shadowing |
| **8-9** (Jun 2-13) | Fase 3: Solo Avaliado (Cand 1 + Cand 2) | Rubrica completa + aprovação ≥4/5 |
| **10** (Jun 16-20) | Certificação + Atualização `TEAM-ROLES.md` | Badge facilitador + anúncio no radar |

---

## Critérios de Certificação Final

1. **Todas as 4 sessões shadowing** com score ≥4/5
2. **Sessão Solo** com score ≥4/5 (média ponderada) e zero critérios <3
3. **Feynman validado** por todos leads presentes na sessão solo
4. **Registro completo** em `GRILL-ME-RESULTS.md` + `grill-me-schedule.md` + checklists CI
5. **Aprovação unânime** do painel (Guanabara + 1 facilitador certificado + Severino)

---

## Pós-Certificação

| Responsabilidade | Frequência |
|------------------|------------|
| Facilitar ≥1 Grill-Me/mês | Mensal |
| Mentorar próximo ciclo (shadowing) | Por ciclo |
| Manter rubrica/checklists atualizados | Contínuo |
| Participar de calibração trimestral | Trimestral |

---

## Cross-References
* `_consolidado/cross-cutting/team/GRILL-ME-RESULTS.md` — Sessão 10 outcome
* `_consolidado/cross-cutting/team/grill-me-schedule.md` — Schedule Q1 2027 + Cycle 3 slots
* `_governance/LEARNING_LOOP.md` — Learning loop integration
* `_consolidado/cross-cutting/team/TEAM-ROLES.md` — Facilitator role definition
* `ADR-026` a `ADR-030` — Tópicos das sessões Cycle 3