## METADADOS
- **Repositório**: `ios-good-practices`
- **Lead Responsável**: `qualy`
- **Funcionário (Subagente)**: `qualy`
- **Data**: `2026-10-08`
- **Tempo gasto**: `1h 15min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Guia de boas práticas de desenvolvimento iOS (Swift/Obj‑C) — arquitetura, dependências, segurança, diagnósticos, build, deploy, IAP, etc. |
| **Público-alvo** | Desenvolvedores iOS (junior a sênior), arquitetos mobile, leads de qualidade mobile |
| **Tamanho** | 1 arquivo principal (`README.md` – 703 linhas) + `LICENSE` |
| **Linguagens/Tech** | Markdown (documentação), referências a Swift, Objective‑C, Xcode, CocoaPods, Carthage, Fastlane (citado indiretamente) |
| **Freshness** | Repo "living document"; último commit não visível aqui. Issues/PRs abertos no GitHub original (futurice/ios-good-practices) indicam manutenção esporádica. |

---

## 2. O QUE PRESTA PARA **QUALIDADE / TESTES** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Compiler warnings como erros (`-Wall -Wextra` + "Treat warnings as errors") | `README.md:488-498` | Guideline / Tool config | `agents/qualy/ci-quality-gates.md` | 🔴 Alta |
| Clang Static Analyzer – enable all checks, shallow para `Analyze`, deep para `Build` | `README.md:502-516` | Guideline / Tool config | `agents/qualy/static-analysis.md` | 🔴 Alta |
| Faux Pas – static error detection (Obj‑C) | `README.md:517-523` | Tool config | `agents/qualy/static-analysis.md` | 🟠 Média |
| Exception breakpoint para crashes no debugger | `README.md:525-528` | Guideline / Runbook step | `agents/qualy/debugging-runbook.md` | 🟠 Média |
| View debugging tools (Reveal, Spark Inspector, Xcode View Debugger) | `README.md:529-533` | Tool config | `agents/qualy/ui-debugging.md` | 🟢 Baixa |
| Instruments (Allocations, Leaks, CPU, Network) – profiling workflow | `README.md:535-540` | Guideline / Runbook | `agents/qualy/profiling-runbook.md` | 🟠 Média |
| Crash‑log collection services (Fabric, HockeyApp, Crittercism, Splunk MINT, Instabug) | `README.md:565-575` | Guideline / Checklist | `agents/qualy/crash-reporting-checklist.md` | 🔴 Alta |
| Logging hygiene (não logar secrets, log levels por build) | `README.md:469-472` | Guideline | `agents/qualy/logging-guidelines.md` | 🟠 Média |
| **Ausência total de seção de Testes** (bullet "Add section on Testing") | `README.md:698-701` | Gap / Anti‑pattern | `agents/qualy/gaps-testing.md` | 🔴 Alta |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| CocoaPods como gerenciador default (inclui commit de `Pods/`) | `README.md:83-108` | SPM (Swift Package Manager) é padrão Apple desde Xcode 11; CocoaPods adiciona complexidade e binários no repo. | SPM + `Package.resolved` (ou Tuist/XcodeGen para geração de projeto) |
| Carthage como alternativa "simples" | `README.md:110-120` | Menos usado hoje; SPM cobre a maioria dos casos. | SPM |
| Ausência de menção a **XCTest**, **XCUITest**, **Swift Testing**, **SnapshotTesting**, **Detox**, **Appium**, **Fastlane scan** | — | Guia de boas práticas iOS *precisa* cobrir testes unitários, UI, snapshot, contract, CI. | Adicionar seção dedicada (ver Gaps) |
| Recomendação de "Commit the installed dependencies" (CocoaPods) | `README.md:97` | Gera repositórios inchados; conflitos de merge. | `Package.resolved` + `swift package resolve` no CI |
| Referência a `NSURLSession` vs AFNetworking/Alamofire sem menção a **async/await** (Swift 5.5+) | `README.md:209-214` | Código moderno usa `async/await` + `URLSession` nativo. | `async/await` + `URLSession` (ou `Alamofire` só se necessário) |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para Qualidade/Testes)

- [ ] **Gap 1: Estratégia de Testes (Unit / Integration / UI / Snapshot / Contract)** — *Sugestão*: Criar capítulo "Testing" com pirâmide invertida para mobile, exemplos de XCTest + Swift Testing, XCUITest, SnapshotTesting, Pact (contract) e Detox/Appium para E2E.
- [ ] **Gap 2: CI/CD Quality Gates para iOS** — *Sugestão*: Documentar pipeline Fastlane/GitHub Actions/Bitrise com `xcodebuild test`, `xcodebuild analyze`, `swiftlint`, `sonarqube`, `danger`, `codecov`, `mutation testing` (Stryker4Swift).
- [ ] **Gap 3: Test Data Management & Isolation** — *Sugestão*: Fábricas (FactoryBoy‑style), `SwiftMock`, `Mockingbird`, uso de `XCTestObservation` para sandbox, `inMemory` Core Data store.
- [ ] **Gap 4: Accessibility Testing (a11y)** — *Sugestão*: Integração `XCUITest` + `AXRuntime`, `AccessibilitySnapshot`, `axe-ios`.
- [ ] **Gap 5: Performance Baselines & Regression** — *Sugestão*: `XCTMetric` (launch, memory, CPU), `Instruments` automation, `k6` para backend, `Lighthouse CI` para WebViews.
- [ ] **Gap 6: Flakiness Management** — *Sugestão*: Quarentena automática (Danger + `flakiness-dashboard`), regra "fix em 48h ou delete".
- [ ] **Gap 7: Security Testing (Static + Dynamic)** — *Sugestão*: `MobSF`, `OWASP MASVS` checklist, `Frida` scripts, certificate pinning validation em testes.

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Qualy)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: seção "iOS Testing Strategy" baseada nos gaps acima.
- [ ] **Criar ADR**: `ADR-001-ios-testing-strategy` — Decisão: adotar XCTest + Swift Testing (unit), XCUITest (UI), SnapshotTesting (visual), Pact (contract), Detox (E2E cross‑platform).
- [ ] **Criar Template**: `templates/ios/TestPlan.md` — Rastreabilidade requisito → caso de teste → automação.
- [ ] **Criar Checklist**: `checklists/ios/pre-merge-quality-gate.md` (warnings-as-errors, static analyzer, unit coverage ≥80%, UI smoke, snapshot diff, accessibility audit).
- [ ] **Criar Runbook**: `runbooks/ios/static-analysis-failure.md` (passos para resolver Clang/Faux Pas warnings).
- [ ] **Criar Skill**: `skills/ios-test-automation/` — Wrapper para gerar boilerplate de testes (XCTest + Snapshot + Pact) em novos módulos.
- [ ] **Novo agente necessário**: `agents/ios-quality/` — Especialista mobile quality (se volume de repos iOS crescer).

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES

> **README.md:488-498**  
> "Enable as many compiler warnings as possible and treat those warnings as errors … `-Wall -Wextra` … "Treat warnings as errors" build setting."

> **README.md:502-516**  
> "The Clang compiler … has a static analyzer … Enable all of the checks … Analyze during 'Build' … Mode of Analysis for 'Build' → Deep."

> **README.md:517-523**  
> "Faux Pas … analyzes your codebase and finds issues you had no idea even existed. … run it before shipping any iOS (or Mac) app!"

> **README.md:535-540**  
> "Xcode comes with a profiling suite called Instruments … tracking down memory leaks with the Allocations instrument … NSDateFormatter is very expensive to create … keep a static instance."

> **README.md:565-575**  
> "First you should make your app send crash logs onto a server … Fabric, HockeyApp, Crittercism, Splunk MINTexpress, Instabug … save the Xcode archive (`.xcarchive`) of every build you release."

> **README.md:698-701**  
> "- Add section on Testing"

---

## 7. SCORE DE VALOR DO REPO (Para Qualidade/Testes)

| Critério | 1‑5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 2 | Guia geral de iOS, **não** foca em testes/quality. |
| **Qualidade** | 3 | Boas práticas de build, static analysis, crash reporting bem descritas. |
| **Atualidade** | 3 | Algumas recomendações (CocoaPods, Carthage) datadas; falta Swift concurrency, Swift Testing. |
| **Ação** | 4 | Gaps claros geram ADRs, templates, checklists imediatos. |
| **Completude** | 2 | Ausência total de testing, test data, a11y, performance, flakiness. |
| **TOTAL** | **14 / 25** | |

> **Regra**: Score 10‑17 = **Extrair seletivo** (o que fizemos acima).  

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/qualy/extractions/ios-good-practices.md`
- [ ] Notificar Lead **Qualy** (via canal interno) que a extração está pronta
- [ ] Avançar para próximo repo na fila (Batch 1)  

--- 

*Extração concluída por Qualy (subagente) em 2026‑10‑08.*