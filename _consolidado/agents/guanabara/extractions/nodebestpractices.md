## METADADOS
- **Repositório**: `nodebestpractices`
- **Lead Responsável**: `guanabara`
- **Funcionário (Subagente)**: `Guanabara`
- **Data**: `2026-10-08`
- **Tempo gasto**: `0h 20min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | 102 melhores práticas Node.js curadas (arquitetura, erros, estilo, testes, produção, segurança, Docker) |
| **Público-alvo** | Devs Node (junior→sênior), arquitetos, tech leads |
| **Tamanho** | `README.md` (~770+ linhas, 8 seções) + `sections/` com guias aprofundados; tags `#new`/`#updated`/`#strategic` |
| **Linguagens/Tech** | Markdown, Node.js, TS, ESLint, Fastify/Express/Nest/Koa, Docker |
| **Freshness** | Edição 2026, atualizado p/ Node 22; manutenção ativa semanal |

---

## 2. O QUE PRESTA PARA **GUANABARA** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Estruturar por componentes de negócio (bounded context), não por camadas | `README.md:229-248` | Analogy | `agents/guanabara/analogies/components-not-layers.md` | 🔴 Alta |
| 3-tier por componente + web layer sem vazar req/res p/ domínio | `README.md:252-271` | Pattern | `agents/guanabara/tutorials/3-tier-layers.md` | 🔴 Alta |
| Config hierárquica, env-aware, validada e c/ defaults (fail fast) | `README.md:297-305` | Guideline | `agents/guanabara/tutorials/env-config.md` | 🔴 Alta |
| Guia de escolha de framework (Nest vs Fastify vs Express vs Koa) | `README.md:309-317` | Decision record | `agents/guanabara/decision-records/choose-node-framework.md` | 🟠 Média |
| TypeScript moderado: 20% bugs a menos, 80% continuam — teste cobre o resto | `README.md:319-327` | Decision record | `agents/guanabara/decision-records/typescript-moderation.md` | 🔴 Alta |
| Erros operacionais vs catastróficos (reiniciar ou não?) | `README.md:357-365` | Analogy | `agents/guanabara/analogies/operational-vs-programmer-errors.md` | 🔴 Alta |
| Tratar erros centralmente, não no middleware | `README.md:369-375` | Pattern | `agents/guanabara/tutorials/central-error-handling.md` | 🟠 Média |
| `return await` p/ stacktrace completo | `README.md:455-467` | Code snippet | `agents/guanabara/tutorials/return-await.md` | 🟢 Baixa |
| ESLint + plugins Node (no-throw-literal, security) | `README.md:485-501` | Tool config | `agents/guanabara/templates/eslint-node-stack.md` | 🟠 Média |
| Entry-point explícito (index.js / package exports) como interface pública | `README.md:641-665` | Pattern | `agents/guanabara/tutorials/explicit-entry-point.md` | 🟠 Média |
| Efeitos fora de função (código flutuante no require) | `README.md:715-721` | Anti-pattern | `agents/guanabara/analogies/no-floating-effects.md` | 🟠 Média |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Callbacks `function(err, res)` como padrão | `README.md:335-341,695-700` | Pyramid of doom | async/await + promises |
| `var` | `README.md:623-629` | Escopo de função confunde | `const`/`let` |
| `require` dentro de funções | `README.md:633-638` | Bloqueio síncrono tardio + crash escondido | requires no topo |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] Gap 1: Analogia visual 3-tier (lasanha: entrada→domínio→dados) — Sugestão: `agents/guanabara/analogies/3-tier-lasagna.md`
- [ ] Gap 2: Checklist de migração callback→async/await — Sugestão: `agents/guanabara/checklists/callback-to-async.md`
- [ ] Gap 3: Quando usar TS estrito vs pragmático por tamanho de time — Sugestão: `agents/guanabara/tutorials/typescript-strictness-ladder.md`

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: analogias de arquitetura Node + decision records didáticos
- [ ] **Criar ADR**: `component-first-structure` — Para: padronizar organização de serviços
- [ ] **Criar Analogy/Tutorial**: `operational-vs-programmer-errors` (gripe vs infarto) — Em: `agents/guanabara/analogies/`
- [ ] **Criar Checklist**: `node-service-bootstrap` (config, logger, error handler, entry-point) — Em: `agents/guanabara/checklists/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> "With an autonomous component, every change is performed over a granular and smaller scope — the mental overload, development friction, and deployment fear are much smaller and better." (`README.md:233`)

> "Researches show that using TypeScript can help in detecting ~20% bugs earlier... Only efficient tests can discover the whole spectrum of bugs." (`README.md:325`)

> "The best gift you can give to your code is using Promises with async-await which enables a much more compact and familiar code syntax like try-catch." (`README.md:337`)

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Base do onboarding backend Node |
| **Qualidade** | 5 | TL;DR + Otherwise + Read More em cada prática |
| **Atualidade** | 5 | Edição 2026, Node 22 |
| **Ação** | 5 | ADRs, checklists e analogias diretos |
| **Completude** | 5 | Do `npm init` ao Docker em produção |
| **TOTAL** | **25/25** | Priorizar extração completa |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/guanabara/extractions/nodebestpractices.md`
- [x] Avisar seu Lead (gerente) que a extração está pronta
- [x] Mover para próximo repo na fila (`project-guidelines`)