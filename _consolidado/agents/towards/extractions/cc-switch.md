# EXTRAÇÃO — cc-switch

## METADADOS
- **Repositório**: `cc-switch`
- **Lead Responsável**: `towards`
- **Funcionário (Subagente)**: `towards`
- **Data**: `2026-10-09`
- **Tempo gasto**: `0h 25min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | All-in-One Assistant for Claude Code, Codex & Gemini CLI — one-click switch de API providers, gestão unificada de MCP, Skills e prompts sem editar JSON/TOML/YAML manualmente |
| **Público-alvo** | devs que usam múltiplos coding agents (Claude Code, Codex, Gemini CLI, OpenCode, Pi, etc.) |
| **Tamanho** | ~101 arquivos top-level scan truncado; frontend React 18 + backend Tauri 2 (Rust); `src-tauri/src/` com ~19 módulos root + subpastas `commands/` (23), `database/dao/` (13), `live/`, `mode/` (7), `session_manager/providers/` (15); `src/lib/api/` (26 arquivos), `src/lib/query/` (14); `tests/` com unit + integration |
| **Linguagens/Tech** | TypeScript strict (React 18, Vite 7, TanStack Query v5, Zustand-implícito via query, Tailwind 3, Radix UI, react-hook-form+zod, i18next), Rust (Tauri 2.8, axum 0.7, tokio, rusqlite bundled, rquickjs, serde/toml), SQLite, Vitest 2 + Testing Library + MSW, Rust tests + golden snapshots |
| **Freshness** | v4.0.4 ativa; `src/whats-new/4.0.x.json`; i18n em 4 locales (en/zh/zh-TW/ja); commits recentes, docs multilíngues (EN/ZH/JA/DE) |

---

## 2. O QUE PRESTA PARA **TOWARDS** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Dual-mode controller: Direct vs Proxy como projeção idempotente `DB + mode-state → client files`, sem snapshots | `src-tauri/src/mode/controller.rs:1-20` | Pattern | `agents/towards/backend-patterns.md` | 🔴 Alta |
| Proxy contract com `key` (digest) para skip de escrita + `exclusive` fields removidos só se valor igual | `src-tauri/src/mode/state.rs:59-69` | Pattern | `agents/towards/backend-patterns.md` | 🔴 Alta |
| Live write engine: read bytes+hash → parse → patch in-memory → plan → stage temp file → backup first-write → re-read hash → rename; conflito otimista documentado | `src-tauri/src/live/engine.rs:1-10` | Pattern | `agents/towards/backend-patterns.md` | 🔴 Alta |
| `DeviceStore` fixo em `~/.cc-switch` (live-state.json + backups) separado de config dir sincronizável — fato local do device não segue sync | `src-tauri/src/live/engine.rs:25-55` | Guideline | `agents/towards/backend-patterns.md` | 🟠 Média |
| `LiveFile { path, private }` — flag `private` => escrita 0600 para arquivos com keys | `src-tauri/src/live/engine.rs:57-78` | Code snippet | `agents/towards/backend-patterns.md` | 🟠 Média |
| `LiveState` versionado (`STATE_VERSION=1`, `extra: Map` flatten para forward-compat, campos unknown preservados) | `src-tauri/src/mode/state.rs:26-50` | Pattern | `agents/towards/backend-patterns.md` | 🟠 Média |
| Pending-intent journal por arquivo (pre/post hash + staged temp) com forward-roll / discard após crash | `src-tauri/src/mode/state.rs:1-8` | Pattern | `agents/towards/backend-patterns.md` | 🔴 Alta |
| Lock ordering explícito: `ProxyService::lock_switch_for_app` (externo) → engine app-write lock (interno), nunca inverso | `src-tauri/src/mode/controller.rs:18-19` | Guideline | `agents/towards/backend-patterns.md` | 🟠 Média |
| Per-format patchers isolados: `live/patch/{toml,json,dotenv}.rs` + per-app projections `live/project/{claude,gemini,codex,grok}.rs` | `src-tauri/src/live/` (listing) | Pattern | `agents/towards/backend-patterns.md` | 🟠 Média |
| Official provider seeds idempotentes (id fixo, `is_official_seed_id` como single source of truth escaneando `OFFICIAL_SEEDS`) | `src-tauri/src/database/dao/providers_seed.rs:13-91` | Code snippet | `agents/towards/backend-patterns.md` | 🟠 Média |
| Provider model unificado: `settingsConfig: Record<string,any>` polimórfico por app + `meta` separado (não vai para live config) + `category`/`inFailoverQueue`/`sortIndex` | `src/types.ts:1-31` | Pattern | `agents/towards/frontend-patterns.md` | 🟠 Média |
| Editor save com 3-way merge: `base` + `draft` + `onConflict: refuse\|keepMine\|keepTheirs` + view de `inactive` fields | `src/lib/api/providers.ts:44-65` | Pattern | `agents/towards/frontend-patterns.md` | 🟠 Média |
| Tauri invoke typed wrapper por domínio (`providersApi.getAll/getCurrent`, etc.) + evento `ProviderSwitchEvent` via `listen` | `src/lib/api/providers.ts:73-80,11-19` | Code snippet | `agents/towards/frontend-patterns.md` | 🟢 Baixa |
| QueryClient defaults conservadores: `queries.retry=1, staleTime=0, refetchOnWindowFocus=true; mutations.retry=false` | `src/lib/query/queryClient.ts:1-14` | Tool config | `agents/towards/frontend-patterns.md` | 🟢 Baixa |
| Rust backend stack referência Tauri 2 desktop com SQLite bundled + axum proxy + rquickjs sandbox (usage scripts) | `src-tauri/Cargo.toml:25-80` | Tool config | `agents/towards/backend-patterns.md` | 🟢 Baixa |
| Golden snapshot tests por app (`snapshots/{mcp,modes,rows}` + `golden/*.rs`) + fixtures de sessões por provider (6 harnesses) | `src-tauri/tests/golden/`, `tests/fixtures/sessions/` | Checklist | `agents/qualy/test-strategy.md` | 🟠 Média |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Comentários e docs internos majoritariamente em chinês (`engine.rs`, `controller.rs`, `state.rs`) | `src-tauri/src/live/engine.rs:1-10`, `mode/*` | Barreira para contribuidores EN; risco de misread em lógica crítica de escrita | Manter código, adicionar docstrings EN; usar i18n só no UI |
| `settingsConfig: Record<string, any>` sem discriminated union por AppType | `src/types.ts:14` | `any` vaza; validação só via zod/forms espalhados; propenso a mismatch live-projection | `type SettingsConfig = ClaudeSettings \| CodexSettings \| ...` + zod schemas por app |
| Janela de race admitida: re-read+rename vs escrita externa (Claude Code) ainda pode sobrescrever | `src-tauri/src/live/engine.rs:8-10` | Perda de escrita externa em race apertada | File locking cross-process (flock) ou retries com rebase; ao menos telemetry do evento |
| Sponsors/affiliate links hardcoded no README_ZH (13+ blocos) | `README_ZH.md:25-119` | Ruído para extração; acoplamento comercial no README | Mover para `SPONSORS.md` |
| `createdAt/sortIndex` como campos opcionais soltos sem migração versionada no frontend | `src/types.ts:18-19` | Risco de ordenação inconsistente entre devices | Centralizar em DAO com default + teste golden |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] Gap 1: `flock` / atomicidade cross-process real — engine assume lock intra-processo; documentar ADR com opções (SQLite WAL lock file, `fs2::File::lock_exclusive`, retry com backoff). Sugestão: criar `agents/towards/adr/atomic-client-config-writes.md`
- [ ] Gap 2: Schema validation por AppType no boundary Tauri command (zod no front + serde strict no back com erro tipado `LiveWriteError`). Sugestão: template `templates/tauri/command-validation.rs`
- [ ] Gap 3: Failover queue (`inFailoverQueue`) sem lógica visível de health-check/circuit-breaker no slice lido. Sugestão: documentar como runbook `agents/towards/runbooks/provider-failover.md`
- [ ] Gap 4: Segredo em `settingsConfig` + escrita 0600 é bom, mas falta menção a keyring/OS credential store. Sugestão: checklist de secrets em `agents/tranquilao/` (cross-ref com Trevor)

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: dual-mode projection pattern, live write engine (plan→stage→backup→verify→rename), contract-digest skip, pending-intent journal, DeviceStore local-vs-sync separation
- [ ] **Criar ADR**: `atomic-client-config-writes` — Para: decidir flock cross-process vs乐观+telemetry
- [ ] **Criar Template**: `tauri-invoke-typed-client` — Em: `_consolidado/templates/tauri/` (baseado em `src/lib/api/providers.ts`)
- [ ] **Criar Checklist**: `multi-harness-config-switching` — Em: `_consolidado/agents/towards/checklists/` (per-app projection + golden snapshots por harness)
- [ ] **Criar Runbook**: `provider-failover-queue` — Em: `_consolidado/agents/towards/runbooks/` (investigar `failover.ts` + `inFailoverQueue` end-to-end)
- [ ] **Criar Skill**: `tauri-live-config-engine` — Em: `_consolidado/skills/` (reuso do pipeline hash→plan→stage→verify→rename para qualquer CLI config switcher)

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `src-tauri/src/mode/controller.rs:3-5` — "所有操作都是「DB + 模式状态 → 客户端文件」的投影，可以重复执行，没有一个依赖快照" (todas as operações são projeções idempotentes, sem depender de snapshots)

> `src-tauri/src/live/engine.rs:8-10` — "冲突检测是乐观的…「重读比对」和 rename 之间仍有一个极小的窗口，外部写入恰好落在里面时仍会被覆盖。" (conflito otimista com janela residual admitida)

> `src-tauri/src/mode/controller.rs:18-19` — "写引擎的应用写锁在更里面拿，两把锁不反向嵌套。" (ordem de locks explícita, sem nesting reverso)

> `src-tauri/src/live/engine.rs:27-28` — "路径固定为 get_home_dir()/.cc-switch，和 settings.json 一样不跟随配置目录覆盖" (device-local state não segue sync dir)

> `src-tauri/src/database/dao/providers_seed.rs:89-91` — "单一事实源：直接扫描 OFFICIAL_SEEDS，避免在多处重复维护 id 列表。" (single source of truth para seed ids)

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Config switching multi-harness é core do Towards backend; projeção idempotente + write engine diretamente reusáveis |
| **Qualidade** | 4 | Rust bem comentado (mesmo que em ZH), separação patch/projection/state, golden tests; perde 1 ponto por `any` no front e race admitida |
| **Atualidade** | 5 | Tauri 2.8, React 18, TanStack v5, Vitest 2, rusqlite bundled, axum 0.7 — stack moderna e ativa (v4.0.4) |
| **Ação** | 4 | Gera ADR + 2 templates + checklist + runbook + skill imediatamente; falta só detalhar failover runtime |
| **Completude** | 4 | Cobre switch/proxy/direct/seeds/editor-merge/testes; buracos: flock real, validação strict por app, keyring |
| **TOTAL** | **22/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/{lead}/extractions/{repo}.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Template v1.0 — Atualize se precisar de campos extras para seu domínio.*
