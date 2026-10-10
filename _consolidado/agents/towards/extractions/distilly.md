# EXTRAÇÃO — distilly

## METADADOS
- **Repositório**: `distilly` (formerly `colleague-skill`)
- **Lead Responsável**: `towards`
- **Funcionário (Subagente)**: `towards`
- **Data**: `2026-10-09`
- **Tempo gasto**: `0h 25min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Distill a person's experience, judgment, voice, ways of working into reusable Person Profile packaged as Agent Skill. Pipeline: Messages·docs·interviews·public sources → Distilly → Person Profile → Agent/Bot |
| **Público-alvo** | AI agent builders, devs building persona/skills tooling, community contributors |
| **Tamanho** | Médio. Raiz: README/SKILL.md/ROADMAP + `prompts/` (9 entries, dual EN/ZH), `tools/` (~19 py + `research/` 7 files), `references/`, `skills/colleague/`, `tests/` (10 files), `bin/distilly.mjs`, `docs/PRD.md` |
| **Linguagens/Tech** | Python 3.9+ (collectors, writers, research pipeline), Node.js >=18 (npm bin shim), Markdown prompts, Bash, SQLite (WeChat), Lark/DingTalk/Slack APIs, Playwright (browser scraping), Whisper (transcribe) |
| **Freshness** | Ativo. Milestone 20K stars 2026-08-13, rename end-to-end 2026-08-24, roadmap 2026-04-13, tech report arXiv 2605.31264 (2026-06-01). 8 agent hosts suportados |

---

## 2. O QUE PRESTA PARA **TOWARDS** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Dual-artifact distillation pattern (Work Skill + Persona, PART A/B + Operating Rules) | `README.md:259-267`, `tools/skill_writer.py:41-112` | Pattern | `agents/towards/distillation-patterns.md` | 🔴 Alta |
| 6-dimension parallel research strategy (writings/conversations/expression/decisions/external/timeline) | `prompts/celebrity/research.md:103-183` | Guideline | `agents/towards/research-distillation.md` | 🔴 Alta |
| Taste principles + source hierarchy + blacklist (long>snippet, controversy>consensus, firsthand>secondhand) | `prompts/celebrity/research.md:18-56` | Guideline | `agents/towards/source-quality-hierarchy.md` | 🔴 Alta |
| Two-tier quality gates: budget-friendly (3 notes/2 URLs) vs budget-unfriendly (6 tracks/8 URLs + audit/synthesis/validation) | `SKILL.md:415-538`, `tools/skill_presets.py:109-156`, `tools/research/quality_check.py:161-221` | Pattern | `agents/towards/quality-gates.md` | 🔴 Alta |
| Research merge + metrics summarizer (URL count, weight distribution 1-7, track coverage, long-quote heuristic) | `tools/research/merge_research.py:40-251` | Code snippet | `agents/towards/compression-techniques.md` | 🔴 Alta |
| Quality-check evaluator as code (grounded-URL filter, copyright safety, PASS/FAIL review chain) | `tools/research/quality_check.py:78-221` | Code snippet | `agents/towards/distillation-quality-check.md` | 🟠 Média |
| Incremental evolution loop: append-files delta merge + conversation correction + version backup/rollback | `README.md:269-274`, `SKILL.md:665-729`, `prompts/merger.md:1-91`, `prompts/correction_handler.md:1-102` | Pattern | `agents/towards/training-loops.md` | 🔴 Alta |
| Section-level markdown patch merge (replace matching `##` else append) | `tools/skill_writer.py:314-349` | Code snippet | `agents/towards/markdown-patch-merge.md` | 🟠 Média |
| Correction log with 50-entry cap + semantic compaction | `prompts/correction_handler.md:97-102`, `tools/skill_writer.py:352-392` | Pattern | `agents/towards/correction-compaction.md` | 🟠 Média |
| Schema v3 + manifest + artifact naming (`{character}-{slug}`, work/persona split) | `tools/skill_schema.py:22-32,187-205,353-411` | Template | `templates/skills/manifest.json` | 🟠 Média |
| Path-traversal hardening (`validate_path_segment`, `resolve_contained_child`, slug kebab-case 40 chars) | `tools/skill_schema.py:134-169`, `tools/skill_writer.py:115-125` | Code snippet | `agents/towards/secure-file-writer.md` | 🔴 Alta |
| Version manager with retention (MAX_VERSIONS=10, backup/rollback/cleanup) | `tools/version_manager.py:28,72-179` | Code snippet | `agents/towards/versioning-runbook.md` | 🟠 Média |
| Character preset registry (colleague/relationship/celebrity + aliases, prompt bundles, research profiles) | `tools/skill_presets.py:23-179` | Pattern | `agents/towards/preset-registry.md` | 🟠 Média |
| Copyright-safety compression rule (paraphrase + metadata only, no full transcripts, short quotes, delete temp JSON) | `prompts/celebrity/research.md:290-313`, `SKILL.md:540-548` | Guideline | `agents/towards/compression-safety.md` | 🟠 Média |
| Cold-figure protocol (sources<10 → max 2-3 mental models, expand honest boundaries) | `prompts/celebrity/research.md:186-197` | Guideline | `agents/towards/low-data-fallback.md` | 🟢 Baixa |
| Multi-source collector matrix (Lark auto/API/browser/MCP, DingTalk, Slack, WeChat SQLite, eml/mbox, SRT→transcript) | `SKILL.md:63-78`, `README.md:137-150` | Tool config | `agents/towards/collector-matrix.md` | 🟠 Média |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Nome legado `colleague-skill` ainda referenciado em aliases/docs | `SKILL.md:22`, `tools/skill_presets.py:34,47` | Confusão de naming; risco de instalar path errado | Canonical `distilly` + redirect; remover aliases em major |
| `GET /im/v1/chats` sugerido historicamente para P2P | `SKILL.md:979` | Limitação API Lark: não retorna P2P, gera debug perdido | Enviar msg para obter `chat_id` (já documentado como workaround) |
| DingTalk message history via browser scraping | `SKILL.md:1024-1051` | Frágil, quebra com login/CAPTCHA, sem contrato | Screenshot upload + parser dedicado; marcar como degraded |
| Xquik third-party metered service sem rate-limit no código | `tools/research/xquik_public_posts.py`, `SKILL.md:403-413` | Custo por `--limit` sem guardrail; exfiltração de API key se logado | Confirm `--limit` + ler `XQUIK_API_KEY` só de env + deletar temp JSON (já exigido, mas sem enforce em código) |
| `rm -rf skills/...` como delete oficial | `SKILL.md:753-764` | Sem confirmação, sem soft-delete, sem audit | `skill_writer --action delete` com trash + backup |
| Internacional `larksuite.com` não implementado | `SKILL.md:837` | Quebra tenants fora da China | Abstrair base URL por região via env |
| Persona de pessoas reais sem consentimento explícito no fluxo | `README.md:38-44`, `prompts/` | Risco ético/legal (exes, colegas) | Adicionar consent checklist + flag `is_real_person` já existe em schema mas não gateia criação |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] Gap 1: **Nenhum teste de regressão de destilação (known-answer/edge/voice blind test automatizado)** — validation.md exige mas só `quality_check.py` cobre heurística. Sugestão: criar harness `eval_distillation.py` com fixtures + LLM-judge
- [ ] Gap 2: **Sem API/DB — tudo é filesystem + CLI**. Para backend Towards falta FastAPI wrapper + Postgres para skills/manifests/versions. Sugestão: ADR + `api/` com CRUD + busca vetorial
- [ ] Gap 3: **Sem observabilidade de training loop (tokens, custo, latência por dimensão)**. `merge_research` conta chars mas não custo. Sugestão: instrumentar collectors com OpenTelemetry + budget tracker por `research_profile`
- [ ] Gap 4: **Sem concurrency/locking em `skill_writer update` + `version_manager backup`** — race em updates paralelos corrompe `meta.json`. Sugestão: file lock (`fcntl`) + optimistic version check
- [ ] Gap 5: **Sem CI visível para os 10 testes** — `tests/` existe mas `.github/` não avaliado em detalhe. Sugestão: workflow pytest + ruff + quality_check self-run

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: distillation dual-artifact pattern, 6-dimension research, taste hierarchy, budget-friendly/unfriendly gates, merge+quality-check snippets
- [ ] **Criar ADR**: `ADR-distillation-pipeline` — Para: adotar Work+Persona split + audit/synthesis/validation chain como padrão de compressão de conhecimento
- [ ] **Criar Template**: `skill-manifest-v3` — Em: `_consolidado/templates/skills/`
- [ ] **Criar Checklist**: `distillation-quality-gate` — Em: `_consolidado/agents/towards/checklists/` (mental models, expression DNA, honest boundaries, source grounding ≥2/4, copyright safety)
- [ ] **Criar Runbook**: `incremental-distillation-loop` — Em: `_consolidado/agents/towards/runbooks/` (append → merger → backup → patch → quality_check → rollback)
- [ ] **Criar Skill**: `distillation-eval` — Em: `_consolidado/skills/distillation-eval/` (harness known-answer + edge + voice blind test)

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `README.md:38` — "It turns the materials you provide into a portable, source-grounded Person Profile built from observable experience, decision patterns, expression, and ways of working; it does not claim to clone the person behind them."

> `README.md:267` — "Receive task → Persona selects material-derived preferences and tone → Additional modules fill in execution detail → Produce a source-grounded response"

> `prompts/celebrity/research.md:20-25` — "Long-form > snippets / Controversy > consensus / Change > fixity / Firsthand > secondhand / Repeated patterns > one-off quotes"

> `prompts/merger.md:12` — "只追加增量，不覆盖已有结论。如有冲突，输出冲突提示让用户决定。" (Only append deltas, never overwrite; on conflict ask user)

> `tools/skill_writer.py:186-194` — "If the question is outside the recorded responsibilities or the source material is insufficient, state the gap. Do not fabricate missing information or refer to Persona."

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 4 | Não é ML distillation clássica, mas pipeline de compressão conhecimento→artefato + loops incrementais é diretamente reusável para Towards |
| **Qualidade** | 4 | Prompts bem estruturados, código Python limpo com typing, schema v3, testes presentes, paper arXiv |
| **Atualidade** | 5 | 2026 ativo, 20K stars, 8 hosts, roadmap vivo |
| **Ação** | 4 | Gera patterns/checklists/runbook/snippets imediatos (merge, quality gate, preset registry, hardening) |
| **Completude** | 3 | Falta API/DB, eval automatizado, observabilidade, locking — gaps backend claros |
| **TOTAL** | **20/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/towards/extractions/distilly.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Template v1.0 — Atualize se precisar de campos extras para seu domínio.*
