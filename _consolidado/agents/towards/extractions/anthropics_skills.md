# TEMPLATE DE EXTRAÇÃO — Para Funcionários (Subagentes)

## METADADOS
- **Repositório**: `anthropics_skills`
- **Lead Responsável**: `towards`
- **Funcionário (Subagente)**: `Towards (Senior Full-Stack Engineer)`
- **Data**: `2026-03-30`
- **Tempo gasto**: `1h 00min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Anthropic's official implementation of Agent Skills for Claude, featuring skills for creative, technical, enterprise tasks, MCP server building, and automated evaluation/improvement loops. |
| **Público-alvo** | AI engineers, prompt engineers, backend developers, system architects building LLM-powered agents and integrations. |
| **Tamanho** | ~40+ diretórios de skills, scripts Python em skill-creator, schemas JSON, documentação de API e agentes avaliadores. |
| **Linguagens/Tech** | Markdown, Python (FastMCP, Pydantic, eval runners, scripts de melhoria), TypeScript (MCP SDK, Zod), JSON schemas. |
| **Freshness** | Muito ativo / Padrão oficial Anthropic (Agent Skills specification + Claude Code plugin marketplace). |

---

## 2. O QUE PRESTA PARA **TOWARDS** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| **Agent Skills Specification & Anatomy** | `README.md:65-90`, `spec/agent-skills-spec.md` | Guideline | `agents/towards/skill-architecture.md` | 🔴 Alta |
| **Progressive Disclosure Pattern** (Metadata -> SKILL.md body -> Bundled resources) | `skills/skill-creator/SKILL.md:88-110` | Pattern | `agents/towards/progressive-disclosure.md` | 🔴 Alta |
| **MCP Server Design Best Practices** (API coverage vs. workflow tools, pagination, actionable errors, Zod/Pydantic schemas) | `skills/mcp-builder/SKILL.md:21-125` | Guideline | `agents/towards/mcp-server-design.md` | 🔴 Alta |
| **Automated Eval & Hillclimbing Harness** (pass@k, assertions, grading with evidence, metric logging, timing, benchmark JSON) | `skills/skill-creator/SKILL.md:165-290`, `skills/skill-creator/references/schemas.md` | Template / Tool config | `agents/towards/eval-harness.md` | 🔴 Alta |
| **Trigger Description Optimization Loop** (Train/test split, should-trigger vs near-miss negative test cases, automated multi-iteration refinement) | `skills/skill-creator/SKILL.md:335-405` | Runbook | `agents/towards/trigger-optimization.md` | 🟠 Média |
| **Grader Agent Prompt & Rubric Pattern** (Verifiable expectations, evidence collection, tool call metrics) | `skills/skill-creator/agents/grader.md` (via references/schemas.md) | Template | `agents/towards/grader-rubrics.md` | 🟠 Média |

**Tipos válidos utilizados**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Tool config`, `Checklist`, `Runbook`

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Statefull JSON-RPC over custom streaming transport for MCP | `skills/mcp-builder/SKILL.md:54` | Stateful sessions complexificam scale | Stateless HTTP / Streamable JSON over HTTP (como recomendado) |
| Hardcoded evaluation mocks without sandbox isolation | `skills/skill-creator/SKILL.md` | Risco de execução de código malicioso se skills externas forem instaladas sem verificação | Sandboxed execution / containerized test runs |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] Gap 1: Integração nativa de MCP servers com autenticação OAuth2 enterprise — Sugestão: Adicionar guia de segurança e propagação de tokens em chamadas MCP multi-tenant.
- [ ] Gap 2: Testes de carga automatizados para ferramentas MCP concorrentes — Sugestão: Criar harness de stress test para avaliar latência sob concorrência de agentes.
- [ ] Gap 3: Auditoria estática de prompts contra prompt injection indireto em skills de leitura de documentos — Sugestão: Incorporar regras de sanitização de inputs de ferramentas.

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: Padrões de arquitetura de Agent Skills, especificações de MCP builders e harnesses de avaliação automatizada da Anthropic.
- [ ] **Criar Template**: `mcp-server-template` — Em: `_consolidado/templates/mcp/`
- [ ] **Criar Checklist**: `skill-quality-checklist` — Em: `_consolidado/checklists/`
- [ ] **Criar Runbook**: `eval-hillclimb-runbook` — Em: `_consolidado/runbooks/`
- [ ] **Criar Skill**: `anthropic-agent-patterns` — Em: `_consolidado/skills/anthropic-agent-patterns/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `skills/mcp-builder/SKILL.md:25`: "Balance comprehensive API endpoint coverage with specialized workflow tools. Workflow tools can be more convenient for specific tasks, while comprehensive coverage gives agents flexibility to compose operations."
> `skills/skill-creator/SKILL.md:88`: "Skills use a three-level loading system: Metadata (name + description) -> SKILL.md body -> Bundled resources."
> `skills/skill-creator/SKILL.md:398`: "Claude only consults skills for tasks it can't easily handle on its own — simple, one-step queries like 'read this PDF' may not trigger a skill even if the description matches perfectly."
> `skills/skill-creator/references/schemas.md:305`: "Important: The viewer reads these field names exactly. Using config instead of configuration, or passing pass_rate at the top level of a run instead of nested under result, will cause the viewer to show empty/zero values."

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Essencial para arquitetura de agentes, MCP servers e design de prompts na stack Anthropic/Claude. |
| **Qualidade** | 5 | Contém especificações maduras, scripts de eval funcionais, schemas JSON rigorosos e guias práticos. |
| **Atualidade** | 5 | Reflete o estado da arte em 2026 para Agent Skills e Model Context Protocol. |
| **Ação** | 5 | Fornece padrões imediatamente aplicáveis para construção de skills, testes e otimização de gatilhos. |
| **Completude** | 4 | Cobre desde a especificação até o harness de avaliação, faltando apenas exemplos avançados de multi-tenant auth. |
| **TOTAL** | **24/25** | Priorizar extração completa. |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [ ] Salvar este arquivo em `_consolidado/agents/towards/extractions/anthropics_skills.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila
