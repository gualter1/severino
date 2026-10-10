# METADADOS
- **Repositório**: project-guidelines
- **Lead Responsável**: turing
- **Funcionário (Subagente)**: Turing
- **Data**: 2026-10-08
- **Tempo gasto**: 0h 25min

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Guia de boas práticas de estruturação de projetos, componentização e organização de código |
| **Público-alvo** | Desenvolvedores front-end, arquitetos de software |
| **Tamanho** | ~17 arquivos (múltiplas traduções de README) |
| **Linguagens/Tech** | Markdown |
| **Freshness** | Traduzido para vários idiomas (pt-BR, ja, ko, it, zh), amplamente adotado |

---

## 2. O QUE PRESTA PARA **FRONTEND/DX**
| Item | Localização | Tipo | Destino sugerido | Prioridade |
|------|------------|------|------------------|------------|
| Feature-based folder structure | `README.md` (Directory structure) | Guideline | `agents/turing/frontend-folder-structure.md` | 🔴 Alta |
| Component modularization rules | `README.md` | Guideline | `agents/turing/component-rules.md` | 🔴 Alta |
| Naming conventions for components, utils, hooks | `README.md` | Guideline | `agents/turing/naming-conventions.md` | 🔴 Alta |
| Code style and formatting standards | `README.md` | Guideline | `templates/linting/style-guide.md` | 🟠 Média |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO
| Item | Localização | Motivo | Substituto moderno |
|------|-------------|--------|-------------------|
| Estrutura baseada em tipo (`components/`, `containers/`, `actions/`) | `README.md` (legacy pattern) | Co-location fraca, codebase escala mal | Feature-based co-location structure |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA
- [ ] **React Server Components / App Router structure** – falta guideline para Next.js 14+
- [ ] **Monorepo structure (pnpm workspaces / Turborepo)** – falta escalabilidade para múltiplos pacotes
- [ ] **Design tokens e CSS Architecture** – falta separação entre tokens e componentes

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Turing)
- [ ] **Criar Checklist**: `frontend-folder-structure-check.md` – Em `checklists/turing/`
- [ ] **Criar ADR**: `ADR-004: Adopt Feature-Based Co-location` – Para arquitetura de pastas

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES
> `README.md` — "Group files by feature rather than by technical role (e.g., components, services, styles)"

---

## 7. SCORE DE VALOR DO REPO (Para Frontend/DX)
| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 4 | Excelentes princípios de organização |
| **Qualidade** | 4 | Direto ao ponto, universal |
| **Atualidade** | 3 | Conceitos clássicos, precisa de atualização para RSC |
| **Ação** | 4 | Gera guidelines e checklists |
| **Completude** | 3 | Focado apenas em estrutura de arquivos |
| **TOTAL** | **18/25** |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO
- [x] Salvar este arquivo em `_consolidado/agents/turing/extractions/project-guidelines.md`
- [ ] Prosseguir para `JavaScript`