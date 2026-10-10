## METADADOS
- **Repositório**: android-best-practices
- **Lead Responsável**: guanabara
- **Funcionário (Subagente)**: guanabara (subagente)
- **Data**: 2026-10-08
- **Tempo gasto**: 0h 25min

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Coleção de boas práticas Android da Futurice — evitar reinventar a roda. |
| **Público-alvo** | Devs Android junior → sênior |
| **Tamanho** | 1 README.md (~555 linhas) + traduções em 8 idiomas |
| **Linguagens/Tech** | Markdown, Gradle Groovy, XML, Java |
| **Freshness** | Arquivado ~2018. Stack: Gradle, minSdk 21, Jackson/Gson/Moshi, OkHttp/Retrofit/Picasso/Glide, RxJava, Retrolambda, ProGuard, Stetho, LeakCanary, JUnit/Espresso/AssertJ-Android, Jenkins/Travis. Muito desatualizado (pré-Kotlin, pré-Compose, pré-Hilt). |

---

## 2. O QUE PRESTA PARA **GUANABARA** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Gradle como source of truth (não IDE) | `README.md:38-42` | Guideline | `agents/guanabara/onboarding/build-systems.md` | 🔴 Alta |
| Segredos em gradle.properties (não hardcode) | `README.md:56-95` | Code snippet + Analogy | `agents/guanabara/analogies/secrets-management.md` | 🔴 Alta |
| Dependências Maven estáticas vs dinâmicas | `README.md:97-106` | Guideline | `agents/guanabara/onboarding/build-systems.md` | 🔴 Alta |
| applicationIdSuffix para debug/release lado a lado | `README.md:108-129` | Pattern | `agents/guanabara/onboarding/build-variants.md` | 🟠 Média |
| Feature-based package structure | `README.md:182-194` | Pattern + Decision record | `agents/guanabara/onboarding/project-structure.md` | 🔴 Alta |
| Layout XMLs como código organizado | `README.md:196-231` | Guideline + Analogy | `agents/guanabara/onboarding/android-ui.md` | 🟠 Média |
| Estilos para evitar duplicação | `README.md:242-263` | Guideline + Analogy | `agents/guanabara/onboarding/android-styles.md` | 🟠 Média |
| Split de styles em múltiplos arquivos | `README.md:265-266` | Guideline | `agents/guanabara/onboarding/android-styles.md` | 🟢 Baixa |
| colors.xml como paleta | `README.md:268-316` | Pattern + Analogy | `agents/guanabara/onboarding/android-resources.md` | 🟠 Média |
| dimens.xml como paleta | `README.md:318-345` | Pattern | `agents/guanabara/onboarding/android-resources.md` | 🟠 Média |
| Strings com namespace | `README.md:347-375` | Guideline + Anti-pattern | `agents/guanabara/onboarding/android-i18n.md` | 🟠 Média |
| Evitar hierarquia profunda de views | `README.md:377-417` | Anti-pattern + Analogy | `agents/guanabara/anti-patterns/ui-hierarchy.md` | 🔴 Alta |
| WebView: evitar processamento client-side + leaks | `README.md:419-421` | Anti-pattern | `agents/guanabara/anti-patterns/webview.md` | 🟠 Média |
| JUnit vs Robolectric | `README.md:423-428` | Decision record | `agents/guanabara/tutorials/android-testing.md` | 🔴 Alta |
| Espresso + AssertJ-Android | `README.md:429-441` | Tutorial | `agents/guanabara/tutorials/android-testing.md` | 🟠 Média |
| ProGuard keep/keepnames + mapping.txt | `README.md:446-493` | Runbook | `agents/guanabara/runbooks/proguard.md` | 🔴 Alta |
| Stetho / LeakCanary só em debug | `README.md:522-531` | Checklist | `agents/guanabara/onboarding/debug-tools.md` | 🟠 Média |
| CI com Lint/Checkstyle/Findbugs | `README.md:532-539` | Checklist | `agents/guanabara/onboarding/ci-basics.md` | 🟢 Baixa |

**Tipos válidos**: Guideline, Template, Code snippet, Pattern, Anti-pattern, Tool config, Checklist, Runbook, Analogy, Tutorial, Decision record, Compliance mapping

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Guava = vilão por 65k methods | `README.md:171` | Multidex + R8 resolveram; minSdk 21+ nativo | AndroidX, Kotlin stdlib, R8 full-mode |
| Jackson como default JSON | `README.md:142` | Pesado para mobile; Moshi/kotlinx.serialization melhores | Moshi / kotlinx.serialization |
| Retrolambda para lambdas | `README.md:161-168` | Desugaring nativo desde AS 3.0 | D8/R8 desugaring + Java 8+ APIs |
| RxJava para tudo | `README.md:155-159` | Curva alta, vazamentos; coroutines/Flow padrão | Kotlin Coroutines + Flow |
| Schematic para ContentProvider | `README.md:514` | Abandonado; Room é padrão | Room + DataStore |
| SharedPreferences como default | `README.md:500` | Sem type-safety, bloqueante, sem criptografia | DataStore / EncryptedSharedPreferences |
| Stetho / Chuck | `README.md:522-526` | Arquivados | App Inspection (Studio), Chucker, Flipper |
| Jenkins/Travis como CI | `README.md:538-539` | Travis morto; Jenkins pesado p/ mobile | GitHub Actions + Gradle cache + Firebase Test Lab |
| minSdkVersion 21 como recomendação | `README.md:52` | De 2016; hoje minSdk 24-26 típico | Definir por analytics + Play vitals |
| Avoid Robolectric 100% | `README.md:427` | Robolectric 4+ + shadows maduros; útil p/ lógica Android leve | JUnit puro + Robolectric seletivo + Espresso |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para ensino/onboarding)

- [ ] Gap 1: **Kotlin-first** — Sugestão: criar trilha Kotlin (null-safety, coroutines, sealed classes) como pré-requisito
- [ ] Gap 2: **Jetpack Compose** — Sugestão: tutorial declarativo vs XML imperativo com analogia
- [ ] Gap 3: **Arquitetura moderna (MVVM/MVI + Clean + módulos)** — Sugestão: diagrama + exemplo feature completa testável
- [ ] Gap 4: **DI (Hilt)** — Sugestão: analogia tomada/plugue, scopes de Activity/Fragment/ViewModel
- [ ] Gap 5: **Segurança mobile (keystore, EncryptedPrefs, pinning, Play Integrity)** — Sugestão: runbook didático
- [ ] Gap 6: **Acessibilidade + Material 3 + dark mode** — Sugestão: checklist de UI review ensinável

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Guanabara)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: analogias de Gradle/secrets/paletas/hierarquia/JUnit-vs-Robolectric + learning path Android Jr→Sr
- [ ] **Criar ADR**: `ADR-secrets-gradle-properties` — Para: padronizar segredos fora do VCS
- [ ] **Criar Template**: `android-feature-skeleton` — Em: `_consolidado/templates/android/`
- [ ] **Criar Checklist**: `android-new-screen-review` — Em: `_consolidado/agents/guanabara/checklists/`
- [ ] **Criar Runbook**: `proguard-troubleshooting` — Em: `_consolidado/agents/guanabara/runbooks/`
- [ ] **Criar Skill**: `android-resources-palettes` — Em: `_consolidado/skills/android-resources-palettes/`
- [ ] **Criar Analogy/Tutorial**: `65k-method-limit` + `junit-vs-robolectric` + `view-hierarchy-flat` — Em: `agents/guanabara/{analogies|tutorials}/`
- [ ] **Novo agente necessário**: nenhum — cobrir com guanabara + cross (niamaia/qualy/tranquilao/trevor)

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES

> `README.md:42` — "It is important that your application's build process is defined by your Gradle files, rather than being reliant on IDE specific configurations."

> `README.md:46` — "unless you have a compelling reason to do otherwise, you should accept its default structure as this simplify your build scripts."

> `README.md:106` — "Avoid the use of dynamic dependency versions, such as `2.1.+` as this may result in different and unstable builds"

> `README.md:171` — "Beware of the dex method limitation, and avoid using many libraries... Especially avoid using the Guava library, since it contains over 13k methods."

> `README.md:180` — "Avoid putting too much code in Activities... Prefer single-fragment activities instead of plain activities"

> `README.md:184` — "We recommend using a *feature based* package structure for your code."

> `README.md:233` — "attributes `android:layout_****` should be defined in the layout XML, while other attributes `android:****` should stay in a style XML."

> `README.md:427` — "testing under Robolectric is inaccurate and incomplete as it works by providing mock implementations of the Android platform"

> `README.md:489` — "Early in your project, make and test release build to check whether ProGuard rules are correctly retaining your dependencies."

> `README.md:491` — "Save the `mapping.txt` file for every release that you publish"

---

## 7. SCORE DE VALOR DO REPO (Para ensino/onboarding)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 4 | Altamente ensinável: build, recursos, arquitetura, testes — base de onboarding mobile |
| **Qualidade** | 4 | Didático, com do/don't em código, decisões justificadas, analogias implícitas fortes |
| **Atualidade** | 2 | Arquivado 2018; stack pré-Kotlin/Compose/Room/Hilt; exige camada de modernização |
| **Ação** | 4 | Gera checklists/runbooks/skills/ADRs imediatos (secrets, paletas, ProGuard, testes) |
| **Completude** | 3 | Bom em fundamentos, buracos em Kotlin, Compose, DI, segurança moderna, a11y |
| **TOTAL** | **17/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa" → **Extrair seletivo (topo da faixa), com modernização obrigatória**

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/guanabara/extractions/android-best-practices.md`
- [x] Avisar seu Lead (gerente) que a extração está pronta
- [x] Mover para próximo repo na fila (`ios-good-practices`)

---

### Apêndice didático (para o Lead reaproveitar)

**Conceitos ensináveis + analogias:**
- Gradle source of truth → receita no caderno, não na cabeça
- gradle.properties → cofre separado da planta da casa
- 65k limit/Guava → caminhão pequeno + elefante
- Feature packages → gavetas por utensílio, não por material
- Estilos/paletas → molde de corte + cartela de tintas
- Hierarquia profunda → torre de cartas (StackOverflow)
- Robolectric → simulador que ignora buracos
- ProGuard keep → lista de peças que não podem ser renomeadas na fábrica

**Learning path Jr→Mid→Sr:** Jr (Gradle básico, resources, estilos, 1º Fragment, JUnit simples, Logcat) → Mid (variants/signing, MVVM, Navigation, RecyclerView, Espresso, Hierarchy Viewer, Stetho/LeakCanary, GH Actions) → Sr (plugins Gradle, Clean/modularização, startup/perf, testes contrato, Kotlin idiomático, pinning/Integrity, mentoria/reviews)

*Template v1.0 — Guanabara lens: conceitos, analogias, onboarding, ADRs didáticos.*