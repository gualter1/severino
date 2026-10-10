# TEMPLATE DE EXTRAÇÃO — andrej-karpathy-skills (Lente Didática Guanabara)

## METADADOS
- **Repositório**: `andrej-karpathy-skills`
- **Lead Responsável**: `guanabara`
- **Funcionário (Subagente)**: `guanabara-batch2-w3`
- **Data**: `2026-10-09`
- **Tempo gasto**: `0h 20min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Um único `CLAUDE.md` / skill para melhorar comportamento de coding agents, derivado das observações de Andrej Karpathy sobre pitfalls de LLMs codando |
| **Público-alvo** | Devs que usam Claude Code / Cursor / coding agents; autores de skills e rules |
| **Tamanho** | Pequeno (~6 arquivos fonte): `README.md`, `CLAUDE.md`, `EXAMPLES.md` (522 linhas, o coração), `CURSOR.md`, `skills/karpathy-guidelines/SKILL.md`, `.cursor/rules/karpathy-guidelines.mdc` |
| **Linguagens/Tech** | Markdown + YAML frontmatter (Agent Skill spec), exemplos em Python, packaging como Claude plugin (`.claude-plugin/`) e Cursor rule (`.mdc`) |
| **Freshness** | Ativo/recente (referencia post Karpathy `status/2015883857489522876`; README bilíngue EN/ZH; marketplace `forrestchang/andrej-karpathy-skills`) |

---

## 2. O QUE PRESTA PARA **GUANABARA** (Extrair para consolidado)

> Nota de escopo: apesar do nome, o repo **não ensina ML/DL, neural nets ou transformers**. Ensina **como ensinar (e como instruir LLMs/juniors) a codar bem**. Valor para Guanabara está em **didática, analogias e padrões de tutorial**, não em conceitos de IA.

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| 4 princípios ensináveis (Think Before Coding / Simplicity First / Surgical Changes / Goal-Driven Execution) — estrutura Conceito → Por que → Como → Teste | `README.md:23-98` / `CLAUDE.md:7-61` | Guideline | `agents/guanabara/teaching-principles/karpathy-four-principles.md` | 🔴 Alta |
| Formato didático ❌ vs ✅ com "Problems:" explícitos — padrão reutilizável para qualquer tutorial Guanabara | `EXAMPLES.md:9-55`, `99-160`, `227-291` | Tutorial | `agents/guanabara/tutorials/template-wrong-vs-right.md` | 🔴 Alta |
| Anti-patterns summary table (Princípio → Anti-pattern → Fix) — formato de fechamento de aula | `EXAMPLES.md:498-505` | Template | `agents/guanabara/tutorials/anti-pattern-table-template.md` | 🔴 Alta |
| Key Insight: "overcomplicated examples aren't obviously wrong — problem is timing" + "Good code solves today's problem simply" | `EXAMPLES.md:507-522` | Analogy | `agents/guanabara/analogies/simplicity-timing.md` | 🟠 Média |
| Transformação imperativo → meta verificável ("Add validation" → "Write tests... then make them pass") + plano `[Step] → verify: [check]` | `README.md:83-97` / `CLAUDE.md:49-59` / `EXAMPLES.md:388-452` | Pattern | `agents/guanabara/teaching-patterns/goal-driven-verification.md` | 🔴 Alta |
| Técnica "Surface Assumptions" (listar escopo/formato/fields/volume antes de implementar) — padrão de pergunta socrática | `EXAMPLES.md:38-55`, `71-93` | Tutorial | `agents/guanabara/teaching-patterns/surface-assumptions.md` | 🟠 Média |
| Exemplo over-abstraction (Strategy pattern p/ desconto simples: 40 linhas vs 4) — analogia pronta "canivete vs caixa de ferramentas" | `EXAMPLES.md:99-160` | Analogy | `agents/guanabara/analogies/over-abstraction.md` | 🟠 Média |
| Exemplo Surgical diff (só linhas do bug, preserva estilo/aspas) — aula sobre "cirurgia vs reforma" | `EXAMPLES.md:227-366` | Tutorial | `agents/guanabara/tutorials/surgical-changes.md` | 🟠 Média |
| "How to Know It's Working" (diffs menores, perguntas antes de implementar, PRs mínimas) — critérios observáveis de aprendizado | `README.md:140-147` | Checklist | `agents/guanabara/checklists/teaching-effectiveness.md` | 🟢 Baixa |
| Tradeoff Note ("bias toward caution over speed; trivial tasks use judgment") — ensinar quando NÃO aplicar a regra | `README.md:163-167` / `SKILL.md:11` | Guideline | `agents/guanabara/teaching-principles/when-not-to-apply.md` | 🟢 Baixa |
| Empacotamento multi-formato da mesma lição (CLAUDE.md + SKILL.md + .mdc + plugin) — padrão "escreva 1x, distribua Nx" | `CURSOR.md:1-28`, `skills/karpathy-guidelines/SKILL.md:1-5` | Pattern | `agents/guanabara/skill-packaging/single-source-multiformat.md` | 🟢 Baixa |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

### Analogias prontas para derivar (proposta Guanabara)
1. **Think Before Coding → "Médico antes de operar"**: não abre o paciente (coda) sem anamnese (perguntas de escopo/formato/volume). `EXAMPLES.md:38-55`.
2. **Simplicity First → "Canivete vs caminhão de ferramentas"**: função de 4 linhas resolve; Strategy pattern de 40 linhas é levar caminhão para cortar barbante. `EXAMPLES.md:149-158`.
3. **Surgical Changes → "Cirurgia, não reforma"**: troca só o ponto infeccionado (linhas do bug), não repinta o hospital (quotes, type hints, reformat). `EXAMPLES.md:269-291, 339-366`.
4. **Goal-Driven Execution → "Receita com ponto do bolo"**: cada passo tem teste do palito (`[Step] → verify: [check]`); sem isso é "assar até ficar bom". `README.md:89-95`.

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Nome `andrej-karpathy-skills` sugere conteúdo ML/DL | Repo inteiro | Misleading para onboarding — aluno esperando neural nets encontra só guidelines de coding agent | Renomear referência interna para `karpathy-coding-guidelines`; não usar como fonte de ML |
| Exemplos Python sem type hints/test runner real | `EXAMPLES.md` | Didáticos, não executáveis como suite; risco de copiar como "código pronto" | Usar só como material de aula ❌/✅, não como snippet de produção |
| Conselho "No error handling for impossible scenarios" isolado | `CLAUDE.md:24` | Se ensinado sem contexto, junior pode remover handling necessário | Sempre parear com aula de "quando erro é impossível vs improvável" |
| Nada perigoso de segurança/infra | — | Repo é só Markdown instrucional | — |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] Gap 1: **Zero conceitos ML/DL ensináveis** (backprop, gradient descent, overfitting, transformers, attention, tokens) — Sugestão: criar `agents/guanabara/analogies/ml-fundamentals.md` (ex: backprop = "revisar prova errada questão por questão"; overfitting = "decorar gabarito vs aprender matéria") usando estilo ❌/✅ deste repo
- [ ] Gap 2: **Sem analogias de LLM/Transformer architecture** (nada sobre attention, context window, temperature, embeddings) — Sugestão: criar `agents/guanabara/analogies/transformer-architecture.md` no mesmo formato de 4 princípios
- [ ] Gap 3: **Sem MLOps teaching path** (data, training loop, eval, deploy, monitoramento) — Sugestão: criar `agents/guanabara/tutorials/ml-lifecycle-goal-driven.md` aplicando o template `[Step] → verify: [check]` ao ciclo ML
- [ ] Gap 4: **Sem verificação de entendimento** (repo não pergunta "faz sentido?" nem dá exercícios) — Sugestão: estender template com seção `🎓 Tente você` / `❓ Checkpoint` conforme padrão Guanabara
- [ ] Gap 5: **Sem progressão por nível** (iniciante → intermediário → avançado) — Sugestão: mapear os 4 princípios em trilha onboarding (semana 1: surgical; semana 2: simplicity; semana 3: goal-driven)

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: seção `Padrões didáticos ❌/✅ + tabela anti-pattern + verificação por step` derivada deste repo
- [ ] **Criar Template**: `template-wrong-vs-right` — Em: `agents/guanabara/tutorials/` (baseado em `EXAMPLES.md`)
- [ ] **Criar Checklist**: `teaching-effectiveness` — Em: `agents/guanabara/checklists/` (de `README.md:140-147`)
- [ ] **Criar Analogy/Tutorial**: `over-abstraction (canivete vs caminhão)` — Em: `agents/guanabara/analogies/over-abstraction.md`
- [ ] **Criar Analogy/Tutorial**: `surgical-changes (cirurgia vs reforma)` — Em: `agents/guanabara/tutorials/surgical-changes.md`
- [ ] **Criar Analogy/Tutorial**: `goal-driven-verification ([Step] → verify)` — Em: `agents/guanabara/teaching-patterns/`
- [ ] **Criar Skill**: `teaching-with-wrong-vs-right` — Em: `_consolidado/skills/` (empacotar o formato pedagógico como skill reutilizável, espelhando `SKILL.md` com frontmatter `name/description/license`)
- [ ] **Novo agente necessário**: nenhum — mas sinalizar cross-ref com **Towards** (implementação) e **Qualy** (test-first verification)

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `README.md:15` — "The models make wrong assumptions on your behalf and just run along with them without checking."

> `README.md:57` — "The test: Would a senior engineer say this is overcomplicated? If yes, simplify."

> `README.md:75` — "The test: Every changed line should trace directly to the user's request."

> `README.md:136` — "LLMs are exceptionally good at looping until they meet specific goals... Don't tell it what to do, give it success criteria and watch it go."

> `EXAMPLES.md:522` — "Good code is code that solves today's problem simply, not tomorrow's problem prematurely."

> `SKILL.md:2` — "description: Behavioral guidelines to reduce common LLM coding mistakes. Use when writing, reviewing, or refactoring code..."

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 3 | Alta para didática/onboarding, zero para ML/DL prometido no nome |
| **Qualidade** | 5 | Exemplos ❌/✅ entre os melhores formatos de aula já vistos; conciso e copiável |
| **Atualidade** | 4 | Padrão Skill + Cursor rules + plugin atual; conteúdo atemporal |
| **Ação** | 4 | Gera template de tutorial + analogias + checklist imediatamente |
| **Completude** | 2 | Micro-repo (1 ideia, 4 princípios); sem progressão, exercícios ou ML real |
| **TOTAL** | **18/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"
>
> **Veredito**: 18/25 → **Priorizar extração do formato pedagógico** (não do conteúdo ML, que não existe).

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [ ] Salvar este arquivo em `_consolidado/agents/guanabara/extractions/andrej-karpathy-skills.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Template v1.0 — Atualize se precisar de campos extras para seu domínio.*