# TEMPLATE DE EXTRAÇÃO — Qualy (Testes & Qualidade)

## METADADOS
- **Repositório**: `project-guidelines`
- **Lead Responsável**: `qualy`
- **Funcionário (Subagente)**: `qualy`
- **Data**: `2026-10-08`
- **Tempo gasto**: `0h 30min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Guia de boas práticas para projetos JavaScript/Node (estrutura, git, docs, ambientes, deps, testes, code style, logging, API, acessibilidade, licensing). |
| **Público-alvo** | Desenvolvedores full‑stack, tech leads, QA engineers, architects que precisam de baseline de projeto. |
| **Tamanho** | ~1 k linhas de Markdown, 14 arquivos .md + 15 imagens. |
| **Linguagens/Tech** | Markdown (guidelines), referências a ESLint, Prettier, Jest/Vitest, Lighthouse, axe‑core, Storybook, Docker, nvm, Husky, lint‑staged. |
| **Freshness** | Último commit aparente 2023‑2024 (não há histórico git no snapshot). Issues/PRs não visíveis. Considerado **legacy‑ish** — boas práticas ainda válidas, mas faltam tópicos modernos (contract testing, test data, mutation, flaky management). |

---

## 2. O QUE PRESTA PARA **TESTING / QUALITY** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Test mode environment recommendation | `README.md:342-346` | Guideline | `agents/qualy/testing-strategy.md#test-env` | 🔴 Alta |
| Test file placement & naming (`*.test.js`/`*.spec.js` next to module) | `README.md:348-352` | Pattern | `agents/qualy/testing-strategy.md#file-organization` | 🔴 Alta |
| Additional test files in `__tests__` folder | `README.md:354-358` | Pattern | `agents/qualy/testing-strategy.md#extra-tests` | 🟠 Média |
| Write testable code – pure functions, avoid side‑effects | `README.md:360-366` | Guideline | `agents/qualy/testing-strategy.md#testable-code` | 🔴 Alta |
| Static type checker (Flow/TS) suggestion | `README.md:368-372` | Tool config | `agents/qualy/testing-strategy.md#type-check` | 🟠 Média |
| Run tests locally before PR (pre‑push) | `README.md:374-378` | Guideline | `agents/qualy/ci-gates.md#pre-push` | 🔴 Alta |
| Document tests in README | `README.md:380-384` | Checklist | `templates/qualy/test-documentation-checklist.md` | 🟠 Média |
| Accessibility audit baseline (Lighthouse/axe) | `README.md:873-876` | Guideline | `agents/qualy/accessibility.md#audit-baseline` | 🔴 Alta |
| a11y linter plugins per framework | `README.md:877-885` | Tool config | `agents/qualy/accessibility.md#linter-plugins` | 🔴 Alta |
| Integrate axe‑core in test suite | `README.md:887-889` | Pattern | `agents/qualy/accessibility.md#axe-in-tests` | 🔴 Alta |
| Storybook a11y testing recipe | `README.md:889-893` | Tutorial | `agents/qualy/accessibility.md#storybook-a11y` | 🟠 Média |
| Accessible design system recommendation (React Spectrum, Material) | `README.md:895-899` | Guideline | `agents/qualy/accessibility.md#design-system` | 🟢 Baixa |
| Basic a11y rules (links, lists, headings, contrast, alt text) | `README.md:902-933` | Checklist | `templates/qualy/a11y-basic-checklist.md` | 🔴 Alta |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Apenas menção a "static type checker" genérico (Flow) | `README.md:368-372` | Flow em desuso; TypeScript é padrão | Recomendar **TypeScript strict** + `tsc --noEmit` no CI |
| Nenhuma menção a **contract testing** (Pact) | — | Gap crítico para micro‑serviços | Adicionar seção Contract Testing no consolidated |
| Nenhuma menção a **test data management** (factories, synthetic data, anonymization) | — | Gap crítico | Criar guideline + template de factories |
| Nenhuma menção a **mutation testing** (Stryker) | — | Gap para qualidade de unit tests | Adicionar mutation testing gate |
| Nenhuma menção a **flaky test quarantine / dashboard** | — | Gap operacional | Criar runbook + dashboard spec |
| Nenhuma menção a **performance / load testing** (k6, Lighthouse CI) | — | Gap para regressão de perf | Adicionar seção Performance Baselines |
| Referência a `npm audit` apenas (linha 334) | `README.md:334` | Insuficiente para supply‑chain | `npm audit` + `snyk` + `dependabot` + `SBOM` |
| Sugestão de `husky` + `lint-staged` sem menção a **pre‑commit CI** (ex: GitHub Actions) | `README.md:545-549` | Prática antiga, CI moderno substitui | Manter hooks locais, mas exigir **CI gate** obrigatório |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para Qualy)

- [ ] **Test Pyramid / Honeycomb strategy** – definir camadas (unit, integration, contract, E2E) com metas de cobertura e tempo.  
- [ ] **Contract Testing** – consumer‑driven contracts (Pact) + provider verification no CI.  
- [ ] **Test Data Management** – factories (factory-bot / faker), synthetic data, PII anonymization, isolamento por execução (namespace/schema).  
- [ ] **Mutation Testing** – StrykerJS ≥ 60% mutation score em lógica de negócio.  
- [ ] **Flaky Test Management** – quarantine policy (48h fix or delete), dashboard (taxas, MTTR).  
- [ ] **Performance Baselines** – k6 scripts por PR, Lighthouse CI budgets, alertas de regressão.  
- [ ] **Accessibility CI Gate** – axe‑core + jest‑axe / playwright‑axe no pipeline, score mínimo AA.  
- [ ] **Quality Gates Consolidados** – lint, typecheck, unit, contract, integration, E2E, a11y, perf, security (SAST) em pipeline único.  
- [ ] **Observabilidade de Testes** – duração, flakiness rate, coverage trends, mutation score em dashboard (Grafana/Datadog).  
- [ ] **Runbooks** – falhas comuns de CI (flaky, timeout, DB migration), rollback de quality gate.

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Qualy)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: estratégia de testes (pirâmide/honeycomb), quality gates, test data, contract testing, mutation, flaky policy, perf baselines, a11y gate.  
- [ ] **Criar ADR**: `ADR-001 Test Strategy & Quality Gates` – decisão sobre ferramentas (Vitest, Playwright, Pact, k6, axe‑core, Stryker).  
- [ ] **Criar Template**: `templates/qualy/test-plan-template.md` (rastreabilidade requisito → testes).  
- [ ] **Criar Checklist**: `templates/qualy/a11y-basic-checklist.md` (baseado nas regras 10.2).  
- [ ] **Criar Checklist**: `templates/qualy/test-documentation-checklist.md` (README test section).  
- [ ] **Criar Runbook**: `runbooks/qualy/flaky-test-quarantine.md`.  
- [ ] **Criar Runbook**: `runbooks/qualy/performance-regression.md`.  
- [ ] **Criar Skill**: `skills/qualy-test-strategy` (prompt para novos repos).  
- [ ] **Novo agente necessário**: não – Qualy cobre; apenas expandir artifacts.

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES

> `README.md:342-346` – "Have a `test` mode environment if needed... you may not want to enable analytical information on a 'production' mode..."
> `README.md:348-352` – "Place your test files next to the tested modules using `*.test.js` or `*.spec.js` naming convention..."
> `README.md:360-366` – "Write testable code, avoid side effects, extract side effects, write pure functions..."
> `README.md:873-876` – "Arrange to do regular audits using lighthouse accessibility or the axe DevTools extension. Agree on a minimum score..."
> `README.md:887-889` – "Set up and use a11y testing using axe-core or similar."
> `README.md:902-933` – Basic accessibility rules (links, lists, headings, contrast, alt text).

---

## 7. SCORE DE VALOR DO REPO (Para Qualy)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 4 | Cobre testes básicos, acessibilidade, CI hooks – alinhado ao domínio. |
| **Qualidade** | 3 | Boas práticas gerais, mas exemplos práticos limitados (sem code snippets). |
| **Atualidade** | 2 | Ausência de tópicos modernos (contract, mutation, flaky, perf, test data). |
| **Ação** | 3 | Gera checklists e guidelines imediatas; gaps claros para criar artifacts. |
| **Completude** | 2 | Faltam camadas essenciais de qualidade contínua. |
| **TOTAL** | **14/25** | **Classificação**: "Extrair seletivo" (10‑17). Priorizar extração dos itens de testing/a11y e criar gaps como backlog. |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/qualy/extractions/project-guidelines.md`
- [ ] Notificar Lead Qualy (via Maestri ou mensagem) que a extração está pronta
- [ ] Mover para próximo repo na fila (se houver)

--- 

*Extração gerada automaticamente pelo subagente Qualy – template v1.0*