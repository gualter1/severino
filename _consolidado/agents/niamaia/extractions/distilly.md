# EXTRAÇÃO — distilly

**Repositório**: `distilly`  
**Lead Responsável**: `niamaia`  
**Funcionário (Subagente)**: `niamaia`  
**Data**: `2026-10-09`  
**Tempo gasto**: `2h 30min`

---

## 1. VISÃO GERAL DO REPO

| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Destilar experiência, julgamento, voz e formas de trabalhar de uma pessoa em *Person Profiles* reutilizáveis (Agent Skills) para 8 hosts de agentes. Antes: `colleague-skill` / `Colleague Skill`. |
| **Público-alvo** | Arquitetos de agentes, desenvolvedores de skills, usuários finais que querem "clonar" colegas/relacionamentos/celebridades em agents. |
| **Tamanho** | ~50 arquivos principais, 12k+ linhas (prompts, tools, tests, refs). Pastas: `prompts/` (3 families × 6-7 prompts), `tools/` (20 scripts), `tools/research/` (7), `references/` (2 frameworks), `tests/` (10), `docs/` (PRD + design docs). |
| **Linguagens/Tech** | Python 3.9+ (core), Node.js (installer CLI), Markdown (prompts/refs), YAML (frontmatter), Bash (wrappers). Dependencies: `requests`, `pypinyin`, `playwright`, `slack-sdk`, `python-docx`, `openpyxl`. |
| **Freshness** | Ativo: 20K⭐ (ago/2026), roadmap v1.0 shipped, community gallery 215 skills. Último commit recente. Issues/PRs ativos. |

---

## 2. O QUE PRESTA PARA **NIAMAIA** (Arquitetura, Destilação, Trade-offs)

| Item | Localização | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|-------------|------|-------------------------------------|------------|
| **Meta-skill architecture** — Distilly é um meta-skill que gera skills (`colleague-*`, `relationship-*`, `celebrity-*`) com artifact naming portátil `{character}-{slug}` | `bin/distilly.mjs:32-45`, `tools/skill_schema.py:187-205`, `tools/skill_presets.py:23-167` | Pattern | `agents/niamaia/architecture-patterns.md` | 🔴 Alta |
| **Work + Persona dual-model** — Separação explícita: PART A (Work Skill: capacidade técnica) + PART B (Persona: personalidade/comportamento). Regras de execução: "Start with PART B → Execute with PART A → Keep PART B in output" | `README.md:257-268`, `tools/skill_writer.py:41-75`, `prompts/persona_builder.md:13-146` | Pattern | `agents/niamaia/architecture-patterns.md` | 🔴 Alta |
| **6-dimension research pipeline** (celebrity) — Writings, Conversations, Expression DNA, Decisions, External Views, Timeline. Cada dimensão = arquivo raw independente. Mínimo 3 arquivos (budget-friendly) ou 6 tracks (budget-unfriendly). | `prompts/celebrity/research.md:103-183`, `tools/research/merge_research.py:21-37` | Pattern | `agents/niamaia/distillation-patterns.md` | 🔴 Alta |
| **Triple-gate mental model extraction** — Cross-context recurrence + Generative power + Exclusivity. 3 passes = mental model; 1-2 = heuristic; 0 = discard. | `references/celebrity_budget_unfriendly_framework.md:107-125` | Pattern | `agents/niamaia/distillation-patterns.md` | 🔴 Alta |
| **Taste principles** — Long-form > snippets, Controversy > consensus, Change > fixity, Firsthand > secondhand, Craft > biography, Repeated patterns > one-off, Failure > success. | `prompts/celebrity/research.md:18-28`, `references/celebrity_budget_unfriendly_framework.md:32-43` | Guideline | `agents/niamaia/distillation-patterns.md` | 🔴 Alta |
| **Source quality hierarchy (1-7)** — User local > first-person books > long interviews > documented decisions > short-form first-person > external analysis > secondhand. Blacklist: Zhihu, WeChat OA, Baidu Baike, content farms, AI bios, Wikipedia standalone. | `prompts/celebrity/research.md:31-56`, `references/celebrity_budget_unfriendly_framework.md:44-56` | Guideline | `agents/niamaia/distillation-patterns.md` | 🔴 Alta |
| **Cold figure protocol** — Se total grounded sources < 10: limitar mental models a 2-3, marcar "based on limited information", expandir honest boundaries, sugerir material extra. | `prompts/celebrity/research.md:186-198`, `references/celebrity_budget_unfriendly_framework.md:77-86` | Pattern | `agents/niamaia/distillation-patterns.md` | 🟠 Média |
| **Quality gates automatizados** — `quality_check.py` valida: mental_models, limitations, expression_dna, honest_boundaries, internal_tension, intellectual_genealogy, agentic_protocol, source_grounding (URLs grounded ≥4/2), copyright_safety, source_hierarchy (primary ratio ≥50%), review_chain (audit+synthesis+validation PASS), validation_depth (2 known-answer + 1 edge-case), research_depth (6 files, 8 URLs, 3 primary markers, etc). | `tools/research/quality_check.py:32-221` | Tool config + Checklist | `agents/niamaia/quality-gates.md` | 🔴 Alta |
| **Budget-friendly vs Budget-unfriendly profiles** — Duas trilhas de pesquisa com thresholds distintos. Budget-friendly: 3 raw files, 2 URLs, merge_strategy=compact. Budget-unfriendly: 6 tracks, 8 URLs, 3 primary markers, 6 source metadata blocks, 6 contradictions, 6 inferences, audit→synthesis→validation chain, merge_strategy=deep. | `tools/skill_presets.py:108-155`, `prompts/celebrity/budget_unfriendly/` | Decision record | `agents/niamaia/adr/` | 🔴 Alta |
| **Incremental evolution (merge + correction)** — `merger.md`: append-only deltas, section-level markdown patch replacement, conflict detection. `correction_handler.md`: Work corrections → markdown patch; Persona corrections → Correction Log (max 50, merge similar). `version_manager.py`: auto-archive on update, rollback, retention limit=10. | `prompts/merger.md`, `prompts/correction_handler.md`, `tools/version_manager.py` | Pattern | `agents/niamaia/evolution-patterns.md` | 🔴 Alta |
| **Multi-host portable installation** — 8 hosts (Claude Code, OpenClaw, Hermes, Codex, DeepSeek Harness, Pi, Grok Build, OpenCode). Self-contained `SKILL.md` install (não copia diretório inteiro). Frontmatter normalization durante install. Command slugs portáteis. | `bin/distilly.mjs`, `tools/install_generated_skill.py`, `tools/install_generated_skill_common.py` | Pattern | `agents/niamaia/portability-patterns.md` | 🔴 Alta |
| **Schema versioning v3 + backward compat** — `schema_version: "3"`, legacy fields sincronizados (`sync_legacy_fields`), legacy storage roots resolvidos (`colleagues/` vs `skills/colleague/`), preset aliases (`dot.colleague.v1` → `distilly.colleague.v1`). | `tools/skill_schema.py:23-38, 208-232, 337-350`, `tools/skill_presets.py:47, 74, 164` | Pattern | `agents/niamaia/versioning-patterns.md` | 🟠 Média |
| **Layer 0 personality rules** — Tags manuais (ex: "甩锅高手" = blame-shifter) traduzidas para regras comportamentais executáveis: "em situação X, faça Y". Layer 0 > tudo. Exemplos concretos vs adjetivos. | `prompts/persona_analyzer.md:87-125`, `prompts/persona_builder.md:18-23, 150-166` | Guideline | `agents/niamaia/persona-engineering.md` | 🟠 Média |
| **Agentic Protocol requirement** — Skill deve incluir protocolo de pesquisa antes de responder: classify question type → research dimensions per mental models → framework application → confidence calibration. Específico à pessoa, não genérico. | `references/celebrity_budget_unfriendly_framework.md:138-150` | Pattern | `agents/niamaia/agentic-protocols.md` | 🟠 Média |
| **Copyright safety by design** — No full transcripts, no long quotes. Paraphrased notes + source metadata only. Short quotes only for expression DNA. `quality_check.py` detecta timestamps, blockquotes, code fences como sinais de violação. | `prompts/celebrity/research.md:308-312`, `tools/research/quality_check.py:150-158` | Guideline | `agents/niamaia/copyright-safety.md` | 🟠 Média |
| **URL grounding rules** — URLs devem ser páginas concretas abertas e lidas. Não contam: homepages, /search, /topic, /tag, profile roots, placeholder paths. Validador em `is_source_like_url()`. | `prompts/celebrity/research.md:251-261`, `tools/research/quality_check.py:78-101` | Guideline | `agents/niamaia/grounding-rules.md` | 🟠 Média |
| **Character preset registry** — `skill_presets.py` define 3 families com: prompt bundles, research profiles, knowledge dirs, storage roots, toolchains, compat aliases. Extensível via `CHARACTER_ALIASES`. | `tools/skill_presets.py:23-167` | Pattern | `agents/niamaia/extensible-architecture.md` | 🟢 Baixa |
| **Language-aware rendering** — `prefers_chinese(meta)` detecta `classification.language: "zh-CN"` → templates ZH vs EN para SKILL.md, work_skill, persona_skill. | `tools/skill_writer.py:144-155, 158-174` | Pattern | `agents/niamaia/i18n-patterns.md` | 🟢 Baixa |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno |
|------|-------------|--------|-------------------|
| Legacy storage root `colleagues/` (vs `skills/colleague/`) | `tools/skill_presets.py:47`, `tools/skill_schema.py:322-327` | Compat apenas; novo canonical é `skills/{character}/` | Usar `canonical_storage_root()` |
| Legacy command aliases `/create-colleague`, `/create-skill` | `tools/skill_presets.py:34` | Mantidos só para compat; novo entrypoint unificado é `/distilly` | Documentar migração |
| `dot-skill` engine identifiers preservados em meta.json | `tools/skill_schema.py:394-404` | Compat com skills v1 geradas pelo predecessor | Não criar novos com legacy engine |
| DingTalk message scraping via browser (fallback) | `tools/dingtalk_auto_collector.py`, `SKILL.md:271-298` | API não suporta histórico; frágil, depende de Playwright | WeCom support planejado (roadmap) |
| `npm audit` only no package.json scripts | `package.json:22` | Não pega transitive deps bem | Adicionar `snyk` + `dependabot` no CI |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para arquitetura/destilação)

- [ ] **Gap 1: Formal ADR registry** — Decisões irreversíveis (stack, dual-model, research profiles, triple-gate, portability) não estão registradas como ADRs formais.  
  **Sugestão**: Criar `_consolidado/agents/niamaia/adrs/ADR-001-meta-skill-architecture.md`, `ADR-002-work-persona-dual-model.md`, `ADR-003-triple-gate-extraction.md`, `ADR-004-budget-profiles.md`, `ADR-005-multi-host-portability.md`.

- [ ] **Gap 2: Capacity planning / cost model** — Budget-unfriendly usa `xquik_public_posts` (metered by post count) + Whisper transcription + deep research. Não há estimativa de custo/latência por profile.  
  **Sugestão**: Documentar em `agents/niamaia/cost-model.md`: tokens estimados, API calls, tempo médio, budget tiers.

- [ ] **Gap 3: Observabilidade da destilação** — Logs estruturados, métricas (qualidade, grounding, correções), traces do pipeline research→analysis→generation.  
  **Sugestão**: Adicionar `tools/telemetry.py` + `agents/niamaia/observability.md` com RED metrics para o pipeline.

- [ ] **Gap 4: Threat model para dados sensíveis** — Coleta Lark/DingTalk/WeChat/email contém PII, segredos corporativos, conversas privadas. Não há threat model STRIDE documentado.  
  **Sugestão**: Criar ADR-015 (já referenciado) + `agents/kaspersky/threat-models/distilly.md`.

- [ ] **Gap 5: Evaluation harness para Persona fidelity** — "Voice check" (100 palavras blind test) é manual. Não há eval automatizado (ex: benchmark de respostas vs ground truth).  
  **Sugestão**: `agents/qualy/eval-harness.md` com dataset de prompts conhecidos + expected behaviors.

- [ ] **Gap 6: Skill composition / multi-skill orchestration** — Roadmap Phase 3 menciona `/meeting @a @b @c` e relationship graph. Não há design doc.  
  **Sugestão**: RFC para `agents/niamaia/rfcs/multi-skill-composition.md`.

- [ ] **Gap 7: Windows compatibility gaps** — `distilly.mjs` valida paths mas collectors usam Playwright/browser; `install_claude_command_shim` é workaround.  
  **Sugestão**: Documentar known issues + fixes em `agents/trevor/windows-compat.md`.

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Niamaia)

- [ ] **Criar ADR**: `ADR-001: Meta-skill architecture for portable agent skill generation` — Para: definir Distilly como meta-skill que gera skills portáteis multi-host.
- [ ] **Criar ADR**: `ADR-002: Work+Persona dual-model with Layer 0 priority` — Para: separação de preocupações técnica vs comportamental, regras de execução.
- [ ] **Criar ADR**: `ADR-003: Triple-gate mental model extraction for celebrity distillation` — Para: critério objetivo para promover heurística → mental model.
- [ ] **Criar ADR**: `ADR-004: Budget-friendly vs budget-unfriendly research profiles` — Para: trade-off explícito custo/qualidade com thresholds mensuráveis.
- [ ] **Criar ADR**: `ADR-005: Self-contained SKILL.md installation for cross-host portability` — Para: instalar apenas artifact único, não diretório; frontmatter normalization.
- [ ] **Criar Template**: `distillation-research-template.md` — Em: `agents/niamaia/templates/` — Baseado em `prompts/celebrity/research.md` + `budget_unfriendly/` structure.
- [ ] **Criar Checklist**: `celebrity-distillation-quality-gate.md` — Em: `agents/niamaia/checklists/` — Baseado em `quality_check.py` checks + audit/synthesis/validation gates.
- [ ] **Criar Runbook**: `distilly-incident-response.md` — Em: `agents/niamaia/runbooks/` — Para: falha de coleta (bot não no grupo, token expirado), violação copyright, source grounding FAIL.
- [ ] **Criar Skill**: `niamaia-distillation-reviewer` — Em: `_consolidado/skills/niamaia-distillation-reviewer/` — Para revisar quality gates de skills geradas automaticamente.

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES

> `README.md:38-39`: "Distilly is the person-modeling layer for agents. It turns the materials you provide into a portable, source-grounded Person Profile built from observable experience, decision patterns, expression, and ways of working; it does not claim to clone the person behind them."

> `references/celebrity_budget_unfriendly_framework.md:22-28`: **"Capture HOW they think, not WHAT they said."** The difference: WHAT they said → quote collection, summarizable by anyone. HOW they think → cognitive architecture, requires deep pattern extraction. A good Skill should let you predict how this person would approach a problem they've never publicly discussed. That's the test.

> `references/celebrity_budget_unfriendly_framework.md:109-118`: **Triple-Gate Extraction**: Every candidate mental model must pass all three gates: 1. Cross-context recurrence (appears in ≥2 contexts/source types). 2. Generative power (helps predict approach to new adjacent problem). 3. Exclusivity (meaningfully distinctive, not generic advice). Three passes = keep; 1-2 = demote to heuristic; 0 = discard.

> `prompts/celebrity/research.md:22-28`: **Taste Principles**: 1. Long-form > snippets. 2. Controversy > consensus. 3. Change > fixity. 4. Firsthand > secondhand. 5. Craft > biography. 6. Repeated patterns > one-off quotes. 7. Failure discussion > success narrative.

> `tools/skill_writer.py:68-73`: **Operating Rules**: 1. **Start with PART B**: decide whether you would take the task and in what attitude. 2. **Execute with PART A**: use the work methods, heuristics, and capability profile to do the task. 3. **Keep PART B in the output**: preserve the tone, diction, rhythm, and reaction patterns from the persona. **Layer 0 rules in PART B always take priority and must never be violated.**

> `prompts/persona_builder.md:154-166`: **Layer 0 quality**: ❌ "você é muito forte" → ✅ "ao ser questionado, você não explica, refuta com 'qual é seu critério?'"; ✅ "antes de reunião você diz 'vamos alinhar o context primeiro', se não tem background você interrompe".

> `prompts/merger.md:12-13`: **Princípio de evolução**: "Só追加增量，不覆盖已有结论。如有冲突，输出冲突提示让用户决定。" (Append only, never overwrite. Conflicts → user decides.)

> `tools/research/quality_check.py:175-212`: **Quality checks automatizados**: `source_grounding` (grounded URLs ≥4 strict/2 friendly), `copyright_safety` (no timestamps, blockquotes, code fences), `source_hierarchy` (primary ratio ≥50%), `review_chain` (audit+synthesis+validation all PASS), `research_depth` (6 files, 8 URLs, 3 primary markers, 6 contradictions, 6 inferences, track_coverage=6).

---

## 7. SCORE DE VALOR DO REPO (Para arquitetura/destilação)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Core domain: destilação de expertise em skills portáteis, padrões de pesquisa, qualidade, evolução. |
| **Qualidade** | 5 | Profundo, precisoso, exemplos práticos (Karpathy, ByteDance L2-1), templates executáveis. |
| **Atualidade** | 5 | 2026, roadmap ativo, 8 hosts modernos, schema v3, budget-unfriendly recém-shipped. |
| **Ação** | 5 | Gera ADRs, templates, checklists, runbooks, skills IMEDIATAMENTE usáveis. |
| **Completude** | 4 | Cobre end-to-end: ingestão → pesquisa → análise → geração → instalação → evolução. Gap: observabilidade, threat model, eval harness. |
| **TOTAL** | **24/25** | |

> **Regra**: Score > 17 = "Priorizar extração completa" ✅

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/niamaia/extractions/distilly.md`
- [ ] Avisar Lead (niamaia) que a extração está pronta → **AUTO-AVISO: EXTRAÇÃO CONCLUÍDA**
- [ ] Iniciar criação dos ADRs propostos (5) + templates/checklists/runbooks
- [ ] Mover para próximo repo na fila (se houver)

---

## ANEXO: RESUMO DE TRADE-OFFS ARQUITETURAIS IDENTIFICADOS

| Decisão | Trade-off | Racional documentado |
|---------|-----------|---------------------|
| **Meta-skill vs standalone skills** | Complexidade do gerador vs portabilidade do artifact | Meta-skill centraliza lógica, skills geradas são self-contained e portáteis |
| **Work + Persona separados vs unificado** | Duplicação de infra vs separação limpa de responsabilidades | PART B (Persona) decide *atitude*; PART A (Work) executa *método*; Layer 0 > all |
| **Budget-friendly vs budget-unfriendly** | Custo/tempo vs profundidade/confiabilidade | Dois perfis explícitos com quality gates distintos; usuário escolhe conscientemente |
| **Local-first vs web+local vs web-only** | Privacidade/velocidade vs cobertura | Estratégia declarada no intake; local-first default para celebrity |
| **Compact vs deep merge strategy** | Simplicidade vs preservação de nuance | Budget-friendly=compact (3 files merged); budget-unfriendly=deep (6 tracks + reviews) |
| **Section-level patch vs full rewrite** | Segurança (não perde história) vs atomicidade | `merge_markdown_patch()` substitui sections `##` matching; append se não existe |
| **Version retention = 10** | Storage vs rollback capability | `cleanup_old_versions()` automático; backup before rollback |
| **Self-contained SKILL.md install** | Perde knowledge/raw dirs vs portabilidade/segurança | Instalador só copia `SKILL.md` + metadata; raw materials ficam no repo origem |
| **Source weight 1-7 hierarchy** | Granularidade vs cognitive load | 7 tiers mapeiam hierarquia de qualidade; weighted primary ratio ≥50% para budget-unfriendly |
| **Correction Log max 50 entries** | Memória vs precisão | Merge semântico de correções similares; preserva expressão mais recente |

---

## ANEXO: MAPA DE PROMPTS → RESPONSABILIDADES (para referência rápida)

| Prompt | Family | Responsabilidade |
|--------|--------|-----------------|
| `intake.md` | colleague | 3 perguntas base (nome, info, personality) |
| `relationship/intake.md` | relationship | 3 perguntas base adaptadas |
| `celebrity/intake.md` | celebrity | 4 perguntas (inclui research_profile) |
| `work_analyzer.md` | all | Extrai: scope, workflow, output prefs, experience KB, role-specific |
| `persona_analyzer.md` | colleague | Expression, decisions, interpersonal, boundaries + tag→Layer0 translation |
| `relationship/persona_analyzer.md` | relationship | Expression DNA, emotional triggers, conflict/repair patterns |
| `celebrity/persona_analyzer.md` | celebrity | Mental models, decision heuristics, expression DNA, contradictions, honest boundaries |
| `celebrity/budget_unfriendly/persona_analyzer.md` | celebrity (strict) | + intellectual genealogy, agentic protocol seeds |
| `work_builder.md` | all | Gera `work.md` estruturado |
| `persona_builder.md` | colleague | Gera `persona.md` com 6 Layers (0-5) + Correction Log |
| `relationship/persona_builder.md` | relationship | Adapta layers para relacionamento |
| `celebrity/persona_builder.md` | celebrity | Inclui mental models, decision heuristics, expression DNA |
| `celebrity/budget_unfriendly/persona_builder.md` | celebrity (strict) | + intellectual genealogy, agentic protocol |
| `merger.md` | all | Incremental delta merge com conflict detection |
| `relationship/merger.md` | relationship | Adaptado para relationship |
| `celebrity/merger.md` | celebrity | Adaptado para celebrity |
| `correction_handler.md` | all | Classifica Work vs Persona → patch ou correction JSON |
| `celebrity/research.md` | celebrity (friendly) | 6-dim parallel collection → 3 raw files |
| `celebrity/budget_unfriendly/research.md` | celebrity (strict) | 6 tracks independentes → 6 raw files |
| `celebrity/budget_unfriendly/audit.md` | celebrity (strict) | Research audit gate (PASS/FAIL + backfill tasks) |
| `celebrity/budget_unfriendly/synthesis.md` | celebrity (strict) | Triple-gate extraction → mental models + genealogy + agentic protocol |
| `celebrity/budget_unfriendly/validation.md` | celebrity (strict) | Known-answer (2) + edge-case (1) + voice (100w) + copyright + agentic protocol |

---

*Extração completa. Pronto para geração de ADRs e artefatos consolidados.*