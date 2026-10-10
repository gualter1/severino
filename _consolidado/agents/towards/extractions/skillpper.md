# EXTRAÇÃO — skillpper

## METADADOS
- **Repositório**: `skillpper`
- **Lead Responsável**: `towards`
- **Funcionário (Subagente)**: `towards`
- **Data**: `2026-10-09`
- **Tempo gasto**: `0h 25min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Community collection de skills reutilizáveis para devs e seus AI coding agents (design, research, workflows). Cada skill = processo focado + referências + expectativas de resultado. |
| **Público-alvo** | Devs que usam Claude Code / Codex / Cursor via Skills CLI; contribuidores de skills |
| **Tamanho** | ~60-80 arquivos; 9 pastas de skill no root (`ai-memory-obsidian`, `concept-to-excalidraw`, `design-craft`, `good-design`, `grill-me`, `prepare-technical-slides`, `skillpper-saver`, `study-quiz`, `technical-talk-research`); `scripts/skill_validation/` (11 módulos), `tests/` (14 arquivos), `docs/`, `security/`, `.github/` |
| **Linguagens/Tech** | Markdown (SKILL.md + references), Python 3.12 (scripts de validação/index/votos + unittest), YAML (skill-review manifests, policy), GitHub Actions + Discussions (GraphQL), GitHub Pages (`docs/index.html`) |
| **Freshness** | Ativo — `docs/votes.json` com `updated_at: 2026-10-04`; workflow de votos roda a cada 5 min; ranking ainda zerado (repo jovem) |

---

## 2. O QUE PRESTA PARA **TOWARDS** (Extrair para consolidado)

Foco do batch: **skill registry/marketplace, versioning, dependency resolution, discovery**.

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Frontmatter contract como chave de discovery (`name` == folder name, regex `^[a-z0-9]+(-[a-z0-9]+)*$`, `description` non-empty ≤1024) + index gerado entre markers `SKILLS:START/END` | `scripts/update_skills_index.py:24-57`, `scripts/skill_validation/structure.py:359-364` | Pattern | `agents/towards/skill-registry-discovery.md` | 🔴 Alta |
| Layout de registry: `SKILL.md` só permitido em root direto não-infra; `INFRASTRUCTURE_ROOTS = {.git,.github,.conductor,docs,scripts,tests,security}`; `INV002` (dir sem manifest), `INV003` (bundle sem source), `INV005` (SKILL.md aninhado) | `scripts/skill_validation/catalog.py:7-69` | Guideline | `agents/towards/skill-registry-layout.md` | 🔴 Alta |
| `skill-review.yaml` manifest: `{schema_version, purpose, differentiation, access:{files_read,files_written,network_hosts,tools,dependencies}, cases:[happy-path, boundary]}` com chaves exatas e IDs obrigatórios | `scripts/skill_validation/structure.py:166-219`, `CONTRIBUTING.md:26-55` | Template | `templates/skills/skill-review.yaml` | 🔴 Alta |
| Dependência declarada como string livre + caso de teste (`prepare-technical-slides` → `concept-to-excalidraw`; "pesquisa pontual funciona sem essa dependência" = dep opcional/graceful degradation) | `prepare-technical-slides/skill-review.yaml:20-23` | Pattern | `agents/towards/skill-dependency-declaration.md` | 🟠 Média |
| Empacotamento determinístico `.skill` (ZIP: paths POSIX ordenados, timestamp fixo 1980-01-01, só modos 644/755, sem symlinks, archive fora do source dir) + receita Python canônica | `CONTRIBUTING.md:57-94` | Guideline | `agents/towards/skill-bundle-packaging.md` | 🔴 Alta |
| Validação de bundle sem extração: paridade exata source↔archive (`BUNDLE_EXTRA/MISSING/MISMATCH`), budgets (20 MiB comprimido / 50 MiB expandido / 500 membros / ratio 100:1), zip-slip/path-traversal hardening, sem nested archives, sem encryption | `scripts/skill_validation/bundles.py:116-250` | Pattern | `agents/towards/skill-bundle-validation.md` | 🔴 Alta |
| Dedup de registry: `DUP001 error` (body idêntico pós normalização Unicode+whitespace bloqueia) + `DUP002 review` (Jaccard ≥0.65 com mín 30 tokens, máx 10 shared terms seguras) | `scripts/skill_validation/duplicates.py:54-93` | Pattern | `agents/towards/skill-dedup.md` | 🟠 Média |
| Instalação/distribuição via Skills CLI (`npx skills add kipperdev/skillpper [--list] [--skill X] [--agent codex] [--global]`) — registry endereçável por `owner/repo` + skill name | `README.md:46-83` | Guideline | `agents/towards/skill-distribution-channels.md` | 🟠 Média |
| Ranking/discovery via GitHub Discussions `:+1:`: marker oculto `<!-- skillpper-vote-skill: X -->` + mapping confiável `docs/vote-discussions.json` (ignora cópias comunitárias), `RANKING.md` + `docs/votes.json` dashboard gerados, workflow a cada 5 min, preview local sem credenciais | `scripts/update_skill_votes.py:50-66,226-257,301-316`, `docs/community-voting.md:1-42`, `RANKING.md:1-16` | Pattern | `agents/towards/skill-marketplace-ranking.md` | 🟠 Média |
| Índice federado curado separado do first-party (`RECOMENDATIONS.md`: projeto/autor/use-case/install, PR com exemplo de uso; "lista curada manualmente, separada do index gerado") | `RECOMENDATIONS.md:1-19`, `README.md:36-44` | Guideline | `agents/towards/skill-federated-index.md` | 🟢 Baixa |
| Trusted-base validator (CI usa policy/exceptions/validator do `base_sha` verificado, não do candidato; `_verify_trusted_base` checa `HEAD == base_sha` + bytes idênticos dos paths protegidos; sem fallback para código do candidato) | `scripts/validate_skills.py:74-111` | Pattern | `agents/towards/skill-registry-supply-chain.md` | 🔴 Alta |
| Modelo de exceção versionado: só `SEC003`/`DUP001` waivable, path exato (sem globs), bind em `content_sha256`, aprovador ∈ maintainers, lifetime ≤30 dias, mudanças no exception file exigem review separado no trusted base | `scripts/skill_validation/policy.py:84-180`, `SECURITY.md:16` | Decision record | `agents/towards/skill-exception-policy.md` | 🟠 Média |
| Leitura bounded de árvore Git (budgets: 100 MiB scan / 10k entries / 500 arquivos por root / 1 MiB texto / 5 MiB binário; `cat-file --batch` sem checkout/execução; erros genéricos sem vazar conteúdo do candidato) | `scripts/skill_validation/git_tree.py:162-273`, `scripts/validate_skills.py:32-71` | Pattern | `agents/towards/skill-registry-ingestion-limits.md` | 🟠 Média |
| Strict YAML (sem anchors/aliases, sem chaves duplicadas) + frontmatter ≤8 KiB + links Markdown locais contidos na skill (`STR013` escapa, `STR014` alvo inexistente) + schemes permitidos `{https,http,mailto}` | `scripts/skill_validation/structure.py:36-94,296-338` | Code snippet | `agents/towards/skill-manifest-parsing.md` | 🟠 Média |
| Reports determinísticos com redação (`[REDACTED]` p/ tokens/keys, escape de markup, fingerprint `sha256(rule↔path↔content)`, exit codes 0/1/2, "static inspection only, not executed") | `scripts/skill_validation/report.py:20-77`, `scripts/skill_validation/models.py:58-62` | Pattern | `agents/towards/skill-validation-reporting.md` | 🟢 Baixa |
| Honestidade de escopo do validador ("passing check is not a safety certification; não instala/executa, não chama modelo, não fetch URLs") + catálogo de 7 `review` findings baseline documentados | `README.md:189`, `SECURITY.md:1-13` | Guideline | `agents/towards/skill-validation-scope.md` | 🟢 Baixa |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Sem campo de versão no frontmatter/manifest (só `name`+`description` + `schema_version: 1` do review manifest) — impossível pin/yank/upgrade | `scripts/skill_validation/structure.py:365-377` | Registry sem versionamento não suporta `skills add @x.y.z`, rollback ou deprecation | Adicionar `version: <semver>` + `CHANGELOG.md` por skill; ver Gap 1 |
| Dependências como strings livres sem range/resolver (`dependencies: []` ou `"concept-to-excalidraw"`) — sem resolução transitiva nem instalação automática | `prepare-technical-slides/skill-review.yaml:20-23`, `design-craft/skill-review.yaml:20` | Instalador (`npx skills add --skill X`) não puxa deps; doc manda "instale ambas" manualmente (`README.md:91`) | Manifest com `dependencies: [{name, version_range, optional}]` + resolver; ver Gap 2 |
| `RANKING.md` e links de discussão apontando para fork `LucasLydio/skillpper` enquanto install usa `kipperdev/skillpper` — inconsistência de identidade do registry | `RANKING.md:8-14`, `docs/votes.json:3`, `README.md:62` | Votos/links quebram se o repo canônico mudar; dashboard exibe origem errada | Parametrizar owner/repo via env/CI (`GITHUB_REPOSITORY`) e regenerar registry |
| Skill `technical-talk-research/` sem `skill-review.yaml` (14 manifests? não — glob mostra 8 skills com manifest, mas `technical-talk-research` tem yaml; `grill-me` ok) — na verdade `concept-to-excalidraw/agents/openai.yaml` etc. são configs por-agent não validadas pelo schema | `concept-to-excalidraw/agents/openai.yaml`, `good-design/agents/openai.yaml` | Sub-manifests por-agent fora do contrato validado = drift silencioso | Estender `validate_structure` ou declarar `agents/` como convenção versionada |
| Votação por reação `:+1:` sem anti-gaming (sem peso por contribuidor, sem quorum, empates = ordem alfabética) | `scripts/update_skill_votes.py:301-316` | Ranking manipulável / pouco sinal para discovery real | Combinar com download counts, CI pass rate, freshness (ver Gap 3) |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] Gap 1: **Versionamento semântico por skill inexistente** — Sugestão: estender frontmatter com `version`, `changelog` e `deprecated successor`; `update_skills_index.py` passa a renderizar coluna Version; bundles `.skill` nomeados `name-version.skill`; documentar política de breaking changes em ADR
- [ ] Gap 2: **Sem resolvedor de dependências** — Sugestão: tipar `access.dependencies[]` como `{name, version_range, optional: bool}`, implementar `scripts/resolve_skill_deps.py` (detecção de ciclo + ordenação topológica + install transitiva no `skills add`), e teste `tests/test_skill_deps.py` (happy: cadeia A→B→C; edge: ciclo, versão insatisfeita, dep opcional ausente)
- [ ] Gap 3: **Discovery limitado a nome+descrição (sem keywords/search/compatibilidade por agent)** — Sugestão: campos `tags[]`, `agents[]` (claude/codex/cursor), índice `docs/skills.json` pesquisável (gerado junto de `votes.json`), e ranking composto (votos + freshness + CI verde)
- [ ] Gap 4: **Sem mecanismo de yank/deprecation/renome** — Sugestão: `canonical_discussions()` já preserva discussão em rename (linha 246-250) — generalizar para `redirects: {old-name: new-name}` no index + finding `INV006 deprecated` com successor

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: seção `skill registry` — layout (SKILL.md raiz + INFRASTRUCTURE_ROOTS), frontmatter contract, manifest `skill-review.yaml`, packaging determinístico `.skill`, validação (structure/bundles/dedup/security), trusted-base CI, ranking por Discussions
- [ ] **Criar ADR**: `skill-registry-versioning-and-deps` — Para: decidir formato de `version` + `dependencies[]` tipadas antes de adotar o template de manifest no `_consolidado`
- [ ] **Criar Template**: `skill-review.yaml` — Em: `_consolidado/templates/skills/skill-review.yaml` (copiar schema de `CONTRIBUTING.md:30-55` + campo proposto `version`/`tags` marcados como extensão)
- [ ] **Criar Checklist**: `new-skill-submission` — Em: `agents/towards/checklists/` (frontmatter válido → manifest com happy-path+boundary → index regenerado → validator local verde → bundle regenerado se houver → PR com review dos `review` findings)
- [ ] **Criar Runbook**: `skill-bundle-release` — Em: `agents/towards/runbooks/` (receita determinística de `CONTRIBUTING.md:63-92` + verificação de paridade `BUNDLE_*` + budgets)
- [ ] **Criar Skill**: `skill-registry-reviewer` — Em: `_consolidado/skills/skill-registry-reviewer/` (checklist automatizável: layout INV00x, frontmatter STR00x, manifest, links contidos, dedup DUP00x, bundle parity, policy de exceções)
- [ ] **Novo agente necessário**: nenhum — cobertura via towards + cross-ref guanabara (teaching) / niamaia (architecture)

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `README.md:187` — "discovers root-level `*/SKILL.md` files and checks that the alphabetical table matches their YAML metadata."

> `CONTRIBUTING.md:59` — "An optional archive contains every regular file under its skill directory, with archive paths prefixed by the skill directory name."

> `SECURITY.md:3` — "A passing result means only that the implemented static checks found no unexcepted blocking issue; it is not a safety guarantee."

> `SECURITY.md:16` — "No globs are allowed. V1 permits waivers only for `SEC003` and `DUP001`."

> `docs/community-voting.md:23` — "The trusted skill-to-discussion mapping lives in `docs/vote-discussions.json`, so copied markers in community-created discussions are ignored."

> `prepare-technical-slides/skill-review.yaml:22` — "concept-to-excalidraw para produção visual; pesquisa pontual funciona sem essa dependência"

> `README.md:36` — "We also have a bunch of recomendation of third-party skills you can use on your daily workflow"

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | É literalmente um skill registry/marketplace com validação, packaging, discovery e ranking — core do batch |
| **Qualidade** | 5 | Validador em 11 módulos com budgets, testes (14 arquivos), policy versionada, reports redatados; código limpo e comentado com "why" |
| **Atualidade** | 4 | Ativo (out/2026), Python 3.12, Skills CLI atual; perde 1 pt pela inconsistência de owner e ranking zerado |
| **Ação** | 5 | Templates (manifest, packaging, checklist) e patterns (layout, bundle validation, trusted-base, dedup) usáveis AGORA |
| **Completude** | 3 | Registry + discovery + validação cobertos; **versionamento, dependency resolution e yank/deprecation ausentes** |
| **TOTAL** | **22/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

**Veredito: PRIORIZAR EXTRAÇÃO COMPLETA** (com ADRs para os gaps de versionamento/deps).

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/towards/extractions/skillpper.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Código pronto para PR (artefatos-fonte no repo, caminhos exatos nas tabelas acima). Decisões técnicas: priorizado o ângulo registry/marketplace conforme o batch; segurança do validador tratada como pattern de supply-chain (detalhe para kaspersky via cross-ref); versionamento/deps registrados como gaps com ADRs propostas em vez de assumidos. Testes sugeridos: happy (skill nova válida passa `validate_skills.py` + index `--check` verde), edge (rename com discussão preservada, bundle com 1 byte divergente → `BUNDLE_MISMATCH`, frontmatter 8 KiB+1 → `STR002`), error handling (blob >1 MiB → `InputError`, exceção expirada → `PolicyError`, scan incompleto → exit 2). TODOs: resolver inconsistência de owner `kipperdev` vs `LucasLydio`; propor ADR de versionamento antes de copiar o template.*
