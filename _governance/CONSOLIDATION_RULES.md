# REGRAS DE CONSOLIDAÇÃO — Para Líder (Severino)

## Seu Papel
Você é o **Líder**. Não extrai, não aprova domínio — **consolida cross-cutting**, resolve conflitos, aprova ADRs finais, monta a equipe.

---

## FLUXO DE CONSOLIDAÇÃO

### 1. LEITURA SEMANAL (Segunda-feira, 30 min)
Ler todos os `CONSOLIDATED.md` atualizados na semana:
```
_consolidado/agents/niamaia/CONSOLIDATED.md
_consolidado/agents/trevor/CONSOLIDATED.md
_consolidado/agents/tranquilao/CONSOLIDATED.md
_consolidado/agents/qualy/CONSOLIDATED.md
_consolidado/agents/towards/CONSOLIDATED.md
_consolidado/agents/turing/CONSOLIDATED.md
_consolidado/agents/kaspersky/CONSOLIDATED.md
_consolidado/agents/guanabara/CONSOLIDATED.md
_consolidado/agents/marketing/CONSOLIDATED.md (se existir)
_consolidado/agents/sales/CONSOLIDATED.md (se existir)
```

### 2. IDENTIFICAÇÃO DE CONFLITOS CROSS-CUTTING
| Tipo de Conflito | Exemplo | Resolução |
|------------------|---------|-----------|
| **Duplicação** | Niamaia e Trevor ambos definem "pipeline ideal" | Líder decide dono único, outro referencia |
| **Contradição** | Tranquilão proíbe X, Towards usa X em refactoring | Líder chama ambos, decide com trade-off documentado |
| **Gap entre domínios** | Qualy precisa de infra que Trevor não fornece | Líder cria ADR definindo contrato |
| **Novo domínio emergente** | Marketing aparece em 3 repos | Líder cria agente `marketing` + pasta |

### 3. APROVAÇÃO DE ADRs FINAIS
**Critério para ADR ir para `cross-cutting/adrs/`:**
- [ ] Proposta por um Lead no seu `adrs/` ou `CONSOLIDATED.md`
- [ ] Revisada por Leads afetados (comentários em 48h)
- [ ] Decisão documentada com trade-offs
- [ ] Líder aprova → move para `cross-cutting/adrs/NNN-titulo.md`
- [ ] Numeração sequencial, status: `Proposed` → `Accepted` → `Superseded`

### 4. UNIFICAÇÃO DE TEMPLATES
Templates que servem **múltiplos domínios** → `cross-cutting/templates/`:
- Pipeline CI/CD unificado
- ADR template
- Feature module template (Android/iOS/Web)
- Release checklist
- Security baseline

### 5. ATUALIZAÇÃO DA EQUIPE (`cross-cutting/team/`)
Após cada ciclo de consolidação:
- `roles.md` — papéis, responsabilidades, senioridade
- `skills-matrix.md` — quem sabe o quê (Guanabara mantém)
- `hiring-plan.md` — gaps identificados → contratações

### 6. PRIORIZAÇÃO DE PRÓXIMOS REPOS
Baseado em:
- Gaps nos `CONSOLIDATED.md` atuais
- Demandas do negócio (se houver)
- Score de valor médio dos repos na fila

---

## REGRAS DE OURO DO LÍDER

1. **Não edita CONSOLIDATED.md dos Leads** — só lê, propõe, escala
2. **ADR = decisão final** — não volta atrás sem ADR nova
3. **Conflito = reunião 15 min com Leads envolvidos** — não resolve sozinho no escuro
4. **Novo agente = proposta formal** — com domínio, justificativa, primeiro repo alvo
5. **Documenta tudo em `cross-cutting/`** — é o legado da equipe

---

## TEMPLATE DE REGISTRO DE DECISÃO DO LÍDER

Adicione em `_logs/decisions.log`:

```markdown
## YYYY-MM-DD — Decisão: {título}
**Tipo**: ADR aprovada / Conflito resolvido / Novo agente / Template unificado / Priorização repos
**Leads envolvidos**: {lista}
**Decisão**: {resumo}
**Trade-offs**: {principais}
**Ação**: {o que muda onde}
**ADR gerada**: {link ou N/A}
---
```

---

*Regras v1.0 — Evoluem com a maturidade da equipe.*