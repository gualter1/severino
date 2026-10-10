# TEMPLATE DE EXTRAÇÃO — Agent Skills

## METADADOS
- **Repositório**: `agent-skills`
- **Lead Responsável**: `towards`
- **Funcionário (Subagente)**: `towards`
- **Data**: `2026-10-09`
- **Tempo gasto**: `30min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Habilidades de engenharia de nível de produção para agentes de codificação de IA. |
| **Público-alvo** | Engenheiros de software (Senior/Staff) e desenvolvedores de ferramentas de IA. |
| **Tamanho** | ~25 skills, 4 agentes especialistas, múltiplos templates e guias de setup. |
| **Linguagens/Tech** | Markdown (Workflow definitions), Bash (Helper scripts), TOML/JSON (Plugin configs). |
| **Freshness** | Muito ativo (v0.6.12), mantido por Addy Osmani e colaboradores. |

---

## 2. O QUE PRESTA PARA **TOWARDS** (Backend/API/Logic)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Skill Manifest Structure (Frontmatter) | `docs/skill-anatomy.md:22-42` | Guideline | `agents/towards/skill-framework/manifest.md` | 🔴 Alta |
| Anti-Rationalization Pattern | `docs/skill-anatomy.md:96-100` | Pattern | `agents/towards/logic/anti-rationalization.md` | 🔴 Alta |
| Evidence-based Verification Gates | `docs/skill-anatomy.md:104-106` | Pattern | `agents/towards/quality/verification-gates.md` | 🔴 Alta |
| API & Interface Design Skill | `skills/api-and-interface-design/SKILL.md` | Workflow | `agents/towards/backend/api-design-workflow.md` | 🔴 Alta |
| Spec-Driven Development | `skills/spec-driven-development/SKILL.md` | Workflow | `agents/towards/process/spec-driven-dev.md` | 🔴 Alta |
| Security & Hardening Skill | `skills/security-and-hardening/SKILL.md` | Workflow | `agents/towards/security/hardening-workflow.md` | 🔴 Alta |
| Parallel Fan-out Orchestration | `AGENTS.md:73-77` | Pattern | `agents/towards/orchestration/patterns.md` | 🟠 Média |
| Source-Driven Development (Cite sources) | `skills/source-driven-development/SKILL.md` | Guideline | `agents/towards/logic/source-grounding.md` | 🟠 Média |
| Observability & Instrumentation | `skills/observability-and-instrumentation/SKILL.md` | Workflow | `agents/towards/backend/observability.md` | 🟠 Média |
| Doubt-Driven Development | `skills/doubt-driven-development/SKILL.md` | Pattern | `agents/towards/logic/adversarial-review.md` | 🔴 Alta |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Inline code blocks in SKILL.md | `docs/skill-anatomy.md:135` | Consome muitos tokens (context cost). | Preferir scripts externos ou referências graduais. |
| "I'll add tests later" rationalization | Em várias skills | Anti-pattern recorrente em agentes. | Enforcement via verification gates. |
| Model-specific workarounds | `docs/skill-anatomy.md:159-169` | Fragilidade entre modelos (cross-model transfer). | Escrever procedimentos agnósticos de modelo. |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] **Gap 1: Database Migration Workflows** — Sugestão: Criar skill `database-schema-migration` focada em backward compatibility e zero-downtime (Towards domain).
- [ ] **Gap 2: Performance Profiling para Node.js/Python** — Sugestão: Expandir `performance-optimization` com passos específicos de memory leak detection e flamegraphs.
- [ ] **Gap 3: Distributed Systems Patterns** — Sugestão: Criar referências para Circuit Breaker, Idempotency keys e Eventual Consistency (Towards focus).

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: Adotar o padrão de "Anti-Rationalization Table" em todos os workflows do Towards.
- [ ] **Criar ADR**: ADR-011: Skill-Driven Execution Model (Baseado no `AGENTS.md` do repo).
- [ ] **Criar Template**: `SKILL.md` template seguindo o anatomy do repo.
- [ ] **Criar Checklist**: `verification-evidence.md` para backend (logs, db state, test coverage).
- [ ] **Criar Skill**: `idempotent-api-design` (Towards extension).

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `docs/skill-anatomy.md:151`: "Process over knowledge. Skills are workflows, not reference docs. Steps, not facts."
> `docs/skill-anatomy.md:159`: "Write the Procedure, Not the Workaround."
> `AGENTS.md:73`: "The user (or a slash command) is the orchestrator. Personas do not invoke other personas."
> `README.md:345`: "Verification is non-negotiable. Every skill ends with evidence requirements - tests passing, build output, runtime data. 'Seems right' is never sufficient."

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Crucial para sistematizar como o Towards opera e ensina outros agentes. |
| **Qualidade** | 5 | Framework muito bem estruturado, limpo e testável. |
| **Atualidade** | 5 | Estado da arte em agentic workflows (2026). |
| **Ação** | 5 | Imediatamente aplicável ao nosso CONSOLIDATED.md. |
| **Completude** | 4 | Cobre bem o lifecycle, mas falta profundidade em infra/db avançado. |
| **TOTAL** | **24/25** | |

> **Regra**: Score > 17 = "Priorizar extração completa".

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/towards/extractions/agent-skills.md`
- [x] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Incorporar `Doubt-Driven Development` no workflow padrão de refatoração do Towards.

---

*Extração focada em padrões de engenharia e confiabilidade de backend.*