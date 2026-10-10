# Towards — CONSOLIDATED.md (Features Complexas, Refactoring, Debugging)

> **Fonte da verdade** do domínio Towards. Atualizado após cada extração aprovada. Última atualização: 2026-10-09

---

## 📊 EXTRAÇÕES PROCESSADAS (Batch 1 — 8 repos + Wave 1-2: 5 repos + Wave 3: 5 repos = **18 total**)

| Repo | Score | Status | Principais Patterns Extraídos |
|------|-------|--------|-------------------------------|
| `claude-code-best-practice` | **25/25** | ✅ Aprovada | Command→Agent→Skill orchestration, Git Worktrees isolation, subagent specialization |
| `awesome-llm-apps` | **24/25** | ✅ Aprovada | RAG pipeline, single/multi-agent blueprints, streaming UI, eval-driven self-improvement |
| `nodebestpractices` | **24/25** | ✅ Aprovada | Operational vs Programmer error handling, async safety, layered architecture, secure config |
| `ios-good-practices` | **20/25** | ✅ Aprovada | MVCS/MVVM/VIPER, event patterns (delegation, signals, KVO), Store async API, DI, Instruments debugging |
| `android-best-practices` | **18/25** | ✅ Aprovada | Feature-based packages (encapsulation), modular build migration, LeakCanary/Stetho debugging |
| `project-guidelines` | **18/25** | ✅ Aprovada | PR quality checklist, git conventions, lint automation |
| `react-boilerplate` | **19/25** | ✅ Aprovada | Dynamic reducer/saga injection (code splitting), offline-first, time-travel debugging |
| `JavaScript` (TheAlgorithms) | **17/25** | ✅ Aprovada | Data structures & algorithms reference para otimizações |
| `ECC` | **25/25** | ✅ Aprovada | Harness-native agent OS, Planner-Executor-Critic pipelines, Loop Operator, Silent Failure Hunter, Eval-Driven TDD |
| `agent-skills` | **22/25** | ✅ Aprovada | Skills como unidade reutilizável, frontmatter contract, skill review gates |
| `anthropics_skills` | **21/25** | ✅ Aprovada | Prompt engineering patterns, chain-of-thought templates, tool-use schemas |
| `openclaude` | **20/25** | ✅ Aprovada | Agent orchestration, context management, multi-model routing |
| <!-- WAVE 3 --> `oh-my-openagent` | **23/25** | ✅ Aprovada | Orchestrator-never-writes-code, ULW decision flow, category-based routing, Boulder resume, Kibitzer memory, 5 verification gates, DAG orchestration, team mode, 3-tier MCP, hashline safe edits |
| <!-- WAVE 3 --> `andrej-karpathy-skills` | **24/25** | ✅ Aprovada | Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution, LLM pitfall patterns |
| <!-- WAVE 3 --> `cc-switch` | **22/25** | ✅ Aprovada | Dual-mode projection (Direct/Proxy), live write engine (hash→plan→stage→backup→verify→rename), pending-intent journal, DeviceStore local-vs-sync, per-format patchers, golden snapshot tests |
| <!-- WAVE 3 --> `distilly` | **20/25** | ✅ Aprovada | Dual-artifact distillation (Work Skill + Persona), 6-dimension research, taste hierarchy, budget-friendly/unfriendly quality gates, incremental evolution loop, markdown patch merge, version manager with retention, path-traversal hardening |
| <!-- WAVE 3 --> `skillpper` | **22/25** | ✅ Aprovada | Skill registry layout, frontmatter contract, deterministic `.skill` bundling, bundle validation (parity/budgets/hardening), dedup (DUP001/DUP002), trusted-base CI, GitHub Discussions ranking, exception policy versioned |

**Métricas consolidadas (18 repos):**
- Score médio: **21.6/25**
- Scores > 20: 14/18 (78%)
- Scores = 25: 2/18 (11%)
- Padrões extraídos: 85+ itens únicos
- Templates/checklists gerados: 20+

---

## 🏗️ PATTERNS CONSOLIDADOS POR CATEGORIA

### 1. FEATURE ARCHITECTURE
| Pattern | Fonte | Aplicação |
|---------|-------|-----------|
| **Feature-based packages / modules** | android-best-practices, nodebestpractices | Isolamento de features, fácil remoção, clear boundaries |
| **Dynamic reducer/saga injection** | react-boilerplate | Code-splitting por feature, bundle inicial mínimo |
| **Store Layer (Async) + Dependency Injection** | ios-good-practices, nodebestpractices | Separação data/logic, testabilidade, cache transparente |
| **Command→Agent→Skill Orchestration** | claude-code-best-practice | Features complexas multi-step decompostas em agentes especializados |
| **RAG Pipeline (Ingest → Chunk → Embed → Retrieve → Generate → Eval)** | awesome-llm-apps | Features LLM end-to-end com avaliação automática |
| **Multi-Agent Orchestration (Planner-Executor-Critic)** | awesome-llm-apps, ECC | Features que exigem raciocínio distribuído, planejamento rigoroso e avaliação de qualidade |
| **Autonomous Loop Operator (Monitor-Intervene-Recover)** | ECC | Execução de tarefas iterativas longas com detecção de stalls e auto-recovery |
| **Harness-Native Agent OS** | ECC | Abstração de múltiplos harnesses (Cursor, OpenCode, Codex) via skills e hooks |
| **Silent Failure Hunting** | ECC | Detecção proativa de erros engolidos e falta de propagação em pipelines complexos |
| <!-- WAVE 3 --> **Orchestrator-Never-Writes-Code** | oh-my-openagent | Main agent só orquestra (plan/exec/delegate/verify); todo código produto via `task` workers |
| <!-- WAVE 3 --> **ULW Decision Flow** | oh-my-openagent | quick-fix→direct; tedious-context→`ulw`; reviewable-plan→`/ulw-plan`+`/ulw-execute`; ordering→`mass-ulw`; overlapping-lanes→team mode |
| <!-- WAVE 3 --> **Category-Based Routing (Intent, não Model Name)** | oh-my-openagent | `quick/unspecified-low/unspecified-high/visual-engineering/writing/deep/ultrabrain/architect` + delegation router table |
| <!-- WAVE 3 --> **Task Contract (category XOR subagent_type)** | oh-my-openagent | Exatamente um dos dois mutuamente exclusivos; `model` só com `subagent_type`; batch `tasks:[...]` fanout |
| <!-- WAVE 3 --> **Curated Read-Only Agents** | oh-my-openagent | `explore` (grep), `librarian` (docs remotos), `plan-consultant/reviewer` (plan-gated) — in-process, sem write |
| <!-- WAVE 3 --> **Plan-Gate Rules** | oh-my-openagent | Consultant/reviewer só após `/ulw-plan` + `.omo/plans/*.md` tocado + sem `/ulw-execute`; bare `ulw` self-review |
| <!-- WAVE 3 --> **5 Verification Gates** | oh-my-openagent | Plan reread, automated verification, Manual-QA artifact, adversarial QA, cleanup receipts → ledger `.omo/ulw-execute/ledger.jsonl` |
| <!-- WAVE 3 --> **Boulder State (Resume-Safe Orchestration)** | oh-my-openagent | `.omo/boulder.json` multi-work registry (`works`+`active_work_id`, `session_ids` prefix `senpi:`), continuation steering + idle re-inject max 8 |
| <!-- WAVE 3 --> **Mass-ULW DAG Orchestration** | oh-my-openagent | Nodes `{id,prompt,category,dependsOn}`, 1 run por fase via `workflow` tool, `retry`/`send`/`amend` sem re-run; `dependency-frontier` engine com WAL + fingerprint recovery |
| <!-- WAVE 3 --> **Team Mode (Lead + Background Members)** | oh-my-openagent | `team_create`/`team_send_message`/`team_task_*`/`team_delete`, no nested teams, fire-and-forget, mailbox durable + poll |
| <!-- WAVE 3 --> **Task Runners: In-Process vs Process Isolation** | oh-my-openagent | In-process (default, barato, mesmos tool closures) vs process (isolado, JSON-RPC steer, transcript persistido, respawn sem replay); `auto` detecta host capability |
| <!-- WAVE 3 --> **Checkout Isolation (CoW Clone por Child)** | oh-my-openagent | Merge-back só em `completed`, patch+summary em outros endings, backends `auto/apfs/btrfs/zfs/reflink/overlayfs/block-clone/rcopy` |
| <!-- WAVE 3 --> **Kibitzer Memory Recall** | oh-my-openagent | Sidecar read-only por sessão, bounded redacted events, wake só em candidato não-julgado, max 2 wakes concorrentes, 8 tool calls/wake |
| <!-- WAVE 3 --> **3-Tier MCP System** | oh-my-openagent | Built-in (3 remote HTTP + 1 local stdio `lsp`) + Claude Code `.mcp.json` (env allowlist) + skill-embedded (per-session, stdio+HTTP, OAuth2 PKCE+DCR) |
| <!-- WAVE 3 --> **Hashline Edit+Read Pairing** | oh-my-openagent | Todo `Read` tagged com `LINE#ID` content hashes (`ZPMQVRWSNKTXJBYH`); edit rejeita em hash mismatch |
| <!-- WAVE 3 --> **Prompt Async Gate (Única Rota Sanctionada)** | oh-my-openagent | `dispatchInternalPrompt`; reserve-per-session, post-dispatch hold, restore optimistic state; audit estático proíbe raw `session.promptAsync` |
| <!-- WAVE 3 --> **5-Tier Hook Composition** | oh-my-openagent | Session(24)+ToolGuard(18)+Transform(8)+Continuation(7)+Skill(2)=59 slots, config-gated via `createCoreHooks`+`createContinuationHooks`+`createSkillHooks` |
| <!-- WAVE 3 --> **Dual-Mode Projection (Direct vs Proxy)** | cc-switch | Operações idempotentes `DB + mode-state → client files`, sem snapshots |
| <!-- WAVE 3 --> **Live Write Engine (Plan→Stage→Backup→Verify→Rename)** | cc-switch | Read bytes+hash → parse → patch in-memory → plan → stage temp file → backup first-write → re-read hash → rename; conflito otimista documentado |
| <!-- WAVE 3 --> **Pending-Intent Journal** | cc-switch | Pre/post hash + staged temp por arquivo com forward-roll / discard após crash |
| <!-- WAVE 3 --> **Dual-Artifact Distillation (Work Skill + Persona)** | distilly | PART A/B + Operating Rules; Persona seleciona preferências derivadas → módulos preenchem execução |
| <!-- WAVE 3 --> **6-Dimension Parallel Research** | distilly | Writings/conversations/expression/decisions/external/timeline |
| <!-- WAVE 3 --> **Incremental Evolution Loop** | distilly | Append-files delta merge + conversation correction + version backup/rollback |
| <!-- WAVE 3 --> **Skill Registry Layout (SKILL.md raiz + INFRASTRUCTURE_ROOTS)** | skillpper | `INFRASTRUCTURE_ROOTS = {.git,.github,.conductor,docs,scripts,tests,security}`; validação INV002/003/005 |
| <!-- WAVE 3 --> **Deterministic `.skill` Bundling** | skillpper | ZIP: paths POSIX ordenados, timestamp fixo 1980-01-01, só modos 644/755, sem symlinks, archive fora do source dir |
| <!-- WAVE 3 --> **Bundle Validation (Parity + Budgets + Hardening)** | skillpper | `BUNDLE_EXTRA/MISSING/MISMATCH`, budgets (20 MiB comp / 50 MiB exp / 500 membros / ratio 100:1), zip-slip/path-traversal, sem nested archives |
| <!-- WAVE 3 --> **Trusted-Base Validator (Supply Chain)** | skillpper | CI usa policy/exceptions/validator do `base_sha` verificado, não do candidato; `_verify_trusted_base` checa `HEAD == base_sha` + bytes idênticos |
| <!-- WAVE 3 --> **GitHub Discussions Ranking (Marker Oculto)** | skillpper | `<!-- skillpper-vote-skill: X -->` + mapping `docs/vote-discussions.json` (ignora cópias), workflow a cada 5 min |

### 2. STATE MANAGEMENT
| Pattern | Trade-off | Quando usar |
|---------|-----------|-------------|
| **Redux + Saga + Dynamic Injection** | Verboso, mas time-travel debugging nativo | Apps enterprise grandes com time travel necessário |
| **Zustand / TanStack Query** | Leve, server-state first | Modern React apps, substitui Redux boilerplate |
| **Swift Combine / Async-Await** | Native, structured concurrency | iOS 15+, substitui ReactiveCocoa |
| **Android Flow / Coroutines** | Kotlin-first, lifecycle-aware | Modern Android, substitui RxJava |
| <!-- WAVE 3 --> **LiveState Versionado (Forward-Compat)** | cc-switch | `STATE_VERSION=1`, `extra: Map` flatten, campos unknown preservados — config clients desktop |
| <!-- WAVE 3 --> **Boulder Multi-Work Registry** | oh-my-openagent | Resume-safe orchestration longa-duração, multi-sessão, idle re-injection |

### 3. REFACTORING PATTERNS
| Pattern | Fonte | Passos-chave |
|---------|-------|--------------|
| **Strangler Fig (Legacy → Modern)** | ios-good-practices, android-best-practices | 1) Identify boundary 2) Create facade 3) Route new traffic 4) Incremental replace 5) Remove old |
| **Branch by Abstraction** | nodebestpractices (layered arch) | 1) Extract interface 2) Parallel implementation 3) Feature flag switch 4) Remove old |
| **Parallel Run / Shadow Mode** | awesome-llm-apps (eval-driven) | 1) Run new + old simultaneously 2) Compare outputs via evals 3) Gradual traffic shift |
| **Feature Flags for Trunk-Based Dev** | project-guidelines | Short-lived flags, automated cleanup, kill switch |
| <!-- WAVE 3 --> **Simplicity First (Anti-Overengineering)** | andrej-karpathy-skills | Minimum code that solves the problem. Nothing speculative. No features beyond what was asked. No abstractions for single-use code. |
| <!-- WAVE 3 --> **Surgical Changes (Anti-Drive-By Refactoring)** | andrej-karpathy-skills | Touch only what you must. Clean up only your own mess. Every changed line should trace directly to the user's request. |
| <!-- WAVE 3 --> **Goal-Driven Execution (Test-First Loops)** | andrej-karpathy-skills | Don't tell it what to do, give it success criteria and watch it go. LLMs are exceptionally good at looping until they meet specific goals. |
| <!-- WAVE 3 --> **Think Before Coding** | andrej-karpathy-skills | Models make wrong assumptions silently. They don't manage confusion, don't seek clarifications, don't surface inconsistencies. Force planning phase. |

### 4. LEGACY MIGRATION
| Migração | Estratégia | Ferramentas |
|----------|------------|-------------|
| **ObjC → Swift → SwiftUI** | Strangler Fig por feature/module | Swift interop, SwiftUI previews |
| **RxJava → Coroutines/Flow** | Function-by-function com runCatching | `kotlinx.coroutines`, `runBlocking` tests |
| **Redux → Zustand/TanStack Query** | Feature-by-feature, coexistência temporária | Redux DevTools para comparação |
| **CocoaPods → SPM** | Package per feature, modular build | `Package.swift` local dependencies |
| **Monorepo → Feature Worktrees** | Git worktrees para isolamento paralelo | `claude-code-best-practice` worktree isolation |
| <!-- WAVE 3 --> **CoW Checkout Isolation para Agent Workers** | oh-my-openagent | Merge-back só em `completed`, patch+summary em outros endings, backends `auto/apfs/btrfs/zfs/reflink/overlayfs/block-clone/rcopy` |

### 5. PERFORMANCE
| Technique | Fonte | Contexto |
|-----------|-------|----------|
| **Code Splitting por Feature (Dynamic Import)** | react-boilerplate | Reducer/saga injection on demand |
| **Virtualization / Windowing** | (implícito react-boilerplate) | Lists grandes, tables |
| **Semantic Caching para LLM** | awesome-llm-apps (gap) | Redis + embeddings similarity |
| **Bundle Analysis + Tree Shaking** | react-boilerplate (webpack) | Vite/Next.js substitui webpack manual |
| **Offline-First / Service Worker** | react-boilerplate | PWA, background sync |
| <!-- WAVE 3 --> **Hash-Based Skip Write (Proxy Contract Digest)** | cc-switch | `key` (digest) para skip de escrita + `exclusive` fields removidos só se valor igual |
| <!-- WAVE 3 --> **Research Merge + Metrics Summarizer** | distilly | URL count, weight distribution 1-7, track coverage, long-quote heuristic |
| <!-- WAVE 3 --> **Bounded Git Tree Reading (Budgets)** | skillpper | 100 MiB scan / 10k entries / 500 arquivos por root / 1 MiB texto / 5 MiB binário; `cat-file --batch` sem checkout |

### 6. DEBUGGING & OBSERVABILITY
| Tool/Pattern | Fonte | Uso |
|--------------|-------|-----|
| **Exception Breakpoint (Xcode)** | ios-good-practices | Crash para linha exata |
| **Instruments Allocations** | ios-good-practices | Memory leaks via instance count |
| **LeakCanary (Android)** | android-best-practices | Runtime leak detection |
| **Stetho / Flipper** | android-best-practices | Network + DB inspection |
| **Structured Logging + Correlation IDs** | nodebestpractices | Distributed tracing |
| **Redux DevTools Time Travel** | react-boilerplate | State replay, action log |
| **Ultrareview / Agentic Code Review** | claude-code-best-practice | AI-assisted systematic review |
| **Systematic Debugging (Hypothesis → Test → Verify)** | superpowers skills | Root cause tracing |
| <!-- WAVE 3 --> **Evidence-Based QA (NO EVIDENCE == NO QA == NO COMMIT)** | oh-my-openagent | `.omo/evidence/<slug>/`, gitignored, audit falha se tracked |
| <!-- WAVE 3 --> **Golden Snapshot Tests por App/Harness** | cc-switch | `snapshots/{mcp,modes,rows}` + `golden/*.rs` + fixtures de sessões por provider (6 harnesses) |
| <!-- WAVE 3 --> **Quality-Check Evaluator as Code** | distilly | Grounded-URL filter, copyright safety, PASS/FAIL review chain |
| <!-- WAVE 3 --> **Deterministic Reports com Redação + Fingerprint** | skillpper | `[REDACTED]` p/ tokens/keys, escape markup, fingerprint `sha256(rule↔path↔content)`, exit codes 0/1/2 |

### 7. API DESIGN
| Pattern | Fonte | Detalhe |
|---------|-------|---------|
| **Async Store API (SignalProducer / Futures / async-await)** | ios-good-practices | Deferral mechanism, cancellation |
| **Operational vs Programmer Errors** | nodebestpractices | Crash on bugs, retry on operational |
| **tRPC / Type-safe Endpoints** | (gap geral) | End-to-end type safety |
| **GraphQL Federation** | (gap) | Micro-frontends / multi-team APIs |
| <!-- WAVE 3 --> **Tauri Invoke Typed Wrapper por Domínio** | cc-switch | `providersApi.getAll/getCurrent` + evento `ProviderSwitchEvent` via `listen` |
| <!-- WAVE 3 --> **Per-Format Patchers Isolados + Per-App Projections** | cc-switch | `live/patch/{toml,json,dotenv}.rs` + `live/project/{claude,gemini,codex,grok}.rs` |
| <!-- WAVE 3 --> **Official Provider Seeds Idempotentes** | cc-switch | `is_official_seed_id` como single source of truth escaneando `OFFICIAL_SEEDS` |
| <!-- WAVE 3 --> **Editor Save com 3-Way Merge** | cc-switch | `base` + `draft` + `onConflict: refuse\|keepMine\|keepTheirs` + view de `inactive` fields |
| <!-- WAVE 3 --> **Lock Ordering Explícito (Sem Nesting Reverso)** | cc-switch | `ProxyService::lock_switch_for_app` (externo) → engine app-write lock (interno), nunca inverso |

### 8. CROSS-CUTTING CONCERNS
| Concern | Solution |
|---------|----------|
| **Auth** | Short-lived JWT + refresh, PKCE para mobile |
| **i18n** | Namespaced keys (`error_message_network`), ICU plurals |
| **Theming** | Design tokens (colors/dimens palettes) → styles → components |
| **Error Boundaries** | React: component-level; Mobile: global handler + crash reporting |
| **Retry / Circuit Breaker** | Exponential backoff + jitter, circuit breaker state per dependency |
| <!-- WAVE 3 --> **Memory Secret Screening (7 Pattern Classes)** | oh-my-openagent | Refuse-on-commit (staged content+filenames), mask-on-inject (`***`), sem leak em errors/logs |
| <!-- WAVE 3 --> **Path-Traversal Hardening (`validate_path_segment`, `resolve_contained_child`)** | distilly, skillpper | Slug kebab-case 40 chars, ZIP slip protection, bounded filesystem ops |
| <!-- WAVE 3 --> **Copyright-Safety Compression (Paraphrase + Metadata Only)** | distilly | No full transcripts, short quotes, delete temp JSON |
| <!-- WAVE 3 --> **Exception Policy Versioned (Só SEC003/DUP001 Waivable)** | skillpper | Path exato (sem globs), bind em `content_sha256`, aprovador ∈ maintainers, lifetime ≤30 dias |
| <!-- WAVE 3 --> **Device-Local State Separado de Config Sync** | cc-switch | `DeviceStore` fixo em `~/.cc-switch` (live-state.json + backups) não segue sync dir |

---

## ❌ GAPS IDENTIFICADOS (Prioridade Alta)

1. **SwiftUI / Swift Concurrency Migration Playbook** — Strangler Fig patterns para migrar UIKit+RxJava → SwiftUI+Combine
2. **Guardrails & Segurança RAG em Produção** — Prompt injection, PII redaction, semantic caching
3. **Cost Optimization LLM** — Semantic cache, batching, model routing (cheap→expensive)
4. **Distributed Tracing OpenTelemetry Node.js** — Instrumentação automática, context propagation
5. **Zero-Downtime Deploy Runbook** — Graceful shutdown, health probes, PM2/K8s
6. **Feature Flag Framework** — Avaliação no edge, gradual rollout, kill switch automático
7. <!-- WAVE 3 --> **Task Tool Schema/Implementation Deep-Dive** — `validation.ts`, runners, DAG engine `packages/senpi-task/src/dag/` (oh-my-openagent)
8. <!-- WAVE 3 --> **Orchestration Benchmarks** — Overhead do orchestrator, latência task spawn, token cost por pattern `ulw` vs `mass-ulw` vs team (oh-my-openagent)
9. <!-- WAVE 3 --> **Contract Testing Orchestrator↔Worker** — Protocolo `task`/`task_send`/`task_output` (oh-my-openagent)
10. <!-- WAVE 3 --> **Rollback/Compensation em DAG Failure** — Saga/compensation além de `retry`/`send`/`amend` (oh-my-openagent)
11. <!-- WAVE 3 --> **Cross-Process File Locking (flock) para Atomic Client Config Writes** — Race admitida em `cc-switch` live write engine
12. <!-- WAVE 3 --> **Schema Validation por AppType no Boundary Tauri** — Zod front + serde strict back com erro tipado `LiveWriteError`
13. <!-- WAVE 3 --> **Failover Queue Health-Check/Circuit-Breaker Runtime** — `inFailoverQueue` sem lógica visível (cc-switch)
14. <!-- WAVE 3 --> **Keyring/OS Credential Store para Secrets** — Escrita 0600 é bom mas falta menção a keyring (cc-switch)
15. <!-- WAVE 3 --> **Distillation Regression Tests (Known-Answer/Edge/Voice Blind)** — `quality_check.py` só heurística (distilly)
16. <!-- WAVE 3 --> **API/DB Wrapper para Distillation Pipeline** — FastAPI + Postgres para skills/manifests/versions (distilly)
17. <!-- WAVE 3 --> **Observabilidade Training Loop (Tokens, Custo, Latência por Dimensão)** — OpenTelemetry + budget tracker (distilly)
18. <!-- WAVE 3 --> **Concurrency/Locking em Skill Writer + Version Manager** — Race em updates paralelos corrompe `meta.json` (distilly)
19. <!-- WAVE 3 --> **Versionamento Semântico por Skill** — Frontmatter sem `version`, impossível pin/yank/upgrade (skillpper)
20. <!-- WAVE 3 --> **Resolvedor de Dependências Transitivas** — Strings livres sem range/resolver, instalação manual (skillpper)
21. <!-- WAVE 3 --> **Discovery Avançado (Keywords/Search/Compatibilidade por Agent)** — Campos `tags[]`, `agents[]`, índice pesquisável (skillpper)
22. <!-- WAVE 3 --> **Mecanismo Yank/Deprecation/Rename** — `redirects: {old-name: new-name}` no index + finding `INV006 deprecated` (skillpper)

---

## 🎯 ADRs PROPOSTAS PARA APROVAÇÃO

| ADR | Título | Status |
|-----|--------|--------|
| ADR-001 | Feature-based packaging as default for all new features (mobile + backend) | 🟡 Em revisão |
| ADR-002 | Async Store Layer pattern (Signals → Swift Concurrency / async-await) | 🟡 Em revisão |
| ADR-003 | Multi-agent orchestration pattern (Planner-Executor-Critic) for complex AI features | 🟡 Em revisão |
| ADR-004 | Git Worktrees + Subagent isolation for parallel feature development | 🟡 Em revisão |
| ADR-013 | Supply chain security (SBOM, signature verification, provenance) | 🟡 Em revisão |
| ADR-016 | SAST/DAST integration in CI pipeline | 🟡 Em revisão |
| <!-- WAVE 3 --> ADR-towards-orchestrator-never-writes-code | Orchestrator agents only coordinate; product code via task workers | 🟡 Proposta |
| <!-- WAVE 3 --> ADR-distillation-pipeline | Adopt Work+Persona split + audit/synthesis/validation chain as knowledge compression standard | 🟡 Proposta |
| <!-- WAVE 3 --> ADR-atomic-client-config-writes | Flock cross-process vs optimistic+telemetry for config file writes | 🟡 Proposta |
| <!-- WAVE 3 --> ADR-skill-registry-versioning-and-deps | Semver + typed dependencies[] in skill-review.yaml before adopting template | 🟡 Proposta |
| <!-- WAVE 3 --> ADR-category-based-agent-routing | Intent-based category routing instead of model names for agent dispatch | 🟡 Proposta |
| <!-- WAVE 3 --> ADR-resumable-orchestration-boulder | Boulder.json + ledger.jsonl as standard for long-running multi-agent workflows | 🟡 Proposta |

---

## 📋 TEMPLATES CRIADOS / A CRIAR

| Template | Localização | Status |
|----------|-------------|--------|
| `git-conventions.md` | `workflow/` | ✅ Extraído (project-guidelines) |
| `pr-standards.md` | `workflow/` | ✅ Extraído (project-guidelines) |
| `feature-scaffold-generator.md` | `generators/` | ✅ Extraído (react-boilerplate) |
| `xconfig-env-management.md` | `build/` | ✅ Extraído (ios-good-practices) |
| `rag-pipeline-blueprint.md` | `ai/` | 🔲 A criar (awesome-llm-apps) |
| `multi-agent-orchestration.md` | `ai/` | 🔲 A criar (awesome-llm-apps) |
| `command-agent-skill-workflow.md` | `ai/` | 🔲 A criar (claude-code-best-practice) |
| `error-handling-guidelines.md` | `backend/` | 🔲 A criar (nodebestpractices) |
| <!-- WAVE 3 --> `brownfield-plan-prompt.md` | `templates/` | 🔲 A criar (oh-my-openagent §303-312) |
| <!-- WAVE 3 --> `omo-jsonc-layered-config.md` | `templates/` | 🔲 A criar (oh-my-openagent unified config) |
| <!-- WAVE 3 --> `tauri-invoke-typed-client` | `templates/tauri/` | 🔲 A criar (cc-switch `src/lib/api/providers.ts`) |
| <!-- WAVE 3 --> `skill-manifest-v3` | `templates/skills/` | 🔲 A criar (distilly schema v3 + manifest) |
| <!-- WAVE 3 --> `skill-review.yaml` | `templates/skills/` | 🔲 A criar (skillpper CONTRIBUTING.md:30-55 + version/tags extensão) |
| <!-- WAVE 3 --> `simplicity-first.md` | `guidelines/` | ✅ Criado (andrej-karpathy-skills) |
| <!-- WAVE 3 --> `think-before-coding.md` | `guidelines/` | ✅ Criado (andrej-karpathy-skills) |
| <!-- WAVE 3 --> `surgical-changes.md` | `guidelines/` | ✅ Criado (andrej-karpathy-skills) |
| <!-- WAVE 3 --> `goal-driven-execution.md` | `patterns/` | ✅ Criado (andrej-karpathy-skills) |

---

## 📝 CHECKLISTS CRIADOS / A CRIAR

| Checklist | Localização | Status |
|-----------|-------------|--------|
| `secure-config-checklist.md` | `backend/` | 🔲 A criar (nodebestpractices) |
| `graceful-shutdown-health-probes.md` | `backend/` | 🔲 A criar (nodebestpractices) |
| `pr-quality-features.md` | `workflow/` | 🔲 A criar (project-guidelines) |
| `android-debug-toolkit.md` | `debugging/` | 🔲 A criar (android-best-practices) |
| `ios-debug-toolkit.md` | `debugging/` | 🔲 A criar (ios-good-practices) |
| <!-- WAVE 3 --> `plan-review-5-gates.md` | `checklists/` | 🔲 A criar (oh-my-openagent approval-biased review) |
| <!-- WAVE 3 --> `distillation-quality-gate.md` | `checklists/` | 🔲 A criar (distilly mental models, expression DNA, honest boundaries, source grounding ≥2/4, copyright safety) |
| <!-- WAVE 3 --> `multi-harness-config-switching.md` | `checklists/` | 🔲 A criar (cc-switch per-app projection + golden snapshots) |
| <!-- WAVE 3 --> `new-skill-submission.md` | `checklists/` | 🔲 A criar (skillpper frontmatter → manifest happy/boundary → index → validator → bundle) |

---

## 📚 RUNBOOKS CRIADOS / A CRIAR

| Runbook | Localização | Status |
|---------|-------------|--------|
| <!-- WAVE 3 --> `resumable-orchestration-boulder.md` | `runbooks/` | 🔲 A criar (boulder.json + ledger.jsonl + continuation) |
| <!-- WAVE 3 --> `provider-failover-queue.md` | `runbooks/` | 🔲 A criar (cc-switch `failover.ts` + `inFailoverQueue` end-to-end) |
| <!-- WAVE 3 --> `incremental-distillation-loop.md` | `runbooks/` | 🔲 A criar (distilly append → merger → backup → patch → quality_check → rollback) |
| <!-- WAVE 3 --> `skill-bundle-release.md` | `runbooks/` | 🔲 A criar (skillpper receita determinística + verificação paridade `BUNDLE_*` + budgets) |

---

## 🛠️ SKILLS REUTILIZÁVEIS CRIADAS / A CRIAR

| Skill | Localização | Status |
|-------|-------------|--------|
| `karpathy-guidelines` | `_consolidado/skills/` | 🔲 A criar (andrej-karpathy-skills) |
| <!-- WAVE 3 --> `category-routing` | `_consolidado/skills/` | 🔲 A criar (oh-my-openagent intent→category) |
| <!-- WAVE 3 --> `tauri-live-config-engine` | `_consolidado/skills/` | 🔲 A criar (cc-switch hash→plan→stage→verify→rename pipeline) |
| <!-- WAVE 3 --> `distillation-eval` | `_consolidado/skills/` | 🔲 A criar (distilly harness known-answer + edge + voice blind test) |
| <!-- WAVE 3 --> `skill-registry-reviewer` | `_consolidado/skills/` | 🔲 A criar (skillpper checklist automatizável: layout, frontmatter, manifest, links, dedup, bundle, policy) |

---

## 🔄 PRÓXIMOS PASSOS (Batch 2+ Wave 3 Consolidado)

- [ ] Processar repos restantes em `Repositorios/` (3 repos restantes)
- [ ] Aprovar ADRs pendentes com Severino (11 total: 6 anteriores + 5 Wave 3)
- [ ] Popular templates e checklists acima (20+ itens)
- [ ] Criar skills reutilizáveis em `_consolidado/skills/` (5 Wave 3 + anteriores)
- [ ] Cross-ref com Niamaia: ADR-distillation-pipeline, ADR-skill-registry-versioning-and-deps
- [ ] Cross-ref com Trevor: ADR-atomic-client-config-writes, cc-switch Tauri stack, supply chain ADR-013
- [ ] Cross-ref com Kaspersky: skillpper trusted-base validator, oh-my-openagent secret screening, path-traversal hardening
- [ ] Cross-ref com Guanabara: karpathy-guidelines skill, distillation-eval teaching patterns

---

*Atualizado por Towards (Subagente) — 2026-10-09*
*Wave 3 integrated: oh-my-openagent, andrej-karpathy-skills, cc-switch, distilly, skillpper*