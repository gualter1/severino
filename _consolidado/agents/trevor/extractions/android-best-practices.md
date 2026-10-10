# TEMPLATE DE EXTRAÇÃO — Para Funcionários (Subagentes)

**Use este template para cada repositório que analisar.**
Salve em: `_consolidado/agents/{seu_lead}/extractions/{nome-do-repo}.md`

---

## METADADOS
- **Repositório**: `android-best-practices`
- **Lead Responsável**: `trevor`
- **Funcionário (Subagente)**: `trevor`
- **Data**: `2026-10-08`
- **Tempo gasto**: `0h 45min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Guia de melhores práticas de desenvolvimento Android (Futurice) — build, arquitetura, testes, CI, segurança, observabilidade |
| **Público-alvo** | Android devs, leads, platform engineers |
| **Tamanho** | 555 linhas (README.md único), 0 workflows CI, 0 Dockerfiles |
| **Linguagens/Tech** | Markdown, Gradle (Groovy/Kotlin), Java/Kotlin references |
| **Freshness** | Documento legado (referencia minSdk 21, Retrolambda deprecated, Android Studio 3.0+, mas sem GitHub Actions) |

---

## 2. O QUE PRESTA PARA **DEVOPS/PLATFORM** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Gradle como build system padrão + estrutura default | `README.md:38-46` | Guideline | `agents/trevor/build-systems/gradle-android.md` | 🔴 Alta |
| Segredos fora do VCS: `gradle.properties` para keystore passwords | `README.md:56-95` | Pattern | `templates/gradle/gradle.properties.example` + `agents/trevor/secrets-management.md` | 🔴 Alta |
| Assinatura release: `signingConfigs` com try/catch para credenciais | `README.md:81-95` | Template | `templates/gradle/signing-config.gradle` | 🔴 Alta |
| `applicationIdSuffix` + `versionNameSuffix` para debug vs release | `README.md:108-124` | Pattern | `agents/trevor/multi-env/android-build-types.md` | 🟠 Média |
| Compartilhar debug keystore no repo (safe) | `README.md:128-129` | Guideline | `agents/trevor/android-debug-keystore.md` | 🟢 Baixa |
| Dependências via Maven (não JARs) + versões fixas (não `2.1.+`) | `README.md:97-106` | Guideline | `agents/trevor/dependency-management.md` | 🟠 Média |
| ProGuard/DexGuard para release: `minifyEnabled true` + regras custom | `README.md:446-493` | Template | `templates/proguard/proguard-rules.pro` | 🟠 Média |
| Salvar `mapping.txt` de cada release para desofuscar crashes | `README.md:490-492` | Runbook | `runbooks/android/proguard-mapping-retention.md` | 🟠 Média |
| Testes: JUnit (unit JVM), Espresso (UI device), AssertJ-Android | `README.md:423-440` | Guideline | `agents/qualy/android-testing.md` | 🟠 Média |
| **CI recomendado**: Jenkins (self-hosted) ou Travis CI (cloud) | `README.md:532-538` | Anti-pattern | `agents/trevor/ci-cd/android-ci-modern.md` | 🔴 Alta |
| Lint + Checkstyle + FindBugs como quality gates | `README.md:535` | Checklist | `checklists/android/quality-gates.md` | 🟠 Média |
| Stetho (debug bridge) apenas em debug build | `README.md:522-526` | Pattern | `agents/trevor/observability/stetho-debug-only.md` | 🟢 Baixa |
| LeakCanary (memory leaks) apenas no-op em release | `README.md:528-530` | Pattern | `agents/trevor/observability/leakcanary-config.md` | 🟢 Baixa |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Travis CI recomendado | `README.md:538` | Travis CI gratuito limitado/descontinuado para OSS; migrou para GitHub Actions/GitLab CI | GitHub Actions, GitLab CI, Bitrise, CircleCI |
| Jenkins como única opção self-hosted | `README.md:538` | Funciona mas sem exemplos de pipeline-as-code | Jenkinsfile declarativo + shared libraries |
| Retrolambda mencionado | `README.md:161-168` | Desnecessário desde Android Studio 3.0 (Java 8 nativo) | Remover — usar lambdas nativas |
| `compile` / `implementation` misto (exemplo usa `implementation` mas docs antigas usam `compile`) | `README.md:99-102` | `compile` deprecated no AGP 3.0+ | Usar apenas `implementation` / `api` |
| Sem menção a GitHub Actions, Bitrise, Fastlane, Gradle Managed Devices | — | Gap enorme de CI/CD moderno | Adicionar seção completa de CI/CD moderno |
| Sem menção a Android App Bundle (AAB) / Play Console internal testing | — | APK legacy; AAB é obrigatório no Play Store | Documentar bundle + Play Internal Testing |
| Sem menção a Firebase Test Lab / Gradle Managed Devices para device farm CI | — | Testes em device real essenciais | Adicionar |
| Sem menção a `gradle.properties` para versão (centralized versioning) | — | Versionamento manual propenso a erro | `versionCatalog` (TOML) ou `gradle.properties` centralizado |
| Sem menção a `baseline profiles` / startup optimization | — | Performance crítica em prod | Adicionar |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] **Gap 1: CI/CD moderno com GitHub Actions** — Sugestão: Criar workflow template com: `gradle lint`, `gradle test`, `gradle assembleRelease`, upload AAB artifact, assinatura via `r0adkll/sign-android-release`, deploy para Play Internal Testing via `r0adkll/upload-google-play`
- [ ] **Gap 2: Assinatura keyless / Play App Signing** — Sugestão: Documentar fluxo sem keystore local (Google gerencia chave), usar `apksigner` + `bundletool`
- [ ] **Gap 3: Versionamento automático (semver + changelog)** — Sugestão: `gradle-git-version` plugin ou `semantic-release` + `conventional commits`
- [ ] **Gap 4: Security scanning (DependencyCheck, OWASP, Trivy no container de build)** — Sugestão: Adicionar step `dependency-check-gradle` no pipeline
- [ ] **Gap 5: Device farm CI (Firebase Test Lab / Gradle Managed Devices)** — Sugestão: Workflow matrix com `pixel-6-api-34`, `pixel-4-api-30` etc.
- [ ] **Gap 6: Observabilidade mobile (Firebase Crashlytics, Sentry, Datadog RUM)** — Sugestão: Template de integração + dashboards
- [ ] **Gap 7: Feature flags / Remote Config (Firebase Remote Config)** — Sugestão: Padrão de rollout gradual
- [ ] **Gap 8: SBOM generation (CycloneDX) + assinatura SLSA** — Sugestão: `cyclonedx-gradle-plugin` + `slsa-framework/slsa-github-generator`

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: Seção Android CI/CD moderno — templates de workflow, signing keyless, device farm, observabilidade
- [ ] **Criar Template**: `templates/github-actions/android-ci.yml` — Em: `_consolidado/templates/github-actions/`
- [ ] **Criar Template**: `templates/gradle/signing-config.gradle` — Em: `_consolidado/templates/gradle/`
- [ ] **Criar Checklist**: `checklists/android/release-checklist.md` — Em: `_consolidado/checklists/android/`
- [ ] **Criar Runbook**: `runbooks/android/proguard-mapping-retention.md` — Em: `_consolidado/runbooks/android/`
- [ ] **Criar ADR**: `ADR-001-android-ci-migration` — Para: Migrar de Travis/Jenkins legacy para GitHub Actions + Bitrise hybrid
- [ ] **Criar Skill**: `android-release-automation` — Em: `_consolidado/skills/android-release-automation/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `README.md:40-42` — "Your default option should be Gradle using the Android Gradle plugin. It is important that your application's build process is defined by your Gradle files, rather than being reliant on IDE specific configurations. This allows for consistent builds between tools and better support for continuous integration systems."

> `README.md:72-77` — "Instead, make a `gradle.properties` file which should _not_ be added to the version control system: `KEYSTORE_PASSWORD=password123` `KEY_PASSWORD=password789`"

> `README.md:452-463` — "Usually you would configure Gradle to use ProGuard when building a release APK. `minifyEnabled true` `proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'`"

> `README.md:532-538` — "Continuous integration systems let you automatically build and test your project every time you push updates to version control. Continuous integration also runs static code analysis tools, generates the APK files and distributes them. Lint and Checkstyle are tools that ensure the code quality while Findbugs looks for bugs in the code. There is a wide variety of continuous integration software which provide different features. Pricing plans might be for free if your project is open-sourced. Jenkins is a good option if you have a local server at your disposal, on the other hand Travis CI is also a recommended choice if you plan to use a cloud-based continuous integration service."

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 4 | Cobre build, signing, ProGuard, testes, CI — core do Android platform |
| **Qualidade** | 3 | Exemplos práticos de Gradle, mas CI desatualizado |
| **Atualidade** | 2 | Travis CI, sem AAB, sem GitHub Actions, sem device farm, sem keyless signing |
| **Ação** | 3 | Gera templates de signing, ProGuard, quality gates usáveis |
| **Completude** | 2 | Buracos grandes: CI moderno, observabilidade, security scanning, SBOM, feature flags |
| **TOTAL** | **14/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/trevor/extractions/android-best-practices.md`
- [x] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Template v1.0 — Atualize se precisar de campos extras para seu domínio.*