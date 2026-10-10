# METADADOS
- **Repositório**: `ios-good-practices`
- **Lead Responsável**: `towards`
- **Funcionário (Subagente)**: `Towards`
- **Data**: `2026-10-08`
- **Tempo gasto**: `0h 40min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | iOS Good Practices — Futurice guidelines for architecture, Swift/ObjC patterns, diagnostics, security |
| **Público-alvo** | iOS engineers, mobile architects |
| **Tamanho** | Single comprehensive README.md (700+ linhas) |
| **Linguagens/Tech** | Markdown, Swift, Objective-C, Xcode, ReactiveCocoa |
| **Freshness** | Clássico da Futurice — conceitos arquiteturais ainda válidos, ferramentas datadas |

---

## 2. O QUE PRESTA PARA **FEATURES COMPLEXAS, REFACTORING, DEBUGGING**

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Architecture patterns: MVCS, MVVM, VIPER comparison | `README.md:237-249` | Guideline | `agents/towards/architecture/ios-mvcs-mvvm-viper.md` | 🔴 Alta |
| Event patterns: Delegation, Callbacks, NotificationCenter, KVO, Signals | `README.md:251-259` | Pattern | `agents/towards/architecture/ios-event-patterns.md` | 🔴 Alta |
| Store layer with async APIs (SignalProducer / callbacks) | `README.md:318-340` | Pattern | `agents/towards/backend/async-store-patterns.md` | 🟠 Média |
| Dependency Injection for View Controllers | `README.md:299-314` | Pattern | `agents/towards/architecture/di-viewcontrollers.md` | 🔴 Alta |
| Exception Breakpoint for debugging crashes | `README.md:527-528` | Tool config | `agents/towards/debugging/xcode-exception-breakpoint.md` | 🟠 Média |
| Instruments Allocations for memory leak tracking | `README.md:537-538` | Runbook | `agents/towards/debugging/instruments-memory-leaks.md` | 🟠 Média |
| Build Configurations & xcconfig files for env management | `README.md:589-609` | Template | `agents/towards/build/xcconfig-env-management.md` | 🔴 Alta |
| Provisioning debugging technique (Quick Look .mobileprovision) | `README.md:659-661` | Runbook | `agents/towards/debugging/provisioning-debugging.md` | 🟢 Baixa |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| ReactiveCocoa / SignalProducer | `README.md:324-336` | Largely superseded | Combine / Swift Concurrency (async/await) |
| AFNetworking/Alamofire recommendation | `README.md:209-215` | Native URLSession + Combine preferred | URLSession + async/await |
| CocoaPods commit pods to repo | `README.md:97-98` | Against modern practice | SPM (Swift Package Manager) |
| GitFlow branching model | `README.md:182-186` | Outdated for CI/CD | Trunk-based development |
| XIB/Storyboard hybrid advice | `README.md:71-73` | SwiftUI is declarative future | SwiftUI + code-first |
| Faux Pas tool (no Swift support) | `README.md:517-522` | Abandoned/legacy | SwiftLint + Xcode Static Analyzer |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA

- [ ] Gap 1: SwiftUI / Swift Concurrency migration patterns (Strangler Fig ObjC→Swift→SwiftUI) — Sugestão: ADR + runbook
- [ ] Gap 2: Swift Package Manager (SPM) modularization for features — Sugestão: Template de Package.swift per feature
- [ ] Gap 3: XCTest / Swift Testing modern patterns (vs JUnit style) — Sugestão: Testing strategy guide
- [ ] Gap 4: Swift Concurrency Structured Concurrency for feature cancellation — Sugestão: Pattern para feature timeout/cancel

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD

- [ ] **Criar Pattern**: Store Layer + Async API with Swift Concurrency (replacing ReactiveCocoa)
- [ ] **Criar ADR**: `ADR-xxx: Feature-based Swift Package modules for iOS features`
- [ ] **Criar Runbook**: Memory Leak Investigation with Instruments Allocations
- [ ] **Criar Template**: xcconfig per environment (Dev/Staging/Prod) with secrets management
- [ ] **Criar/Atualizar CONSOLIDATED.md** com: iOS architecture patterns & debugging toolkit

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES

> `README.md:237-244 — "MVCS: Default Apple architecture (MVC), extended by a Store layer that vends Model instances and handles networking, caching etc."` — Practical architecture for complex features.

> `README.md:254-259 — "Event patterns: Delegation (one-to-one), Callback blocks (one-to-one), Notification Center (one-to-many), KVO (one-to-many implicit), Signals (ReactiveCocoa one-to-many)"` — Complete event taxonomy.

> `README.md:300-301 — "Use dependency injection, i.e. pass any required objects in as parameters, instead of keeping all state around in singletons."` — Testability & feature isolation.

> `README.md:527 — "When your app crashes, Xcode does not break into the debugger by default. To achieve this, add an exception breakpoint..."` — Essential debugging setup.

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Architecture & debugging core to complex features |
| **Qualidade** | 5 | Extremamente bem escrito, comparações claras |
| **Atualidade** | 2 | ReactiveCocoa, GitFlow, CocoaPods, no SwiftUI/Combine |
| **Ação** | 4 | Gera ADRs, patterns, runbooks imediatos |
| **Completude** | 4 | Covers arch, debugging, building, deployment |
| **TOTAL** | **20/25** | => Priorizar extração + complementar gaps |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/towards/extractions/ios-good-practices.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Template v1.0 — Towards domain: features complexas, refactoring, debugging*