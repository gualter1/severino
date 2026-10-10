# LOOP DE APRENDIZADO CONSTANTE

## Princípio
**Extrair → Aprovar → Consolidar → Aplicar → Medir → Melhorar**
Não é "ler tudo uma vez". É um ciclo contínuo onde a equipe **aprende fazendo**.

---

## CICLO SEMANAL

### Segunda — PLANEJAMENTO (Líder + Leads - 30 min)
- Líder apresenta: repos na fila, gaps atuais, prioridades
- Leads escolhem: "Eu pego repo X pro meu domínio"
- Funcionários recebem: fila de extrações da semana

### Terça-Quinta — EXECUÇÃO (Funcionários em paralelo)
- Cada funcionário: 1 repo por vez, extração completa
- Lead revisa conforme chegam (não acumula)
- Líder disponível para escalações

### Sexta — SÍNTESE (Líder - 30 min)
- Lê CONSOLIDATED.md atualizados
- Identifica conflitos, aprova ADRs, unifica templates
- Atualiza `cross-cutting/team/` se mudou algo
- Publica "Weekly Digest" (1 página: o que entrou, o que mudou, próximos)

---

## MECÂNICAS DE APRENDIZADO

### 1. CROSS-POLINIZAÇÃO OBRIGATÓRIA
- **Mensalmente**: Cada Lead apresenta 1 insight do seu domínio para os outros (15 min)
- **Trimestralmente**: Rotação — funcionário gasta 1 semana em outro domínio

### 2. GRILL-ME COMO CERIMÔNIA
- Antes de toda ADR cross-cutting: `grill-me` session
- Antes de todo template unificado: `grill-me` session
- Guanabara facilita, Líder decide

### 3. MÉTRICAS DE SAÚDE DO CONHECIMENTO
| Métrica | Target | Onde medir |
|---------|--------|------------|
| **Extrações/semana** | ≥ 8 (1 por lead) | `_consolidado/agents/*/extractions/` |
| **Tempo lead revisão** | ≤ 30 min/extração | Timestamp aprovação |
| **ADRs aprovadas/mês** | ≥ 2 | `cross-cutting/adrs/` |
| **Templates unificados** | Crescendo | `cross-cutting/templates/` |
| **Gaps fechados** | > Gaps abertos | Seção 4 das extrações |
| **Reutilização** | Templates usados em projetos reais | Feedback de projetos |

### 4. FEEDBACK LOOP DE PROJETOS REAIS
Quando um projeto usa algo do consolidado:
- **Sucesso**: Documenta no `CONSOLIDATED.md` do domínio: "Usado em Projeto X — funcionou porque..."
- **Falha/Gap**: Abre issue no `CONSOLIDATED.md`: "Falhou em Projeto X — motivo: ... — Ação: atualizar template Y"
- **Líder revisa** falhas mensalmente → ajusta prioridades

### 5. ONBOARDING COMO TESTE DO CONHECIMENTO
- Novo membro = Guanabara guia usando `cross-cutting/onboarding/`
- Se novo membro **não entende** algo do consolidado → **o consolidado tem bug**
- Guanabara reporta → Lead corrige → Líder valida

---

## EVOLUÇÃO DOS AGENTES (Leads)

| Estágio | Critério | Ação |
|---------|----------|------|
| **Iniciante** | Lead tem < 5 extrações aprovadas | Funcionário extrai, Lead revisa, Líder mentoria |
| **Operacional** | Lead tem 5-20 extrações, CONSOLIDATED.md vivo | Lead autônomo, Líder só cross-cutting |
| **Especialista** | Lead tem > 20 extrações, templates maduros | Lead propõe ADRs, mentor de outros Leads |
| **Arquiteto do Domínio** | Domínio maduro, poucos gaps, alta reutilização | Lead vira "Dono" — define roadmap do domínio |

> **Regra**: Se um domínio não tem extrações há 3 meses → Lead volta para "Iniciante" ou domínio é arquivado.

---

## FERRAMENTAS DO LOOP

### Para Funcionários
- `EXTRACTION_TEMPLATE.md` — estrutura fixa
- `grill-me` skill — para validar entendimento antes de extrair

### Para Leads
- `APPROVAL_PROCESS.md` — fluxo de aprovação
- `CONSOLIDATED.md` — fonte da verdade do domínio

### Para Líder
- `CONSOLIDATION_RULES.md` — regras de consolidação
- `cross-cutting/adrs/` — decisões finais
- `cross-cutting/team/` — definição da equipe
- `_logs/decisions.log` — auditoria

### Para Todos
- `README.md` na raiz de `_consolidado/` — mapa do tesouro
- Reunião semanal 30 min — sincronização

---

## EXEMPLO DE CICLO COMPLETO

```
SEMANA 1:
├── Segunda: Líder prioriza repos [react-boilerplate, nodebestpractices, awesome-llm-apps]
├── Terça: 
│   ├── Turing pega react-boilerplate (frontend patterns)
│   ├── Towards pega nodebestpractices (backend patterns)
│   ├── Kaspersky pega awesome-llm-apps (threat surface LLMs)
├── Quarta: 
│   ├── Leads revisam extrações
│   ├── Turing aprova → atualiza CONSOLIDATED.md com "React 18 patterns"
│   ├── Towards aprova → adiciona template "Node service structure"
│   ├── Kaspersky escala: "Precisa de Niamaia para LLM architecture patterns"
├── Quinta: 
│   ├── Líder resolve escalação → cria ADR-007 "LLM Integration Patterns"
│   ├── Niamaia e Kaspersky colaboram na ADR
├── Sexta: 
│   ├── Líder aprova ADR-007 → cross-cutting/adrs/
│   ├── Weekly Digest publicado
│   ├── Próxima semana: repos [dify, archify, context-mode]
```

---

## ARMADILHAS A EVITAR

| Armadilha | Sintoma | Antídoto |
|-----------|---------|----------|
| **Acúmulo de extrações não revisadas** | Pasta `extractions/` crescendo, `CONSOLIDATED.md` parado | Lead revisa no mesmo dia ou Líder realoca |
| **CONSOLIDATED.md virando "lixão"** | Tudo jogado lá sem estrutura | Lead cura: move para templates/checklists/runbooks |
| **ADRs travadas** | Propostas paradas em `Proposed` > 2 semanas | Líder força decisão ou rejeita com motivo |
| **Domínios isolados** | Leads não falam entre si | Cross-polinação mensal obrigatória |
| **Conhecimento não aplicado** | Templates bonitos mas ninguém usa | Feedback loop de projetos reais obrigatório |

---

*Loop v1.0 — A equipe refina a cada retrospectiva mensal.*