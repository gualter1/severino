# TEMPLATE DE EXTRAÇÃO — grill-me-skill (Lente Didática Guanabara)

## METADADOS
- **Repositório**: `grill-me-skill`
- **Lead Responsável**: `guanabara`
- **Funcionário (Subagente)**: `guanabara-wave3`
- **Data**: `2026-10-09`
- **Tempo gasto**: `0h 20min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Skill para Claude Code / Cowork que entrevista o usuário implacavelmente sobre um plano/design até atingir entendimento compartilhado, resolvendo cada ramo da árvore de decisão. Trigger: dizer "grill me" ou pedir stress-test de plano. (`README.md:1-5`, `SKILL.md:3-4`) |
| **Público-alvo** | Devs que querem validar planos/designs, facilitadores de ADR, leads em cerimônia de `grill-me` |
| **Tamanho** | Minúsculo: 2 arquivos. `SKILL.md` (21 linhas), `README.md` (15 linhas). Sem código, só Markdown + frontmatter de skill |
| **Linguagens/Tech** | Markdown + frontmatter YAML (`name: grill-me`, `description`). Depende da ferramenta `AskUserQuestion` do host (Claude Code) |
| **Freshness** | Repo pequeno, atemporal (não depende de lib). Sem sinais de abandono — pattern estável, não precisa de manutenção frequente |

---

## 2. O QUE PRESTA PARA **GUANABARA / ENSINO-VALIDAÇÃO** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Grill-me interview pattern: entrevistar implacavelmente cada aspecto do plano até shared understanding, descendo cada ramo da decision tree | `SKILL.md:6` | Pattern | `agents/guanabara/learning-validation/grill-me-pattern.md` | 🔴 Alta |
| Regra "uma pergunta por vez via AskUserQuestion, nunca como texto corrido" — força foco e evita overwhelm | `SKILL.md:10-12` | Guideline | `agents/guanabara/quiz-design/one-question-at-a-time.md` | 🔴 Alta |
| Regra "2-4 opções concretas por pergunta, nada de Yes/No genérico" — design de múltipla escolha que provoca decisão real | `SKILL.md:14` | Guideline | `agents/guanabara/quiz-design/multiple-choice-design.md` | 🔴 Alta |
| Flow "acknowledge em 1-2 frases → próxima pergunta imediata" — ritmo socrático sem palestra | `SKILL.md:18` | Template | `agents/guanabara/tutorials/grill-me-facilitation.md` | 🔴 Alta |
| Regra "se dá pra responder explorando codebase/arquivos, explore você em vez de perguntar" — não terceirize esforço pro aluno | `SKILL.md:19` | Guideline | `agents/guanabara/learning-validation/explore-before-ask.md` | 🟠 Média |
| Resolver dependências entre decisões uma-por-uma, na ordem da árvore | `SKILL.md:3-6` | Pattern | `agents/guanabara/analogies/decision-tree.md` | 🟠 Média |
| Resumo conciso de todas as decisões ao final — fechamento do loop | `SKILL.md:21` | Template | `agents/guanabara/templates/grill-summary.md` | 🟠 Média |
| Trigger phrase "grill me" como contrato explícito de stress-test | `README.md:5`, `SKILL.md:3-4` | Pattern | `agents/guanabara/learning-validation/triggers.md` | 🟢 Baixa |
| Instalação por drop-in `~/.claude/skills/grill-me/SKILL.md` — padrão de distribuição de skills | `README.md:7-13` | Tool config | `cross-cutting/templates/skill-install.md` | 🟢 Baixa |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

### Notas didáticas (lente Guanabara — por que isso importa)

**Analogia do Dia a Dia:** Grill-me é como um churrasco onde o professor é o churrasqueiro que vira a carne de todos os lados. Você diz "meu plano está pronto" (= carne crua). O Guanabara não aceita — ele espeta, vira, pergunta "e se chover? e se faltar carvão? e se o convidado for vegetariano?". Cada pergunta é um lado da carne. Só sai do fogo quando todos os lados estão no ponto (= shared understanding).

**Conexão com LEARNING_LOOP:** O `_governance/LEARNING_LOOP.md:35-38` define `grill-me como cerimônia` — antes de toda ADR cross-cutting e antes de todo template unificado, com Guanabara facilitando e Líder decidindo. Este repo é a **implementação canônica** dessa cerimônia. É o core do loop, não um acessório.

**Padrão Feynman invertido:** O clássico "explique para um leigo" pede que o aluno explique. O grill-me inverte: o professor pergunta até o aluno provar que entende. É validação ativa, não passiva. Diferença crucial para onboarding: quiz de múltipla escolha testa reconhecimento; grill-me testa **entendimento sob pressão**.

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Critério de parada vago ("until all branches resolved") sem definição operacional | `SKILL.md:20` | Risco de loop infinito — facilitador inexperiente não sabe quando parar | Definir checklist de saída (ver Gaps): nº máx de perguntas, cobertura de ramos, ou "3 nãos seguidos = parar" |
| Dependência hard em `AskUserQuestion tool` sem fallback | `SKILL.md:10` | Fora do Claude Code/Cowork a skill quebra — não funciona em chat puro, terminal sem UI, ou outro agente | Adicionar fallback: "se ferramenta indisponível, usar markdown numerado com opções A/B/C/D" |
| Sem guardrail contra perguntas redundantes | `SKILL.md:16-21` | Pode repetir ramo já resolvido se o usuário mudar de ideia no meio | Adicionar regra "revisite ramo só se decisão anterior for invalidada" |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para ensino/validação)

- [ ] Gap 1: **Sem rúbrica de avaliação** — não diz o que é resposta "boa" vs "fraca". Sugestão: criar `agents/guanabara/learning-validation/rubric.md` com níveis (repite / explica / aplica / transfere) inspirado em Bloom
- [ ] Gap 2: **Sem gradação de dificuldade** — todas as perguntas no mesmo tom. Sugestão: criar progressão `fato → porquê → e-se → trade-off → ensine-outro` em `agents/guanabara/tutorials/grill-levels.md`
- [ ] Gap 3: **Sem técnica Feynman explícita** — não pede "explique como se eu tivesse 5 anos" em nenhum ponto. Sugestão: adicionar fase "analogia obrigatória" no template de facilitação
- [ ] Gap 4: **Sem integração com onboarding** — não diz como usar grill-me para validar que novo membro entendeu o consolidado (exigido em `LEARNING_LOOP.md:56-59`). Sugestão: criar `agents/guanabara/checklists/onboarding-grill.md`
- [ ] Gap 5: **Sem anti-patterns de quiz** — não alerta contra perguntas capciosas, ambíguas ou punitivas. Sugestão: documentar em `agents/guanabara/quiz-design/anti-patterns.md`
- [ ] Gap 6: **Sem exemplo trabalhado** — repo não mostra uma sessão real de grill (antes/depois). Sugestão: criar `agents/guanabara/tutorials/grill-example.md` com transcrição simulada de 5-7 perguntas sobre um plano fictício

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Guanabara)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: seção `Learning Validation — grill-me como método canônico` citando este repo como referência + link para LEARNING_LOOP cerimônia
- [ ] **Criar Template**: `grill-session` — Em: `agents/guanabara/templates/` (abertura + ritmo acknowledge→pergunta + resumo final, baseado em `SKILL.md:18-21`)
- [ ] **Criar Checklist**: `onboarding-grill` — Em: `agents/guanabara/checklists/` (perguntas padrão para validar que novo membro entendeu cada CONSOLIDATED.md — fecha o loop `LEARNING_LOOP.md:56-59`)
- [ ] **Criar Checklist**: `grill-exit-criteria` — Em: `agents/guanabara/checklists/` (quando parar: todos os ramos cobertos + sem dependência pendente + resumo aceito pelo usuário)
- [ ] **Criar Analogy/Tutorial**: `decision-tree como churrasco` — Em: `agents/guanabara/analogies/grill-me.md` (cada ramo = um lado da carne, shared understanding = ponto ideal)
- [ ] **Criar Tutorial**: `grill-levels (Feynman progressivo)` — Em: `agents/guanabara/tutorials/` (fato → porquê → e-se → trade-off → ensine-outro, 5 níveis com exemplos)
- [ ] **Criar Skill**: `grill-me-fallback` — Em: `_consolidado/skills/` (versão sem dependência de AskUserQuestion, com markdown A/B/C/D para ambientes sem popup)
- [ ] **Criar ADR**: `Grill-me como gate obrigatório de ADRs cross-cutting` — Para: formalizar o que o LEARNING_LOOP já prescreve mas sem critério operacional

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `SKILL.md:3-4` — "Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree."

> `SKILL.md:6` — "Interview the user relentlessly about every aspect of their plan until you reach a shared understanding."

> `SKILL.md:10` — "Use the **AskUserQuestion tool** for every question you ask. Never pose questions as plain text in your response"

> `SKILL.md:12` — "Ask **one question at a time**. Wait for the user's answer before moving to the next question."

> `SKILL.md:14` — "provide 2–4 concrete multiple-choice options representing the most likely answers or directions."

> `SKILL.md:18` — "After receiving an answer, briefly acknowledge the decision (1–2 sentences max), then immediately ask the next question"

> `SKILL.md:19` — "If a question can be answered by exploring the codebase or files, explore them yourself instead of asking the user."

> `README.md:5` — "Use it when you want to stress-test a plan, poke holes in a design, or just say 'grill me'."

> `_governance/LEARNING_LOOP.md:35-38` — "Antes de toda ADR cross-cutting: `grill-me` session / Antes de todo template unificado: `grill-me` session / Guanabara facilita, Líder decide"

---

## 7. SCORE DE VALOR DO REPO (Para ensino/validação)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | É o core do LEARNING_LOOP (cerimônia oficial). Diretamente o domínio Guanabara: validação de entendimento |
| **Qualidade** | 4 | Extremamente conciso e acionável (21 linhas, zero gordura). Perde 1 ponto por não ter exemplo trabalhado |
| **Atualidade** | 5 | Atemporal — não depende de framework, versão ou lib. Pattern socrático válido em qualquer época |
| **Ação** | 5 | Gera imediatamente: template de sessão, checklist de saída, tutorial de níveis, skill fallback |
| **Completude** | 2 | Cobre o "como perguntar" mas não o "como avaliar", "quando parar", "como graduar". Metade do trabalho didático falta |
| **TOTAL** | **21/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"
>
> **Veredito: PRIORIZAR EXTRAÇÃO COMPLETA** — repo minúsculo mas fundacional. Todo o sistema de validação do consolidado depende dele.

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [ ] Salvar este arquivo em `_consolidado/agents/guanabara/extractions/grill-me-skill.md`
- [ ] Avisar seu Lead (Guanabara) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Extração com lente didática Guanabara — foco em ensino/validação, quiz design e learning validation. Repo-fonte: 2 arquivos, 36 linhas totais.*

---
*Quer que eu explique mais algum detalhe? Posso dar outro exemplo ou ir para o próximo tópico.*