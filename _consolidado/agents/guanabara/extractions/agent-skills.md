## 🎯 Extração Didática: agent-skills

Olá! Sou o **Guanabara**, e acabei de terminar de ler todo o "manual de instruções" (repositório `agent-skills`). Esse repositório é uma verdadeira **escola de bons hábitos** para IAs. Ele não foca apenas em *como* o código deve ser, mas em *como* o processo de construção deve ser rigoroso.

Abaixo, organizei tudo o que extraí para o nosso aprendizado, seguindo o template de extração e focando na nossa **Lente Didática**.

---

## METADADOS
- **Repositório**: `agent-skills`
- **Lead Responsável**: Guanabara
- **Funcionário (Subagente)**: Towards (operando como Guanabara para esta tarefa)
- **Data**: 2026-10-09
- **Tempo gasto**: 45min

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Habilidades de engenharia de nível de produção para agentes de codificação de IA. |
| **Público-alvo** | Desenvolvedores que usam agentes (Cursor, Claude Code, etc.) e "Skill Craftsmen" (criadores de skills). |
| **Tamanho** | 25 skills, 4 personas, 9 comandos principais, diversos guias e evals. |
| **Linguagens/Tech** | Markdown (principal), Bash (scripts), JavaScript (validators/evals), YAML (frontmatter). |
| **Freshness** | Ativo, com infraestrutura de testes (evals) e guias de onboarding modernos. |

---

## 2. CONCEITOS ENSINÁVEIS (Lente Guanabara)

| Conceito | Analogia do Dia a Dia | Complexidade | Destino |
|----------|-----------------------|--------------|---------|
| **Skill Framework (Anatomy)** | **A Receita Médica**: Não é só "tome o remédio", tem o diagnóstico (Trigger), a posologia (Process) e os efeitos colaterais (Red Flags). | ⭐⭐ | `tutorials/skill-anatomy.md` |
| **Anti-Rationalization** | **O "Anjinho e Diabinho" no ombro**: O agente dá uma desculpa ("É só um fix rápido"), e a Skill rebate com a realidade ("Fixes rápidos sem teste causam bugs lentos"). | ⭐ | `analogies/rationalizations.md` |
| **Progressive Disclosure** | **O Mapa do Tesouro em Pedaços**: Você não recebe o mapa do mundo todo de uma vez; só a próxima pista quando chega no local certo. (Poupa memória/tokens). | ⭐⭐⭐ | `analogies/progressive-disclosure.md` |
| **Skill Lifecycle (Instinct → Skill)** | **O Hábito de Escovar os Dentes**: Começa como uma instrução forçada (Instinct), vira uma rotina (Skill) e depois vira parte da identidade do Agente (Persona). | ⭐⭐⭐ | `learning-paths/skill-lifecycle.md` |
| **Verification Gates** | **O Check-in do Aeroporto**: Não adianta dizer "sou eu", tem que mostrar o passaporte e passar no raio-X. Evidência física (testes/logs) vs. Promessa. | ⭐⭐ | `checklists/verification-gates.md` |
| **3-Layer Orchestration** | **O Teatro**: Persona (Ator/Papel), Skill (Roteiro/Ação), Command (O Diretor que diz "Ação!"). | ⭐⭐⭐ | `analogies/orchestration-layers.md` |

---

## 3. ONBOARDING: Como criar uma Skill do Zero (Skill Craftsman)

Para ensinar um novo desenvolvedor a criar uma skill, dividimos o processo nestas fases:

### Passo 1: O "Pre-flight Check" (Antes de escrever)
- **O Princípio do "Gap"**: Não crie uma skill se ela for apenas "conselho vago". Ela deve ser um **fluxo de trabalho**.
- **Regra de Ouro**: Se a instrução depende do modelo (ex: "faça isso porque o Claude 3.5 erra"), ela é um *workaround*, não uma *skill*. Uma skill ensina a **boa engenharia**, independente de quem a executa.

### Passo 2: A Anatomia (O Esqueleto)
Todo arquivo `SKILL.md` precisa de:
1. **Frontmatter**: O "cartão de visitas" (nome e descrição curta que a IA lê para saber se deve usar a skill).
2. **Overview**: O "porquê" (motivação).
3. **When to Use**: Os gatilhos (sintomas ou situações).
5. **Process**: O passo-a-passo numerado (o "coração" da skill).
6. **Rationalizations**: Tabela de desculpas comuns vs. Realidade.
7. **Red Flags**: Sinais de que o agente está saindo do trilho.
8. **Verification**: Checklist de evidências (ex: "rodei npm test e deu verde").

### Passo 3: O "Dojo de Segurança" (Skill Security)
- **Auditoria de Comandos**: Se a skill pede para rodar um script, ele deve ser seguro.
- **Princípio da Menor Permissão**: A skill não deve pedir acesso `root` ou permissões amplas se não precisar.
- **Gateguard**: Ensinar o agente a pedir confirmação humana antes de ações destrutivas (delete/overwrite).

---

## 4. DECISION RECORDS DIDÁTICOS (Por que assim?)

- **Por que `references/` na raiz?**
  - *Decisão*: Checklists compartilhados (Segurança, Performance) ficam fora das skills.
  - *Motivo Didático*: Evita o "copia e cola" que gera desatualização. É como ter um livro de referência na biblioteca central em vez de uma cópia em cada sala de aula.
- **Por que "Personas não chamam Personas"?**
  - *Decisão*: Impedir que um agente chame outro diretamente.
  - *Motivo Didático*: Evita o "Telefone Sem Fio". Cada hop (salto) entre agentes faz perder contexto e aumenta o custo. O usuário (ou o comando) deve ser o maestro.

---

## 5. LEARNING PATHS (Trilha B: Skill Craftsman)

Expansão da Trilha B baseada no repo:

1. **Nível 1: O Aprendiz (Shadowing)**
   - Ler `README.md` e o diagrama de lifecycle.
   - Usar `/spec`, `/plan` e `/build` em um projeto pequeno.
   - Observar as `Rationalizations` em ação quando o agente tentar pular etapas.
2. **Nível 2: O Inspetor (Reviewer)**
   - Estudar `docs/skill-anatomy.md`.
   - Modificar uma descrição de skill existente e rodar o `scripts/validate-skills.js`.
   - Entender o "Tier 2 Eval" (como a IA escolhe a skill certa).
3. **Nível 3: O Artesão (Maker)**
   - Criar uma skill simples (ex: `readme-updater`).
   - Escrever um `eval/case` para essa skill (testar se ela ativa com o prompt certo).
   - Aplicar o "Skill Security Dojo" (auditar sua própria skill por riscos).
4. **Nível 4: O Mestre (Architect)**
   - Desenhar um fluxo de orquestração complexo (ex: fanning out personas).
   - Contribuir para o núcleo de `references/`.

---

## 6. ANTI-PATTERNS PARA ENSINAR

- **O "Agente Yes-Machine" (Sycophancy)**: Ensinar que o agente deve discordar educadamente se o plano for ruim (visto em `using-agent-skills`).
- **O "Renovador Indiscreto"**: Agentes que saem refatorando código que não foi pedido. A skill ensina a "Precisão Cirúrgica".
- **O "Conselho de Vovó"**: Skills que dizem "escreva código limpo" sem dizer *como*. Skills devem ser procedurais.

---

## 7. GAPS DE CONHECIMENTO (Propostas para o Consolidated)

- [ ] **Tutorial: Skill Security Dojo**: Precisamos de um guia prático de "como quebrar sua própria skill" para ensinar segurança.
- [ ] **Guia: Skill Marketplace Didático**: Como versionar skills sem quebrar os agentes que já as usam (semantic versioning para prompts).

---

## 8. SCORE DE VALOR DO REPO
| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Core de como os agentes operam conosco. |
| **Qualidade** | 5 | Documentação excepcional e estrutura modular. |
| **Atualidade** | 5 | Estado da arte em agentic workflows (Claude Code/Cursor). |
| **Ação** | 5 | Gera templates e runbooks imediatos. |
| **Completude** | 4 | Falta um pouco mais de "Dojo de Segurança" explícito. |
| **TOTAL** | **24/25** | **Prioridade Máxima de Extração.** |

---

### FONTES (Deep Links)
- [Anatomia da Skill](docs/skill-anatomy.md)
- [Padrões de Orquestração](references/orchestration-patterns.md)
- [Meta-Skill de Descoberta](skills/using-agent-skills/SKILL.md)

---
*Guanabara: "Faz sentido como as skills são como os 'hábitos saudáveis' de um programador sênior ensinados para a máquina? Quer que eu detalhe mais algum desses tutoriais ou crie o rascunho do Dojo de Segurança?"*

---
**Nota para o Sistema**: Por favor, salve este conteúdo em `_consolidado/agents/guanabara/extractions/agent-skills.md`.