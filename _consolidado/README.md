# _consolidado — BASE DE CONHECIMENTO DA EQUIPE

> **Fonte da verdade** do que a equipe extraiu, aprovou e consolidou dos repositórios em `Repositorios/`.

---

## MAPA DO TESOURO

### 📁 agents/ — Por Domínio (Cada Lead = Gerente + Funcionários)
```
agents/
├── niamaia/           # 🏛️ Arquitetura — ADRs, patterns, tech stack, modularização
│   ├── extractions/   # Extrações brutas por repo
│   ├── CONSOLIDATED.md  ← LEIA ESTE (resumo vivo do domínio)
│   ├── adrs/          # ADRs propostas
│   └── templates/
├── trevor/            # ☁️ Platform/DevOps — CI/CD, IaC, K8s, observabilidade, signing
├── tranquilao/        # 🛡️ Security/Quality — Hardening, checklists, compliance, SAST
├── qualy/             # 🧪 Quality/Testing — Estratégias, automação, contract testing
├── towards/           # ⚙️ Full-stack Senior — Features complexas, refactoring, debugging
├── turing/            # 🎨 Frontend/DX — Performance, a11y, design systems, React/Vue
├── kaspersky/         # 🔐 Threat Modeling — SAST/DAST, LGPD/SOC2, attack surfaces
├── guanabara/         # 🎓 Ensino/Onboarding — Analogias, tutoriais, mental models
├── severino/          # 🎯 Tech Lead Orchestrator — Decisões, estratégia, retrospectivas (LÍDER)
├── specialists/       # 🔍 Especialistas Descobertos — Domínios novos que aparecem no caminho
├── marketing/         # 📈 Growth/Content/SEO (quando houver)
└── sales/             # 🤝 Proposals/CRM/Negotiation (quando houver)
```

### 📁 cross-cutting/ — Consolidação Transversal (Líder = Severino)
```
cross-cutting/
├── adrs/              # ADRs APROVADAS (numeradas, final) — LEIA ESTAS PRIMEIRO
├── team/
│   ├── roles.md       # Papéis, responsabilidades, senioridade
│   ├── skills-matrix.md  # Quem sabe o quê
│   └── hiring-plan.md    # Gaps → contratações
├── templates/         # Templates UNIFICADOS prontos para uso em projetos
├── runbooks/          # Procedimentos operacionais validados
└── onboarding/        # Pack de entrada para novos membros
```

### 📁 skills/ — Skills Reutilizáveis Extraídas
```
skills/
├── grill-me/          # Validação de designs/plans (já existe)
├── code-review/       # (futuro)
├── threat-modeling/   # (futuro)
└── ...
```

---

## COMO USAR ESTA BASE

### Se você é **Líder (Severino)**
1. Leia `cross-cutting/adrs/` — decisões finais
2. Leia `cross-cutting/team/roles.md` — quem faz o quê
3. Segunda-feira: leia `agents/*/CONSOLIDATED.md` atualizados
4. Use `CONSOLIDATION_RULES.md` em `_governance/`
5. Suas decisões/estratégia: `agents/severino/decisions/`, `agents/severino/strategy/`
6. Especialistas descobertos: `agents/specialists/discovered/`

### Se você é **Lead (Gerente)**
1. Seu domínio: `agents/{seu_nome}/CONSOLIDATED.md` — mantenha VIVO
2. Revise extrações em `agents/{seu_nome}/extractions/`
3. Use `APPROVAL_PROCESS.md` em `_governance/`
4. Proponha ADRs em `agents/{seu_nome}/adrs/`

### Se você é **Funcionário (Subagente)**
1. Pegue repo na fila
2. Use `EXTRACTION_TEMPLATE.md` em `_governance/`
3. Salve em `agents/{seu_lead}/extractions/{repo}.md`
4. Avise seu Lead

### Se você é **Novo Membro**
1. Comece em `cross-cutting/onboarding/`
2. Guanabara te guia
3. Leia ADRs em `cross-cutting/adrs/`
4. Escolha domínio → vire Funcionário de um Lead

---

## REGRAS DE OURO (Resumo)

| Regra | Onde está |
|-------|-----------|
| **Repositorios/ é READ-ONLY** | `_governance/READ_ONLY_REPOS.md` |
| **Como extrair** | `_governance/EXTRACTION_TEMPLATE.md` |
| **Como Lead aprova** | `_governance/APPROVAL_PROCESS.md` |
| **Como Líder consolida** | `_governance/CONSOLIDATION_RULES.md` |
| **Como aprendemos sempre** | `_governance/LEARNING_LOOP.md` |

---

## STATUS ATUAL (Atualizado pelo Líder semanalmente)

| Domínio | CONSOLIDATED.md | Extrações aprovadas | ADRs propostas | Templates | Última atualização |
|---------|-----------------|---------------------|----------------|-----------|-------------------|
| niamaia | ❌ Vazio | 0 | 0 | 0 | — |
| trevor | ❌ Vazio | 0 | 0 | 0 | — |
| tranquilao | ❌ Vazio | 0 | 0 | 0 | — |
| qualy | ❌ Vazio | 0 | 0 | 0 | — |
| towards | ❌ Vazio | 0 | 0 | 0 | — |
| turing | ❌ Vazio | 0 | 0 | 0 | — |
| kaspersky | ❌ Vazio | 0 | 0 | 0 | — |
| guanabara | ❌ Vazio | 0 | 0 | 0 | — |
| severino | ❌ Vazio | — | — | — | — |
| specialists | ❌ Vazio | — | — | — | — |

> **Meta Fase 1**: Todos os 10 domínios com CONSOLIDATED.md vivo após processar os 29 repos.

---

## REPOSITÓRIOS NA FILA (29 em `Repositorios/`)

```
1. agent-skills
2. AionUi
3. andrej-karpathy-skills
4. android-best-practices
5. anthropics_skills
6. archify
7. awesome-llm-apps
8. cc-switch
9. claude-code-best-practice
10. context-mode
11. dify
12. ECC
13. grill-me-skill
14. ios-good-practices
15. JavaScript
16. javascript-testing-best-practices
17. mattpocock_skills
18. nodebestpractices
19. obsidian-skills
20. oh-my-openagent
21. openclaude
22. planning-with-files
23. project-guidelines
24. python-guide
25. react-boilerplate
26. skillpper
27. superpowers
28. ui-ux-pro-max-skill
```

---

## PRÓXIMOS PASSOS IMEDIATOS

- [ ] **Fase 1**: 8 leads extraem dos 3 repos conhecidos (android, ios, grill-me)
- [ ] **Fase 1b**: 8 leads processam os 26 repos restantes (em batches)
- [ ] **Fase 2**: Leads aprovam, CONSOLIDATED.md ficam vivos
- [ ] **Fase 3**: Líder consolida cross-cutting, aprova ADRs, unifica templates
- [ ] **Contínuo**: Loop de aprendizado (LEARNING_LOOP.md)

---

*Última atualização: 2026-10-08 — Severino (Líder)*