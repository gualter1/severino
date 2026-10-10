## METADADOS
- **Repositório**: `javascript-testing-best-practices`
- **Lead Responsável**: `guanabara`
- **Funcionário (Subagente)**: `Guanabara`
- **Data**: `2026-10-08`
- **Tempo gasto**: `0h 25min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Guia A-Z de confiabilidade e testes em JavaScript/Node: anatomia, backend, frontend, medição e CI (50+ práticas) |
| **Público-alvo** | Devs JS/TS, QA, DevOps |
| **Tamanho** | `readme.md` único (~2159 linhas), 6 seções (Golden Rule, Test Anatomy, Backend, Frontend, Measuring, CI) + traduções |
| **Linguagens/Tech** | Markdown, JavaScript, Jest, Mocha, Sinon, Supertest, Cypress, fast-check, Stryker |
| **Freshness** | Curadoria ativa de Yoni Goldberg + comunidade; referência de mercado |

---

## 2. O QUE PRESTA PARA **GUANABARA** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Golden Rule: lean testing p/ Sistema 1 (sem headspace p/ complexidade) | `readme.md:80-93` | Analogy | `agents/guanabara/analogies/lean-testing-system1.md` | 🔴 Alta |
| Nome de teste em 3 partes (o quê / circunstância / resultado) | `readme.md:103-155` | Guideline | `agents/guanabara/tutorials/test-naming-3-parts.md` | 🔴 Alta |
| Padrão AAA (Arrange, Act, Assert) | `readme.md:159-213` | Pattern | `agents/guanabara/tutorials/aaa-pattern.md` | 🔴 Alta |
| Black-box: testar só métodos públicos (menino que gritava lobo) | `readme.md:276-314` | Anti-pattern | `agents/guanabara/analogies/black-box-testing.md` | 🔴 Alta |
| Stubs/spies > mocks; teste deve refletir requirements doc | `readme.md:318-367` | Guideline | `agents/guanabara/tutorials/test-doubles.md` | 🔴 Alta |
| Não usar "foo": dados realistas (Chance/Faker) | `readme.md:377-427` | Guideline | `agents/guanabara/tutorials/realistic-test-data.md` | 🟠 Média |
| Property-based testing (fast-check, 1000 permutações) | `readme.md:431-464` | Pattern | `agents/guanabara/tutorials/property-based-testing.md` | 🟠 Média |
| Snapshots só curtos e inline (3-7 linhas) | `readme.md:468-531` | Anti-pattern | `agents/guanabara/tutorials/snapshot-discipline.md` | 🟠 Média |
| Component testing: melhor dos dois mundos (supertest) | `readme.md:775-800` | Pattern | `agents/guanabara/tutorials/component-testing.md` | 🔴 Alta |
| PACT: cliente define o teste do servidor (contrato) | `readme.md:803-824` | Pattern | `agents/guanabara/analogies/contract-testing.md` | 🟠 Média |
| Dados por teste, nunca seed global (testes pisam uns nos outros) | `readme.md:913-963` | Anti-pattern | `agents/guanabara/tutorials/test-data-isolation.md` | 🔴 Alta |
| Limpeza after-all > after-each (paralelismo, debugging) | `readme.md:968-996` | Decision record | `agents/guanabara/decision-records/db-cleanup-strategy.md` | 🟠 Média |
| Nock p/ isolar HTTP (simulador de voo: tempestades, não céu azul) | `readme.md:1000-1025` | Analogy | `agents/guanabara/analogies/http-isolation.md` | 🟠 Média |
| Mutation testing: o teste pega o bug de verdade? | `readme.md:1729-1775` | Tutorial | `agents/guanabara/tutorials/mutation-testing.md` | 🟠 Média |
| Taggear testes (#cold #sanity) p/ subsets rápidos | `readme.md:639-668` | Guideline | `agents/guanabara/tutorials/tagging-tests.md` | 🟢 Baixa |
| Feedback loop local (npm run quality + husky) | `readme.md:1836-1872` | Runbook | `agents/guanabara/runbooks/local-quality-loop.md` | 🟠 Média |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Enzyme p/ React | `readme.md:1264` | Descontinuado p/ React moderno | `@testing-library/react` |
| Faker legado (pacote original sabotado) | `readme.md:379` | Incidente do autor em 2022 | `@faker-js/faker` |
| Mocks estritos c/ `withArgs` checando tipos internos | `readme.md:340-350` | White-box smell, quebra em refactor | Spies comportamentais |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] Gap 1: Como ler relatório de cobertura p/ estagiários (o que é branch vs line) — Sugestão: criar `agents/guanabara/tutorials/reading-coverage.md`
- [ ] Gap 2: Analogia única mocks vs stubs vs spies (dublês de cinema) — Sugestão: criar `agents/guanabara/analogies/test-doubles-cinema.md`
- [ ] Gap 3: Learning path junior→pleno usando as seções 0-5 em ordem — Sugestão: criar `agents/guanabara/learning-paths/testing-ladder.md`

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: catálogo de analogias de teste + ladder de aprendizado
- [ ] **Criar Analogy/Tutorial**: `lean-testing-system1` — Em: `agents/guanabara/analogies/`
- [ ] **Criar Template**: `test-anatomy-template` (nome 3 partes + AAA) — Em: `agents/guanabara/templates/`
- [ ] **Criar Checklist**: `test-review-checklist` (black-box? dados realistas? isolado?) — Em: `agents/guanabara/checklists/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> "Design your test for system 1, when looking at test code it should _feel_ as easy as modifying an HTML document and not like solving 2X(17 × 24)." (`readme.md:87-89`)

> "Your tests behave like the boy who cried wolf: shouting false-positive cries... people will soon start to ignore the CI notifications until someday, a real bug gets ignored." (`readme.md:281`)

> "A good flight simulator is not about painting clear blue sky rather bringing safe storms and chaos." (`readme.md:1002`)

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Core do onboarding de qualidade p/ qualquer dev JS/TS |
| **Qualidade** | 5 | Exemplos certo/errado lado a lado, citações de fontes |
| **Atualidade** | 4 | Moderno (Jest/Cypress/fast-check); resíduo Enzyme/Faker legado |
| **Ação** | 5 | Gera analogias, tutoriais e checklists imediatos |
| **Completude** | 5 | Unitário → contrato → caos → mutação → CI end-to-end |
| **TOTAL** | **24/25** | Priorizar extração completa |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/guanabara/extractions/javascript-testing-best-practices.md`
- [x] Avisar seu Lead (gerente) que a extração está pronta
- [x] Mover para próximo repo na fila (`nodebestpractices`)