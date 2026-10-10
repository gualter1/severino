# EXTRAÇÃO — python-guide (Lente Arquitetura)

## METADADOS
- **Repositório**: `python-guide`
- **Lead Responsável**: `niamaia`
- **Funcionário (Subagente)**: `niamaia`
- **Data**: `2026-10-09`
- **Tempo gasto**: `1h 30min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | "Python Best Practices Guidebook" — guia opinativo de boas práticas para instalação, configuração e uso diário de Python (novatos e experts) |
| **Público-alvo** | Desenvolvedores Python (junior a sênior), arquitetos decidindo stack/estrutura, times definindo padrões internos |
| **Tamanho** | ~50 arquivos `.rst` em 10 diretórios temáticos (`starting/`, `dev/`, `writing/`, `shipping/`, `scenarios/`, `intro/`, `notes/`) + config Sphinx |
| **Linguagens/Tech** | reStructuredText (Sphinx), Python (exemplos), Makefile, requirements.txt |
| **Freshness** | Último commit ~2019 (Tabela freezing tools: "Date of this writing: Oct 5, 2019"). Issues/PRs abertos. Manutenção comunitária ativa mas conteúdo **datado** (Python 3.6~3.7 era, Pipenv recomendado, Travis CI, bbFreeze/py2exe). |

---

## 2. O QUE PRESTA PARA **ARQUITETURA** (Extrair para consolidado)

| Item | Localização | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|-------------|------|-------------------------------------|------------|
| **Estrutura de repositório canônica (Kenneth Reitz 2013)** | `docs/writing/structure.rst:59-80` | Pattern | `agents/niamaia/architecture-patterns.md#repo-structure` | 🔴 Alta |
| **Anti-pattern: nested Django project (repetitive paths)** | `docs/writing/structure.rst:268-315` | Anti-pattern | `agents/niamaia/architecture-patterns.md#django-structure` | 🔴 Alta |
| **Module vs Package naming conventions (underscore vs submodule)** | `docs/writing/structure.rst:390-411` | Guideline | `agents/niamaia/architecture-patterns.md#module-naming` | 🟠 Média |
| **Import style: `import modu` vs `from modu import func` vs `import *`** | `docs/writing/structure.rst:437-479` | Guideline | `agents/niamaia/architecture-patterns.md#import-style` | 🔴 Alta |
| **Package `__init__.py` minimal/empty practice** | `docs/writing/structure.rst:502-510` | Guideline | `agents/niamaia/architecture-patterns.md#package-init` | 🟠 Média |
| **Pure functions over classes for stateless logic (concurrency-safe)** | `docs/writing/structure.rst:561-588` | Pattern | `agents/niamaia/architecture-patterns.md#pure-functions` | 🔴 Alta |
| **Decorators for cross-cutting concerns (memoization, caching)** | `docs/writing/structure.rst:596-628` | Pattern | `agents/niamaia/architecture-patterns.md#decorators` | 🟠 Média |
| **Context managers (`with` / `@contextmanager`) for resource safety** | `docs/writing/structure.rst:632-698` | Pattern | `agents/niamaia/architecture-patterns.md#context-managers` | 🟠 Média |
| **Pipenv as dependency manager (Pipfile + lockfile)** | `docs/dev/virtualenvs.rst:68-142` | Tool config | `agents/niamaia/tech-stack-decisions.md#dependency-mgmt` | 🟡 Baixa (datado — Poetry/uv modernos) |
| **Virtualenv isolation per project (not system-wide)** | `docs/dev/virtualenvs.rst:112-142` | Guideline | `agents/niamaia/architecture-patterns.md#venv-isolation` | 🔴 Alta |
| **Requirements.txt at repo root for dev dependencies only** | `docs/writing/structure.rst:153-161` | Guideline | `agents/niamaia/architecture-patterns.md#requirements-txt` | 🟠 Média |
| **Setup.py at root for packaging/distribution** | `docs/writing/structure.rst:130-142` | Guideline | `agents/niamaia/architecture-patterns.md#setup-py` | 🟠 Média |
| **Packaging for PyPI (library) vs Freezing for end-user apps** | `docs/shipping/packaging.rst:10-30` | Decision record | `agents/niamaia/tech-stack-decisions.md#packaging-vs-freezing` | 🔴 Alta |
| **Freezing tools comparison table (PyInstaller, cx_Freeze, py2app, etc.)** | `docs/shipping/freezing.rst:48-60` | Decision record | `agents/niamaia/tech-stack-decisions.md#freezing-tools` | 🟡 Baixa (datado) |
| **WSGI as standard interface (portability across servers)** | `docs/scenarios/web.rst:22-27` | Pattern | `agents/niamaia/architecture-patterns.md#wsgi` | 🟠 Média |
| **Framework selection matrix: Django (batteries) vs Flask (micro) vs Falcon (API) vs Tornado (async)** | `docs/scenarios/web.rst:55-120` | Decision record | `agents/niamaia/tech-stack-decisions.md#web-frameworks` | 🔴 Alta |
| **Logging: library vs application patterns (NullHandler, `__name__`)** | `docs/writing/logging.rst:43-70` | Pattern | `agents/niamaia/architecture-patterns.md#logging` | 🔴 Alta |
| **12-factor logging (stdout stream, env-driven config)** | `docs/writing/logging.rst:75-80` | Guideline | `agents/niamaia/architecture-patterns.md#12factor-logging` | 🔴 Alta |
| **Logging config via dict/JSON (runtime reloadable) vs INI vs code** | `docs/writing/logging.rst:83-98` | Decision record | `agents/niamaia/tech-stack-decisions.md#logging-config` | 🟠 Média |
| **CI/CD: Tox for multi-version testing, Travis CI example** | `docs/scenarios/ci.rst:47-80` | Tool config | `agents/niamaia/tech-stack-decisions.md#ci-tooling` | 🟡 Baixa (GitHub Actions moderno) |
| **Python 3 only recommendation (Python 2 EOL 2020)** | `docs/starting/which-python.rst:33-42` | Decision record | `agents/niamaia/tech-stack-decisions.md#python-version` | 🔴 Alta |
| **CPython vs PyPy for CPU-bound (GIL awareness)** | `docs/scenarios/speed.rst:8-58` | Decision record | `agents/niamaia/tech-stack-decisions.md#interpreter-choice` | 🟠 Média |
| **Cython / C-extensions for performance-critical paths** | `docs/scenarios/speed.rst:76-80` | Pattern | `agents/niamaia/architecture-patterns.md#c-extensions` | 🟠 Média |
| **Data serialization: flat vs nested, repr/ast.literal_eval, JSON, msgpack, YAML** | `docs/scenarios/serialization.rst:19-80` | Guideline | `agents/niamaia/architecture-patterns.md#serialization` | 🟠 Média |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| **Pipenv como recomendação principal** | `docs/dev/virtualenvs.rst:68-142` | Pipenv estagnado (2019-2021), lockfile lento, problemas com resolução complexa | **Poetry** (mature, fast resolver) ou **uv** (Rust, extremamente rápido, drop-in pip) |
| **bbFreeze, py2exe, py2app tabelados** | `docs/shipping/freezing.rst:48-60` | bbFreeze morto (2014), py2exe só Windows, py2app só macOS | **PyInstaller** (cross-platform, ativo) ou **Nuitka** (compila para C, performance) |
| **Travis CI como exemplo principal** | `docs/scenarios/ci.rst:61-80` | Travis gratuito morto para OSS (2020), migração para GitHub Actions/GitLab CI/CircleCI | **GitHub Actions** (native, free for public, matrix strategy) |
| **Python 3.6/3.7 referências implícitas** | Múltiplos arquivos | EOL (Dec 2021 / Jun 2023) — `dataclasses`, `f-strings`, `typing` modernos ausentes | **Python 3.11+** (performance, `tomllib`, `ExceptionGroup`, `Self` type) |
| **`setup.py` como único packaging** | `docs/writing/structure.rst:130-142` | `pyproject.toml` + `build` + `setuptools`/`flit`/`hatch`/`pdm` é padrão PEP 517/518/621 | **pyproject.toml** com backend moderno (hatchling, flit, pdm-backend) |
| **`requirements.txt` para dev deps only** | `docs/writing/structure.rst:153-161` | Conflita com lockfiles modernos (Poetry.lock, uv.lock, pdm.lock) | **Lockfile do gerenciador** + `pip compile`/`uv pip compile` para CI |
| **`tox` como única ferramenta multi-version** | `docs/scenarios/ci.rst:47-58` | Tox ainda útil mas config complexa; `nox` (Python config) ou matrix nativo GH Actions mais simples | **GitHub Actions matrix** + `nox` se precisar lógica complexa |
| **Loguru mencionado como alternativa** | `docs/writing/logging.rst:13` | Loguru bom, mas `structlog` + stdlib `logging` é padrão enterprise (OpenTelemetry ready) | **structlog** (structured, processors, OpenTelemetry integration) |
| **Falcon recomendado para REST APIs** | `docs/scenarios/web.rst:98-111` | Falcon niche; FastAPI domina (async, OpenAPI auto, type hints, pydantic) | **FastAPI** (ou Starlette direto) |
| **Tornado para async (próprio event loop)** | `docs/scenarios/web.rst:115-120` | Tornado legacy async; `asyncio` nativo + `uvicorn`/`gunicorn` + FastAPI/Starlette/Quart | **FastAPI/Starlette + uvicorn** |
| **Serialização: `repr`/`ast.literal_eval` como métodos** | `docs/scenarios/serialization.rst:57-79` | Inseguro (`ast.literal_eval` ok mas limitado), não schema-validado | **Pydantic** (validation + serialization), **msgspec** (fast), **orjson** (fast JSON) |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (Arquitetura)

- [ ] **Monorepo vs Polyrepo para Python** — Sugestão: ADR template em `agents/niamaia/architecture-decisions/monorepo-python.md`
- [ ] **Arquitetura modular / Clean Architecture / Hexagonal em Python** — Sugestão: pattern doc em `agents/niamaia/architecture-patterns.md#modular-arch`
- [ ] **Dependency injection patterns (punq, python-dependency-injector, fastapi DI)** — Sugestão: guideline em `agents/niamaia/architecture-patterns.md#di`
- [ ] **Async architecture: event loops, structured concurrency (task groups), cancellation** — Sugestão: pattern em `agents/niamaia/architecture-patterns.md#async-arch`
- [ ] **Observabilidade nativa: OpenTelemetry, structured logging, metrics (prometheus-client), tracing** — Sugestão: runbook em `agents/niamaia/runbooks/otel-python.md`
- [ ] **API versioning & contract testing (schemathesis, pact-python)** — Sugestão: checklist em `agents/niamaia/checklists/api-contract.md`
- [ ] **Database migration patterns (alembic vs django migrations vs sqlalchemy-migrate)** — Sugestão: decision record em `agents/niamaia/tech-stack-decisions.md#db-migrations`
- [ ] **Secrets management (dotenv vs 1password-cli vs vault vs sops vs aws secretsmanager)** — Sugestão: ADR template em `agents/niamaia/architecture-decisions/secrets-mgmt.md`
- [ ] **Containerization: Dockerfile best practices (multi-stage, uv/pip-cache, distroless, non-root)** — Sugestão: template em `templates/docker/python-multistage.Dockerfile`
- [ ] **Supply chain security: SLSA, sigstore, pip-audit, dependabot, SBOM (cyclonedx-python)** — Sugestão: checklist em `agents/kaspersky/checklists/python-supply-chain.md`
- [ ] **Type hints & mypy/pyright strict config, generics, protocols, TypedDict** — Sugestão: guideline em `agents/niamaia/architecture-patterns.md#typing`
- [ ] **Testing architecture: property-based (hypothesis), contract, mutation (mutmut), snapshot (syrupy)** — Sugestão: checklist em `agents/qualy/checklists/python-testing-arch.md`

---

## 5. AÇÕES PROPOSTAS PARA NIAMAIA (Lead)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: patterns de estrutura repo, import style, pure functions, context managers, logging library vs app, packaging vs freezing decision tree
- [ ] **Criar ADR**: `ADR-XXX: Python Project Structure Standard` — Para: padronizar layout (src-layout vs flat), `pyproject.toml`, lockfile, test location
- [ ] **Criar ADR**: `ADR-XXX: Dependency Management Tool Selection` — Para: Poetry vs uv vs PDM vs Pipenv (vetar Pipenv)
- [ ] **Criar ADR**: `ADR-XXX: Web Framework Selection` — Para: FastAPI (default) vs Django (admin-heavy) vs Starlette (low-level) vs Flask (legacy)
- [ ] **Criar Template**: `templates/python/pyproject.toml` — Em: `templates/python/` (modern PEP 621, hatchling/flit backend, tool configs)
- [ ] **Criar Template**: `templates/docker/python-multistage.Dockerfile` — Em: `templates/docker/`
- [ ] **Criar Checklist**: `checklists/python-project-bootstrap.md` — Em: `agents/niamaia/checklists/`
- [ ] **Criar Runbook**: `runbooks/python-freezing-deployment.md` — Em: `agents/niamaia/runbooks/` (PyInstaller/Nuitka, signing, SBOM)
- [ ] **Criar Skill**: `skills/python-arch-review` — Em: `_consolidado/skills/python-arch-review/` (valida estrutura, imports, deps, typing, logging)
- [ ] **Atualizar Tech Radar**: mover Pipenv → **Hold**, Poetry → **Adopt**, uv → **Trial→Adopt**, FastAPI → **Adopt**, structlog → **Adopt**, PyInstaller → **Trial**, Nuitka → **Assess**

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES

> `docs/writing/structure.rst:34-37`: "Repository structure is a crucial part of your project's architecture. When a potential user or contributor lands on your repository's page, they see a few things: Project Name, Project Description, Bunch O' Files."

> `docs/writing/structure.rst:107-108`: "Your library does not belong in an ambiguous src or python subdirectory."

> `docs/writing/structure.rst:438-440`: "Using `import *` makes the code harder to read and makes dependencies less compartmentalized."

> `docs/writing/structure.rst:469-471`: "Best: `import modu` ... `x = modu.sqrt(4)` # sqrt is visibly part of modu's namespace"

> `docs/writing/structure.rst:508-510`: "Leaving an `__init__.py` file empty is considered normal and even good practice, if the package's modules and sub-packages do not need to share any code."

> `docs/writing/structure.rst:574-587`: "Pure functions are deterministic... easier to change... easier to test... easier to manipulate, decorate, and pass around. In summary, pure functions are more efficient building blocks than classes and objects for some architectures."

> `docs/writing/logging.rst:52-54`: "It is strongly advised that you do not add any handlers other than NullHandler to your library's loggers."

> `docs/writing/logging.rst:75-80`: "The twelve factor app... emphatically advocates for treating log events as an event stream, and for sending that event stream to standard output to be handled by the application environment."

> `docs/shipping/packaging.rst:20-23`: "If your code isn't packaged on PyPI, then it will be harder for other developers to find it and to use it... They will regard such projects with substantial suspicion of being either badly managed or abandoned."

> `docs/scenarios/web.rst:95-96`: "Flask is default choice for any Python web application that isn't a good fit for Django." — **datado: FastAPI hoje default para APIs**

> `docs/starting/which-python.rst:39-40`: "Use Python 3 for new Python applications."

---

## 7. SCORE DE VALOR DO REPO (Para Arquitetura)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Cobra exatamente: estrutura repo, módulos, packaging, logging, frameworks, CI, performance — core架构 decisions |
| **Qualidade** | 4 | Exemplos práticos, opiniões claras (Kenneth Reitz), anti-patterns nomeados, código ilustrativo |
| **Atualidade** | 2 | **Grande gap**: 2019 era. Pipenv, Travis, bbFreeze, Python 3.6, Flask default, sem FastAPI/uv/structlog/pyproject.toml/OpenTelemetry |
| **Ação** | 4 | Gera ADRs, templates, checklists, tech radar updates imediatos (após modernização) |
| **Completude** | 3 | Bom coverage tópico mas buracos: typing, async, DI, monorepo, containers, supply chain, observabilidade nativa |
| **TOTAL** | **18/25** | |

> **Regra**: Score 18 = **"Extrair seletivo + modernizar"** — extrair patterns atemporais, vetar/atualizar tooling datado, criar ADRs para decisões modernas.

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/niamaia/extractions/python-guide.md`
- [ ] Avisar Lead (niamaia) que a extração está pronta → **ESTE ARQUIVO É A ENTREGA**
- [ ] Mover para próximo repo na fila (aguardando instrução)

---

*Template v1.0 — Extração completa com lente arquitetura Niamaia.*