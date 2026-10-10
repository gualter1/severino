# QUALY — CONSOLIDATED (Testing / Quality Gates / Test Data / Automation)

**Lead**: Qualy | **Última atualização**: 2026-10-09 (Batch 2 Wave 3 — 9 repos)
**Status**: ✅ Aprovado pelo Gerente — Fonte da verdade do domínio

---

## 1. SCOREBOARD BATCH 1

| Repo | Score /25 | Veredito | Top Contribuição |
|------|-----------|----------|------------------|
| `javascript-testing-best-practices` | **24** | ✅ Priorizar extração completa | Golden Rule, AAA pattern, Component testing, Mutation testing (Stryker), Test Data isolation |
| `nodebestpractices` | **23** | ✅ Priorizar extração completa | Testing architecture, Error flow testing, Async/await testing, Integration test strategy |
| `awesome-llm-apps` | **21** | ✅ Priorizar extração completa | LLM agent eval harnesses, JSON data contracts, Deterministic prompt unit tests |
| `dify` | **22** | ✅ Priorizar extração completa | pytest configuration & mocks, API testing standards, Contract verification patterns |
| `claude-code-best-practice` | **21** | ✅ Priorizar extração completa | Test-time compute verification loops, agent validation skills, context denoising |
| `project-guidelines` | **14** | ⚠️ Extrair seletivo | Co-located unit tests (`.spec.js`), lint-staged quality hooks, CI gate standards |
| `ios-good-practices` | **14** | ⚠️ Extrair seletivo | Warning-as-errors (`-Wall -Wextra`), Clang Static Analyzer deep checks, Crash reporting |
| `android-best-practices` | **13** | ⚠️ Extrair seletivo | JUnit vs Robolectric guidelines, Espresso UI testing, ProGuard release verification |

### 1b. SCOREBOARD BATCH 2 WAVE 3 [NOVO]

| Repo | Score /25 | Veredito | Top Contribuição |
|------|-----------|----------|------------------|
| `python-guide` | **12** | ⚠️ Extrair seletivo | 10 regras gerais de teste + Hypothesis property-based (único 🔴); resto legado Py2/pytest-2/Travis — modernizar em `python-testing.md` |

**Métricas atualizadas**: 9 repos (8 Batch 1 + 1 Wave 3) | Score médio Batch 1: 19.0 | Score médio geral: 18.2 | Seletivos: 4/9

---

## 2. ESTRATÉGIA DE TESTES CONSOLIDADA (Extrair para Templates/Checklists/Runbooks)

### 2.1 Test Architecture & Pyramid
- **Unit Tests**: Co-located (`*.spec.test.js`), isolated, pure functions, AAA pattern (Arrange, Act, Assert).
- **Component / Integration Tests**: Supertest / Pact / Testcontainers para isolar serviços sem mocks frágeis.
- **E2E / UI Tests**: Playwright / Cypress (Web), Espresso (Android), XCUITest (iOS).
- **LLM / AI Evals**: Test-time compute evaluation, deterministic assertions on structured outputs (JSON schemas).

### 2.1b Python Testing Ecosystem Moderno [NOVO — Wave 3: python-guide]
> Origem: `extractions/python-guide.md` (12/25 seletivo). Repo legado (Py2.6/2.7, pytest-2.2.1, Travis-CI.org, Jenkins) — **não copiar literal**; usar por contraste.
- **O que aproveitar**:
  - 10 regras gerais de teste (`tests.rst:15-76`): independência total, fresh dataset por teste, setUp/tearDown, fast tests + heavy suite separada (scheduled), single-test run, full suite pre/post session, pre-push hook, broken-test-as-bookmark, bug-catching test first → `agents/qualy/test-principles.md` (🟠 Média).
  - pytest no-boilerplate (assert puro, output verboso) (🟠 Média).
  - **Hypothesis property-based testing** (🔴 Alta — único item alta prioridade): parameterized examples, minimal falsifying example, integra com pytest → pattern canônico em `python-testing.md`.
  - tox multi-env matrix como front-end p/ CI (🟠 Média) → modernizar para `tox`/`nox` + GHA matrix.
  - CI definition Fowler/Beck + pre-push/full-suite discipline (🟢 Baixa) → `quality-gates.md`.
- **O que descartar (lixo EOL)**: `py.test` CLI (removido pytest≥8), Travis-CI.org + matriz Py2.6-3.3, Jenkins/Buildbot "Use it", `pip install mock` (stdlib `unittest.mock` desde Py3.3).
- **Ação principal**: criar `agents/qualy/python-testing.md` moderno (pytest 8 + `pytest-cov/xdist` + hypothesis + factory-boy/Faker + testcontainers-python + schemathesis + mutmut + tox/nox + GHA matrix 3.10-3.13), substituindo guias obsoletos.

### 2.2 Quality Gates (CI/CD)
| Gate | Threshold | Ferramenta | Destino |
|------|-----------|------------|--------|
| **Line/Branch Coverage** | ≥ 80% lines / ≥ 70% branches | Vitest / Jest / Pytest | `checklists/quality-gates.md` |
| **Mutation Score** | ≥ 80% em paths críticos (auth, crypto) | Stryker / MutPy | `checklists/quality-gates.md` |
| **Compiler / Linter Warnings** | 0 warnings (treated as errors) | SwiftLint / ESLint / Clang | `checklists/quality-gates.md` |
| **Dependency Audit** | 0 High/Critical | Snyk / OSV / npm audit | `checklists/supply-chain.md` |
| **Contract Verification** | 0 contract drift | Pact / JSON Schema validation | `checklists/api-contract-gate.md` |

#### 2.2b Quality Gates Python [NOVO — Wave 3: python-guide, ADR-008/016/018]
| Gate Python | Threshold | Ferramenta moderna |
|-------------|-----------|--------------------|
| Lint + Format | 0 warnings (warnings-as-errors) | `ruff check+format` |
| Typecheck | strict, 0 errors | `mypy --strict` |
| SAST | 0 High | `bandit` |
| Deps audit | 0 High/Critical | `safety` / `pip-audit` |
| Coverage | `--fail-under=80` (80/70 ADR-008) | `pytest --cov` + `pytest-cov` |
| Mutation | ≥ 60% em lógica crítica | `mutmut` / `cosmic-ray` |
| Contract fuzz | 0 schema violations | `schemathesis` (OpenAPI) + `pact-python` |
| Parallel/Flaky | xdist + reruns + quarantine | `pytest-xdist`, `pytest-rerunfailures` |
> Destino: estender `checklists/quality-gates.md` com gate Python (reforça ADR-008 Coverage 80/70 + Mutation, ADR-016 SAST/DAST, ADR-018 Warnings-as-Errors). Cross-ref: Kaspersky (bandit/safety), Trevor (GHA).

---

## 3. GAPS CRÍTICOS (Backlog do Qualy)
1. **Contract Testing Formal** (Pact entre API e Web/Mobile)
2. **AI Agent Evals CI Gate** (Validar alucinação e drift de prompts no PR)
3. **Flakiness Management Dashboard** (Quarentena automática de testes instáveis)
4. **Accessibility (a11y) Automated Tests** (axe-core em Playwright / XCUITest)
5. **Mutation Testing Standard** (Adotar Stryker/MutPy em todos os serviços core)
6. **[NOVO — Wave 3] Python Test Data Isolation** — `pytest fixtures (scope=function)` + `factory-boy` + `Faker` + `testcontainers-python` (Postgres/Redis); regra "Mock externo, não interno" (`unittest.mock` só p/ fronteira externa). Origem: ausência total em python-guide.
7. **[NOVO — Wave 3] Python Contract + Mutation + Property triad** — `hypothesis` profiles CI + `mutmut` ≥60% + `schemathesis` fuzzing OpenAPI + `pact-python`; expandir o único acerto 🔴 do python-guide.
8. **[NOVO — Wave 3] Python Flakiness & CI strategy** — `pytest-xdist` parallel, `--reruns`/quarantine, shift-left (lint→unit→contract no PR, E2E no merge); cobrir em `checklists/quality-gates.md`.

---

## 4. ADRs PROPOSTAS (para cross-cutting)
- **ADR-016**: Test Coverage Gate 80/70 + Mutation Testing em paths críticos (com Tranquilão + Kaspersky)
- **ADR-017**: LLM Output Contract Testing via JSON Schema / Pydantic (com Towards + Kaspersky)
- **ADR-018**: Warnings-as-Errors em todas as plataformas (Mobile, Web, Backend)
- **[NOVO — Wave 3] ADR-008 reforço Python**: `pytest --cov-fail-under=80` + `mutmut` ≥60% + `ruff` 0 warnings + `mypy --strict` como gate Python canônico (com Kaspersky p/ bandit/safety, Trevor p/ GHA matrix). Sem nova ADR — instancia ADR-008/016/018 para Python em `python-testing.md`.
- **[NOVO — Wave 3] Cross-ref Niamaia**: architecture em python-guide (packaging/layout) fica com Niamaia; Qualy consome só tests.rst + ci.rst.

---

## 5. WAVE 3 DELTA — python-guide (2026-10-09) [NOVO]
- **Score**: 12/25 seletivo (Relevância 3, Qualidade 3, Atualidade 1, Ação 2, Completude 3).
- **Citaçõesâncora**: "Each test unit must be fully independent..." (`tests.rst:20-24`); "Try hard to make tests that run fast..." (`tests.rst:26-32`); "first step... write a new test pinpointing the bug" (`tests.rst:50-52`); "Hypothesis... find more bugs with less work" (`tests.rst:204-206`); "tox is an automation tool..." (`ci.rst:47-50`).
- **Templates/Checklists afetados**: criar `agents/qualy/python-testing.md`; estender `checklists/quality-gates.md` (gate Python); `agents/qualy/test-principles.md` (10 regras).
- **Novo agente necessário**: nenhum.

---

*CONSOLIDATED v1.1 (Batch 1 + Wave 3 python-guide) — Qualy*
