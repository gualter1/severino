# TEMPLATE DE EXTRAÇÃO — Para Funcionários (Subagentes)

---

## METADADOS
- **Repositório**: `oh-my-openagent` (ex `oh-my-opencode`, npm dual-publish durante transição)
- **Lead Responsável**: `towards`
- **Funcionário (Subagente)**: `towards`
- **Data**: `2026-10-09`
- **Tempo gasto**: `0h 40min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | "Your tool for real work. But it's an agent." — Um comando `omo` que orquestra agentes multi-modelo: ultrawork (plan-verify-execute), memory system (Kibitzer), teams/workflows DAG, skills seletivas, multi-harness (OpenCode, Codex, Senpi/Pi). |
| **Público-alvo** | Devs que usam coding agents (OpenCode/Codex/Senpi), architects de agent harnesses, platform engineers |
| **Tamanho** | Grande: 45 workspaces Bun (20 Core + 4 MCP + adapters), `docs/` com 30 md (guide 7, reference 18), `packages/senpi-task/src/dag/` ~14k LOC, hooks ~54-62 dirs, CLI 12 comandos |
| **Linguagens/Tech** | TypeScript strict (Bun 1.4.0, tsgo native-preview), Rust (`crates/senpi-desktop-safety`), Node ESM scripts, JSONC+Zod v4 config, Cloudflare Workers (`get-worker`), Next.js 15 (`packages/web`) |
| **Freshness** | Muito ativo: v5.1.24, CHANGELOG, weekly `refresh-model-capabilities.yml`, CI full matrix, `dev`→`master` merge-commit policy, CLA bot |

---

## 2. O QUE PRESTA PARA **TOWARDS** (Extrair para consolidado)

Foco: **Open agent patterns, agent frameworks, orchestration, tool use** (lente backend/API/business-logic).

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Orchestrator-never-writes-code rule: main agent só orquestra (plan/exec/delegate/verify), todo código produto via `task` workers | `docs/guide/orchestration.md:162-163` | Guideline | `agents/towards/orchestration-patterns.md` | 🔴 Alta |
| ULW decision flow: quick-fix→direct; tedious-context→`ulw`; reviewable-plan→`/ulw-plan`+`/ulw-execute`; ordering→`mass-ulw`; overlapping-lanes→team mode | `docs/guide/orchestration.md:9-31` | Guideline | `agents/towards/orchestration-patterns.md` | 🔴 Alta |
| Category-based routing (intent, não model name): `quick/unspecified-low/unspecified-high/visual-engineering/writing/deep/ultrabrain/architect` + delegation router table | `docs/guide/orchestration.md:196-228` | Pattern | `agents/towards/agent-routing.md` | 🔴 Alta |
| `task(category\|subagent_type)` contract: exatamente um dos dois, mutuamente exclusivos; `model` só válido com `subagent_type`; batch `tasks:[...]` fanout; `run_in_background` + `name` handle | `docs/guide/senpi-task.md:9-31` | Pattern | `agents/towards/agent-routing.md` | 🔴 Alta |
| Curated read-only agents: `explore` (codebase grep), `librarian` (remote docs), `plan-consultant`/`plan-reviewer` (plan-gated) — in-process, sem write | `docs/guide/orchestration.md:71-77` | Pattern | `agents/towards/orchestration-patterns.md` | 🔴 Alta |
| Plan-gate rules: consultant/reviewer só após `/ulw-plan` explícito + `.omo/plans/*.md` tocado + sem `/ulw-execute` ainda; bare `ulw` faz self-review no notepad | `docs/guide/orchestration.md:136-141` | Pattern | `agents/towards/plan-review-gates.md` | 🟠 Média |
| Plan-reviewer approval-biased: rejeita só blockers verificados; 5 gates (files exist, usable starting point, no contradiction, QA scenarios nomeiam tool+steps+expected, no missing info); cap 5 rounds | `docs/guide/orchestration.md:122-134` | Checklist | `agents/towards/plan-review-gates.md` | 🟠 Média |
| 5 verification gates por checkbox: plan reread, automated verification, Manual-QA artifact, adversarial QA, cleanup receipts → ledger `.omo/ulw-execute/ledger.jsonl` | `docs/guide/orchestration.md:169-172` | Checklist | `agents/towards/verification-gates.md` | 🔴 Alta |
| Boulder state (resume-safe orchestration): `.omo/boulder.json` multi-work registry (`works`+`active_work_id`, `session_ids` prefix `senpi:`), continuation steering + idle re-inject max 8 | `docs/guide/orchestration.md:169,176-192` | Pattern | `agents/towards/resumable-orchestration.md` | 🔴 Alta |
| mass-ulw DAG: nodes `{id,prompt,category,dependsOn}`, 1 run por fase via `workflow` tool, `retry`/`send`/`amend` sem re-run; `dependency-frontier` engine com WAL + fingerprint recovery | `docs/guide/orchestration.md:240-243`, `AGENTS.md` (DAG engine ~14k LOC) | Pattern | `agents/towards/dag-orchestration.md` | 🔴 Alta |
| Team mode: lead (sessão atual) + members background, `team_create`/`team_send_message`/`team_task_*`/`team_delete`, no nested teams, fire-and-forget (sem `team_wait`), mailbox durable + poll | `docs/guide/team-mode.md:82-126`, `docs/guide/senpi-task.md:88-99` | Pattern | `agents/towards/team-mode.md` | 🟠 Média |
| Team member eligibility: curated read-only + reviewer trio rejeitados no parse, roteados via `task` | `docs/guide/team-mode.md:75-80` | Guideline | `agents/towards/team-mode.md` | 🟢 Baixa |
| Task runners: in-process (default, barato, mesmos tool closures menos task/team/dag) vs process (isolado, JSON-RPC steer, transcript persistido, respawn sem replay); `auto` detecta host capability | `docs/guide/senpi-task.md:33-44` | Decision record | `agents/towards/agent-runners.md` | 🟠 Média |
| Checkout isolation (CoW clone por child): merge-back só em `completed`, patch+summary em outros endings, `isolated_not_revivable`, backends `auto/apfs/btrfs/zfs/reflink/overlayfs/block-clone/rcopy` | `docs/guide/senpi-task.md:100-135` | Pattern | `agents/towards/agent-isolation.md` | 🟠 Média |
| Completion routing: parent idle→sempre acorda; streaming→inject no próximo tool-call boundary (batch ~200ms combinados); compacting/switch/shutdown→buffered+flush; cancel síncrono nunca notifica | `docs/guide/senpi-task.md:69-77` | Pattern | `agents/towards/agent-runners.md` | 🟠 Média |
| Kibitzer memory recall: sidecar read-only por sessão, bounded redacted events, wake só em candidato não-julgado, max 2 wakes concorrentes, 8 tool calls/wake, output `recalled memory: <hint>` ≤200 chars, 1x por memória por sessão | `docs/guide/orchestration.md:79-81`, `docs/reference/configuration.md:637-710` | Pattern | `agents/towards/agent-memory.md` | 🔴 Alta |
| Memory secret screening: 7 pattern classes, refuse-on-commit (staged content+filenames), mask-on-inject (`***`), sem leak em errors/logs | `docs/reference/configuration.md:585-609` | Guideline | `agents/towards/agent-memory.md` | 🟠 Média |
| 3-tier MCP system: built-in (3 remote HTTP + 1 local stdio `lsp`) + Claude Code `.mcp.json` (env allowlist) + skill-embedded (per-session, stdio+HTTP, OAuth2 PKCE+DCR), isolamento por `${sessionID}:${skill}:${server}` | `AGENTS.md` (THREE-TIER MCP SYSTEM) | Pattern | `agents/towards/mcp-strategy.md` | 🟠 Média |
| Hashline edit+read pairing: todo `Read` tagged com `LINE#ID` content hashes (`ZPMQVRWSNKTXJBYH`); edit rejeita em hash mismatch | `AGENTS.md` (ARCHITECTURE INVARIANTS) | Pattern | `agents/towards/safe-edit-protocol.md` | 🟠 Média |
| `prompt_async_gate`: ÚNICA rota sancionada p/ injeção interna (`dispatchInternalPrompt`); reserve-per-session, post-dispatch hold, restore optimistic state; audit estático proíbe raw `session.promptAsync` | `AGENTS.md` (ARCHITECTURE INVARIANTS) | Anti-pattern | `agents/towards/prompt-injection-guard.md` | 🔴 Alta |
| Unified config `omo.jsonc`: user layer + project layers (nearest wins), harness blocks `[opencode]/[native]/[codex]` → `profiles.<P>` → `profiles.<P>.[harness]` → defaults; `mcp_env_allowlist` user-layer-only | `docs/reference/configuration.md:44-92` | Template | `templates/omo-jsonc-layered-config.md` | 🟠 Média |
| 5-tier hook composition: Session(24)+ToolGuard(18)+Transform(8)+Continuation(7)+Skill(2)=59 slots, config-gated (54 default/61 team/62 monitor) via `createCoreHooks`+`createContinuationHooks`+`createSkillHooks` | `AGENTS.md` (ARCHITECTURE INVARIANTS) | Pattern | `agents/towards/hook-composition.md` | 🟠 Média |
| IntentGate keyword detector: classifica intent (`ultrawork/ulw/search/analyze/team`) e injeta mode prompts | `AGENTS.md` (NOTES) | Pattern | `agents/towards/orchestration-patterns.md` | 🟢 Baixa |
| Manifesto "agent invisível": human intervention = failure signal; indistinguishable-from-senior code; token cost OK se 10-100x produtividade; core loop Human Intent→Agent Execution→Verified Result | `docs/manifesto.md:15-192` | Guideline | `agents/towards/agent-quality-bar.md` | 🟠 Média |
| Constrained brownfield plan template: fix problem, preserve architecture, smallest viable change, exact files+verification, no unrelated refactor | `docs/guide/orchestration.md:303-312` | Template | `templates/brownfield-plan-prompt.md` | 🟠 Média |
| QA mandate com evidência em disco (`.omo/evidence/<slug>/`, gitignored, audit falha se tracked) + "NO EVIDENCE == NO QA == NO COMMIT" | `AGENTS.md` (QA section) | Guideline | `agents/towards/evidence-based-qa.md` | 🟠 Média |
| Conventions transferíveis: factory `createXXX()`, barrel `index.ts` only, ban catch-all (`utils.ts/helpers.ts/service.ts`), 200 LOC soft limit, kebab-case, strict TS sem `as any`, testes given/when/then, sem AAA comments | `AGENTS.md` (CONVENTIONS/ANTI-PATTERNS) | Guideline | `agents/towards/code-conventions.md` | 🟢 Baixa |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Licença `SUL-1.0` (Source-available Uncompensated Labor — "side project", não OSI) | `package.json:164` | Não é open-source real; reuse de código exige cautela legal | Usar só como referência de padrões, não fork de código |
| Model IDs datados/fictícios nos docs (`gpt-6-astra`, `claude-fable-5-1`, `kimi-k3`, `grok-4.7` — 2026-future) | `docs/reference/configuration.md:345-449` | Acoplado ao registry interno deles; copiar IDs quebra | Copiar o *padrão* (category chains + fallback), não os IDs |
| `publish.yml` manual-dispatch dual-publish + 12 platform launchers | `AGENTS.md` (CI/CD) | Overkill p/ nosso contexto; acoplado ao npm deles | Ignorar; manter nosso release simples |
| `omowright` dep via GitHub ref (`github:code-yeongyu/omowright#293ca5...`) | `package.json:230` | Pin frágil, não versionado no npm | Evitar esse padrão |
| `workflow-selector` removido 2026-06-29 mas ainda referenciado em excludes | `AGENTS.md` (CODEX), `package.json:101` | Doc drift pós-remoção | N/A (só notar) |
| Docs `team-mode.md` (guia usuário) vs `orchestration.md` (guia técnico) divergem em eligibility (guia diz "any resolvable category", técnico restringe) | `docs/guide/team-mode.md:75-80` vs `docs/guide/orchestration.md:77` | Inconsistência entre superfícies (OpenCode plugin vs Senpi task) | Seguir a regra mais restritiva; notar que são harnesses diferentes |
| Emphatic all-caps imperatives ("HOLD THE FUCK UP", "NO EXCEPTIONS") como estilo de doc | `AGENTS.md` | Funciona no contexto deles, tóxico como template geral | Adotar o *rigor* (evidence gate), não o tom |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] Gap 1: `task` tool schema/implementação real (validation.ts, runners, DAG engine `packages/senpi-task/src/dag/`) não lida — extração baseada só em docs. Sugestão: deep-dive no código `senpi-task` p/ extrair state machine + WAL + fingerprint recovery como `Code snippet`
- [ ] Gap 2: Sem benchmarks de orquestração (overhead do orchestrator, latência task spawn, token cost por pattern `ulw` vs `mass-ulw` vs team). Sugestão: criar `agents/towards/orchestration-cost-model.md` com estimativas próprias
- [ ] Gap 3: Sem contract testing entre orchestrator↔worker (só "contract-driven" plan-reviewer mencionado). Sugestão: propor `qualy` desenhar contract tests p/ protocolo `task`/`task_send`/`task_output`
- [ ] Gap 4: Rollback/compensation em DAG failure (só `retry`/`send`/`amend` documentados; sem saga/compensation). Sugestão: ADR sobre compensation em workflows multi-agente

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: seção `Orchestration Patterns (oh-my-openagent)`: orchestrator-never-writes, ULW decision flow, category routing, boulder resume, Kibitzer recall, 5 verification gates
- [ ] **Criar ADR**: `ADR-towards-orchestrator-never-writes-code` — Para: decidir se nossos agentes coordenadores seguem a regra "orquestrador não escreve código produto"
- [ ] **Criar Template**: `brownfield-plan-prompt.md` — Em: `_consolidado/templates/` (constrained scope prompt do §303-312)
- [ ] **Criar Checklist**: `plan-review-5-gates.md` — Em: `_consolidado/agents/towards/checklists/` (approval-biased review)
- [ ] **Criar Runbook**: `resumable-orchestration-boulder.md` — Em: `_consolidado/agents/towards/runbooks/` (boulder.json + ledger.jsonl + continuation)
- [ ] **Criar Skill**: `category-routing` — Em: `_consolidado/skills/category-routing/` (intent→category em vez de model name)
- [ ] **Novo agente necessário**: nenhum — padrões cabem em `towards`; memory/Kibitzer tem overlap com memória do Severino (alinhar, não duplicar)

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `docs/guide/orchestration.md:163` — "it never writes product code itself. Every implementation, test, QA, and review unit is delegated to a spawned worker."

> `docs/guide/orchestration.md:200` — "A model name in a prompt carries the model's own idea of its limits. A category carries intent"

> `docs/manifesto.md:31` — "Human intervention during agentic work is fundamentally a wrong signal."

> `docs/manifesto.md:114` — "The ideal agent should work like a compiler: markdown document goes in, working code comes out."

> `docs/guide/senpi-task.md:9` — "A single spawn needs `prompt` plus exactly one of `category` or `subagent_type`; the two are mutually exclusive"

> `AGENTS.md` — "NO EVIDENCE FILE == NO QA == NO COMMIT == NO PUSH. ALWAYS. EVERY TIME. NO EXCEPTIONS."

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Core do batch: agent frameworks, orchestration, tool use — match exato com o foco Towards |
| **Qualidade** | 5 | Docs técnicas profundas (orchestration 325 linhas, senpi-task, config 750+), arquitetura explícita, invariants documentados |
| **Atualidade** | 5 | v5.1.24, CI ativo, 2026, multi-harness moderno (OpenCode/Codex/Senpi) |
| **Ação** | 4 | Gera guidelines/templates/checklists imediatos; perde 1pto por extração docs-only (código `senpi-task` não lido) |
| **Completude** | 4 | End-to-end em orchestration (plan→execute→verify→resume); gaps em benchmarks e código do DAG engine |
| **TOTAL** | **23/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

**Veredito: PRIORIZAR EXTRAÇÃO COMPLETA** (23/25). Follow-up recomendado: deep-dive no código `packages/senpi-task/` (state machine, DAG WAL, runners) para segunda passada.

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/towards/extractions/oh-my-openagent.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Template v1.0 — Atualize se precisar de campos extras para seu domínio.*
