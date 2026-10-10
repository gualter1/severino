# TEMPLATE DE EXTRAÇÃO — Para Funcionários (Subagentes)

**Use este template para cada repositório que analisar.**
Salve em: `_consolidado/agents/{seu_lead}/extractions/{nome-do-repo}.md`

---

## METADADOS
- **Repositório**: `android-best-practices`
- **Lead Responsável**: `niamaia`
- **Funcionário (Subagente)**: `niamaia`
- **Data**: `2026-10-08`
- **Tempo gasto**: `45min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Best practices in Android development — lições aprendidas de desenvolvedores da Futurice. Guia vivo para evitar reinventar a roda. |
| **Público-alvo** | Android developers (iniciantes a sêniores), architects, tech leads |
| **Tamanho** | 1 arquivo principal (README.md ~550 linhas), LICENSE |
| **Linguagens/Tech** | Markdown, Groovy (Gradle snippets), Java, XML |
| **Freshness** | Referência clássica (Futurice), último update não explícito no README. Práticas baseadas em Android SDK 21+ (Lollipop). Alguns itens legados (ex: Retrolambda deprecated desde AS 3.0). |

---

## 2. O QUE PRESTA PARA **NIAMAIA** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Feature-based package structure recommendation | `README.md:182-195` | Pattern | `agents/niamaia/architecture-patterns.md` | 🔴 Alta |
| 3-layer reasoning: Activities as controllers, Fragments as UI pieces | `README.md:173-181` | Pattern | `agents/niamaia/architecture-patterns.md` | 🔴 Alta |
| Dependency injection via constructor (pass ViewModel to Activity) | `README.md:302-310` | Pattern | `agents/niamaia/di-patterns.md` | 🟠 Média |
| Gradle default project structure as standard | `README.md:44-47` | Decision record | `agents/niamaia/tech-stack-decisions.md` | 🟠 Média |
| OkHttp + Retrofit + Picasso/Glide stack justification | `README.md:148-154` | Decision record | `agents/niamaia/tech-stack-decisions.md` | 🟠 Média |
| RxJava cautionary guidance (steep learning curve, document tricky parts) | `README.md:155-159` | Anti-pattern / Trade-off | `agents/niamaia/tech-stack-decisions.md` | 🟠 Média |
| 65k method limit mitigation: avoid Guava, use dex-method-counts tool | `README.md:170-172` | Constraint / Trade-off | `agents/niamaia/scalability-limits.md` | 🔴 Alta |
| ProGuard/DexGuard config with keep rules | `README.md:446-493` | Template | `templates/android/proguard-rules.pro` | 🟠 Média |
| Stetho debug bridge (network, SQLite, SharedPrefs inspection) | `README.md:522-526` | Tool config | `agents/niamaia/observability.md` | 🟢 Baixa |
| LeakCanary for memory leak detection (noop in release) | `README.md:528-530` | Tool config | `agents/niamaia/observability.md` | 🟢 Baixa |
| ContentProvider over ORM for process-safe data access | `README.md:510-521` | Decision record | `agents/niamaia/tech-stack-decisions.md` | 🟠 Média |
| Feature-flag via buildTypes (debug/release applicationIdSuffix) | `README.md:108-126` | Pattern | `agents/niamaia/feature-flags.md` | 🟢 Baixa |
| Vector drawables (PDF) in asset catalogs for auto bitmap generation | `README.md:352-356` | Pattern | `agents/niamaia/asset-management.md` | 🟢 Baixa |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Retrolambda recommendation | `README.md:161-168` | Deprecated desde Android Studio 3.0 (Java 8 nativo) | Java 8+ lambdas nativas, desugar |
| Robolectric avoidance | `README.md:427-428` | Ainda válido para unit tests JVM-only, mas Robolectric evoluiu (Shadow APIs melhoradas) | Robolectric 4+ para testes de integração leves; JUnit + Espresso para UI |
| Guava avoidance (13k methods) | `README.md:171` | Ainda válido para 65k limit, mas multidex nativo API 21+ resolve | Multidex nativo + R8 shrinking; Guava ok se modularizado |
| Jackson vs Gson vs Moshi — sem veredito claro | `README.md:142-146` | Moshi é recomendação moderna para Kotlin | Moshi + Kotlin serialization |
| CocoaPods reference (cross-link to iOS repo) | `README.md:3` | Fora de escopo Android | N/A |
| Travis CI recommendation | `README.md:538` | Travis CI declinou; GitHub Actions é padrão | GitHub Actions, Bitrise, CircleCI |
| FindBugs | `README.md:535` | Descontinuado (SpotBugs é fork ativo) | SpotBugs, Error Prone |
| `android-test` artifact reference implícita | - | Antigo | AndroidX Test, JUnit 5 |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para arquitetura)

- [ ] **Modularização multi-module / Dynamic Delivery** — Feature modules, dynamic feature modules, instant apps. O repo menciona "simplifies transition to module based build structure" (linha 192) mas não detalha.
- [ ] **Clean Architecture / MVVM com Jetpack** — ViewModel, LiveData/Flow, Repository pattern, UseCases. O repo discute Activities/Fragments mas não ViewModel.
- [ ] **Navigation Component / Deep linking** — Single-activity architecture, navigation graph.
- [ ] **Hilt / Koin DI frameworks** — DI manual via constructor é mostrado, mas frameworks modernos não cobertos.
- [ ] **Coroutines / Flow vs RxJava** — RxJava discutido mas coroutines/Flow não.
- [ ] **Compose (UI declarativo)** — XML-only, Compose não existe na época.
- [ ] **Modularização por feature vs layer** — Package structure feature-based recomendado mas boundaries de módulo Gradle não detalhados.
- [ ] **Test architecture: Pyramid vs Trophy** — Apenas frameworks citados, não estratégia.
- [ ] **CI/CD pipeline moderno** — Apenas menção genérica a Jenkins/Travis.
- [ ] **Security: Certificate pinning, Network Security Config** — Apenas Stetho/LeakCanary.
- [ ] **App Startup / Baseline Profiles / Startup tracing** — Performance moderna não coberta.
- [ ] **Observabilidade: Structured logging, Metrics, Tracing** — Apenas debug tools.

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: Feature-based package structure como padrão Android; 65k method limit mitigation estratégias; Stack OkHttp/Retrofit/Moshi como baseline.
- [ ] **Criar ADR**: `ADR-001: Android Modularization Strategy` — Para: Decidir multi-module vs monolith, dynamic delivery, feature flags.
- [ ] **Criar ADR**: `ADR-002: Android Architecture Pattern` — Para: MVVM + Clean + Jetpack vs legacy MVC/MVP.
- [ ] **Criar Template**: `proguard-rules.pro` — Em: `templates/android/`
- [ ] **Criar Checklist**: `android-architecture-review.md` — Em: `agents/niamaia/checklists/`
- [ ] **Criar Skill**: `android-arch-review` — Em: `_consolidado/skills/android-arch-review/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES

> `README.md:184-192` — "We recommend using a *feature based* package structure for your code. This has the following benefits: Clearer feature dependency and interface boundaries. Promotes encapsulation. Easier to understand the components that define the feature. Reduces risk of unknowingly modifying unrelated or shared code. Simpler navigation: most related classes will be in the one package. Easier to remove a feature. Simplifies the transition to module based build structure (better build times and Instant Apps support)"

> `README.md:175-181` — "Because of Android API's history, you can loosely consider Fragments as UI pieces of a screen... Activities can be loosely considered to be controllers... We suggest you sail carefully, making informed decisions since there are drawbacks for choosing a fragments-only architecture, or activities-only, or views-only."

> `README.md:170-172` — "Beware of the dex method limitation, and avoid using many libraries. Android apps, when packaged as a dex file, have a hard limitation of 65536 referenced methods. Especially avoid using the Guava library, since it contains over 13k methods."

> `README.md:302-310` — "Use dependency injection, i.e. pass any required objects in as parameters, instead of keeping all state around in singletons. The latter is okay only if the state _really_ is global."

---

## 7. SCORE DE VALOR DO REPO (Para arquitetura)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 4 | Diretamente alinhado: patterns, modularização, DI, stack decisions |
| **Qualidade** | 4 | Exemplos práticos, trade-offs explícitos, código real |
| **Atualidade** | 2 | Legado (pre-Jetpack, pre-Compose, pre-Coroutines). Base histórica valiosa mas precisa modernização. |
| **Ação** | 3 | Gera templates/checklists usáveis mas precisa adaptação para stack atual |
| **Completude** | 3 | Cobre build, libs, UI, test, storage, CI — mas gaps grandes em arquitetura moderna |
| **TOTAL** | **16/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"
> **Classificação**: **Extrair seletivo** — Base histórica excelente, requer layer de modernização (Jetpack, Compose, Coroutines, Modularização multi-module).

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/niamaia/extractions/android-best-practices.md`
- [x] Avisar Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila: `ios-good-practices`