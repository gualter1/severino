# EXTRAÇÃO — python-guide (Qualy)

## METADADOS
- **Repositório**: `python-guide`
- **Lead Responsável**: `qualy`
- **Funcionário (Subagente)**: `qualy`
- **Data**: `2026-10-09`
- **Tempo gasto**: `0h 20min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Hitchhiker's Guide to Python — handbook opinionado de best practices (instalação, config, uso diário) |
| **Público-alvo** | Devs Python novice→expert, generalistas |
| **Tamanho** | ~100 arquivos, maioria `.rst` docs + fotos; 2 arquivos relevantes p/ Qualy: `docs/writing/tests.rst` (~300 linhas), `docs/scenarios/ci.rst` (~96 linhas) |
| **Linguagens/Tech** | reStructuredText (Sphinx), Python 2.x-era examples, tox/pytest/unittest/mock/hypothesis |
| **Freshness** | **Legado / desatualizado** — exemplos citam Python 2.6/2.7/3.2/3.3, pytest-2.2.1, Travis-CI.org, Jenkins/Buildbot; último conteúdo relevante da era pre-pytest-7. Arquivar como referência histórica. |

---

## 2. O QUE PRESTA PARA **QUALY** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| General rules of testing (10 regras: independência, fresh dataset, setUp/tearDown, fast tests, heavy suite separada, single-test run, full suite pre/post session, pre-push hook, broken-test-as-bookmark, bug-catching test first) | `docs/writing/tests.rst:15-76` | Guideline | `agents/qualy/test-principles.md` | 🟠 Média |
| unittest batteries-included + TestCase pattern | `docs/writing/tests.rst:84-106` | Pattern | `agents/qualy/python-testing.md` | 🟢 Baixa |
| Doctest como documentação executável (main use cases, roda na full suite) | `docs/writing/tests.rst:109-143` | Guideline | `agents/qualy/python-testing.md` | 🟢 Baixa |
| pytest no-boilerplate (assert puro, output verboso) | `docs/writing/tests.rst:151-198` | Guideline | `agents/qualy/python-testing.md` | 🟠 Média |
| Hypothesis property-based testing (parameterized examples, minimal falsifying example, integra com pytest) | `docs/writing/tests.rst:201-232` | Pattern | `agents/qualy/python-testing.md` | 🔴 Alta |
| tox multi-env matrix (virtualenv management, front-end p/ CI) | `docs/writing/tests.rst:235-248` + `docs/scenarios/ci.rst:43-58` | Tool config | `agents/qualy/python-testing.md` | 🟠 Média |
| unittest.mock + patch decorator (mock externo, assert_called_with) | `docs/writing/tests.rst:251-299` | Code snippet | `agents/qualy/python-testing.md` | 🟢 Baixa |
| CI definition (Fowler/Beck) + pre-push/full-suite discipline | `docs/scenarios/ci.rst:12-26` + `docs/writing/tests.rst:38-43` | Guideline | `agents/qualy/quality-gates.md` | 🟢 Baixa |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| `py.test` CLI + pytest-2.2.1 / Python 2.7.1 | `docs/writing/tests.rst:173-198` | CLI `py.test` removido (pytest>=8); versão de 2012 | `pytest` (v8+), `pytest -x -q`, plugins `pytest-cov/xdist` |
| Travis-CI.org + `.travis.yml` python 2.6/2.7/3.2/3.3 | `docs/scenarios/ci.rst:61-96` | Travis-CI.org desligado (2021); matriz Py2 EOL | GitHub Actions `setup-python` matrix (3.10-3.13) + `tox` ou `nox` |
| Jenkins/Buildbot como recomendação default ("Use it") | `docs/scenarios/ci.rst:28-41` | Sem pipeline-as-code, sem exemplo | GHA / GitLab CI com quality gates (ruff, mypy, pytest-cov) |
| `pip install mock` para Py<3.3 | `docs/writing/tests.rst:258-262` | `mock` standalone obsoleto | `unittest.mock` stdlib (Py3) |
| Ausência total de coverage/mutation/lint gates | `docs/writing/tests.rst` + `docs/scenarios/ci.rst` (todo) | Viola ADR-008 (80/70 + mutation) | pytest-cov `--fail-under=80`, mutmut/cosmic-ray, ruff+mypy+bandit |
| Sem fixtures/factories, testcontainers, contract testing | `docs/writing/tests.rst` (todo) | Test data não isolada; sem Pact/Schemathesis | pytest fixtures + factory-boy/Faker + testcontainers-python + schemathesis |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] Gap 1: **Quality gates modernos Python** — Sugestão: criar `agents/qualy/python-testing.md` com `ruff check+format`, `mypy --strict`, `bandit`, `safety/pip-audit`, `pytest --cov-fail-under=80` (ADR-008/016/018)
- [ ] Gap 2: **Fixtures & test data isolation** — Sugestão: documentar `pytest fixtures (scope=function)`, `factory-boy`, `Faker`, `testcontainers-python` (Postgres/Redis) — regra Qualy "Mock externo, não interno"
- [ ] Gap 3: **Property-based + mutation + contract** — Sugestão: expandir o acerto do Hypothesis (único item 🔴) com `hypothesis` profiles CI, `mutmut` score ≥60% em lógica crítica, `schemathesis` fuzzing OpenAPI + `pact-python`
- [ ] Gap 4: **Flakiness & CI strategy** — Sugestão: nada sobre quarantine/retry/parallel (`pytest-xdist`, `--reruns`), shift-left (lint→unit→contract no PR, E2E no merge) — cobrir em `checklists/quality-gates.md`

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: Scoreboard Batch 2 (`python-guide` 12/25 seletivo) + link para `python-testing.md`; reforçar Hypothesis como pattern property-based canônico
- [ ] **Criar Template**: `python-testing.md` — Em: `_consolidado/agents/qualy/` (pytest8 + cov + xdist + hypothesis + factory-boy + testcontainers + schemathesis + mutmut + tox/nox + GHA matrix)
- [ ] **Criar Checklist**: estender `checklists/quality-gates.md` com gate Python (ruff 0 warnings + mypy strict + bandit + cov 80/70 + mutation 60%)
- [ ] **Novo agente necessário**: nenhum — escopo coberto por Qualy (+ Kaspersky p/ bandit/safety, Trevor p/ GHA)

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `docs/writing/tests.rst:20-24` — "Each test unit must be fully independent. Each test must be able to run alone, and also within the test suite, regardless of the order that they are called."

> `docs/writing/tests.rst:26-32` — "Try hard to make tests that run fast... Keep these heavier tests in a separate test suite that is run by some scheduled task."

> `docs/writing/tests.rst:50-52` — "The first step when you are debugging your code is to write a new test pinpointing the bug."

> `docs/writing/tests.rst:154` — "py.test is a no-boilerplate alternative to Python's standard unittest module."

> `docs/writing/tests.rst:204-206` — "Hypothesis is a library which lets you write tests that are parameterized by a source of examples... find more bugs with less work."

> `docs/scenarios/ci.rst:47-50` — "tox is an automation tool providing packaging, testing, and deployment of Python software right from the console or CI server."

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 3 | Só 2 arquivos tangem Qualy (tests + CI); resto é install/packaging/docs |
| **Qualidade** | 3 | As 10 regras gerais + Hypothesis são boas; resto superficial, sem exemplos CI reais |
| **Atualidade** | 1 | Era Python 2 / pytest-2.2 / Travis.org / Jenkins — tudo EOL; perigoso se copiado literal |
| **Ação** | 2 | Gera 1 template (python-testing.md) por contraste/complemento, não por reuso direto |
| **Completude** | 3 | Cobre unit→property→mock→tox→CI em breadth, mas sem depth (cov, mutation, fixtures, contract, flakiness) |
| **TOTAL** | **12/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"
>
> **Veredito**: ⚠️ **Extrair seletivo** — aproveitar princípios + Hypothesis; modernizar todo o resto no `python-testing.md`.

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/qualy/extractions/python-guide.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Template v1.0 — Atualize se precisar de campos extras para seu domínio.*
