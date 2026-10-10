# CONSOLIDATED.md — Niamaia (Arquitetura de Software)

> **Resumo vivo do domínio Arquitetura** — mantido pelo Lead Niamaia. Atualizado semanalmente a partir de extrações aprovadas.

---

## 📊 STATUS ATUAL
| Métrica | Valor |
|---------|-------|
| Repositórios analisados (Batch 1 + Wave 2 + Wave 3) | 11 |
| Extrações aprovadas | 11 |
| ADRs propostas (Wave 3) | 8 (ADR-011 a ADR-018 propostas na Wave 3) |
| Templates criados (Wave 3) | 3 |
| Checklists criados (Wave 3) | 1 |
| Última atualização | 2026-10-09 |

---

## 🆕 WAVE 3 — RESUMO (2026-10-09)

| Repo | Score | Destaque arquitetural |
|------|-------|----------------------|
| **distilly** | 24/25 | Meta-skill, Work+Persona dual-model, triple-gate, budget-tiered gates, incremental evolution |
| **superpowers** | 24/25 | Three-shape plugin, zero-dep dual-compat, action vocab, bootstrap-first, SDD |
| **python-guide** | 18/25 | Estrutura canônica + modernização (Pipenv→uv, Flask→FastAPI, setup.py→pyproject.toml) |

> **Regra de score**: >17 = extração completa (distilly, superpowers ✅); 10-17 + datado = extrair seletivo + modernizar (python-guide ✅).
> **Cross-refs Wave 3**: `Towards` (impl em distilly, superpowers — plugin entrypoints, skill writer), `Qualy` (testing/eval em python-guide — tox→GH Actions matrix, hypothesis/mutmut; distilly eval harness), `Turing` (DX em superpowers — bootstrap UX, skill surfacing, plan template legibilidade), `Kaspersky` (threat model distilly PII + plugin supply chain), `Trevor` (Windows compat, freezing/container, cost model eval pipeline).

---

## 🎯 PRINCÍPIOS ARQUITETURAIS UNIFICADOS (Cross-repo)

| Princípio | Fontes | Aplicação |
|-----------|--------|-----------|
| **Feature-first / Bounded Context** | android-best-practices (pkg), nodebestpractices (components), project-guidelines (structure), react-boilerplate (containers) | Organizar código por domínio de negócio, não por camada técnica |
| **3-Tier dentro do componente** (entry-points / domain / data-access) | nodebestpractices (1.2), iOS Stores, Android Repositories | Separar concerns técnicos (HTTP/DB) da lógica pura |
| **DI via construtor, singleton só se global-real** | iOS (`initWithViewModel`), Android (constructor), nodebestpractices (explicit entry), planning-with-files (orchestrator owns plan) | Inversão de controle obrigatória; evitar service locator |
| **Async-first boundaries** (Store/Repository retorna Signal/Flow/Promise) | iOS Store, Android Repository, nodebestpractices (domain layer) | Nunca vazar `req`/`resp`/`Cursor`/`JSONObject` para domain |
| **Immutable Models + Anti-Corruption Layer** | iOS Models, Android DTO→Model, nodebestpractices (DTO remoto → Model domínio) | Mapear no boundary; DTO ≠ Domain Model |
| **Config por ambiente, versionada, validada fail-fast** | project-guidelines (.env+joi), nodebestpractices (convict/zod), iOS xcconfig | `.env.example` commitado; validação no boot; segredos fora do repo |
| **Observability from day 1** (structured logs, tx-id, stdout, RED/USE) | nodebestpractices (5.14, 5.18), project-guidelines (winston), planning-with-files (KV-cache hygiene) | Pino/Winston + correlation IDs; infra decide destino |
| **Stateless horizontal scaling** | nodebestpractices (5.12), planning-with-files (file-state), archify (portable HTML) | Zero sticky session; estado em DB/cache externo |
| **Typed contracts / Schema-first** | archify (JSON Schema IR), nodebestpractices (OpenAPI errors), planning-with-files (Markdown contracts) | JSON Schema / OpenAPI / Protobuf como fonte da verdade |
| **Validation gates antes de delivery** (schema + lint + test + visual) | archify (atomic validation), nodebestpractices (centralized error), planning-with-files (attestation) | Fail-closed pipeline; repair receipts acionáveis |
| **Meta-skill & Plugin Architecture** (Three-shape integration, zero-dependency, action vocab, work+persona dual-model) | distilly, superpowers | Gerar skills portáteis multi-host com bootstrap injection automática sem editar corpos de skill |
| **Python Modernization & Project Structure** | python-guide | Layout src-layout, pyproject.toml, dependências modernas (uv/poetry), framework FastAPI |
| **Triple-Gate Knowledge Extraction** (recurrence + generative power + exclusivity) | distilly | Promover heurística → mental model apenas quando passa 3 gates; evitar overfitting a anecdotes |
| **Taste-Driven Source Curation** (Long-form > snippets, Controversy > consensus, Failure > success) | distilly | Priorizar fontes primárias ricas em decisão/craft; blacklist content farms |
| **Budget-Tiered Quality Gates** (friendly vs unfriendly profiles with measurable thresholds) | distilly | Trade-off explícito custo/qualidade; quality gates automatizados com primary ratio ≥50% |
| **Incremental Evolution via Section-Level Patches** (append-only, conflict→user, retention=10) | distilly | Evolução segura de artifacts; nunca sobrescreve; rollback automático |
| **Bootstrap-First Session Initialization** (injected every session, cached, compaction-aware) | superpowers | Zero opt-in; action vocabulary auto-disponível; dedup guard + child session detection |
| **Zero-Dependency Plugin Principle** (no runtime deps, new harness = carve-out only) | superpowers | Isolamento total; cada harness só adiciona seu mapping; supply chain mínimo |
| **Action Vocabulary vs Tool Mapping Separation** (skills name actions, per-harness mapping) | superpowers | Skills harness-agnósticas; references/<harness>-tools.md faz tradução |
| **Subagent-Driven Development** (fresh subagent/task + ledger + compaction survival) | superpowers | Isolamento por tarefa; review embutido; contexto persistido entre compactions |
| **Mandatory Skill Lifecycle Pipeline** (brainstorm→worktrees→plan→SDD→TDD→review→finish) | superpowers | Hard gates impedem pular etapas; "Let's make react todo" auto-trigger brainstorming |

---

## 🏗️ TAXONOMIA DE PATTERNS POR DOMÍNIO

### Mobile (Android + iOS)
| Pattern | Quando usar | Repo fonte |
|---------|-------------|------------|
| **MVCS** (MVC + Store) | Apps CRUD, time pequeno, onboarding rápido | ios-good-practices |
| **MVVM** | VC >300 LOC, binding complexo, testabilidade UI | ios-good-practices |
| **VIPER** | >20 telas, múltiplos times, teste >70% | ios-good-practices |
| **Activity/Fragment 1:1 + feature packages** | Android default; transição p/ multi-module | android-best-practices |
| **Event patterns: Delegation/Callback/NC/Signals** | Escolher por escopo (1-1 vs 1-N vs chain) | ios-good-practices |

### Backend (Node.js / General)
| Pattern | Quando usar | Repo fonte |
|---------|-------------|------------|
| **Component + 3-tier** (apps/libraries, entry/domain/data) | Microserviços ou monólito modular | nodebestpractices (1.1, 1.2) |
| **Framework: Nest (OOP/grande) vs Fastify (micro/simples)** | Decidir no ADR inicial | nodebestpractices (1.5) |
| **Centralized Error Handling** (object, não middleware) | Todos entry-points chamam | nodebestpractices (2.4) |
| **Operational vs Catastrophic errors** (restart vs handle) | Taxonomia obrigatória | nodebestpractices (2.3) |

### Frontend (React / SPA)
| Pattern | Quando usar | Repo fonte |
|---------|-------------|------------|
| **Feature containers** (actions/constants/reducer/saga/selectors) | Redux + saga; escalar | react-boilerplate |
| **Offline-first** (SW + cache strategies) | PWA, mobile web | react-boilerplate |
| **Unidirectional data flow + time-travel** | Debugging complex state | react-boilerplate |

### AI / LLM Systems
| Pattern | Quando usar | Repo fonte |
|---------|-------------|------------|
| **Single → Multi-agent teams → Always-on** | Escalar complexidade progressivamente | awesome-llm-apps |
| **RAG spectrum** (basic → hybrid → corrective → agentic → KG) | Escolher por precisão/custo | awesome-llm-apps |
| **MCP Router** (specialist agents + bridge) | Tools externas heterogêneas | awesome-llm-apps |
| **Trust-gated + hash-chained audit** | Compliance, high-stakes | awesome-llm-apps |

### Diagramming / Architecture Communication
| Pattern | Quando usar | Repo fonte |
|---------|-------------|------------|
| **Typed JSON IR + schema validation** | LLM→diagram pipeline confiável | archify |
| **Evidence-backed nodes** (SRC n → Git file:line@commit) | Source of truth rastreável | archify |
| **5 diagram types** (Arch/Workflow/Seq/Dataflow/Lifecycle) | Escolher por pergunta | archify |
| **Architecture Delta** (Before/Delta/After + receipt) | PR review, change impact | archify |

### Agent Orchestration
| Pattern | Quando usar | Repo fonte |
|---------|-------------|------------|
| **3-file pattern** (task_plan/findings/progress) | Long-running multi-step agents | planning-with-files |
| **Filesystem = Disk state, Context = RAM** | Persistência entre `/clear` | planning-with-files |
| **Orchestrator owns plan, workers report via ledger** | Multi-agent sem conflitos | planning-with-files |
| **Attestation + fail-closed selectors** | Parallel isolation | planning-with-files |

### 🆕 Distillation / Person-Modeling (Wave 3 — distilly)
| Pattern | Quando usar | Repo fonte |
|---------|-------------|------------|
| **Meta-skill architecture** (skill que gera skills `{character}-{slug}`) | Person-modeling portátil multi-host | distilly |
| **Work + Persona dual-model** (PART B decide atitude → PART A executa método; Layer 0 > tudo) | Separar capacidade técnica de comportamento | distilly |
| **6-dimension research pipeline** (Writings/Conversations/Expression/Decisions/External/Timeline) | Celebrity distillation profunda | distilly |
| **Triple-gate extraction** (Cross-context recurrence + Generative power + Exclusivity; 3/3=keep, 1-2=heuristic, 0=discard) | Promover heurística → mental model | distilly |
| **Taste principles** (Long-form > snippets, Controversy > consensus, Failure > success) | Curadoria de fontes | distilly |
| **Source hierarchy 1-7 + blacklist** (local > first-person book > long interview > decisions > short-form > external > secondhand) | Garantir primary ratio ≥50% | distilly |
| **Budget-friendly vs Budget-unfriendly** (3 files/2 URLs/compact vs 6 tracks/8 URLs/deep + audit→synthesis→validation) | Trade-off custo/qualidade | distilly |
| **Incremental evolution** (section-level markdown patch, append-only, conflict→user, retention=10) | Evolução segura sem perder história | distilly |
| **Quality gates automatizados** (`quality_check.py`: grounding, copyright, hierarchy, review chain, research depth) | Fail-closed distillation pipeline | distilly |

### 🆕 Plugin System & Extensibility (Wave 3 — superpowers)
| Pattern | Quando usar | Repo fonte |
|---------|-------------|------------|
| **Bootstrap-first injection** (injected every session, `<EXTREMELY_IMPORTANT>`, cached, dedup guard, child-session detection) | Auto-disponibilizar skills sem opt-in | superpowers |
| **Three-shape integration model** (Shell-hook A / In-process B / Instructions-file C) | Integrar novo harness | superpowers |
| **Action vocabulary vs Tool mapping** (skills name actions, `references/<harness>-tools.md` traduz) | Skills harness-agnósticas | superpowers |
| **Zero-dependency plugin** (no runtime deps, new harness = único carve-out) | Supply chain mínimo | superpowers |
| **Dual-compatible plugin** (named export + default.setup p/ V1+V2) | Suportar duas versões de host | superpowers |
| **Subagent-driven development** (fresh subagent/task + task review + whole-branch review + ledger p/ compaction) | Alta qualidade + iteração rápida | superpowers |
| **Mandatory skill lifecycle** (brainstorm→worktrees→plan→SDD→TDD→review→finish, hard gates) | Pipeline obrigatório | superpowers |
| **Three-path brainstorming** (Spike / Bounded / Architectural) com hard gates | Classificar discovery | superpowers |
| **Cross-platform polyglot hook** (`run-hook.cmd` batch+bash) | Hooks Windows+Unix | superpowers |
| **Compaction-aware re-injection** (per-step dedup, pi flag, agent_end reset) | Sobreviver a compaction | superpowers |

### 🆕 Python Modern Stack (Wave 3 — python-guide)
| Pattern | Quando usar | Repo fonte |
|---------|-------------|------------|
| **Src-layout canônico** (`src/{pkg}/` + `pyproject.toml` PEP 621) | Projetos Python modernos | python-guide |
| **Pure functions > classes** (stateless, concurrency-safe, decorável) | Lógica sem estado | python-guide |
| **Decorators & Context managers** (`@contextmanager`, `with`) p/ cross-cutting/resource safety | Observabilidade, caching, cleanup | python-guide |
| **Logging: NullHandler em libs, 12-factor stdout em apps** (config via dict/JSON reloadable) | Bibliotecas vs aplicações | python-guide |
| **Packaging vs Freezing** (PyPI library vs PyInstaller/Nuitka p/ end-user) | Distribuição | python-guide |
| **WSGI → ASGI + FastAPI** (OpenAPI auto, Pydantic, async) | APIs modernas | python-guide |

---

## 📦 DECISÕES DE TECH STACK (Matriz de Decisão)

| Camada | Opção Recomendada | Alternativa | Critério |
|--------|-------------------|-------------|----------|
| **Mobile Build** | Gradle (Kotlin DSL) + AGP | Bazel/Buck2 | Gradle = source of truth padrão |
| **Mobile DI** | Hilt (Android) / Factory+Env (SwiftUI) / Koin (KMP) | Manual | Hilt = Google-supported; Koin = KMP |
| **Mobile Network** | Ktor (KMP) / OkHttp+Retrofit / Alamofire | URLSession nativo | KMP-first se shared logic |
| **Mobile Persistence** | Room (Android) / SwiftData (iOS) / SQLite (KMP) | Realm/CoreData | First-party modern |
| **Backend Runtime** | Node 22 LTS | Bun/Deno | Node = ecossistema maduro |
| **Backend Framework** | **Fastify** (default microservices) / **Nest** (monolith/OOP) / Hono (edge) | Express (legacy) | Ver ADR node-framework |
| **Backend Config** | convict + zod validation | env-var / dotenv | Fail-fast + type-safe |
| **Backend Logging** | **Pino** (performance) + OpenTelemetry | Winston | Pino = 5x faster JSON |
| **Frontend Build** | **Vite** / Turbopack | Webpack (legacy) | Vite = default moderno |
| **Frontend State** | **TanStack Query** (server) + **Zustand/Jotai** (client) | Redux/Saga (legacy) | Menos boilerplate |
| **Frontend Styling** | **Tailwind** / Panda CSS / Vanilla Extract | styled-components (runtime cost) | Zero-runtime / compile-time |
| **API Contract** | **OpenAPI 3.1** + TypeScript generation | GraphQL (se federation) | Single source of truth |
| **Diagrams** | **Archify** (typed IR, evidence-backed) | Mermaid/PlantUML | Validação + rastreabilidade |
| **Agent Planning** | **planning-with-files** (3-file + hooks) | In-context only | Persistência + multi-agent |
| **Agent Plugins / Skills (🆕 Wave 3)** | **superpowers + distilly** (bootstrap-first, 3-shape, zero-dep) | Manual wiring | Portabilidade 14 harnesses / 8 hosts |
| **Python Runtime** | Python 3.11+ | Python 3.6-3.7 (legacy) | Performance, `tomllib`, typing |
| **Python Package / Dep Manager** | **uv** / **Poetry** (pyproject.toml) | Pipenv / requirements.txt | Fast resolver / modern standard PEP 517 |
| **Python Web Framework** | **FastAPI** (default APIs) / Django (admin-heavy) | Flask / Falcon | OpenAPI auto, async, Pydantic |
| **Python Logging** | **structlog** + stdlib `logging` (12-factor stdout) | print / plain logging | Structured JSON + OpenTelemetry ready |

---

## 🚨 ADRs PROPOSTAS (Backlog Prioritizado)

| ID | Título | Domínio | Prioridade | Status |
|----|--------|---------|------------|--------|
| ADR-001 | Mobile Modularization Strategy (feature modules + dynamic delivery) | Mobile | 🔴 Alta | Rascunho |
| ADR-002 | Cross-Platform Architecture Pattern (MVVM + Store + DI) | Mobile | 🔴 Alta | Rascunho |
| ADR-003 | Node.js Framework Selection (Fastify vs Nest vs Hono) | Backend | 🔴 Alta | Rascunho |
| ADR-004 | Error Taxonomy & Handling (Operational vs Catastrophic) | Backend | 🔴 Alta | Rascunho |
| ADR-005 | React State Management (TanStack Query + Zustand default) | Frontend | 🟠 Média | Pendente |
| ADR-006 | Diagram as Code: Archify as Standard | Cross-cutting | 🟠 Média | Pendente |
| ADR-007 | Agent Orchestration Protocol (3-file + attestation) | AI/Agents | 🟠 Média | Pendente |
| ADR-008 | LLM App Architecture Taxonomy (Single/Multi/Always-on/RAG/MCP) | AI/Agents | 🟠 Média | Pendente |
| ADR-009 | TypeScript Scope (sparingly, simple types) | Cross-cutting | 🟢 Baixa | Pendente |
| ADR-010 | Deployment Ownership Profile (fail-closed boundaries) | Platform | 🟢 Baixa | Pendente |
| ADR-011 | Meta-Skill Architecture for Portable Agent Skill Generation | AI/Agents | 🔴 Alta | Proposta (Wave 3) |
| ADR-012 | Work + Persona Dual-Model with Layer 0 Priority | AI/Agents | 🔴 Alta | Proposta (Wave 3) |
| ADR-013 | Three-Shape Plugin Integration Model for Multi-Harness Support | AI/Agents | 🔴 Alta | Proposta (Wave 3) |
| ADR-014 | Zero-Dependency Dual-Compatible Plugin & Action Vocabulary | AI/Agents | 🔴 Alta | Proposta (Wave 3) |
| ADR-015 | Skill Registry Versioning & Backward Compat (schema v3, retention, aliases) | AI/Agents | 🟠 Média | Proposta (Wave 3 — distilly) |
| ADR-016 | Python Project Structure Standard (src-layout, pyproject.toml, lockfile) | Backend/Python | 🔴 Alta | Proposta (Wave 3 — python-guide) |
| ADR-017 | Python Dependency Management (Poetry/uv veto Pipenv) | Backend/Python | 🔴 Alta | Proposta (Wave 3 — python-guide) |
| ADR-018 | Python Web Framework Selection (FastAPI default vs Django/Starlette) | Backend/Python | 🔴 Alta | Proposta (Wave 3 — python-guide) |

---

## 📋 TEMPLATES & CHECKLISTS NECESSÁRIOS

| Artefato | Domínio | Origem (extração) | Status |
|----------|---------|-------------------|--------|
| `proguard-rules.pro` template | Android | android-best-practices | Pendente |
| `xcconfig` base (Common/Dev/Staging/Prod) | iOS | ios-good-practices | Pendente |
| `.env.example` + `config/` (convict/zod) | Backend | nodebestpractices/project-guidelines | Pendente |
| `eslint` + `prettier` + Airbnb base | Frontend/Node | project-guidelines | Pendente |
| API Design Checklist (plural nouns, kebab-case, versioning, errors) | API | project-guidelines | Pendente |
| Offline-first Checklist (SW, cache, fallback UI) | Frontend | react-boilerplate | Pendente |
| Architecture Diagram Quality Gates (schema, layout, evidence, visual) | Cross | archify | Pendente |
| Multi-Agent Plan Isolation (PLAN_ID, attestation, ledger) | AI/Agents | planning-with-files | Pendente |
| RAG Failure Diagnostics Runbook | AI/Agents | awesome-llm-apps | Pendente |
| Implementation Plan Template (Goal/Arch/Tech/Spec/Constraints) | Cross | superpowers | Concluído (Wave 3) |
| Cross-Platform Hook Wrapper (`run-hook.cmd`) | Platform | superpowers | Concluído (Wave 3) |
| Version Bump Manifest Tracker (`version-bump.json`) | Platform | superpowers | Concluído (Wave 3) |
| Harness Port Acceptance Checklist | AI/Agents | superpowers | Concluído (Wave 3) |

---

## 🔗 GAPS CONHECIDOS (Para próximas extrações)

| Gap | Relevância | Sugestão de fonte |
|-----|------------|-------------------|
| **KMP (Kotlin Multiplatform)** architecture patterns | 🔴 Alta | Novo repo / KotlinConf talks |
| **SwiftUI + Observation + TCA** patterns | 🔴 Alta | pointfreeco / swiftui-lab |
| **Module Federation / Micro-frontends** | 🟠 Média | webpack/module-federation examples |
| **Event-driven / Saga / Choreography / Outbox** | 🟠 Média | eventuate.io / cqrs.nu |
| **API Versioning / Strangler Fig / Backward compat** | 🟠 Média | Martin Fowler / Sam Newman |
| **Observability: OpenTelemetry, eBPF, SLO/SLI** | 🟠 Média | CNCF observability TAG |
| **Security: Zero Trust, mTLS, SPIFFE, SBOM** | 🟠 Média | kaspersky domain |
| **Multi-tenancy boundaries (row-level, schema, DB)** | 🟢 Baixa | SaaS architecture blogs |
| **Design System Architecture (tokens → components → patterns)** | 🟢 Baixa | turing domain |
| **Cost-aware architecture (FinOps, right-sizing)** | 🟢 Baixa | trevor domain |
| **Agent Plugin Architecture (3-shape, zero-deps, action vocab)** | 🔴 Alta | distilly, superpowers |
| **Skill Distillation Pipeline (research→triple-gate→budget-tier→evolution)** | 🔴 Alta | distilly |
| **Python Modern Stack (pyproject.toml, uv/poetry, FastAPI, structlog, OpenTelemetry)** | 🔴 Alta | python-guide |
| **Subagent-Driven Development with Ledger Compaction Survival** | 🔴 Alta | superpowers |
| **Bootstrap-First Injection with Caching & Compaction Awareness** | 🟠 Média | superpowers |

---

## 📚 REFERÊNCIAS RÁPIDAS (Deep links nas extrações)

| Tópico | Arquivo de Extração | Seção |
|--------|---------------------|-------|
| Feature-based packages (Android) | `android-best-practices.md` | §2 linhas 182-195 |
| Store layer async API | `ios-good-practices.md` | §2 linhas 316-340 |
| Component + 3-tier (Node) | `nodebestpractices.md` | §2 linhas 1.1, 1.2 |
| Config validation (convict/zod) | `nodebestpractices.md` | §2 linha 1.4 |
| Framework decision matrix | `nodebestpractices.md` | §2 linha 1.5 |
| Centralized error handling | `nodebestpractices.md` | §2 linha 2.4 |
| Feature-first React containers | `react-boilerplate.md` | §2 containers |
| LLM Agent taxonomy | `awesome-llm-apps.md` | §2 single/multi/always-on |
| RAG spectrum | `awesome-llm-apps.md` | §2 RAG |
| Typed JSON IR + validation | `archify.md` | §2 IR, validation gates |
| Evidence-backed diagrams | `archify.md` | §2 source evidence |
| 3-file agent pattern | `planning-with-files.md` | §2 3-file |
| File-state shared across agents | `planning-with-files.md` | §2 AGENTS.md contracts |
| Meta-skill arch & work+persona dual model | `distilly.md` | §2 meta-skill, dual-model, Layer 0 |
| Triple-gate extraction & taste principles | `distilly.md` | §2 triple-gate, taste, source hierarchy |
| Budget-friendly vs unfriendly profiles & quality gates | `distilly.md` | §2 budget profiles, quality_check.py |
| Three-shape plugin integration model | `superpowers.md` | §2 three shapes, porting guide |
| Action vocabulary vs tool mapping separation | `superpowers.md` | §2 action vocab, harness references |
| Zero-dependency plugin principle | `superpowers.md` | §2 zero-deps, dual-compat plugin |
| Subagent-driven development & mandatory workflow steps | `superpowers.md` | §2 SDD, brainstorming, plan template |
| Python project structure & modern packaging/deps | `python-guide.md` | §2 structure, pyproject.toml, uv |
| Python logging & web framework (FastAPI default) | `python-guide.md` | §2 logging 12-factor, FastAPI vs Flask |

---

## 🔄 TRADE-OFFS ARQUITETURAIS — WAVE 3 (Novos)

| Decisão | Trade-off | Racional documentado | Fonte |
|---------|-----------|---------------------|-------|
| **Meta-skill vs standalone skills** | Complexidade do gerador vs portabilidade do artifact | Meta-skill centraliza lógica, skills geradas self-contained + portáteis | distilly |
| **Work + Persona separados vs unificado** | Duplicação infra vs separação limpa responsabilidades | PART B (Persona) = atitude; PART A (Work) = método; Layer 0 > all | distilly |
| **Budget-friendly vs budget-unfriendly** | Custo/tempo vs profundidade/confiabilidade | Dois perfis explícitos com quality gates distintos; escolha consciente | distilly |
| **Local-first vs web+local vs web-only** | Privacidade/velocidade vs cobertura | Estratégia declarada no intake; local-first default | distilly |
| **Compact vs deep merge strategy** | Simplicidade vs preservação nuance | Budget-friendly=compact; budget-unfriendly=deep (6 tracks + reviews) | distilly |
| **Section-level patch vs full rewrite** | Segurança (não perde história) vs atomicidade | `merge_markdown_patch()` substitui sections `##` matching | distilly |
| **Self-contained SKILL.md install** | Perde knowledge/raw dirs vs portabilidade/segurança | Instalador só copia `SKILL.md` + metadata; raw fica no repo origem | distilly |
| **Three-shape plugin model** | Complexidade de integração vs flexibilidade harness | Cada harness escolhe shape ideal; zero changes no skill core | superpowers |
| **Zero-dependency plugins** | Funcionalidade built-in vs isolamento supply chain | Harness carve-out only; segurança > conveniência | superpowers |
| **Action vocab vs tool names in skills** | Indireção extra vs portabilidade total | Skills nunca quebram quando harness muda tool names | superpowers |
| **Dual-compat V1+V2 single module** | Complexidade módulo vs migração suave | Single file serves both; evita fork de código | superpowers |
| **Fresh subagent per task** | Overhead spawn vs isolamento/review quality | Ledger + compaction survival = net win | superpowers |
| **Bootstrap every session (no opt-in)** | Token bloat (~1-2k tokens) vs zero friction | Cached + dedup guard; acceptance test = "react todo" auto-triggers | superpowers |
| **Inject as user msg vs system msg** | Visibilidade vs token efficiency | System msg broke Qwen (#894), bloated context (#750) | superpowers |
| **Pipenv → uv/Poetry** | Migração configs vs resolver performance | Pipenv estagnado; uv 10-100x mais rápido, drop-in pip | python-guide |
| **Flask → FastAPI (default APIs)** | Ecossistema Flask maduro vs OpenAPI+async+type hints | FastAPI domina 2024+; Pydantic nativo; Starlette base | python-guide |
| **setup.py → pyproject.toml (PEP 517/621)** | Tooling legacy vs standard moderno | Backend hatchling/flit/pdm; build frontend isolado | python-guide |

---

## 🔄 PRÓXIMOS PASSOS DO LEAD (Niamaia)

1. **Esta semana**: Consolidar ADRs propostas da Wave 3 (ADR-011 a ADR-014: Meta-skill, Dual-Model, Three-Shape Plugin, Zero-Dep & Action Vocab) em `adrs/`
2. **Esta semana**: Incorporar templates criados na Wave 3 (`implementation-plan.md`, `run-hook.cmd`, `version-bump.json`)
3. **Próxima sprint**: Validar aceitação de portabilidade multi-harness com Trevor + Towards usando o acceptance checklist
4. **Contínuo**: Revisar ADRs a cada 6 meses ou mudança significativa de contexto (regra Niamaia)
5. **Batch 2 Wave 4**: Aguardar próximos repositórios de KMP, SwiftUI, Observability e Event-driven arquitetura.

---

*Última atualização: 2026-10-09 — Niamaia (Arquiteto) — Batch 2 Wave 3: distilly (24/25), python-guide (18/25), superpowers (24/25)*