## METADADOS
- **Repositório**: android-best-practices
- **Lead Responsável**: Qualy
- **Funcionário (Subagente)**: Qualy
- **Data**: 2026-10-08
- **Tempo gasto**: 0h 45min

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Guia de boas práticas para desenvolvimento Android, baseado na experiência da Futurice. |
| **Público-alvo** | Desenvolvedores Android. |
| **Tamanho** | 1 README.md principal + traduções. |
| **Linguagens/Tech** | Android, Java, Kotlin, Gradle. |
| **Freshness** | Documento antigo, focado em conceitos fundamentais (ex: 65k method limit, JUnit 4, etc). |

---

## 2. O QUE PRESTA PARA **QUALY**

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Uso de JUnit/Espresso/AssertJ | `README.md:23` | Guideline | `agents/qualy/testing/android.md` | 🔴 Alta |
| ProGuard como gate de release | `README.md:24, 448-494` | Guideline | `agents/qualy/ci/quality-gates.md` | 🟠 Média |
| CI p/ build, teste, análise | `README.md:28, 532-538` | Guideline | `agents/qualy/ci/pipelines.md` | 🟠 Média |
| Stetho p/ debugging | `README.md:26, 523-527` | Tool config | `agents/qualy/tools/debug.md` | 🟢 Baixa |
| LeakCanary p/ memory leaks | `README.md:27, 528-530` | Tool config | `agents/qualy/tools/monitoring.md` | 🟠 Média |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno |
|------|-------------|--------|--------------------|
| Robolectric recommendation | `README.md:427` | Inaccurado e obsoleto. | Testes de integração no dispositivo (Testcontainers/Espresso). |
| JUnit (versão implícita) | `README.md:425` | Documento sugere versão antiga. | JUnit 5 + MockK. |
| "Avoid Guava" | `README.md:171` | Contexto de 65k métodos já superado (multidex). | Use o que precisar, gerencie build. |

---

## 4. GAPS — O QUE O REPO NÃO COBRE

- [ ] Falta estratégia de **Contract Testing** (pact) para Android.
- [ ] Falta automação visual de UI (Snapshot testing).
- [ ] Falta menção a **Test Data Management** (in-app seeding, hermetic data).
- [ ] Falta abordagem de **Accessibility testing** (Lint/Espresso).

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Qualy)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: "Guidelines básicas de QA para Android baseadas no repositório Futurice, com ênfase em substituição de ferramentas legadas por modernas (ex: Robolectric por MockK/Testcontainers)."
- [ ] **Criar Checklists**: "Checklist de Release de Testes Android" (ProGuard, LeakCanary, CI integration).

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES

> `README.md:427`: "testing under Robolectric is inaccurate and incomplete as it works by providing mock implementations of the Android platform, which provides no guarantees of correctness."

---

## 7. SCORE DE VALOR DO REPO

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 3 | Bons fundamentos, mas precisa de modernização. |
| **Qualidade** | 3 | Direto, mas limitado pela idade. |
| **Atualidade** | 2 | Muito focado em práticas pré-Kotlin/Modern Android. |
| **Ação** | 3 | Útil para checklists básicos. |
| **Completude** | 2 | Ouve apenas o básico de teste. |
| **TOTAL** | **13/25** | "Extrair seletivo" |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO
- [x] Salvar arquivo em `_consolidado/agents/qualy/extractions/android-best-practices.md`.
- [ ] Avisar Lead.
