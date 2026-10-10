# METADADOS
- **Repositório**: `andrej-karpathy-skills`
- **Lead Responsável**: `towards`
- **Funcionário (Subagente)**: `Towards`
- **Data**: `2026-10-09`
- **Tempo gasto**: `0h 25min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Diretrizes comportamentais para Claude Code e LLMs inspiradas nas observações de Andrej Karpathy sobre armadilhas de codificação de LLMs (evitar suposições silenciosas, excesso de engenharia, edições ortogonais/drive-by refactoring e adotar execução orientada a objetivos/test-first). |
| **Público-alvo** | Desenvolvedores full-stack, arquitetos, engenheiros de IA e equipes utilizando ferramentas de programação baseadas em LLM (Claude Code, Cursor, etc.). |
| **Tamanho** | 6 arquivos (`README.md`, `README.zh.md`, `CLAUDE.md`, `CURSOR.md`, `EXAMPLES.md`, `skills/karpathy-guidelines/SKILL.md`). ~650 linhas no total. |
| **Linguagens/Tech** | Markdown, Claude Code Plugin format, Cursor Rules (`.mdc`). |
| **Freshness** | Ativo, moderno e amplamente referenciado na comunidade de engenharia assistida por IA. |

---

## 2. O QUE PRESTA PARA **TOWARDS** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Princípio "Think Before Coding" | `README.md:34-44`, `CLAUDE.md:7-16` | Guideline | `agents/towards/guidelines/think-before-coding.md` | 🔴 Alta |
| Princípio "Simplicity First" (Anti-overengineering) | `README.md:45-57`, `EXAMPLES.md:97-222` | Pattern / Guideline | `agents/towards/patterns/simplicity-first.md` | 🔴 Alta |
| Princípio "Surgical Changes" (Anti-drive-by refactoring) | `README.md:59-75`, `EXAMPLES.md:225-367` | Guideline | `agents/towards/guidelines/surgical-changes.md` | 🔴 Alta |
| Princípio "Goal-Driven Execution" (Test-first loops) | `README.md:77-97`, `EXAMPLES.md:370-496` | Runbook / Pattern | `agents/towards/patterns/goal-driven-execution.md` | 🔴 Alta |
| Exemplos práticos de refatoração correta vs incorreta por LLMs | `EXAMPLES.md:1-522` | Tutorial / Code snippet | `agents/towards/examples/llm-pitfalls-and-fixes.md` | 🟠 Média |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| N/A | - | O repositório é extremamente conciso, focado e direcionado, sem código legado ou dependências desatualizadas. | - |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] Gap 1: Métricas quantitativas de eficácia de LLM em tasks complexas — Sugestão: Adicionar rastreamento de taxa de sucesso de PRs gerados por IA.
- [ ] Gap 2: Integração com pipelines CI/CD automatizados para validação de código gerado por IA — Sugestão: Adicionar spec de checagem estrita de diff antes de merge.

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: incorporação dos 4 princípios de Karpathy (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution) no ecossistema do Towards.
- [ ] **Criar Guideline**: `simplicity-first.md` — Em: `_consolidado/agents/towards/guidelines/`
- [ ] **Criar Pattern**: `goal-driven-execution.md` — Em: `_consolidado/agents/towards/patterns/`
- [ ] **Criar Skill**: `karpathy-guidelines` — Em: `_consolidado/skills/karpathy-guidelines/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> "The models make wrong assumptions on your behalf and just run along with them without checking. They don't manage their confusion, don't seek clarifications, don't surface inconsistencies, don't present tradeoffs, don't push back when they should." (`README.md:15`)

> "Minimum code that solves the problem. Nothing speculative. No features beyond what was asked. No abstractions for single-use code." (`README.md:48-52`)

> "Touch only what you must. Clean up only your own mess. Every changed line should trace directly to the user's request." (`README.md:61-75`)

> "LLMs are exceptionally good at looping until they meet specific goals... Don't tell it what to do, give it success criteria and watch it go." (`README.md:136`)

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Alinhamento direto com engenharia sênior, prevenção de overengineering e escrita de código limpo e assertivo. |
| **Qualidade** | 5 | Excelente clareza, exemplos práticos de diffs corretos vs incorretos. |
| **Atualidade** | 5 | Perfeitamente alinhado com o estado da arte de desenvolvimento assistido por IA em 2026. |
| **Ação** | 5 | Fornece regras diretamente aplicáveis em arquivos `CLAUDE.md`, `.cursor/rules` e skills. |
| **Completude** | 4 | Cobre perfeitamente o escopo comportamental de LLMs, embora focado em diretrizes e não em arquitetura de backend pura. |
| **TOTAL** | **24/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [ ] Salvar este arquivo em `_consolidado/agents/towards/extractions/andrej-karpathy-skills.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila se necessário
