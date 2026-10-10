# PROCESSO DE APROVAÇÃO — Para Gerentes (Leads)

## Seu Papel
Você é o **Gerente** do seu domínio. Recebe extrações dos funcionários, aprova/rejeita, e mantém o `CONSOLIDATED.md` vivo do seu domínio.

---

## FLUXO DE APROVAÇÃO

### 1. RECEBIMENTO
- Funcionário salva: `_consolidado/agents/{seu_lead}/extractions/{repo}.md`
- Você recebe notificação (ou faz pull periódico)

### 2. REVISÃO (máx 30 min por extração)
**Checklist de revisão:**
- [ ] Metadados preenchidos corretamente
- [ ] Seção 2 (O que presta) — itens relevantes, bem localizados, tipo correto
- [ ] Seção 3 (Lixo) — identificou problemas reais, não opinião
- [ ] Seção 4 (Gaps) — gaps legítimos do seu domínio
- [ ] Seção 5 (Ações) — ações acionáveis, claras, no destino certo
- [ ] Seção 7 (Score) — honesto, justificado

### 3. DECISÃO
| Decisão | Ação |
|---------|------|
| **APROVAR** | Mover itens da Seção 2 para arquivos do domínio (CONSOLIDATED.md, templates, checklists, etc.) |
| **APROVAR COM RESSALVAS** | Comentar no arquivo da extração + mover o que presta |
| **REJEITAR** | Comentar motivos + devolver para funcionário refazer |
| **ESCALAR PARA LÍDER** | Conflito cross-cutting, novo agente necessário, decisão arquitetural |

### 4. ATUALIZAÇÃO DO CONSOLIDATED.md
Após aprovar, **você atualiza** `_consolidado/agents/{seu_lead}/CONSOLIDATED.md`:
- Adiciona novas guidelines, patterns, templates
- Marca versão/data da atualização
- Referencia a extração de origem: `Fonte: extractions/{repo}.md`

### 5. ARQUIVAMENTO
- Extração aprovada → fica em `extractions/` (histórico)
- Itens movidos → vivem nos arquivos do domínio
- `CONSOLIDATED.md` = **fonte da verdade** do seu domínio

---

## REGRAS DE OURO DO GERENTE

1. **Não reescreva o trabalho do funcionário** — aprove/mova/comente
2. **Uma extração = uma sessão de revisão** — não acumule
3. **CONSOLIDATED.md sempre atual** — é o que o Líder lê
4. **Conflito com outro domínio?** → Escala para Líder (Severino) com resumo das posições
5. **Novo template/checklist/runbook?** → Cria na pasta do seu domínio, avisa Líder para unificar se cross-cutting

---

## TEMPLATE DE COMENTÁRIO NA EXTRAÇÃO

Adicione no topo do arquivo da extração após revisar:

```markdown
---
## REVISÃO DO GERENTE ({seu_lead})
- **Status**: APROVADO / APROVADO COM RESSALVAS / REJEITADO / ESCALADO
- **Data**: YYYY-MM-DD
- **Comentários**:
  - Item X: {comentário}
  - Item Y: {comentário}
- **Itens movidos para CONSOLIDADO**:
  - Guideline Z → CONSOLIDATED.md seção W
  - Template T → templates/{arquivo}
  - Checklist C → checklists/{arquivo}
---
```

---

*Processo v1.0 — O Líder pode ajustar conforme a equipe amadurece.*