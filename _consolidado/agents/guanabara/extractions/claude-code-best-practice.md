# EXTRAÇÃO DIDÁTICA — `claude-code-best-practice`
*Por Guanabara (Professor Particular)*

## METADADOS
- **Repositório**: `claude-code-best-practice`
- **Lead Responsável**: `guanabara`
- **Funcionário (Subagente)**: `Guanabara`
- **Data**: `2026-10-08`
- **Tempo gasto**: `1h 30min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Guia definitivo para transicionar de *vibe coding* para *agentic engineering* usando o ecossistema Claude Code (primitivas, workflows, comandos, subagentes, skills e hooks). |
| **Público-alvo** | Desenvolvedores, arquitetos e engenheiros de IA que querem dominar desenvolvimento autônomo e colaborativo com agentes. |
| **Tamanho** | 101 arquivos, contendo dezenas de guias de melhores práticas, dicas curadas do time da Anthropic (Boris Cherny, Thariq, etc.) e relatórios avançados. |
| **Linguagens/Tech** | Markdown, JSON (configurações do Claude, MCP), Bash workflows, relatórios em formato visual. |
| **Freshness** | Altíssima (atualizado até outubro de 2026, cobrindo recursos state-of-the-art como Opus 4.7, Worktrees, Auto Mode e Agent Teams). |

---

## 2. CONCEITOS ENSINÁVEIS & ANALOGIAS (Extração Principal)

| Conceito | Analogia Acessível | Complexidade | Destino Sugerido no Consolidado |
|---|---|---|---|
| **Primitivas do Claude Code (Agents, Commands, Skills)** | **A Caixa de Ferramentas da Oficina**: O *Agent* é o especialista contratado (ex: eletricista), o *Command* é o atalho rápido da furadeira elétrica, e o *Skill* é o manual de instruções detalhado que só sai da prateleira quando necessário (progressive disclosure). | Intermediário | `agents/guanabara/analogies/primitives-toolbox.md` |
| **Context Rot & Dumb Zone (Degradação por Contexto)** | **A Mesa de Trabalho Bagunçada**: Quanto mais papéis acumulados na mesa (tokens de conversas antigas e tentativas falhas), mais lento e confuso fica o cérebro para achar a ferramenta certa. Solução: limpar a mesa (`/clear` ou `/compact`) a cada nova subtarefa. | Iniciante | `agents/guanabara/analogies/context-rot-desk.md` |
| **Git Worktrees + Agent Teams** | **Canteiros de Obras Isolados**: Em vez de todos os pedreiros reformarem a mesma parede ao mesmo tempo (conflito de merge), cada subagente ganha uma casa modelo separada (worktree) para trabalhar em paralelo, juntando tudo no final. | Avançado | `agents/guanabara/analogies/worktrees-construction.md` |
| **Skills como Pastas (Progressive Disclosure)** | **O Livro de Receitas com Abas**: O sumário avisa o chef quando usar a receita, e os anexos (scripts, exemplos) só são lidos quando o chef abre a página específica, economizando espaço na memória de curto prazo. | Intermediário | `agents/guanabara/analogies/skills-cookbook.md` |
| **Auto Mode & Permission Classifier** | **O Segurança de Evento com Crachá**: Em vez de parar o desenvolvedor a cada passo (`/dangerously-skip-permissions`), um classificador inteligente avalia se o comando é seguro (ex: `npm test`) e libera, parando apenas se notar comportamento suspeito. | Intermediário | `agents/guanabara/analogies/auto-mode-security.md` |

---

## 3. ONBOARDING MATERIALS (O que pode virar guia / tutorial / glossário)
1. **Guia de Transição (Vibe Coding → Agentic Engineering)**: Explicar por que mexer manualmente em código gerado por IA é um antipadrão e como delegar a supervisão para testes e hooks.
2. **Glossário de Comandos e Primitivas**: Diferenciação clara entre quando usar `/clear`, `/compact`, `/rewind` e subagentes.
3. **Checklist do `CLAUDE.md` Perfeito**: Guia para manter instruções enxutas (<200 linhas) usando tags direcionais (`<important if="...">`) e regras lazy-load (`.claude/rules/*.md`).

---

## 4. DECISION RECORDS DIDÁTICOS (Por que X, não Y)
- **Por que Agentic Search (Glob + Grep) em vez de Vector Databases (RAG)?**
  - *Decisão*: O código muda rápido demais (drift) e permissões de arquivos são complexas. O Claude prefere buscar diretamente no sistema de arquivos em tempo real assim como um humano experiente.
- **Por que Rewind (`/rewind`) é superior a Correções Manuais após um erro?**
  - *Decisão*: Deixar tentativas falhas no histórico polui o contexto com ruído e lixo cognitivo ("context rot"). Voltar no tempo e refazer o prompt com o aprendizado garante que o modelo mantenha máxima inteligência.

---

## 5. LEARNING PATHS SUGERIDOS
- **Júnior**: Foco em prompt básico, uso seguro do modo interativo, comandos básicos (`/clear`, `/compact`) e leitura de `CLAUDE.md`.
- **Pleno**: Criação de comandos customizados (`.claude/commands/`), escrita de Skills com progressive disclosure e gerenciamento de contexto abaixo de 40% (zona de alta performance).
- **Sênior**: Orquestração de subagentes paralelos via Git Worktrees, criação de hooks automatizados de pós-processamento, configuração de Auto Mode e integração multi-modelo.

---

## 6. ANTI-PATTERNS PARA ENSINAR (O que NÃO fazer)
1. **Babysitting (Microgerenciamento)**: Ficar digitando cada linha que o Claude deve escrever. *Analogia: Comprar um carro autônomo e ficar girando o volante com as mãos.*
2. **Sessões Monstro (Context Bloat)**: Deixar a mesma sessão rodando por horas acumulando 800k tokens. *Analogia: Estudar para 5 provas diferentes na mesma noite sem dormir e tentar lembrar da primeira matéria na hora do teste.*
3. **CLAUDE.md Gigante**: Encher o arquivo de regras que o modelo acaba ignorando. *Analogia: Colocar 50 regras de condomínio em um bilhete na geladeira; ninguém lê tudo.*

---

## 7. GAPS DE CONHECIMENTO & FONTES
- **Gaps**: O repo foca muito no ecossistema Claude Code e menos na validação formal de contratos de API e testes de mutação.
- **Fontes principais (Deep Links)**:
  - Dicas de Boris Cherny (`tips/claude-boris-13-tips-03-jan-26.md`)
  - Gestão de Contexto de Thariq (`tips/claude-thariq-tips-16-apr-26.md`)
  - Anatomia de Skills (`tips/claude-thariq-tips-17-mar-26.md`)

---

## 8. SCORE DE VALOR DO REPO
- **Relevância**: 5/5
- **Qualidade**: 5/5
- **Atualidade**: 5/5 (Atualizado em outubro de 2026)
- **Ação**: 5/5
- **Completude**: 5/5
- **TOTAL**: **25/25** (*Prioridade máxima de extração para o currículo de ensino!*)