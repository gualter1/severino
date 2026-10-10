# Extração pronta — `skillpper` (Lente Guanabara — Didática)

> **Destino:** `_consolidado/agents/guanabara/extractions/skillpper.md`
> *Conteúdo abaixo pronto para salvar — ambiente sem tool de escrita direta neste subagente.*

---

## METADADOS
- **Repositório**: `skillpper`
- **Lead Responsável**: `guanabara`
- **Funcionário (Subagente)**: `guanabara-batch2-wave3`
- **Data**: `2026-10-09`
- **Tempo gasto**: `45min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | *Practical skills for developers and their AI coding agents* — coleção comunitária de skills reutilizáveis (instruções focadas + referências + critérios de output) para agents (Claude Code, Codex, Cursor, Antigravity). Cada skill = pasta com `SKILL.md` |
| **Público-alvo** | Devs que usam AI coding agents; autores de skills; educadores técnicos |
| **Tamanho** | 8 skills raiz (`ai-memory-obsidian`, `concept-to-excalidraw`, `design-craft`, `good-design`, `grill-me`, `prepare-technical-slides`, `skillpper-saver`, `study-quiz`), ~25 pastas, ~40 arquivos de referência, 5 scripts, workflows GH Actions, `docs/` com Pages |
| **Linguagens/Tech** | Markdown (skills), Python 3.10-3.12 (scripts `validate_skills.py`, `update_skills_index.py`, `update_skill_votes.py`), YAML frontmatter, Node `npx skills` CLI (Vercel Labs), GitHub Discussions/GraphQL (voting), GitHub Pages |
| **Freshness** | Ativo (2026), skills com `skill-review.yaml`, validação estática v1, workflows `update-skills-index`, votação via Discussions, `README.md` gerado automaticamente |

---

## 2. O QUE PRESTA PARA **GUANABARA** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| **Marketplace de Skills como App Store** — `npx skills add kipperdev/skillpper --skill <nome> --agent codex --global` + `--list`; instalação por projeto vs global, por agente | `README.md:60-92` | Pattern + Analogy | `agents/guanabara/analogies/skill-marketplace-loja-apps.md` | 🔴 Alta |
| **Convenção de Skill = Pacote** — 1 pasta raiz por skill, nome `lowercase-hyphen`, `name == folder`, YAML frontmatter `name+description`, estrutura `SKILL.md / references/ / scripts/ / assets/` | `README.md:108-143` | Guideline | `agents/guanabara/tutorials/criando-sua-primeira-skill.md` | 🔴 Alta |
| **Índice gerado a partir de metadados** — `update_skills_index.py` lê frontmatter de `*/SKILL.md` e regenera tabela entre `<!-- SKILLS:START/END -->`; `html.escape` + escape de pipe para célula | `scripts/update_skills_index.py:23-68` | Pattern | `agents/guanabara/patterns/registry-index-gerado.md` | 🔴 Alta |
| **Dependency entre skills ensinável** — `prepare-technical-slides` declara dependência explícita de `concept-to-excalidraw`; se ausência → "concluir blueprint e informar que falta dependência; não declarar slides gerados" | `prepare-technical-slides/SKILL.md:11-14` | Pattern + Analogy | `agents/guanabara/analogies/skill-dependencies-lego.md` | 🔴 Alta |
| **Discovery em 3 camadas** — (1) CLI `--list`/browse, (2) `RECOMENDATIONS.md` curadoria manual terceiros, (3) `find-skills` (Vercel skills.sh busca por domínio/task/keyword) + `docs/index.html` Pages | `README.md:36-44` + `RECOMENDATIONS.md:1-19` | Pattern | `agents/guanabara/patterns/skill-discovery-biblioteca.md` | 🟠 Média |
| **Validação estática como governança ensinável** — `validate_skills.py` inspeciona como dados (sem executar): metadata, referências locais, bundle exato, duplicatas, credential/exfiltration/unsafe-exec/safeguard-override/persistência; modos `worktree` vs `git` com base confiável, `SEC002/006/007` como review alerts | `scripts/validate_skills.py:1-138` + `SECURITY.md:1-18` | Guideline | `agents/guanabara/checklists/skill-governance-auditoria.md` | 🟠 Média |
| **Exceções com prazo e SHA256** — waiver só de `SEC003`/`DUP001`, exige path exato + SHA256 + rationale + issue + maintainer + expiração ≤30d, sem globs; mudança de exceção precisa review separado na base confiável | `SECURITY.md:16` | Pattern | `agents/guanabara/patterns/excecoes-com-prazo-validade.md` | 🟠 Média |
| **Ranking comunitário via reações** — Discussions categoria `Skill Votes`, marker oculto `<!-- skillpper-vote-skill: design-craft -->`, mapeamento confiável em `docs/vote-discussions.json`, contagem só de `:+1:` na discussão registrada, cron 5min → `RANKING.md` + `votes.json` | `docs/community-voting.md:1-42` + `RANKING.md:1-16` | Pattern | `agents/guanabara/patterns/marketplace-ranking-comunidade.md` | 🟢 Baixa |
| **Skill `grill-me` — Entrevista socrática** — anti `Blind Assumptions` vs `Text Slop`; usa `AskUserQuestion` nativo, rodadas limitadas, decision tree, opções em 1ª pessoa, `(Recommended)` primeiro, multi-select só quando combina | `grill-me/SKILL.md:18-61` | Tutorial | `agents/guanabara/tutorials/entrevista-socratica-grill-me.md` | 🔴 Alta |
| **Skill `study-quiz` — Avaliação adaptativa com reforço de base** — 10 questões + 2-3 reforço do nível abaixo (fundamento), faixa `iniciante→avançado`, mistura 30-70% conceitual/código, distribuição de gabarito, conferência final 9 checks | `study-quiz/SKILL.md:18-228` | Tutorial | `agents/guanabara/tutorials/quiz-adaptativo-reforco-base.md` | 🔴 Alta |
| **Skills `good-design` + `design-craft` — Dois layers ensináveis** — `good-design` = jornada/conversão ética (9 perguntas ICP/TTV/guardrail); `design-craft` = judgment layer (YC) vs tactical layer (Refactoring UI), "restraint wins" | `good-design/SKILL.md:12-71` + `design-craft/SKILL.md:38-44` | Analogy | `agents/guanabara/analogies/design-judgment-vs-tactics.md` | 🟠 Média |
| **Skill `ai-memory-obsidian` — Memória persistente** — regra "Memory First" (`memory_query` antes de reler repo), ADRs em `decisions/ADR-YYYY-MM-DD-<slug>.md`, handoff `sessions/Session-...md` + 1-line resume, vault fora do repo | `ai-memory-obsidian/SKILL.md:32-83` | Pattern | `agents/guanabara/patterns/memoria-persistente-adr-handoff.md` | 🟠 Média |
| **Skill `skillpper-saver` — Economia de tokens** — 7 regras universais: grep-first, leitura cirúrgica, cutoff 150k, anti-marathon, subagent governance, Text > Screenshot, truncagem de logs | `skillpper-saver/SKILL.md:32-68` | Checklist | `agents/guanabara/checklists/economia-tokens-agentes.md` | 🟠 Média |
| **Skill `concept-to-excalidraw` + `prepare-technical-slides` — Cadeia pesquisa→blueprint→visual** — catálogo aprovado de fontes, `S01` citações, `validate_references.py`, 1 conceito/slide, blueprint Markdown → `.excalidraw` editável | `prepare-technical-slides/SKILL.md:18-112` + `concept-to-excalidraw/SKILL.md:12-42` | Tutorial | `agents/guanabara/tutorials/cadeia-pesquisa-blueprint-visual.md` | 🟠 Média |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| `.skill` archives binários no repo (`design-craft.skill`, `good-design.skill` etc.) | `/: *.skill` | Binário versionado gera diff ilegível e conflitos; validador já checa bundle exato | Gerar `.skill` no CI como artifact/release, `.gitignore` + `skill-review.yaml` como fonte |
| `validate_skills.py` com `python -I` + `TRUSTED_ROOT` + git tree reading | `scripts/validate_skills.py:13-89` | Complexidade alta para onboarding; didática sofre — parece "mágica" | Extrair tutorial simplificado "validação estática em 3 checks" para iniciantes, manter versão completa como avançado |
| Votação com 0 votos e discussões "Not created yet" | `RANKING.md:9` | Ranking vazio ensina pouco sobre curadoria; risco de parecer abandonado | Seed com votos sintéticos de teste ou badge "em bootstrap" + explicar ciclo de 5min |
| `RECOMENDATIONS.md` typo no nome do arquivo (vs RECOMMENDATIONS) | `/RECOMENDATIONS.md` | Quebra expectativa de busca, link quebrado se alguém adivinhar nome | Renomear mantendo redirect/symlink |
| Validação "não instala nem executa skills" declarada como limitação mas sem sandbox futuro | `SECURITY.md:5` | Aluno pode achar que "passou = seguro"; falta analogia de "raio-X vs exame de sangue" | Adicionar analogia didática + roadmap sandbox descartável |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] **Gap 1: Versionamento semântico para skills (semver para prompts)** — Repo usa git SHA + `.skill` mas não documenta `MAJOR.MINOR.PATCH` para skills, nem como evoluir `description`/`workflow` sem quebrar consumers. **Sugestão:** Criar `agents/guanabara/tutorials/versionamento-skills-semver.md` com analogia "receita que ganha ingrediente sem estragar quem já cozinha" + checklist breaking vs non-breaking.
- [ ] **Gap 2: Dependency lockfile entre skills** — `prepare-technical-slides → concept-to-excalidraw` é manual e frágil (path relativo). Falta `skill.lock` / manifesto de dependências com versão. **Sugestão:** Criar `agents/guanabara/patterns/skill-dependencies-manifest.md` + template `skill-dependencies.yaml` inspirado em `package.json`.
- [ ] **Gap 3: Discovery ensinável para iniciantes** — `find-skills` e `skills.sh` citados mas sem tutorial "como escolher entre 3 skills de design". **Sugestão:** Criar `agents/guanabara/tutorials/descoberta-de-skills-para-iniciantes.md` com matriz decisão (tarefa → skill → quando NÃO usar).
- [ ] **Gap 4: Changelog/Release notes didáticos** — Não há padrão de `CHANGELOG.md` por skill; aluno não vê evolução. **Sugestão:** Template `templates/skill/CHANGELOG.md` com Keep-a-Changelog adaptado para prompts.
- [ ] **Gap 5: Onboarding "primeira skill em 15min"** — `CONTRIBUTING.md` é completo mas longo para iniciantes. **Sugestão:** Criar learning path `agents/guanabara/learning-paths/skill-author-15min.md` (scaffold → frontmatter → teste local `npx skills add .` → PR).

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: seção "Skill Marketplace & Registry" (4 analogias novas: loja de apps, biblioteca com fichário/curadoria/busca, LEGO com dependências, receita com semver) + 3 tutorials (primeira skill, quiz reforço, grill-me socrático)
- [ ] **Criar ADR**: `ADR-0XX: Skill Versioning com SemVer para Prompts` — Para: definir quando bump MAJOR (muda interface/trigger), MINOR (novo modo compatível), PATCH (fix de instrução)
- [ ] **Criar Template**: `skill-starter/` — Em: `templates/skill-starter/` (pastas `SKILL.md`, `references/`, `skill-review.yaml`, `CHANGELOG.md`)
- [ ] **Criar Checklist**: `skill-release-checklist.md` — Em: `agents/guanabara/checklists/` (frontmatter válido, name==folder, index regenerado, validação local `validate_skills.py --worktree`, teste `npx skills add .`)
- [ ] **Criar Skill**: `guanabara-skill-marketplace-101` — Em: `_consolidado/skills/guanabara-skill-marketplace-101/` (ensina instalar, descobrir, versionar, depender)
- [ ] **Criar Analogy/Tutorial**: `skill-marketplace-loja-apps` — Em: `agents/guanabara/analogies/` + `tutorials/criando-sua-primeira-skill.md`, `tutorials/quiz-adaptativo-reforco-base.md`, `tutorials/entrevista-socratica-grill-me.md`
- [ ] **Novo agente necessário**: —

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `README.md:14` — "Skillpper is a community collection of reusable instructions for everyday development work: designing interfaces, researching technical topics, and sharing workflows that work."

> `README.md:119-120` — "Start `SKILL.md` with YAML frontmatter. The `name` must match the folder name, and both fields must be non-empty strings"

> `scripts/update_skills_index.py:46-48` — `if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name): raise ValueError(...) if name != path.parent.name: raise ValueError(...)`

> `prepare-technical-slides/SKILL.md:14` — "Se não estiver disponível, concluir o blueprint e informar que falta essa dependência; não declarar slides gerados."

> `SECURITY.md:3` — "A passing result means only that the implemented static checks found no unexcepted blocking issue; it is not a safety guarantee."

> `grill-me/SKILL.md:23-25` — "Blind Assumptions: The agent guesses architecture... Text Slop in Chat: The agent prints long lists of questions in conversational prose, forcing the user to type out tedious paragraphs"

> `study-quiz/SKILL.md:85` — "Reforço não é questão fácil qualquer... É o fundamento que sustenta o tema: aquilo que, se a pessoa não souber, derruba o resto"

> `skillpper-saver/SKILL.md:14` — "the primary drivers of runaway token consumption are not high-end models themselves, but rather marathon sessions, repetitive re-reading, redundant screenshots, and dumping massive logs"

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Marketplace de skills = core do domínio Guanabara (ensinar framework de skills, ECC 293 skills). Cobre registry, discovery, governance, dependências — tudo pedido no batch |
| **Qualidade** | 5 | Skills muito bem escritas didaticamente: `study-quiz` com 9-check conferência, `grill-me` com protocolo de entrevista, `good-design`/`design-craft` com layers, `prepare-technical-slides` com rastreabilidade `S01` |
| **Atualidade** | 4 | 2026, Python 3.12 CI, `npx skills` (Vercel Labs), MCP/Obsidian, Discussions voting cron 5min. Perde 1pt por `.skill` binário e falta semver explícito |
| **Ação** | 4 | Gera 4 analogias + 4 tutorials + 2 checklists + 1 ADR prontos AGORA; scripts `update_skills_index.py`/`validate_skills.py` são templates copiáveis |
| **Completude** | 4 | End-to-end para *criar e distribuir* skills, mas gaps em versionamento, lockfile, changelog e onboarding 15min (listados acima) |
| **TOTAL** | **22/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa" → **Priorizar extração completa**

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/guanabara/extractions/skillpper.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

### 🎯 Notas didáticas Guanabara (extras para CONSOLIDATED)

**Analogias novas para `agents/guanabara/analogies/`:**

1. **Loja de Apps para Skills** — `npx skills add` = App Store; `SKILL.md` frontmatter = ficha do app; `--global` vs projeto = instalar no iPhone vs só num iPad; `RECOMENDATIONS.md` = curadoria "Escolha do Editor"
2. **Biblioteca com 3 buscas** — Browse (`--list` = passear nas estantes) vs Search (`find-skills` = Google da biblioteca) vs Curadoria (`RECOMENDATIONS.md` = bibliotecária indica). Ensinar quando usar cada.
3. **LEGO com dependências** — `prepare-technical-slides` precisa de `concept-to-excalidraw` como LEGO Technic que precisa de motor; sem motor, monta chassi e avisa "falta motor, não digo que anda"
4. **Receita com SemVer** — PATCH = corrige pitada de sal; MINOR = adiciona cobertura opcional; MAJOR = muda forno de gás para elétrico (quem já cozinha precisa reaprender)

**Cross-ref Towards (implementation):** este repo complementa extração Towards focada em `validate_skills.py` como código, `update_skills_index.py` como gerador e `update_skill_votes.py` GraphQL — Guanabara foca no *porquê ensinar* cada pattern.

*Template v1.0 — Guanabara Batch 2 Wave 3*