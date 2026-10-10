# Onboarding Checklist — [Projeto/Equipe]

> Preencha os links entre `[ ]` com URLs reais do projeto antes do Dia 1.
> Progresso: acompanhe com `scripts/track-progress.sh`.

## 🎯 Pré-requisitos (Antes do Dia 1) — Buddy + Trevor preparam

- [ ] Acesso GitHub/GitLab + permissões repo: [link]
- [ ] Acesso Claude Code / IDE configurada
- [ ] `.claude/settings.json` instalado (template `claude-settings`)
- [ ] Secrets configurados (`.env.local` / `Secrets.xcconfig`) — ver `.env.example`: [link]
- [ ] Buddy atribuído (usar `templates/buddy-assignment.md`)
- [ ] Convites: CI ([link]), Sentry/OTEL ([link]), Figma/docs ([link])

## 📚 Semana 1 — Fundamentos

> Mapeamento ADR-019 (10 dias → 5 dias úteis comprimidos; dias 6-10 viram Mês 1):
> Glossário · Git · Env · Deps · Tests · Structure · Style · Logging · API · A11y

### Dia 1: Orientação & Ambiente

- [ ] Tour do repositório (estrutura, `CONSOLIDATED.md` dos leads relevantes): [links]
- [ ] Rodar projeto localmente (`make dev` / `docker-compose up` / `npm run dev`)
- [ ] Executar testes (`npm test` / `pytest` / `go test`) — verde local
- [ ] Entender CI/CD (abrir `.github/workflows/`): [link]
- [ ] Ler glossário do domínio (entidades, siglas, eventos): [link]
- [ ] **Grill-me sessão 1** (buddy facilita, roteiro `grill-questions.md#s1`): *"Explique a arquitetura do projeto em 5 min"*

### Dia 2: Git & Workflow

- [ ] Branching strategy (trunk-based / feature branches / gitflow): [doc]
- [ ] Commit conventions (Conventional Commits) + lint de commit
- [ ] PR template + reviewers + required checks: [link]
- [ ] Worktrees para paralelismo (ADR-004): criar 1 worktree de teste
- [ ] Abrir **First PR trivial** (docs, typo, teste) — template `templates/first-pr.md`
- [ ] **Grill-me sessão 2**: *"Como você faria um hotfix em produção?"*

### Dia 3: Testes & Qualidade

- [ ] Pirâmide de testes do projeto (unit/integration/contract/e2e): [doc Qualy]
- [ ] Coverage gates (ADR-008: 80/70 + mutation): rodar `coverage` e interpretar
- [ ] Quality gates (lint, typecheck, security scan) — forçar 1 falha e corrigir de propósito 🔧
- [ ] **Grill-me sessão 3**: *"Mostre um teste bom e um teste ruim do projeto"*

### Dia 4: Domínio & Código

- [ ] Domain model walkthrough (entidades, value objects, eventos): [link Niamaia/Towards]
- [ ] Feature architecture (ADR-001: feature-skeleton) — criar feature mock
- [ ] Async patterns (ADR-002: async-store) — ler 1 store real e explicar
- [ ] Logging sanitizado + API design (REST/GraphQL do projeto)
- [ ] A11y básico (axe-core pass em 1 tela — Turing/Qualy)
- [ ] **Grill-me sessão 4**: *"Desenhe o fluxo comando → evento → projeção"*

### Dia 5: Primeiro PR & Retro

- [ ] First PR merged (passou por todo pipeline — build→test→lint→security→deploy preview)
- [ ] Code review com buddy (patterns Tranquilão: secrets, input validation, log sanitization)
- [ ] **Retrospectiva semana 1** (template `templates/week-1-retro.md`)
- [ ] **Grill-me final** (Guanabara ou Líder): *"O que você mudaria no onboarding?"* → vira issue de melhoria

## 📈 Mês 1 — Autonomia (Trilha Mid/Senior → `tracks/mid.md`)

- [ ] Feature end-to-end (pegar do backlog, com contract test se houver Pact)
- [ ] ADR writing (propor ou revisar 1 ADR)
- [ ] Threat model básico STRIDE da feature (Kaspersky review)
- [ ] Cross-team collaboration (pair com outro domínio, 1 sessão)
- [ ] **Grill-me mensal**: validação de entendimento cross-cutting

## 🏗️ Contínuo — Senior/Especialista (`tracks/senior.md`, `tracks/specialist.md`)

- [ ] Mentoria de novo membro (ser buddy 1x)
- [ ] Propor melhoria transversal (ADR, template, tooling)
- [ ] Grill-me facilitador (certificação Guanabara — conduzir 1 sessão observada)

---

## GRILL-ME VALIDATION (LEARNING_LOOP.md:35-38, 56-59)

- **Antes de cada ADR cross-cutting**: grill-me session obrigatória
- **Antes de cada template unificado**: grill-me session obrigatória
- **Guanabara facilita, Líder decide**
- **Critérios de saída**: todos os ramos cobertos + sem dependência pendente + resumo aceito (ver `grill-questions.md` → Exit Criteria)
- **Onboarding como teste**: se o novato não entende, o consolidado tem bug → Guanabara reporta → Lead corrige → Líder valida