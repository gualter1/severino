# METADADOS
- **Repositório**: `ECC`
- **Lead Responsável**: `towards`
- **Funcionário (Subagente)**: `Towards`
- **Data**: `2026-10-09`
- **Tempo gasto**: `2h 30min`

---

## 1. VISÃO GERAL DO REPO

| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Harness-native agent operating system for Codex, OpenCode, Cursor, Gemini, Claude Code, and terminal workflows — providing 68 specialized agents, 293 skills, 94 commands, and automated hook workflows. |
| **Público-alvo** | AI Engineers, Software Architects, Full-Stack Developers, DevOps/Harness Operators. |
| **Tamanho** | 48+ diretórios principais (incluindo `agents/`, `skills/`, `commands/`, `hooks/`, `workflows/`, `src/`, `scripts/`, `mcp-configs/`, etc.), 68 agents, 293 skills, 94 commands. |
| **Linguagens/Tech** | TypeScript, JavaScript, Python, Bash, Markdown, JSON, YAML. |
| **Freshness** | Versão 2.2.3, ativo, commit frequency alta, suporte multi-harness universal. |

### Mapa dos 48+ Diretórios por Categoria

1. **Agentes & Orquestração**: `agents/`, `src/llm/`
2. **Workflow & Skills**: `skills/`, `commands/`, `workflows/`, `hooks/`
3. **Configuração & Harnesses**: `.opencode/`, `.claude/`, `.cursor/`, `.codex/`, `.gemini/`, `.kimi/`, `.pi/`, `.qwen/`, `.trae/`, `.vscode/`, `.zed/`, `mcp-configs/`
4. **Infraestrutura & Scripts**: `scripts/`, `docker/`, `manifests/`, `schemas/`, `config/`, `contexts/`
5. **Documentação & Exemplos**: `docs/`, `examples/`, `assets/`
6. **Testes**: `tests/`

---

## 2. O QUE PRESTA PARA **TOWARDS** (Features Complexas, Refatoração, Debugging, Backend/API)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------+------------|
| **Planner-Executor-Critic Workflow** | `agents/planner.md:1-100`, `agents/code-architect.md` | Pattern | `agents/towards/multi-agent-planning.md` | 🔴 Alta |
| **Autonomous Loop Operator Pattern** | `agents/loop-operator.md:1-45`, `skills/autonomous-loops/` | Pattern | `agents/towards/autonomous-loop-operator.md` | 🔴 Alta |
| **Multi-Harness Adapter Compliance** | `scripts/harness-adapter-compliance.js` | Tool config | `agents/towards/harness-adapter-compliance.md` | 🟠 Média |
| **Git Worktrees Parallel Orchestration** | `scripts/orchestrate-worktrees.js`, `scripts/orchestrate-codex-worker.sh` | Runbook | `agents/towards/worktree-parallel-orchestration.md` | 🔴 Alta |
| **LLM Provider Resolution Abstraction** | `src/llm/providers/resolver.py`, `src/llm/core/interface.py` | Code snippet | `agents/towards/llm-provider-abstraction.md` | 🟠 Média |
| **Session Memory & Context Vault** | `docs/design/ecc-memory-vault.md`, `scripts/memory.js` | Guideline | `agents/towards/session-memory-vault.md` | 🟠 Média |
| **Verification & Quality Gate Loop** | `package.json:501`, `skills/verification-loop/` | Checklist | `agents/towards/quality-gate-verification-loop.md` | 🔴 Alta |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| **Legacy Command Shims (`commands/`)** | `commands/` | Mantido apenas por compatibilidade com harnesses antigos; superfície oficial é `skills/` | `skills/` (Skills-first architecture) |
| **Hardcoded Tooling Paths em Scripts** | `scripts/**/*.js` | Dependência excessiva de scripts customizados de sync state | Gerenciamento nativo de MCP / Worktrees |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA

- [ ] Gap 1: **Distributed Tracing em Multi-Agent Swarms** — ECC gerencia workers e loops, mas carece de rastreamento distribuído unificado (OpenTelemetry) para debugar handoffs entre 68 agentes.
- [ ] Gap 2: **Semantic Caching para LLM Providers** — Não há cache embutido para chamadas repetidas a LLMs nos providers Python (`src/llm/providers/`).
- [ ] Gap 3: **Circuit Breaker Automático para MCP Servers** — Falhas em servidores MCP podem travar loops autônomos sem fallback elegante.

---

## 5. AÇÕES PROPOSTAS PARA O LEAD (Towards)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com os patterns de Planner-Executor, Autonomous Loop Operator e Git Worktree Parallel Orchestration extraídos do ECC.
- [ ] **Criar ADR-005**: `Multi-Agent Autonomous Loop & Worktree Isolation` — Para gerenciar execuções paralelas de agentes em features complexas.
- [ ] **Criar Template**: `architecture-blueprint.md` — Baseado em `agents/code-architect.md` para planejar features complexas.
- [ ] **Criar Runbook**: `autonomous-loop-recovery.md` — Baseado em `agents/loop-operator.md` para monitorar e intervir em loops travados.
- [ ] **Criar Skill**: `ecc-multi-agent-orchestrator` — Em `_consolidado/skills/ecc-orchestration/`.

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `agents/planner.md:27-54`: "1. Requirements Analysis -> 2. Architecture Review -> 3. Step Breakdown -> 4. Implementation Order. Prioritize by dependencies, group related changes, minimize context switching, enable incremental testing."
>
> `agents/loop-operator.md:20-31`: "Run autonomous loops safely with clear stop conditions, observability, and recovery actions. 1. Start loop from explicit pattern and mode. 2. Track progress checkpoints. 3. Detect stalls and retry storms. 4. Pause and reduce scope when failure repeats. 5. Resume only after verification passes."
>
> `package.json:4`: "Harness-native agent operating system for Codex, OpenCode, Cursor, Gemini, Claude Code, and terminal workflows — skills, hooks, rules, MCP conventions, and operator control-plane patterns."

---

## 7. SCORE DE VALOR DO REPO (Para Towards)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Altíssima relevância para orquestração multi-agent e features complexas. |
| **Qualidade** | 5 | 68 agentes especializados e 293 skills estruturadas com rigor industrial. |
| **Atualidade** | 5 | Suporte a múltiplos harnesses modernos (OpenCode, Codex, Cursor, Claude Code). |
| **Ação** | 5 | Gera blueprints, runbooks de worktrees e padrões de loops autônomos acionáveis. |
| **Completude** | 5 | Cobre desde o design arquitetural até a execução e monitoramento autônomo. |
| **TOTAL** | **25/25** | |

> **Regra**: Score 25/25 = "Priorizar extração completa".

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [ ] Salvar este arquivo em `_consolidado/agents/towards/extractions/ECC.md`.
- [ ] Atualizar `_consolidado/agents/towards/CONSOLIDATED.md` com as inclusões do ECC.
- [ ] Reportar conclusão ao lead e prosseguir para o próximo repositório.
