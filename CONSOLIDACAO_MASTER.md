# CONSOLIDAÇÃO MESTRE — Mobile Best Practices (Futurice + Grill-Me)

**Origem**: 3 repositórios analisados por 4 subagentes especializados  
**Data**: 2026-10-08  
**Objetivo**: Base de conhecimento densa, técnica e acionável para times mobile

---

## 📋 ÍNDICE
1. [Arquitetura (Niamaia)](#1-arquitetura-niamaia)
2. [DevOps/Platform (Trevor)](#2-devopsplatform-trevor)
3. [Security/Code Quality (Tranquilão)](#3-securitycode-quality-tranquilão)
4. [Testing/Quality (Qualy)](#4-testingquality-qualy)
5. [Grill-Me Skill — Metodologia de Validação](#5-grill-me-skill--metodologia-de-validação)
6. [ADRs Propostas](#6-adrs-propostas)
7. [Próximos Passos Imediatos](#7-próximos-passos-imediatos)

---

## 1. ARQUITETURA (Niamaia)

### 1.1 Padrões Arquiteturais Identificados

| Padrão | Plataforma | Trade-offs | Decisão |
|--------|------------|------------|---------|
| **MVCS** (MVC + Store) | iOS | +Separa I/O assíncrono; -Store vira God-object | **Baseline** para apps CRUD. Particionar Store por agregado |
| **MVVM** | iOS | +VC slim; -Overhead binding, curva Rx | **Usar** quando VC >300 LOC ou lógica complexa. Exige regra de binding |
| **VIPER** | iOS | +SRP extremo, testabilidade; -Explosão arquivos, overkill <15 telas | **Só** >20 telas, múltiplos times, teste >70% |
| **Activity/Fragment** | Android | Sem consenso. Activity=container leve, Fragment=UI | **Default**: 1 Activity : 1 Fragment. Evitar nested fragments |
| **Event Patterns** | iOS (generalizável) | Delegation/Callback/NC/KVO/Signals | **Regra**: Delegation(modal), Callback(1-2 hops), NC(cross-cutting), Signals/Rx(chains dependentes) |
| **Store/Repository** | Ambos | +Boundary anti-corruption; -Serialização objeto inteiro = perde query | **Sempre**: async-first (`SignalProducer`/`Flow`/`suspend`). Nunca expor `Cursor`/`JSONObject` |
| **Model Imutável + Anti-Corruption** | Ambos | +Thread-safety; -Custo cópia listas grandes | **Sempre**: DTO rede ≠ Model domínio; mapper no Store |

> **Regra transversal**: Controller/View magro + Store gordo-async + Model imutável = Clean Architecture 3 camadas

### 1.2 Decisões de Tech Stack (ADR-style)

| Área | Decisão | Status 2026 |
|------|---------|-------------|
| Build Android | Gradle + AGP source of truth, estrutura default | **Manter princípio**, modernizar: Version Catalogs + Convention Plugins |
| Segredos Android | `gradle.properties` (gitignored) + debug keystore commitado | **Superseder**: Secrets Manager + CI signing. Não commitar debug keystore público |
| Deps Android | Maven pinned (`2.1.1`), nunca dynamic | **Manter**. Evoluir: lockfiles + Renovate/Dependabot |
| Rede Android | OkHttp + Retrofit + Picasso/Glide | **Manter padrão**. Avaliar Ktor (KMP). Imagem: Coil (Compose) |
| JSON Android | Jackson default; Gson (method-count); Moshi (Kotlin) | **Revisar**: Kotlinx.serialization / Moshi-codegen como default |
| Reativo Android | RxJava incremental, doc obrigatória se full | **Superseder**: Coroutines + Flow default; Rx só legado |
| 65k métodos | Evitar Guava, orçamentar com `dex-method-counts` | **Parcial**: R8/D8 + App Bundles mudam cálculo. Princípio *dependency budget* permanece |
| Persistência Android | SP (KV simples) → ContentProvider → ORM só extremo | **Superseder**: Room/DataStore default. CP só inter-process real |
| Deps iOS | CocoaPods (commit Pods/) vs Carthage (binários) | **Superseder**: SPM default. Princípio "decisão consciente + pin" permanece |
| UI iOS | Híbrido: sketch SB → code ao maturar | **Superseder**: SwiftUI + Previews resolve 80%. Regra híbrida p/ UIKit legado |
| Layout iOS | Auto Layout + size classes, constraints no init | **Manter princípio**. SnapKit/NSLayoutAnchor → SwiftUI Layout |
| Build iOS | Configs Debug/Release+env via `.xcconfig` + `#include Common` | **Manter 1:1**. Generalizar: `env = config (12-factor), variant = artifact` |
| Segurança iOS | Keychain + TLS+pinning + secureTextEntry + wipe background | **Manter, elevar**: ATS + Certificate Transparency + Secure Enclave/Keystore |
| Qualidade | Warnings-as-errors, Clang deep, Faux Pas, ProGuard cedo, mapping.txt | **Manter ritual, trocar ferramentas**: SwiftLint/detekt/ktlint, R8, Crashlytics |
| Analytics | Facade `AnalyticsHelper` traduz Model→data-layer (GTM) | **Manter padrão Facade**. GTM→Segment/PostHog/Firebase |
| Branching | git-flow | **Revisar**: trunk-based + feature flags default; git-flow só release trains |

### 1.3 Princípios de Design de Sistema (Universalizáveis)

| Princípio | Mobile | Backend/Web |
|-----------|--------|-------------|
| Controllers magros, Stores gordos-async | VC/Activity só lifecycle+binding | Controller HTTP magro → Service → Repository |
| DI por construtor, singleton só se global-real | `FooVC(vm:)` | Constructor injection (Hilt/Koin/Spring) |
| CQS por nome (verbo=efeito, substantivo=query) | `loadView()` vs `navigationItem` | `createOrder()` vs `orderTotal()` |
| Separação layout vs aparência vs conteúdo | XML layout só `layout_*`; styles aparência; colors/dimens palette | Design tokens (Tailwind/CSS vars/Material ColorScheme) |
| Recursos como código | 1 attr/linha, naming `type_foo_bar`, strings namespaced | i18n-first + ICU MessageFormat |
| Flat hierarchy + lazy/estático p/ custo alto | ConstraintLayout, `NSDateFormatter` estático | Evitar N+1, hoist expensive objects, flatten DOM |
| WebView: pedir HTML puro do backend | Nunca sanitizar client-side; bind ApplicationContext | Push sanitização p/ edge/BFF |
| Config por ambiente, não target/branch | `.xcconfig` + `buildTypes` + `applicationIdSuffix` | 12-factor config; 1 artifact + env injection |
| Observabilidade desde dia 1 | Analytics facade + crash + profiling | RED/USE + tracing + crash/SLO |
| Segurança conservadora default | Keychain + protection level mínimo + TLS+pinning | Secrets manager, mTLS, PII redaction, screen-data minimization |
| Não adicionar dep sem decisão consciente | Preferir framework oficial | Tech Radar adopt/trial/assess/hold + abstraction seam |

### 1.4 Modularização e Escalabilidade

**Android** — Feature-based packages:
```
com.app.feature.payments/
  PaymentsFragment, PaymentsVM, PaymentsStore, PaymentsModels
```
Benefícios: fronteiras claras, encapsulamento, remoção segura, **transição direta p/ multi-module + Dynamic Delivery**.

**iOS** — Folder-by-architecture (datado): `Models/Views/Controllers|ViewModels/Stores/Helpers/`

**Consolidação**: Adotar **feature-first nos dois**:
```
Features/Payments/{Models,Views,ViewModels,Store}
Core/{Networking,DesignSystem,Analytics,Security}
```

**iOS Targets** = variantes app (country/white-label); **Build Configs+Schemes** = ambientes. Android: `productFlavors` × `buildTypes`. Documentar como matriz.

### 1.5 Injeção de Dependência e Camadas

```
View (Activity/Fragment/VC/SwiftUI) ─ binding only
    init(viewModel|store) ← constructor injection
ViewModel/Presenter (estado apresentação, sem SDK direto)
    chama Store async, expõe Signal/Flow/LiveData
Store/Repository (vending + caching + networking + disk/DB)
    traduz DTO remoto → Model imutável domínio
Infra (OkHttp/Retrofit/Alamofire, Room/CoreData, Keychain/SharedPrefs)
```

**Futura ADR**: Hilt (Android) / Factory+Environment (SwiftUI) / Koin (KMP); Stores como `@Singleton`-scoped por agregado com interface.

### 1.6 Gaps e Oportunidades

| Mobile-specific (runbook) | Universal (guideline cross-platform) |
|---------------------------|--------------------------------------|
| 65k dex, minSdk, signing/provisioning, asset catalogs, size classes, pasteboard/screenshot leak, secureTextEntry, App Store review | 1. Feature-based + Store async + Model imutável + DI construtor + Facade vendor + warnings-as-errors + release-build semana 1 + secrets fora VCS + i18n-first + design tokens |
| | 2. **Grill-me** como cerimônia obrigatória de ADR/RFC review (stress-test design até fechar árvore decisões) |

---

## 2. DEVOPS/PLATFORM (Trevor)

### 2.1 Build Systems Comparativo

| Aspecto | Android (Gradle) | iOS (Xcode/xcconfig) |
|---------|------------------|----------------------|
| Build tool | Gradle + AGP | Xcodebuild |
| Config declarativa | `build.gradle` (Kotlin DSL) | `.xcconfig` + schemes |
| Multi-env | `buildTypes` + `productFlavors` | Build Configurations |
| Variáveis sensíveis | `gradle.properties` (gitignored) | Keychain + `.xcconfig` |
| Dependency mgmt | Maven coordinates | CocoaPods/Carthage/SPM |
| Version pinning | Estáticas (`2.1.1`) | Operadores Podfile |
| Output | AAB (Play), APK | `.xcarchive` → `.ipa` |
| CI-friendly | `./gradlew assembleRelease` | `xcodebuild -scheme -configuration` |

**Gap crítico**: Android = single-source-of-truth no Gradle; iOS = config espalhada. **Padronizar**: tudo em arquivos versionados.

### 2.2 Pipeline Unificado (Stages Obrigatórios)

```yaml
stages:
  - lint-static-analysis
  - unit-tests
  - integration-tests
  - build-release
  - sign-notarize
  - distribute
  - smoke-test
  - promote
```

### 2.3 Signing & Provisioning

**Android**: Keystore → `gradle.properties` (gitignored). Debug compartilhado, Release OFF-repo, rotação anual.

**iOS**: 
| Certificado | Uso | Profile | Devices |
|-------------|-----|---------|---------|
| Development | Deploy dev | Development | Whitelist (100/ano) |
| Distribution (App Store) | Produção | App Store | Público |
| Distribution (Ad-Hoc) | Beta | Ad-Hoc | Whitelist (100/ano) |
| Distribution (Enterprise) | Privado | Enterprise | Interno |

**Automação**: Fastlane Match (padrão ouro) + git repo de certs + SSH key no CI.

### 2.4 Release & Distribution

| Plataforma | Tracks | Rollback |
|------------|--------|----------|
| Android | Internal → Closed → Open → Production (phased 1%→100%) | Promover track anterior (minutos) |
| iOS | TestFlight (10k) → App Store (phased 1%/24h→100%/7d) | Hotfix branch + expedited review / Feature flags |

### 2.5 Observability & Quality Gates

| Item | Android | iOS |
|------|---------|-----|
| Crash | Firebase Crashlytics/Sentry + `mapping.txt` | Crashlytics/Sentry + `dSYM` |
| Símbolos | Upload automático `uploadCrashlyticsMappingFileRelease` | `upload_symbols_to_crashlytics` |
| Perf | Macrobenchmark, LeakCanary, Perfetto | XCTest metrics, Instruments Allocations/Leaks |

### 2.6 Consolidação Cross-Platform

**Pipeline Unificado**: Jobs Android/iOS paralelos + promote sincronizado em tag.

**Quality Gates Compartilhados**: Version bump único, changelog `git cliff`, license compliance, SBOM merge, security scan `trivy` + `semgrep`.

**IaC para Mobile**: Terraform providers para App Store Connect, Play Console, Fastlane Match repo, device farms, feature flags.

---

## 3. SECURITY/CODE QUALITY (Tranquilão)

### 3.1 Data Protection

| Plataforma | Obrigatório | Proibido |
|------------|-------------|----------|
| Android | `EncryptedSharedPreferences` (API 23+), Keystore, `EncryptedFile` | `SharedPreferences` p/ tokens/PII |
| iOS | Keychain (wrappers: `KeychainAccess`), `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` | `UserDefaults`, plists, Core Data p/ sensível |

### 3.2 Network Security

- **Certificate Pinning**: OkHttp `CertificatePinner` (2+ backup pins) / Alamofire `PinningEvaluator`
- **TLS Enforcement**: `networkSecurityConfig.xml` `cleartextTrafficPermitted=false` / `NSAllowsArbitraryLoads=NO`
- **Logging Sanitization**: Debug tools (`Stetho`, `Chuck`) só em `DEBUG`. **Nunca** logar `Authorization`, `Cookie`, PII
- **Tokens**: Access em memória, Refresh em Keystore/Keychain com rotação server-side

### 3.3 Static Analysis Gates (CI Enforcement)

| Android | iOS |
|---------|-----|
| `lintOptions { abortOnError true }` | SwiftLint regras estritas |
| Checkstyle/SpotBugs/Detekt | Clang Static Analyzer (deep release) |
| OWASP Dependency Check | Faux Pas |
| | `-Wall -Wextra` + `warnings-as-errors` |

### 3.4 Runtime Hardening

- **Android**: R8/ProGuard release (`minifyEnabled true`, `shrinkResources true`), **reter `mapping.txt` forever**, DexGuard p/ advanced
- **iOS**: Compiler hardening nativo (`-fstack-protector-strong`, `-fPIE -pie`)
- **Memory**: LeakCanary (debug no-op release) / Instruments Allocations `Persistent` count
- **UI Protection**: Ocultar sensível + limpar clipboard + proteger screenshot em `applicationDidEnterBackground`; `secureTextEntry=true`

### 3.5 Coding Conventions

- **Android**: Prefixo tipos (`activity_`, `fragment_`, `view_`), `colors.xml` palette pura (`brand_primary`), `dimens.xml` escala padronizada, strings namespaced (`error_message_network`)
- **iOS**: Verbos=efeitos (`loadView`), substantivos=queries puras (`navigationItem`), `MARK:` organização

### 3.6 Compliance (LGPD/GDPR)

- Data minimization: auditoria analytics, hash IDs usuário
- Crash logs: scrubbing automático PII/tokens antes envio
- Consent: integração CMP + respect `AppTrackingTransparency`/`LAT`

### 3.7 Checklist Code Review (Gatekeeper)

#### 🔴 BLOCKERS (bloqueiam merge)
1. Secrets/PII no código
2. Cleartext/sem pinning endpoints sensíveis
3. Armazenamento inseguro (SP/UserDefaults sem criptografia)
4. ProGuard/R8 desabilitado release
5. LeakCanary/Stetho ativos produção
6. CVEs High/Critical dependências
7. Falha AuthZ (IDOR)
8. Vazamento stack traces/detalhes internos

#### 🟠 MAJOR (corrigir antes staging/prod)
1. Alertas static analysis pendentes
2. Coverage <80% linha / <70% branch
3. Memory leaks detectados
4. Violação convenções nomenclatura/recursos
5. Falta limpeza clipboard/proteção screenshot background
6. Dependências versões dinâmicas (`+`, `~>`)

---

## 4. TESTING/QUALITY (Qualy)

### 4.1 Test Pyramid Mobile

| Camada | Android | iOS | Foco |
|--------|---------|-----|------|
| **Unit** | JUnit (JVM) | XCTest | Lógica pura, isolada framework |
| **Integration** | Repository/Store + MockWebServer | Repository/Store + OHHTTPStubs | DB/Network fakes |
| **UI** | Espresso | XCUITest | Jornadas críticas (alto custo/flakiness) |
| **Contract** | **GAP** | **GAP** | Oportunidade: Pact.io / Schemathesis |

### 4.2 Test Data & Environment

- **Android**: `buildTypes` com `applicationIdSuffix` p/ side-by-side; `gradle.properties` segredos
- **iOS**: Schemes `MyApp [Testing]` mapeando configs; launch args `-AppleLanguages (Finnish)` p/ i18n rápido
- **Shared**: Builder/Factory p/ test data; evitar hardcoded strings

### 4.3 Device Strategy

- Emulador x86 dev diário; Real devices por market share
- iOS: TestFlight beta (10k), Ad-Hoc whitelist (100)
- Device farms: Firebase Test Lab / AWS Device Farm
- Paralelização + sharding obrigatório

### 4.4 CI Quality Gates

| Android | iOS |
|---------|-----|
| Lint + Checkstyle + FindBugs + Tests | Analyze (warnings as errors) + Faux Pas |
| Coverage thresholds (definir) | Coverage thresholds (definir) |
| **Gap**: Mutation testing (Stryker) | **Gap**: Mutation testing |

### 4.5 Flakiness Mitigation

- Espresso: Idling Resources, MockWebServer
- XCUITest: Wait strategies robustas
- **Regra**: Quarentena imediata testes instáveis

### 4.6 Contract Testing (Gap Crítico)

- Introduzir **Consumer-Driven Contracts (Pact)**
- Validação schema JSON/Protobuf no CI
- Eliminar mockings frágeis de API

### 4.7 Matriz de Decisão (ROI)

| Tipo | Objetivo | Frequência | ROI |
|------|----------|------------|-----|
| Unit | Lógica negócio | PR Check | Alto |
| Integration | DB/Network | PR Check | Alto |
| E2E UI | Jornada crítica (Login/Checkout) | Nightly | Médio |
| Visual | UI Regressions (Percy/Snapshot) | PR Check | Médio |
| Chaos | Resiliência (lag, force kill) | Pré-release | Baixo |

---

## 5. GRILL-ME SKILL — METODOLOGIA DE VALIDAÇÃO

**Arquivo**: `grill-me-skill/SKILL.md`

### Princípio
> "Entrevistar o usuário incansavelmente sobre um plano/design até atingir entendimento compartilhado, resolvendo cada branch da árvore de decisão."

### Fluxo Obrigatório
1. **Uma pergunta por vez** via `AskUserQuestion` (popup múltipla escolha 2-4 opções)
2. **Aguardar resposta** antes da próxima
3. **Explorar código/arquivos** se resposta estiver lá (não perguntar ao usuário)
4. **Reconhecer decisão** (1-2 frases) → próxima pergunta
5. **Finalizar**: resumo conciso de todas decisões

### Aplicação no Nosso Contexto
- **Cerimônia obrigatória** antes de `Accepted` em ADR (Niamaia)
- **Threat-model gate** (Kaspersky)
- **Capacity planning gate** (Trevor)
- **Design review** para qualquer RFC arquitetural

---

## 6. ADRS PROPOSTAS

| ID | Título | Owner | Prioridade |
|----|--------|-------|------------|
| ADR-001 | Feature-modules como estrutura padrão (mobile + backend slices) | Niamaia | 🔴 Crítica |
| ADR-002 | Store/Repository async-first + Model imutável + mapper boundary | Niamaia | 🔴 Crítica |
| ADR-003 | DI por construtor + framework (Hilt / Swift Factory / Koin KMP) | Niamaia | 🟠 Alta |
| ADR-004 | Analytics/Crash facade + telemetry padrão | Niamaia/Tranquilão | 🟠 Alta |
| ADR-005 | Secrets/env strategy + signing CI | Trevor | 🔴 Crítica |
| ADR-006 | `grill-me` como review obrigatório de RFC/ADR | Severino | 🟠 Alta |
| ADR-007 | Pipeline unificado mobile (GitHub Actions + Fastlane) | Trevor | 🟠 Alta |
| ADR-008 | Contract testing com Pact (mobile↔backend) | Qualy | 🟡 Média |
| ADR-009 | Security baseline checklist (Tranquilão) como gate CI | Tranquilão | 🔴 Crítica |
| ADR-010 | Tech Radar mobile: adopt/trial/assess/hold | Niamaia | 🟡 Média |

---

## 7. PRÓXIMOS PASSOS IMEDIATOS

### Semana 1 — Fundação
- [ ] Criar repo `mobile-guidelines` com esta consolidação como `README.md`
- [ ] Abrir ADR-001, ADR-002, ADR-005, ADR-009 (críticas)
- [ ] Setup GitHub Actions pipeline unificado (`.github/workflows/mobile.yml`)
- [ ] Configurar Fastlane Match (iOS) + Keystore CI (Android)

### Semana 2 — Quality Gates
- [ ] Implementar checklist Tranquilão como GitHub Action required check
- [ ] Configurar SwiftLint/detekt/ktlint + OWASP Dependency Check + Clang Analyzer
- [ ] Setup Crashlytics/Sentry + symbol upload automático
- [ ] Definir coverage thresholds (80%/70%) e falhar build abaixo

### Semana 3 — Arquitetura & Testing
- [ ] Template feature-module (Android + iOS) com Store/Repository + DI
- [ ] Introduzir Pact contract testing (consumer-driven)
- [ ] Configurar device farm (Firebase Test Lab) no CI nightly
- [ ] Documentar `grill-me` ceremony para ADR reviews

### Semana 4 — Operacionalização
- [ ] Runbook mobile: signing rotation, disaster recovery, rollback testado
- [ ] SBOM + license report automático por release tag
- [ ] Cost tracking CI minutes + device farm + store fees
- [ ] Treinamento time no `grill-me` + novos padrões

---

## 📁 ESTRUTURA SUGERIDA DO REPO CONSOLIDADO

```
mobile-guidelines/
├── README.md                    # Este arquivo
├── ADR/
│   ├── 001-feature-modules.md
│   ├── 002-store-repository-pattern.md
│   ├── 003-dependency-injection.md
│   ├── 004-telemetry-facade.md
│   ├── 005-secrets-signing.md
│   ├── 006-grill-me-review.md
│   ├── 007-unified-pipeline.md
│   ├── 008-contract-testing.md
│   ├── 009-security-baseline.md
│   └── 010-tech-radar.md
├── architecture/
│   ├── patterns.md              # Resumo Niamaia (tabelas)
│   ├── layer-boundaries.md
│   └── modularization.md
├── devops/
│   ├── pipeline.yml             # GitHub Actions unificado
│   ├── fastlane/
│   │   ├── Fastfile
│   │   ├── Matchfile
│   │   └── Appfile
│   ├── signing-android.md
│   ├── signing-ios.md
│   ├── release-process.md
│   └── observability.md
├── security/
│   ├── checklist-pr.md          # Checklist Tranquilão
│   ├── data-protection.md
│   ├── network-security.md
│   └── static-analysis.md
├── testing/
│   ├── strategy.md              # Matriz Qualy
│   ├── pyramid.md
│   ├── contract-testing.md
│   └── flakiness.md
├── skills/
│   └── grill-me/                # Copia do grill-me-skill
└── templates/
    ├── feature-module-android/
    ├── feature-module-ios/
    └── adr-template.md
```

---

## 🎯 COMO USAR ESTA CONSOLIDAÇÃO

1. **Para novos projetos**: Clone `mobile-guidelines`, rode `grill-me` no design inicial, aplique ADRs aprovadas
2. **Para code review**: Use `security/checklist-pr.md` como required check no GitHub
3. **Para onboarding**: `guanabara` pode usar este doc + analogias para ensinar o time
4. **Para decisões**: Qualquer trade-off novo → abre ADR seguindo template + `grill-me` review
5. **Para evolução**: Tech Radar (ADR-010) revisado trimestralmente

---

**Mantido por**: Severino (Tech Lead Orchestrator)  
**Contribuidores**: Niamaia, Trevor, Tranquilão, Qualy  
**Validação**: Grill-Me ceremony obrigatória para mudanças nas ADRs críticas