# EXTRAÇÃO — ios-good-practices

## METADADOS
- **Repositório**: `ios-good-practices`
- **Lead Responsável**: `niamaia`
- **Funcionário (Subagente)**: `niamaia`
- **Data**: `2026-10-08`
- **Tempo gasto**: `40min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Living document de boas práticas iOS — do onboarding ao App Store. Sugestões, não dogma ("if you have a good reason, go for it"). |
| **Público-alvo** | iOS devs, architects, tech leads |
| **Tamanho** | README único ~703 linhas, 12 seções |
| **Linguagens/Tech** | Markdown, Swift, Objective-C, xcconfig |
| **Freshness** | Futurice classic; cita CocoaPods/Carthage como default, Fabric/HockeyApp (descontinuados). Base sólida, camada de tooling legada. |

---

## 2. O QUE PRESTA PARA **NIAMAIA**

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| MVCS (MVC+Store), MVVM, VIPER — quando usar cada | `README.md:235-249` | Pattern | `agents/niamaia/architecture-patterns.md` | 🔴 Alta |
| MVVM motivado por "massive view controllers", VC como parte da View | `README.md:240-242` | Pattern | `agents/niamaia/architecture-patterns.md` | 🔴 Alta |
| VIPER para projetos grandes onde testabilidade é major concern | `README.md:243-244` | Decision record | `agents/niamaia/architecture-patterns.md` | 🟠 Média |
| Store layer: vende Models, abstrai networking/caching, API async (SignalProducer vs callback) | `README.md:316-340` | Pattern | `agents/niamaia/architecture-patterns.md` | 🔴 Alta |
| Event patterns: Delegation 1-1, Callbacks 1-1, Notification Center 1-N, KVO (desencorajado), Signals 1-N | `README.md:251-259` | Pattern | `agents/niamaia/event-patterns.md` | 🔴 Alta |
| Models imutáveis, traduzem semântica da API remota (Mantle / Swift struct + Codable) | `README.md:261-267` | Pattern | `agents/niamaia/architecture-patterns.md` | 🟠 Média |
| DI via inicializador: `initWithViewModel:` em vez de singletons | `README.md:298-313` | Pattern | `agents/niamaia/di-patterns.md` | 🔴 Alta |
| Project structure Models/Views/Controllers(VM)/Stores/Helpers como groups + dirs reais | `README.md:122-132` | Guideline | `agents/niamaia/architecture-patterns.md` | 🟠 Média |
| Code vs Storyboards trade-off + abordagem híbrida (sketch em SB, migrar para código) | `README.md:53-72` | Decision record | `agents/niamaia/tech-stack-decisions.md` | 🟠 Média |
| Build configs por environment + xcconfig com #include (Common.xcconfig) | `README.md:589-609` | Pattern | `agents/niamaia/env-config.md` | 🔴 Alta |
| Targets = "um app" vs Configs = environments; Schemes `App (Lang) [Env]` | `README.md:611-627` | Pattern | `agents/niamaia/env-config.md` | 🟠 Média |
| AnalyticsHelper como anti-corruption layer (traduz modelos internos → data layer string-based, permite trocar framework) | `README.md:547-563` | Pattern | `agents/niamaia/architecture-patterns.md` | 🟠 Média |
| IAP receipt validation checklist (Authenticity/Integrity/App/Product/Freshness) + validação server-side | `README.md:673-685` | Checklist | `agents/kaspersky/iap-checklist.md` | 🟠 Média |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| CocoaPods como default + commit de Pods | `README.md:83-108` | SPM é padrão; commitar Pods infla repo | SPM + Package.resolved |
| Carthage | `README.md:110-120` | Projeto arquivado/inativo | SPM (binary targets via XCFramework) |
| AFNetworking/Alamofire como "unbeaten" | `README.md:209-214` | URLSession moderno cobre muito; Alamofire ainda válido mas opcional | URLSession + async/await; Alamofire se precisar de conveniência |
| Fabric / HockeyApp / Crittercism / Splunk MINT | `README.md:567-574` | Descontinuados | Firebase Crashlytics, Sentry |
| Faux Pas / Reveal / Spark Inspector | `README.md:517-533` | Ferramentas pagas legadas | Xcode View Debugger + Instruments nativos |
| `git-flow` branching | `README.md:180-186` | Pesado para mobile moderno | Trunk-based + release branches, GitHub Flow |
| Manual signing/provisioning howto | `README.md:633-663` | Xcode Automatic Signing resolve 90% | Automatic signing + fastlane match |
| DateTools | `README.md:216-220` | Foundation Date/Calendar + Formatters evoluíram | Foundation nativo, Swift Algorithms |

---

## 4. GAPS

- [ ] Gap 1: SwiftUI + TCA/Observation vs UIKit MVVM — repo é UIKit-era. Sugestão: ADR SwiftUI adoption + `architecture-patterns.md` update.
- [ ] Gap 2: Modularização SPM multi-target, feature modules, binary caching — Sugestão: criar `ios-modularization.md`.
- [ ] Gap 3: Concurrency moderna (async/await, actors, Sendable) e seus impactos nos Stores — Sugestão: `concurrency-guide.md`.
- [ ] Gap 4: Test pyramid mobile (unit/UI/snapshot) ausente ("More Ideas" admite). Sugestão: delegar para qualy.

---

## 5. AÇÕES PROPOSTAS

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: MVCS/MVVM/VIPER decision tree; DI via init; xcconfig hierarchy; Analytics anti-corruption layer.
- [ ] **Criar ADR**: `ADR-iOS-arch-pattern` — MVVM default, VIPER quando testabilidade crítica.
- [ ] **Criar Template**: `xcconfig` base (Common/Dev/Staging/Prod) — Em: `templates/ios/`.
- [ ] **Criar Checklist**: IAP validation — Em: `agents/kaspersky/checklists/`.

---

## 6. CITAÇÕES

> `README.md:237-239` — "This is the default Apple architecture (MVC), extended by a Store layer that vends Model instances and handles the networking, caching etc."
> `README.md:241-242` — "MVVM considers `UIViewController` subclasses part of the View and keeps them slim by maintaining all state in the ViewModel."
> `README.md:300` — "Use dependency injection, i.e. pass any required objects in as parameters, instead of keeping all state around in singletons."
> `README.md:602-604` — "You can `#include` other build settings files, which helps you avoid repeating yourself... If you have some settings that apply to all build configurations, add a `Common.xcconfig`."
> `README.md:564` — "This has the additional advantage of allowing you to swap out the entire Analytics framework behind the scenes if needed, without the rest of the app noticing."

---

## 7. SCORE

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Patterns arquiteturais puros (MVCS/MVVM/VIPER, Stores, DI, envs) |
| **Qualidade** | 4 | Trade-offs explícitos, código Swift/ObjC real |
| **Atualidade** | 2 | UIKit/CocoaPods-era; precisa camada SwiftUI+SPM |
| **Ação** | 4 | Decision tree + xcconfig template + DI pattern extraíveis agora |
| **Completude** | 4 | End-to-end (setup→arch→security→build→deploy→IAP) |
| **TOTAL** | **19/25** | Priorizar extração completa (com modernização) |

---

## 8. PRÓXIMOS PASSOS
- [x] Salvo em `_consolidado/agents/niamaia/extractions/ios-good-practices.md`
