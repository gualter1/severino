# Specialists — Especialistas Descobertos no Caminho

> **Pasta para agentes/especialistas que não estavam no plano original** mas aparecem nos repositórios analisados.

---

## COMO FUNCIONA

Durante a extração, se um repositório revelar um **domínio novo** que não cabe nos 8 leads atuais:
1. Lead que descobriu registra em `specialists/discovered/{domínio}.md`
2. Líder (Severino) avalia: cria agente novo? Incorpora em existente? Arquiva?
3. Se vira agente: cria pasta em `agents/{novo}/` + adiciona em `cross-cutting/team/roles.md`

---

## ESTRUTURA

```
specialists/
├── discovered/         # Registro de domínios descobertos (um arquivo por domínio)
│   ├── {domínio}.md    # Ex: data-engineering.md, devrel.md, sre.md, mlops.md
│   └── ...
├── templates/          # Templates para registrar novo especialista
│   └── specialist-discovery-template.md
└── CONSOLIDATED.md     # Resumo vivo: quais viraram agentes, quais arquivados
```

---

## CRITÉRIOS PARA VIRAR AGENTE NOVO

| Critério | Threshold |
|----------|-----------|
| **Volume de conteúdo** | ≥ 3 repos com conteúdo relevante no domínio |
| **Distinção** | Não cabe bem em nenhum lead atual (overlap < 30%) |
| **Recorrência** | Aparece em repos futuros consistentemente |
| **Ação** | Gera templates/checklists/ADRs próprios |

---

## EXEMPLOS DE DOMÍNIOS QUE PODEM APARECER

| Domínio | Provável origem | Leads atuais relacionados |
|---------|-----------------|---------------------------|
| **Data Engineering** | `awesome-llm-apps`, `dify`, `JavaScript` | Niamaia (arquitetura), Trevor (pipeline) |
| **MLOps/LLMOps** | `dify`, `awesome-llm-apps`, `claude-code` | Trevor (infra), Kaspersky (security) |
| **SRE/Observability** | `nodebestpractices`, `dify`, `context-mode` | Trevor (platform), Tranquilão (reliability) |
| **DevRel/Technical Writing** | `project-guidelines`, `grill-me-skill`, skills | Guanabara (teaching) |
| **Product/Discovery** | `planning-with-files`, `project-guidelines` | Niamaia (arch), Guanabara |
| **Compliance/Legal** | `nodebestpractices`, `dify`, `android/ios` | Kaspersky, Tranquilão |
| **Mobile Platform** | `android-best-practices`, `ios-good-practices` | Niamaia, Trevor, Tranquilão |
| **Design Engineering** | `AionUi`, `ui-ux-pro-max-skill`, `react-boilerplate` | Turing, Guanabara |

---

## TEMPLATE DE DESCOBERTA (usar para registrar)

```markdown
# Descoberta: {Domínio}

**Data**: YYYY-MM-DD
**Lead descobridor**: {niamaia|trevor|...}
**Repo(s) origem**: {lista}

## Evidência
- Repo X: {seção/linha} — {o que mostra}
- Repo Y: {seção/linha} — {o que mostra}

## Por que não cabe nos leads atuais
{explicação do overlap < 30%}

## Volume estimado
~{N} repos na fila têm conteúdo relevante

## Ação proposta
[ ] Criar agente novo `agents/{domínio}/`
[ ] Incorporar em lead existente: {qual}
[ ] Arquivar (não é recorrente)

## Primeiros artefatos esperados
- Template: {nome}
- Checklist: {nome}
- ADR: {título}

---

*Registrado por {lead} — Aguardando decisão do Líder*
```

---

## STATUS ATUAL (Atualizado pelo Líder)

| Domínio Descoberto | Repos Origem | Status | Agente Criado? |
|--------------------|--------------|--------|----------------|
| — | — | — | — |

---

*Gerenciado por Severino (Líder) — Leads registram descobertas, Líder decide*