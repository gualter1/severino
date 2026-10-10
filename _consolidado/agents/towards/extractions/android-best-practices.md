# METADADOS
- **Repositório**: `android-best-practices`
- **Lead Responsável**: `towards`
- **Funcionário (Subagente)**: `Towards`
- **Data**: `2026-10-08`
- **Tempo gasto**: `0h 35min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Best practices in Android development — Futurice guidelines for architecture, libraries, debugging |
| **Público-alvo** | Android engineers |
| **Tamanho** | Single comprehensive README.md |
| **Linguagens/Tech** | Markdown, Android/Gradle, Java, Kotlin notes |
| **Freshness** | Futurice opinionated — mostly still relevant for modularization concepts |

---

## 2. O QUE PRESTA PARA **FEATURES COMPLEXAS, REFACTORING, DEBUGGING**

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Feature-based package structure (vs layer-based) | `README.md:184-195` | Guideline | `agents/towards/architecture/feature-based-structure-android.md` | 🔴 Alta |
| Encapsulation & Easy Feature Removal by Modular packages | `README.md:186-195` | Pattern | `agents/towards/architecture/feature-encapsulation.md` | 🔴 Alta |
| Transition to module-based build (better build times & Instant Apps) | `README.md:190-192` | Pattern | `agents/towards/build/modularization-build-times.md` | 🟠 Média |
| Stetho (Debug Bridge) / LeakCanary (Memory Leaks) | `README.md:522-531` | Tool config | `agents/towards/debugging/android-debug-toolkit.md` | 🟠 Média |
| Activities as lightweight containers + Fragments for UI composition | `README.md:174-181` | Pattern | `agents/towards/architecture/activity-fragment-decoupling.md` | 🟢 Baixa |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Jackson/Gson recommendations | `README.md:142-148` | Pre-Kotlin serialization | Moshi / Kotlinx Serialization |
| Guava / 65k method limit discussion | `README.md:171-172` | Outdated post-Multidex | R8 / AndroidX multidex default |
| Retrolambda | `README.md:162-168` | Pre-official Java8 support | Desugar + Kotlin |
| Robolectric discouraged | `README.md:427-428` | Opinion too strict | Modern Robolectric 4.x is viable |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA

- [ ] Gap 1: Compose / Jetpack Compose migration patterns — Sugestão: Criar guia Strangler Fig XML → Compose
- [ ] Gap 2: Kotlin Coroutines/Flow vs RxJava for feature refactoring — Sugestão: Migration checklist RxJava → Coroutines
- [ ] Gap 3: CI/CD for modular features with Gradle Build Cache — Sugestão: Adicionar template de CI para builds incrementais

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD

- [ ] **Criar Pattern**: Feature-based package structure → feature flags → dynamic feature modules (playbook)
- [ ] **Criar ADR**: `ADR-xxx: Feature-based packaging as default for all new features`
- [ ] **Criar Checklist**: `Debug toolkit setup per app (LeakCanary moderna, Stetho substituto = Flipper)`
- [ ] **Criar/Atualizar CONSOLIDATED.md** com: Feature encapsulation principles and modular build migration path

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES

> `README.md:192 — "Simplifies the transition to module based build structure (better build times and Instant Apps support)"` — Feature packaging as migration enabler.

> `README.md:184-195 — "Feature based package structure... Clearer feature dependency and interface boundaries. Promotes encapsulation. Easier to understand the components that define the feature."` — Core principle for complex feature isolation.

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Feature isolation is core to complex features |
| **Qualidade** | 4 | Concise rationale, good structure advice |
| **Atualidade** | 2 | Many library/tools outdated, Compose missing |
| **Ação** | 4 | Directly generates feature-structure templates |
| **Completude** | 3 | Covers structure+debugging, misses modern stack |
| **TOTAL** | **18/25** | => Extrair seletivo + complementar |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/towards/extractions/android-best-practices.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Template v1.0 — Towards domain: features complexas, refactoring, debugging*
