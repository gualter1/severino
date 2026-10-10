# Template: Descoberta de Novo Especialista

**Use este template quando um repositório revelar um domínio que não cabe nos leads atuais.**
Salve em: `_consolidado/agents/specialists/discovered/{dominio}.md`

---

## METADADOS
- **Domínio descoberto**: `{nome-do-domínio}` (ex: data-engineering, mlops, sre, devrel)
- **Lead descobridor**: `{niamaia|trevor|tranquilao|qualy|towards|turing|kaspersky|guanabara}`
- **Repo(s) origem**: `{lista de pastas em Repositorios/}`
- **Data**: `YYYY-MM-DD`

---

## EVIDÊNCIA (cite arquivo:linha)

| Repo | Localização | O que mostra | Relevância (1-5) |
|------|-------------|--------------|------------------|
| `{repo}` | `{arquivo:linha}` | `{descrição}` | `{score}` |
| `{repo}` | `{arquivo:linha}` | `{descrição}` | `{score}` |

---

## POR QUE NÃO CABE NOS LEADS ATUAIS

| Lead Atual | Overlap Estimado | Por que não é suficiente |
|------------|------------------|--------------------------|
| `{lead}` | `{xx}%` | `{explicação}` |
| `{lead}` | `{xx}%` | `{explicação}` |

> **Regra**: Se overlap > 30% com algum lead existente → incorporar lá, não criar novo.

---

## VOLUME E RECORRÊNCIA

- **Repos na fila com conteúdo relevante**: `{N} de 29`
- **Probabilidade de repos futuros**: `Alta/Média/Baixa` — `{justificativa}`
- **Exemplos de artefatos que geraria**: 
  - Template: `{nome}`
  - Checklist: `{nome}`
  - ADR: `{título}`
  - Runbook: `{nome}`

---

## AÇÃO PROPOSTA

- [ ] **Criar agente novo** `agents/{dominio}/` — Lead sugerido: `{nome ou "contratar"}`
- [ ] **Incorporar em lead existente**: `{qual lead}` — Seção: `{onde}`
- [ ] **Arquivar** — Não é recorrente / volume baixo

---

## PRIMEIROS PASSOS SE VIRO AGENTE

1. Líder cria pasta `agents/{dominio}/` com subpastas padrão
2. Líder adiciona em `cross-cutting/team/roles.md`
3. Lead designado cria `CONSOLIDATED.md` inicial
4. Funcionários começam extrações para esse domínio
5. Guanabara adiciona em `skills-matrix.md`

---

## DECISÃO DO LÍDER (preenchido por Severino)

**Status**: `PENDENTE | APROVADO NOVO AGENTE | INCORPORADO EM {lead} | ARQUIVADO`

**Data**: `YYYY-MM-DD`

**Justificativa**: `{resumo}`

**Próximos passos**: `{lista}`

---

*Template v1.0 — Registrado por {lead descobridor} — Decidido por Severino*