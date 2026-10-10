# GUANABARA — CONSOLIDATED (Ensino / Onboarding / Analogias / Decision Records Didáticos)

**Lead**: Guanabara | **Última atualização**: 2026-10-09 (Batch 1 — 8 repos + **Batch 2 Wave 3 — 5 repos = 13 total**)
**Status**: ✅ Aprovado pelo Gerente — Fonte da verdade do domínio

> **🆕 WAVE 3 (2026-10-09):** seções 1B, 2B, 3B, 4B, 7, 8, 9, 10 e 11 são novas. Todo item Wave 3 marcado com 🆕.

---

## 1. SCOREBOARD BATCH 1

| Repo | Score /25 | Veredito | Top Contribuição |
|------|-----------|----------|------------------|
| `ios-good-practices` | **17** | ⚠️ Extrair seletivo | 11 conceitos ensináveis (MVCS/MVVM/VIPER, DI, Auto Layout, Signing, IAP), Learning paths Jr/Mid/Sr |
| `nodebestpractices` | **25** | ✅ Priorizar extração completa | 5 analogias (lasanha 3-tier, gripe vs infarto), ADRs didáticos, checklists onboarding |
| `project-guidelines` | **22** | ✅ Priorizar extração completa | 11 áreas onboarding end-to-end, Git workflow, REST design, A11y, 6 analogias |
| `javascript-testing-best-practices` | **24** | ✅ Priorizar extração completa | 16 conceitos (Golden Rule, AAA, mocks vs spies, property-based), 5 analogias prontas |
| `android-best-practices` | **17** | ⚠️ Extrair seletivo | 17 conceitos (Gradle secrets, feature packages, ProGuard, JUnit vs Robolectric), 8 analogias |
| `awesome-llm-apps` | **22** | ✅ Priorizar extração completa | Agent skills modularity, MCP, Starter agents, RAG local, Learning path agentes |
| `dify` | **23** | ✅ Priorizar extração completa | Agenton (compositor de layers), Runtime Resources, HITL patterns, Session snapshots |
| `claude-code-best-practice` | **25** | ✅ Priorizar extração completa | 5 analogias core (primitives, context rot, worktrees, skills, auto-mode), 3 learning paths |

## 1B. 🆕 SCOREBOARD BATCH 2 WAVE 3 (5 repos)

| Repo | Score /25 | Veredito | Top Contribuição (lente Guanabara) |
|------|-----------|----------|-------------------------------------|
| `grill-me-skill` 🆕 | **21** | ✅ Priorizar extração completa | Implementação canônica da cerimônia `grill-me` do LEARNING_LOOP; interview pattern socrático, 1-pergunta-por-vez, 2-4 opções concretas |
| `skillpper` 🆕 | **22** | ✅ Priorizar extração completa | Marketplace de Skills como App Store; registry-index gerado; 8 skills didáticas (`study-quiz`, `grill-me`, `good-design`, `ai-memory-obsidian`); governance estática |
| `andrej-karpathy-skills` 🆕 | **18** | ✅ Priorizar formato pedagógico | 4 princípios ensináveis + formato ❌/✅ com "Problems:" + tabela anti-pattern + `[Step] → verify:[check]`; 4 analogias prontas |
| `mattpocock_skills` 🆕 | **18** | ✅ Extrair como material de aula (via Turing) | Deep-modules, mocking-at-seams, good/bad tests, shoehorn migration, CLI feedback-loop — ótimos exemplos ❌/✅ para aulas Guanabara |
| `obsidian-skills` 🆕 | **23** | ✅ Priorizar extração completa (via Turing) | Template canônico `SKILL.md` (metadata+doc); CLI devtools como runbook didático; defuddle (limpeza p/ LLM) + knap (template rendering) como patterns ensináveis |

**Métricas consolidadas:**
- Total repos: **13** (8 Batch 1 + 5 Wave 3)
- Média Batch 1: **21.9/25** | Média Wave 3: **20.4/25** | Média geral: **21.3/25**
- Vereditos Wave 3: 4x priorizar completa + 1x priorizar formato (karpathy — conteúdo ML prometido no nome não existe, valor é didático)

---

## 2. CATÁLOGO DE ANALOGIAS CONSOLIDADAS (Extrair para `agents/guanabara/analogies/`)

| Analogia | Conceito | Origem | Destino |
|----------|----------|--------|---------|
| **Planta CAD vs Rascunho** | Code vs Storyboard vs Híbrido | ios-good-practices | `analogies/uicode-vs-storyboard.md` |
| **Buffet vs Marmita** | CocoaPods vs Carthage | ios-good-practices | `decision-records/ios-dependency-managers.md` |
| **Restaurante (MVCS/MVVM/VIPER)** | Arquiteturas iOS | ios-good-practices | `analogies/ios-architectures.md` |
| **Telefone/Bilhete/Alto-falante/Vizinho/Encanamento** | Event Patterns (Delegation/Callback/NC/KVO/Signals) | ios-good-practices | `tutorials/ios-event-patterns.md` |
| **Móveis com Elásticos** | Auto Layout + Size Classes | ios-good-practices | `tutorials/ios-autolayout.md` |
| **Chave na Portaria vs Chave Entregue** | DI vs Singleton | ios-good-practices | `analogies/ios-dependency-injection.md` |
| **Gavetas por Utensílio** | Feature-based packages | project-guidelines | `analogies/feature-structure.md` |
| **Cartela de Tintas / Molde de Corte** | Estilos / Paletas de Cores/Dimens | android-best-practices | `onboarding/android-resources.md` |
| **Torre de Cartas** | View Hierarchy Profunda | android-best-practices | `anti-patterns/ui-hierarchy.md` |
| **Mesa de Trabalho Bagunçada** | Context Rot (tokens acumulados) | claude-code-best-practice | `analogies/context-rot-desk.md` |
| **Canteiros de Obras Isolados** | Git Worktrees + Agent Teams | claude-code-best-practice | `analogies/worktrees-construction.md` |
| **Livro de Receitas com Abas** | Skills (Progressive Disclosure) | claude-code-best-practice | `analogies/skills-cookbook.md` |
| **Segurança com Crachá** | Auto Mode / Permission Classifier | claude-code-best-practice | `analogies/auto-mode-security.md` |
| **Caixa de Ferramentas da Oficina** | Primitivas (Agent/Command/Skill) | claude-code-best-practice | `analogies/primitives-toolbox.md` |
| **Receita que Vira Comida** | Store / SignalProducer (lazy evaluation) | ios-good-practices | `tutorials/ios-stores.md` |
| **Nota Fiscal / Caixa Central** | IAP Receipt Validation (server-side) | ios-good-practices | `checklists/ios-iap-validation.md` |

### 2B. 🆕 ANALOGIAS WAVE 3 (13 novas — total catálogo: 29)

| Analogia 🆕 | Conceito | Origem | Destino |
|-------------|----------|--------|---------|
| **Churrasco (virar a carne de todos os lados)** | Grill-me: cada ramo da decision tree = um lado da carne; shared understanding = ponto ideal | grill-me-skill | `analogies/grill-me-churrasco.md` |
| **Loja de Apps para Skills** | `npx skills add` = App Store; frontmatter = ficha do app; `--global` vs projeto = iPhone vs iPad; RECOMENDATIONS = Escolha do Editor | skillpper | `analogies/skill-marketplace-loja-apps.md` |
| **Biblioteca com 3 buscas** | Browse (`--list` = passear nas estantes) vs Search (`find-skills` = Google da biblioteca) vs Curadoria (bibliotecária indica) | skillpper | `patterns/skill-discovery-biblioteca.md` |
| **LEGO com dependências (falta o motor)** | `prepare-technical-slides → concept-to-excalidraw`: sem motor, monta chassi e avisa "falta motor, não digo que anda" | skillpper | `analogies/skill-dependencies-lego.md` |
| **Receita com SemVer** | PATCH = corrige pitada de sal; MINOR = cobertura opcional; MAJOR = troca forno a gás por elétrico | skillpper (gap→proposta) | `tutorials/versionamento-skills-semver.md` |
| **Médico antes de operar** | Think Before Coding: não abre o paciente (coda) sem anamnese (escopo/formato/volume) | andrej-karpathy-skills | `analogies/karpathy-medico.md` |
| **Canivete vs caminhão de ferramentas** | Simplicity First: Strategy 40 linhas vs função 4 linhas p/ desconto simples | andrej-karpathy-skills | `analogies/over-abstraction.md` |
| **Cirurgia, não reforma** | Surgical Changes: troca só o ponto infeccionado, não repinta o hospital (quotes/reformat) | andrej-karpathy-skills | `tutorials/surgical-changes.md` |
| **Receita com ponto do bolo (teste do palito)** | Goal-Driven: cada `[Step] → verify:[check]`; sem isso é "assar até ficar bom" | andrej-karpathy-skills | `teaching-patterns/goal-driven-verification.md` |
| **Apartamentos com porta de entrada** | Deep-modules: importar só via entry-points, nunca via barrel (= entrar pela portaria, não pela janela do vizinho) | mattpocock_skills (lente Guanabara) | `analogies/deep-modules-portaria.md` |
| **Dublê de cinema** | Mocking-at-seams: mocka a interface (dublê faz a cena perigosa), nunca o código interno (o ator principal) | mattpocock_skills (lente Guanabara) | `analogies/mocking-duble.md` |
| **Coar café (defuddle)** | Limpeza de conteúdo web p/ LLM: tira a borra (HTML/nav/ads), fica só o café (conteúdo) | obsidian-skills (lente Guanabara) | `analogies/defuddle-coar-cafe.md` |
| **Forma de bolo (knap)** | Template rendering: mesmo molde, massas diferentes; separa forma (template) de recheio (dados) | obsidian-skills (lente Guanabara) | `analogies/knap-forma-bolo.md` |

---

## 3. LEARNING PATHS CONSOLIDADOS (Extrair para `agents/guanabara/learning-paths/`)

| Trilha | Fonte Principal | Próximos Passos |
|--------|----------------|-----------------|
| **iOS Junior → Senior** | ios-good-practices | 4 weeks Jr, 4 months Mid, trilha Sr (ADRs, CI, Provisioning) |
| **Testing Junior → Senior** | javascript-testing-best-practices | Pirâmide: Unit → Component → Contract → Chaos → Mutation |
| **Android Junior → Senior** | android-best-practices | Gradle → Resources → MVVM → DI → ProGuard → Security → Modularização |
| **Agentic Engineering** | claude-code-best-practice | Prompt → Commands → Skills → Subagents/Worktrees → Auto Mode |
| **LLM Agents Progression** | awesome-llm-apps | Skills → Starter → Advanced → Multi-agent → Always-on → MCP |

### 3B. 🆕 LEARNING PATHS WAVE 3

| Trilha 🆕 | Fonte Principal | Próximos Passos |
|-----------|----------------|-----------------|
| **Skill Author 15min (primeira skill)** | skillpper (gap→proposta) | scaffold → frontmatter (`name==folder`) → teste local `npx skills add .` → PR; destino `learning-paths/skill-author-15min.md` |
| **Karpathy 4 princípios (semana 1-3)** | andrej-karpathy-skills (gap→proposta) | semana 1: surgical → semana 2: simplicity → semana 3: goal-driven + think-before-coding transversal |
| **Validação socrática (grill → quiz)** | grill-me-skill + skillpper `study-quiz` | grill-me (entendimento sob pressão) → study-quiz 10+2-3 reforço (avaliação adaptativa iniciante→avançado) |

---

## 4. TEMPLATES / CHECKLISTS / RUNBOOKS / SKILLS PRIORITÁRIOS

### Templates
- `templates/ios/xcconfig-starter/` (Common/Debug/Release com `#include`)
- `templates/ios/viewcontroller-structure.swift` (MARK: sections)
- `templates/ios/constants.swift` (enum Config / Color)
- `templates/android/feature-skeleton/` (Gradle, ProGuard, Resources)
- `templates/agent-skill/` (README, schema, eval harness, security)
- `templates/ios-gitignore.md`
- `templates/readme-starter.md` (modernizado para GitHub Actions)

### Checklists
- `checklists/pre-pr-checklist.md` (rebase, build, tests, lint)
- `checklists/api-security-basics.md`
- `checklists/a11y-basics.md`
- `checklists/dependency-health-check.md`
- `checklists/ios-security-release-checklist.md`
- `checklists/ios-iap-validation.md` (5 checks)
- `checklists/ios-provisioning-debug.md`
- `checklists/skill-security.md`
- `checklists/agent-skill-release.md`

### Runbooks
- `runbooks/ios-diagnostics.md` (warnings-as-errors, Clang, FauxPas, Instruments)
- `runbooks/ios-build-and-archive.md` (`.xcarchive` + `.dSYM`)
- `runbooks/ios-ci-cd.md` (Fastlane Match + GitHub Actions)
- `runbooks/debug-agent-run.md` (snapshots, exit signals, logs)
- `runbooks/proguard-troubleshooting.md`
- `runbooks/local-quality-loop.md` (husky + lint-staged)
- `runbooks/always-on-agent.md` (cron + log rotation)

### Skills
- `skills/onboarding-project-hygiene/` (Git, env, deps, structure, PR)
- `skills/guanabara-ios-onboarding/` (Junior/Mid/Sr paths + quizzes)
- `skills/android-resources-palettes/` (colors/dimens/styles)
- `skills/agent-memory-notebook/` (analogy + pattern)

### 4B. 🆕 TEMPLATES / CHECKLISTS / RUNBOOKS / SKILLS WAVE 3

**Templates 🆕**
- `templates/grill-session/` (abertura + ritmo acknowledge→pergunta + resumo final; de `grill-me SKILL.md:18-21`)
- `templates/wrong-vs-right/` (formato ❌ Problema → ✅ Correto + "Problems:" explícitos; de `karpathy EXAMPLES.md`)
- `templates/anti-pattern-table/` (Princípio → Anti-pattern → Fix como fechamento de aula; de `karpathy EXAMPLES.md:498-505`)
- `templates/skill-starter/` (pastas `SKILL.md`, `references/`, `skill-review.yaml`, `CHANGELOG.md`; de `skillpper`)
- `templates/skill/CHANGELOG.md` (Keep-a-Changelog adaptado p/ prompts; gap skillpper)
- `templates/skills/SKILL.md` (metadata + doc canônico; de `obsidian-skills skills/*/SKILL.md` via Turing)

**Checklists 🆕**
- `checklists/grill-exit-criteria.md` (quando parar: ramos cobertos + sem dependência pendente + resumo aceito)
- `checklists/onboarding-grill.md` (perguntas padrão p/ validar que novo membro entendeu cada CONSOLIDATED — fecha `LEARNING_LOOP.md:56-59`)
- `checklists/skill-release-checklist.md` (frontmatter válido, name==folder, index regenerado, `validate_skills.py --worktree`, `npx skills add .`)
- `checklists/skill-governance-auditoria.md` (validação estática: metadata, refs locais, duplicatas, SEC002/006/007; de `skillpper scripts/validate_skills.py` + `SECURITY.md`)
- `checklists/teaching-effectiveness.md` (diffs menores, perguntas antes de implementar, PRs mínimas; de `karpathy README.md:140-147`)
- `checklists/economia-tokens-agentes.md` (7 regras `skillpper-saver`: grep-first, leitura cirúrgica, cutoff 150k, anti-marathon, subagent governance, Text>Screenshot, truncagem logs)

**Runbooks / Tutorials 🆕**
- `tutorials/grill-me-facilitation.md` (acknowledge 1-2 frases → próxima pergunta imediata; ritmo socrático)
- `tutorials/grill-levels.md` (Feynman progressivo: fato → porquê → e-se → trade-off → ensine-outro)
- `tutorials/grill-example.md` (transcrição simulada 5-7 perguntas; gap grill-me)
- `tutorials/entrevista-socratica-grill-me.md` (anti Blind Assumptions vs Text Slop; AskUserQuestion, rodadas limitadas, `(Recommended)` primeiro)
- `tutorials/quiz-adaptativo-reforco-base.md` (10 questões + 2-3 reforço do nível abaixo; 30-70% conceitual/código; conferência 9 checks; de `skillpper study-quiz`)
- `tutorials/criando-sua-primeira-skill.md` (convenção pacote: 1 pasta, `lowercase-hyphen`, `name==folder`, `SKILL.md/references/scripts/assets`)
- `tutorials/cadeia-pesquisa-blueprint-visual.md` (pesquisa→blueprint→`.excalidraw`; catálogo fontes, `S01` citações; de `skillpper`)
- `tutorials/surgical-changes.md` + `teaching-patterns/surface-assumptions.md` + `teaching-patterns/goal-driven-verification.md` (de karpathy)
- `quiz-design/one-question-at-a-time.md` + `quiz-design/multiple-choice-design.md` (2-4 opções concretas, nada de Yes/No genérico; de grill-me)
- `devtools/obsidian.md` (CLI `dev:screenshot`/`dev:dom` como runbook diagnóstico UI; via Turing)

**Skills 🆕**
- `skills/guanabara-skill-marketplace-101/` (instalar, descobrir, versionar, depender)
- `skills/grill-me-fallback/` (versão sem AskUserQuestion: markdown A/B/C/D p/ ambientes sem popup)
- `skills/teaching-with-wrong-vs-right/` (empacota formato pedagógico karpathy como skill reutilizável)

---

## 5. GAPS DE CONHECIMENTO (Para próximas extrações / Batch 2)

| Gap | Relevância | Sugestão de Fonte |
|-----|------------|-------------------|
| **Kotlin Multiplatform (KMP) Architecture** | 🔴 Alta | Novo repo / KotlinConf talks |
| **SwiftUI + Observation + TCA** | 🔴 Alta | pointfreeco / swiftui-lab |
| **Swift Concurrency Migration** (Signals → async/await) | 🟠 Média | ios-good-practices gap + claude-code patterns |
| **SPM como Default** (aposentar CocoaPods/Carthage) | 🟠 Média | ios-good-practices + project-guidelines |
| **CI/CD Mobile Moderno** (Fastlane + GH Actions + Test Lab) | 🟠 Média | Trevor + ios-good-practices gap |
| **Acessibilidade Mobile (VoiceOver / Dynamic Type / Dark Mode)** | 🟠 Média | project-guidelines a11y + ios-good-practices gap |
| **Privacy Manifests & ATT** (iOS 17+) | 🟢 Baixa | iOS release notes + compliance |

### 5B. 🆕 GAPS WAVE 3 (para Batch 3 / próximos crafts)

| Gap 🆕 | Origem | Sugestão |
|--------|--------|----------|
| **Rúbrica de avaliação grill-me** (repite/explica/aplica/transfere, Bloom) | grill-me-skill Gap 1 | `learning-validation/rubric.md` |
| **Anti-patterns de quiz** (capciosas, ambíguas, punitivas) | grill-me-skill Gap 5 | `quiz-design/anti-patterns.md` |
| **Semver para skills + lockfile dependências** | skillpper Gaps 1-2 | ADR semver prompts + `skill-dependencies.yaml` manifesto |
| **ML/DL ensinável (backprop, overfitting, attention)** com estilo ❌/✅ | karpathy Gaps 1-2 | `analogies/ml-fundamentals.md` (ex: overfitting = decorar gabarito vs aprender matéria) |
| **Checkpoint "faz sentido?" + progressão por nível nos tutorials** | karpathy Gaps 4-5 | Estender template wrong-vs-right com `🎓 Tente você` / `❓ Checkpoint` |
| **Validação formato SKILL.md via JSON schema** | obsidian-skills Gap 1 (Turing) | Template validador formato |
| **Testes Vitest/Playwright p/ exemplos didáticos** | mattpocock_skills (Turing) | Migrar snippets Jest-style; `setup-vitest-playwright` skill |

---

## 6. ADRs PROPOSTAS (para cross-cutting)
- **ADR-001**: Feature-based Packaging (com Niamaia + Towards + Trevor)
- **ADR-009**: Android/iOS Security Baseline (com Tranquilão + Kaspersky + Trevor + Niamaia)
- **ADR-019**: Onboarding Standard (Glossário, Git, Env, Deps, Tests, Structure, Style, Logging, API, A11y)
- **ADR-0XX 🆕**: Skill Versioning com SemVer para Prompts (MAJOR=muda interface/trigger, MINOR=novo modo compatível, PATCH=fix instrução; de skillpper Gap 1)
- **ADR-0XY 🆕**: Grill-me como gate obrigatório de ADRs cross-cutting — formalizar com critério operacional o que o LEARNING_LOOP já prescreve (de grill-me-skill)

---

## 7. 🆕 LEARNING VALIDATION — grill-me como método canônico

**Fonte:** `grill-me-skill` (21/25) + `skillpper/grill-me` + `skillpper/study-quiz` | **Cerimônia oficial:** `_governance/LEARNING_LOOP.md:35-38` (Guanabara facilita, Líder decide)

**Analogia:** churrasco — professor-churrasqueiro vira a carne de todos os lados; cada pergunta = um lado; shared understanding = ponto ideal.

**Padrão Feynman invertido:** quiz testa reconhecimento; grill-me testa **entendimento sob pressão** (professor pergunta até o aluno provar que entende).

**Regras canônicas (SKILL.md):**
1. Uma pergunta por vez via AskUserQuestion, nunca texto corrido (`SKILL.md:10-12`) → `quiz-design/one-question-at-a-time.md`
2. 2-4 opções concretas, nada de Yes/No genérico (`SKILL.md:14`) → `quiz-design/multiple-choice-design.md`
3. Acknowledge 1-2 frases → próxima pergunta imediata, sem palestra (`SKILL.md:18`)
4. Se dá p/ responder explorando codebase, explore você — não terceirize esforço pro aluno (`SKILL.md:19`) → `learning-validation/explore-before-ask.md`
5. Resolver dependências uma-por-uma na ordem da árvore; resumo conciso final fecha o loop (`SKILL.md:3-6,21`)
6. Trigger phrase "grill me" = contrato explícito de stress-test

**Quiz adaptativo complementar (`study-quiz`):** 10 questões + 2-3 reforço do fundamento do nível abaixo ("aquilo que, se a pessoa não souber, derruba o resto"); faixa iniciante→avançado; mistura 30-70% conceitual/código; distribuição de gabarito; conferência final 9 checks.

**Riscos conhecidos:** critério de parada vago (loop infinito) → `grill-exit-criteria.md`; dependência hard em AskUserQuestion → `grill-me-fallback` skill; sem guardrail anti-redundância → regra "revisite ramo só se decisão anterior invalidada".

> Citação: *"Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree."* (`SKILL.md:3-4`)

## 8. 🆕 SKILL MARKETPLACE & REGISTRY PATTERNS

**Fonte:** `skillpper` (22/25) — *Practical skills for developers and their AI coding agents*

- **Marketplace como App Store:** `npx skills add kipperdev/skillpper --skill <nome> --agent codex --global` + `--list`; projeto vs global; `RECOMENDATIONS.md` = Escolha do Editor
- **Skill = Pacote:** 1 pasta raiz, `lowercase-hyphen`, `name==folder`, frontmatter `name+description`, `SKILL.md/references/scripts/assets` (validador: `re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*")`)
- **Registry-index gerado:** `update_skills_index.py` lê frontmatter e regenera tabela entre `<!-- SKILLS:START/END -->` → pattern `registry-index-gerado.md`
- **Dependência ensinável:** `prepare-technical-slides → concept-to-excalidraw`; se falta → "concluir blueprint e informar que falta; não declarar slides gerados" (analogia LEGO)
- **Discovery 3 camadas:** (1) CLI browse, (2) curadoria manual, (3) `find-skills`/skills.sh busca por domínio + Pages
- **Governance estática:** `validate_skills.py` inspeciona sem executar (metadata, refs, bundle, duplicatas, SEC002/006/007 credential/exfil/unsafe-exec); modos worktree vs git; waivers só SEC003/DUP001 com SHA256 + expiração ≤30d. *"A passing result... is not a safety guarantee."* (`SECURITY.md:3`) — analogia raio-X vs exame de sangue
- **Ranking comunitário:** Discussions `Skill Votes` + marker `<!-- skillpper-vote-skill: X -->` + cron 5min → `RANKING.md`
- **Memória persistente (`ai-memory-obsidian`):** "Memory First", ADRs em `decisions/ADR-YYYY-MM-DD-<slug>.md`, handoff `sessions/Session-...md`, vault fora do repo
- **Economia tokens (`skillpper-saver`):** *"drivers of runaway token consumption are not high-end models... but marathon sessions, re-reading, screenshots, massive logs"*
- **Cadeia pesquisa→blueprint→visual:** catálogo fontes aprovado, citações `S01`, `validate_references.py`, 1 conceito/slide → `.excalidraw` editável
- **Cross-ref Towards:** Towards foca implementação (`validate_skills.py`, `update_skills_index.py`, GraphQL votos); Guanabara foca *porquê ensinar* cada pattern.

## 9. 🆕 TEACHING PRINCIPLES & FORMATO ❌/✅ (Karpathy)

**Fonte:** `andrej-karpathy-skills` (18/25) — ⚠️ nome engana: **não ensina ML/DL**, ensina *como instruir LLMs/juniors a codar bem*. Referência interna: `karpathy-coding-guidelines`.

**4 princípios (Conceito → Por que → Como → Teste):**
1. **Think Before Coding** (médico antes de operar) — liste escopo/formato/fields/volume antes de implementar (Surface Assumptions)
2. **Simplicity First** (canivete vs caminhão) — teste: *"Would a senior engineer say this is overcomplicated? If yes, simplify."*
3. **Surgical Changes** (cirurgia, não reforma) — teste: *"Every changed line should trace directly to the user's request."*
4. **Goal-Driven Execution** (ponto do bolo) — imperativo → meta verificável ("Add validation" → "Write tests... then make them pass"); plano `[Step] → verify:[check]`. *"Don't tell it what to do, give it success criteria and watch it go."*

**Formato didático reutilizável:** ❌ vs ✅ com "Problems:" explícitos + tabela fechamento (Princípio → Anti-pattern → Fix) + Key Insight (*"Good code solves today's problem simply, not tomorrow's problem prematurely."*). Empacotamento single-source-multiformat (CLAUDE.md + SKILL.md + .mdc + plugin = escreva 1x, distribua Nx). Tradeoff Note: *"bias toward caution over speed; trivial tasks use judgment"* — ensinar quando NÃO aplicar.
**Cross-ref:** Towards (implementação), Qualy (test-first verification).

## 10. 🆕 LENTE GUANABARA SOBRE MATTPOCOCK + OBSIDIAN (extrações Turing)

**`mattpocock_skills` (18/25, extração Turing):** valor Guanabara = material de aula pronto:
- Deep-module enforcement (`dependency-cruiser`, só entry-points, no barrels) → aula "portaria do prédio" + checklist setup
- Mocking-at-seams (DI + SDK-style, nunca mockar interno) → aula "dublê de cinema" (complementa `javascript-testing-best-practices` mocks vs spies)
- Good/Bad tests (integração via interface, 1 assert lógico, anti teste-implementação) → formato ❌/✅ direto p/ `testing-best-practices.md`
- Shoehorn migration (`as` → `fromPartial`/`fromAny`) → tutorial migração segura
- CLI feedback-loop (scripts/curl/Playwright/`hitl-loop.template.sh`) → aula "estetoscópio do dev" (diagnostica rápido em vez de adivinhar)
- Cuidado didático: snippets Jest-style sem Vitest/Playwright + `as` assertions — usar como material ❌/✅, não snippet produção. **Cross-ref Turing (DX) + Qualy (testes).**

**`obsidian-skills` (23/25, extração Turing):** valor Guanabara = template + runbook didático:
- Estrutura `SKILL.md` (metadata + doc) → **template canônico** `templates/skills/SKILL.md` p/ padronizar documentação de ferramentas
- CLI Obsidian (`dev:screenshot`, `dev:dom`) → runbook diagnóstico UI ("raio-X da interface")
- Defuddle (limpeza p/ LLM) → pattern "coar café"; Knap (template rendering) → "forma de bolo". **Cross-ref Turing (DX/devtools).**

---

## 11. 🆕 CROSS-REFS WAVE 3

| Sistema | Conexão |
|---------|---------|
| `LEARNING_LOOP.md:35-38,56-59` | grill-me é cerimônia oficial (antes de toda ADR cross-cutting e template unificado); `onboarding-grill.md` fecha o loop de validação de novos membros |
| Towards (implementation) | skillpper (`validate_skills.py`, `update_skills_index.py`, votos GraphQL); karpathy (aplicar 4 princípios no código) |
| Turing (DX) | mattpocock (deep-modules, mocking, CLI loop, Vitest/Playwright); obsidian (SKILL template, devtools CLI, defuddle/knap) |
| Qualy (quality) | karpathy goal-driven verification (test-first); mattpocock good/bad tests; study-quiz conferência 9 checks |
| Tranquilão/Kaspersky | skillpper governance estática (SEC002/006/007) como baseline de auditoria de skills |

---

*CONSOLIDATED v2.0 (Batch 1 8 repos + Wave 3 5 repos = 13 total) — Guanabara*