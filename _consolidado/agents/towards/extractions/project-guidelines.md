# METADADOS
- **Repositório**: `project-guidelines`
- **Lead Responsável**: `towards`
- **Funcionário (Subagente)**: `Towards`
- **Data**: `2026-10-08`
- **Tempo gasto**: `0h 25min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | A set of guidelines for JavaScript/TypeScript projects (Git workflow, code quality, PR reviews) |
| **Público-alvo** | Engineering teams, tech leads, full-stack developers |
| **Tamanho** | Documentação concisa e direta |
| **Linguagens/Tech** | Markdown, Git, CI/CD practices |
| **Freshness** | Referência clássica em boas práticas de PR e Git workflow |

---

## 2. O QUE PRESTA PARA **FEATURES COMPLEXAS, REFACTORING, DEBUGGING**

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Git Commit Message Conventions & Branch naming | `README.md` | Guideline | `agents/towards/workflow/git-conventions.md` | 🟠 Média |
| Pull Request Quality & Review standards | `README.md` | Checklist | `agents/towards/workflow/pr-standards.md` | 🔴 Alta |
| Code Formatting & Linting Automation | `README.md` | Tool config | `agents/towards/workflow/lint-automation.md` | 🟠 Média |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO
- Algumas recomendações de workflow centralizado (GitFlow pesado) em vez de Trunk-Based Development moderno.

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA
- [ ] Gap 1: Feature flags para trunk-based development seguro — Sugestão: Adicionar guia de feature toggles.

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD
- [ ] **Criar Checklist**: Padrão de Pull Request para Features Complexas.

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES
> "Small pull requests are reviewed faster, have fewer bugs, and are easier to roll back if something fails in production." (`README.md`)

---

## 7. SCORE DE VALOR DO REPO
| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 4 | Bom para padronização de time |
| **Qualidade** | 4 | Direto ao ponto |
| **Atualidade** | 3 | Padrões clássicos |
| **Ação** | 4 | Útil para guias de PR |
| **Completude** | 3 | Focado apenas em workflow básico |
| **TOTAL** | **18/25** | |
