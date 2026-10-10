# METADADOS
- **Repositório**: android-best-practices
- **Lead Responsável**: turing
- **Funcionário (Subagente)**: Turing
- **Data**: 2026-10-08
- **Tempo gasto**: 0h 25min

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Coleção de melhores práticas para desenvolvimento Android (UI, arquitetura, testes) |
| **Público-alvo** | Devs Android (XML + Compose) |
| **Tamanho** | README extenso + traduções, sem código (guia) |
| **Linguagens/Tech** | Markdown, Kotlin, XML layouts, Jetpack Compose |
| **Freshness** | Base sólida mas partes datadas (era XML, pre-Compose em seções) |

---

## 2. O QUE PRESTA PARA **FRONTEND/DX** (mobile UI lens)
| Item | Localização | Tipo | Destino sugerido | Prioridade |
|------|------------|------|------------------|------------|
| Material Design component usage | `README.md` (UI section) | Guideline | `agents/turing/mobile-material-patterns.md` | 🟠 Média |
| ConstraintLayout performance guidance | `README.md` (Layouts) | Guideline | `agents/turing/android-layout-perf.md` | 🟠 Média |
| Accessibility (contentDescription, focus order) | `README.md` (Accessibility) | Guideline | `agents/turing/mobile-a11y-android.md` | 🔴 Alta |
| RecyclerView / lazy list patterns | `README.md` (Lists) | Pattern | `agents/turing/virtualized-lists.md` | 🟠 Média |
| Dark mode / theming (DayNight) | `README.md` (Themes) | Guideline | `agents/turing/mobile-theming.md` | 🟠 Média |
| Compose state hoisting + unidirectional data flow | `README.md` (Compose) | Pattern | `agents/turing/compose-state-patterns.md` | 🔴 Alta |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO
| Item | Localização | Motivo | Substituto moderno |
|------|-------------|--------|-------------------|
| XML layouts como default | `README.md` (Layouts) | Verboso, menos DX | Jetpack Compose |
| findViewById patterns | `README.md` (Views) | Boilerplate, null-unsafe | ViewBinding / Compose |
| AsyncTask / Loaders | `README.md` (Background) | Deprecated | Coroutines + Flow |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA
- [ ] **Jetpack Compose completo** (Material3, animations, navigation) — Sugestão: expandir seção Compose
- [ ] **Accessibility testing automatizado (Espresso + axe)** — Sugestão: adicionar CI checks
- [ ] **Performance (Baseline Profiles, Macrobenchmark)** — Sugestão: documentar startup optimization
- [ ] **Adaptive layouts (foldables, tablets)** — Sugestão: WindowSizeClass guidance

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Turing)
- [ ] **Criar Checklist**: `mobile-a11y-android.md` — Em `checklists/turing/`
- [ ] **Criar Guideline**: `compose-vs-xml-decision.md` — Em `agents/turing/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES
> `README.md` — "Always provide contentDescription for ImageView / Image composables for TalkBack"
> `README.md` — "Prefer ConstraintLayout to flatten view hierarchies and reduce overdraw"

---

## 7. SCORE DE VALOR DO REPO (Para Frontend/DX)
| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 3 | Mobile UI útil, mas não web frontend |
| **Qualidade** | 3 | Bom guia, mas partes datadas |
| **Atualidade** | 2 | Era XML, Compose incompleto |
| **Ação** | 3 | Gera checklists a11y mobile |
| **Completude** | 3 | Cobre UI básico, falta moderno |
| **TOTAL** | **14/25** |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO
- [x] Salvar em `_consolidado/agents/turing/extractions/android-best-practices.md`
- [ ] Prosseguir para `ios-good-practices`