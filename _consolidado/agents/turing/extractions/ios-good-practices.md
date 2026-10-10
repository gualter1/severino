# METADADOS
- **Repositório**: ios-good-practices
- **Lead Responsável**: turing
- **Funcionário (Subagente)**: Turing
- **Data**: 2026-10-08
- **Tempo gasto**: 0h 25min

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Coleção de boas práticas para iOS (UI/UX, A11y, Arquitetura) |
| **Público-alvo** | Devs iOS (SwiftUI + UIKit) |
| **Tamanho** | README + links (guia curto) |
| **Linguagens/Tech** | Markdown, Swift, SwiftUI, UIKit |
| **Freshness** | Foco moderno em SwiftUI, mas mantém legado UIKit |

---

## 2. O QUE PRESTA PARA **FRONTEND/DX** (mobile UI lens)
| Item | Localização | Tipo | Destino sugerido | Prioridade |
|------|------------|------|------------------|------------|
| SwiftUI Accessibility (AccessibilityElement, labels) | `README.md` (A11y) | Guideline | `agents/turing/mobile-a11y-ios.md` | 🔴 Alta |
| SwiftUI Responsive (Size classes, AdaptiveLayout) | `README.md` (Responsive) | Guideline | `agents/turing/mobile-responsive.md` | 🟠 Média |
| Design System with Assets.xcassets (colors, images) | `README.md` (Assets) | Pattern | `agents/turing/ios-design-tokens.md` | 🟠 Média |
| SwiftUI Unidirectional Data Flow (@ObservedObject, @StateObject) | `README.md` (State) | Pattern | `agents/turing/swiftui-state.md` | 🔴 Alta |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO
| Item | Localização | Motivo | Substituto moderno |
|------|-------------|--------|-------------------|
| UIKit Storyboards | `README.md` | Merge conflicts, difícil review | SwiftUI ou Programmatic UIKit |
| MVC (Massive View Controller) | `README.md` | Difícil testar/manter | MVVM ou TCA |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA
- [ ] **TCA (The Composable Architecture)** — Sugestão: documentar padrão moderno para apps complexos
- [ ] **SwiftUI Previews + Snapshot Testing** — Sugestão: documentar CI testing visual
- [ ] **Performance (Instruments, SwiftUI render perf)** — Sugestão: guia de profilling

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Turing)
- [ ] **Criar Checklist**: `mobile-a11y-ios.md` — Em `checklists/turing/`
- [ ] **Criar Template**: `swiftui-component-preview` — Em `templates/swiftui/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES
> `README.md` — "Use `accessibilityLabel` and `accessibilityHint` to describe UI elements for VoiceOver"
> `README.md` — "Favor SwiftUI for new components; keep UIKit for legacy/complex custom rendering"

---

## 7. SCORE DE VALOR DO REPO (Para Frontend/DX)
| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 3 | Útil para mobile UI, lições a11y valiosas |
| **Qualidade** | 3 | Conciso, boas práticas |
| **Atualidade** | 3 | Focado em SwiftUI, mas superficial |
| **Ação** | 3 | Gera checklists a11y úteis |
| **Completude** | 2 | Guia, não referência de código |
| **TOTAL** | **14/25** |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO
- [x] Salvar em `_consolidado/agents/turing/extractions/ios-good-practices.md`
- [ ] Finalizado o lote 1 de extrações. Avisar Lead (Turing) e atualizar `CONSOLIDATED.md`