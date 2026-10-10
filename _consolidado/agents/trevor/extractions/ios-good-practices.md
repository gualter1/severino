# TEMPLATE DE EXTRAÇÃO — Para Funcionários (Subagentes)

**Use este template para cada repositório que analisar.**
Salve em: `_consolidado/agents/{seu_lead}/extractions/{nome-do-repo}.md`

---

## METADADOS
- **Repositório**: `ios-good-practices`
- **Lead Responsável**: `trevor`
- **Funcionário (Subagente)**: `trevor`
- **Data**: `2026-10-08`
- **Tempo gasto**: `0h 50min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Guia de boas práticas iOS (Futurice) — arquitetura, segurança, diagnostics, analytics, building, deployment, signing |
| **Público-alvo** | iOS devs, mobile leads, platform engineers |
| **Tamanho** | 703 linhas (README.md único), 0 workflows CI, 0 Fastfiles, 0 .xcconfig examples |
| **Linguagens/Tech** | Markdown, Swift/ObjC snippets, Xcode concepts |
| **Freshness** | Legado (CocoaPods como default, sem SPM, sem Fastlane, sem Xcode Cloud, sem Bitrise) |

---

## 2. O QUE PRESTA PARA **DEVOPS/PLATFORM** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Multi-environment: dev/test/staging + App Store configs (bundle ID, base URL, log level, provisioning) | `README.md:589-594` | Guideline | `agents/trevor/multi-env/ios-environments.md` | 🔴 Alta |
| `.xcconfig` files para build settings (comments + `#include` + merge-friendly) | `README.md:597-609` | Template | `templates/xcode/Common.xcconfig` + `templates/xcode/Debug.xcconfig` | 🔴 Alta |
| Signing: dev vs distribution certificates, keychain sync | `README.md:633-638` | Guideline | `agents/trevor/signing/ios-certificates.md` | 🔴 Alta |
| Provisioning profiles: dev/ad-hoc/App Store/Enterprise | `README.md:640-649` | Runbook | `runbooks/ios/provisioning-debug.md` | 🟠 Média |
| Provisioning debugging: Craig Hockenberry Provisioning + Quick Look | `README.md:657-663` | Runbook | `runbooks/ios/provisioning-debug.md` | 🟢 Baixa |
| Compiler warnings as errors: `-Wall -Wextra` + `Treat warnings as errors` | `README.md:487-498` | Tool config | `agents/trevor/build-systems/xcode-warnings-as-errors.md` | 🟠 Média |
| Clang Static Analyzer: deep mode on build, shallow on Analyze | `README.md:502-515` | Tool config | `agents/trevor/quality-gates/clang-analyzer-config.md` | 🟠 Média |
| Crash reporting: Fabric/HockeyApp/Crittercism/Splunk MINT/Instabug + save `.xcarchive` | `README.md:565-577` | Guideline | `agents/trevor/observability/ios-crash-reporting.md` | 🟠 Média |
| Salvar `.xcarchive` de cada release (dSYM para symbolicação) | `README.md:577` | Runbook | `runbooks/ios/dsym-retention.md` | 🔴 Alta |
| Certificate pinning: AFNetworking/Alamofire suporte nativo | `README.md:467` | Pattern | `agents/kaspersky/ios-cert-pinning.md` | 🟠 Média |
| Logging: nunca logar passwords/tokens em prod | `README.md:469-471` | Guideline | `agents/trevor/logging/ios-log-levels.md` | 🟢 Baixa |
| Analytics: `AnalyticsHelper` wrapper desacoplado do framework | `README.md:541-563` | Pattern | `agents/trevor/observability/analytics-abstraction.md` | 🟢 Baixa |
| Schemes: `MyApp (<Language>) [Environment]` naming convention | `README.md:615-627` | Template | `templates/xcode/scheme-naming.md` | 🟢 Baixa |
| Git branching: git-flow, releases em branch isolada com tags | `README.md:180-186` | Guideline | `agents/trevor/git-workflow/ios-release-branching.md` | 🟢 Baixa |
| Localization: `-AppleLanguages (Finnish)` launch argument para testes | `README.md:136-138` | Tool config | `agents/qualy/ios-localization-testing.md` | 🟢 Baixa |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| CocoaPods como padrão para dependency management | `README.md:83-108` | SPM é padrão moderno (Apple); CocoaPods tem problemas de build time e centralização | Swift Package Manager + `Package.resolved` commitado |
| Fabric / HockeyApp como crash reporting | `README.md:569-573` | Fabric descontinuado (migrado para Firebase Crashlytics); HockeyApp → App Center (também sunset) | Firebase Crashlytics, Sentry, Datadog RUM |
| Xcode "Fix issue" button mencionado sem automação | `README.md:637` | Manual, não escala em CI | Fastlane Match / App Store Connect API Key (JWT) |
| Sem Fastlane (match, gym, pilot, deliver) | — | Assinatura manual não escala; Match resolve cert sharing | Fastlane + Match + Sigh |
| Sem Bitrise / Xcode Cloud / GitHub Actions | — | CI iOS moderno exige runners macOS + caching de DerivedData | GitHub Actions (macos-14) + `ruby/setup-ruby` + Fastlane |
| Sem TestFlight automation (apenas menção manual) | `README.md:647` | Upload manual lento | `fastlane pilot upload` + groups + changelog |
| Sem App Store Connect API key (JWT) para CI headless | — | Necessário para CI sem 2FA interativa | `app_store_connect_api_key` action |
| Sem notação de `CODE_SIGN_STYLE=Manual` vs Automatic em CI | — | CI headless requer manual + keychain temporário | Documentar `setup_ci` + `create_keychain` |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] **Gap 1: Fastlane complete setup (Match + Gym + Pilot + Deliver)** — Sugestão: Criar `templates/fastlane/Fastfile`, `Matchfile`, `Appfile` com lanes `beta` e `release`
- [ ] **Gap 2: GitHub Actions workflow iOS** — Sugestão: Template com cache (SPM, DerivedData), `xcodebuild test`, `gym`, `pilot`, dSYM upload para Sentry/Firebase
- [ ] **Gap 3: Versionamento automático (agvtool / fastlane increment_build_number)** — Sugestão: Build number = `GITHUB_RUN_NUMBER`, version via git tags + `semantic-release`
- [ ] **Gap 4: Security scanning iOS (MobSF, Semgrep Swift rules, dependency audit)** — Sugestão: Steps de SAST no pipeline
- [ ] **Gap 5: TestFlight rollout gradual + phased release App Store** — Sugestão: Runbook de rollout/rollback com `phased_release` + `automatic_release` flags
- [ ] **Gap 6: Observabilidade moderna (Sentry, Datadog RUM, Firebase Performance)** — Sugestão: Template + dashboards
- [ ] **Gap 7: Xcode Cloud vs Bitrise vs GHA decision matrix** — Sugestão: ADR comparando custo/latência/features
- [ ] **Gap 8: Provisioning as code (Match repo criptografado + rotation)** — Sugestão: Runbook de rotação de certs/profiles

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: Seção iOS CI/CD moderno — Fastlane, Match, TestFlight automation, dSYM retention
- [ ] **Criar Template**: `templates/fastlane/Fastfile` + `Matchfile` + `Appfile` — Em: `_consolidado/templates/fastlane/`
- [ ] **Criar Template**: `templates/github-actions/ios-ci.yml` — Em: `_consolidado/templates/github-actions/`
- [ ] **Criar Template**: `templates/xcode/Common.xcconfig` — Em: `_consolidado/templates/xcode/`
- [ ] **Criar Runbook**: `runbooks/ios/provisioning-debug.md` + `dsym-retention.md` — Em: `_consolidado/runbooks/ios/`
- [ ] **Criar ADR**: `ADR-002-ios-ci-runner-choice` — Para: Escolher entre Xcode Cloud / Bitrise / GitHub Actions macOS runners

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `README.md:591-593` — "You might – no, [_should!_][futurice-environments] – have different environments for testing, staging and other activities related to your service. Each might have its own base URL, log level, bundle identifier (so you can install them side-by-side), provisioning profile and so on."

> `README.md:599-606` — "Typically build settings are specified in the Xcode GUI, but you can also use _configuration settings files_ (`.xcconfig` files) for them. The benefits: You can add comments. You can `#include` other files. If you have settings that apply to all configurations, add a `Common.xcconfig` and `#include` it. Conflict resolution and merging becomes easier."

> `README.md:577` — "Once you have this set up, ensure that you _save the Xcode archive (`.xcarchive`)_ of every build you release. The archive contains the built app binary and the debug symbols (`dSYM`) which you will need to symbolicate crash reports from that particular version of your app."

> `README.md:646-647` — "__Ad-Hoc:__ Just like development profiles, it contains a whitelist of devices the app can be installed to. This type of profile can be used for beta testing on 100 devices per year. For a smoother experience and up to 1000 distinct users, you can use Apple's newly acquired TestFlight service."

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Multi-env, xcconfig, signing, provisioning, crash reporting — core iOS platform |
| **Qualidade** | 4 | Profundo em signing/provisioning/build configs, mas sem tooling moderno |
| **Atualidade** | 2 | CocoaPods default, Fabric/HockeyApp mortos, sem Fastlane/SPM/Xcode Cloud |
| **Ação** | 4 | Gera templates xcconfig, Fastlane, runbooks provisioning/dSYM |
| **Completude** | 2 | Faltam CI/CD, security scanning, TestFlight automation, rollout/rollback |
| **TOTAL** | **17/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/trevor/extractions/ios-good-practices.md`
- [x] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Template v1.0 — Atualize se precisar de campos extras para seu domínio.*