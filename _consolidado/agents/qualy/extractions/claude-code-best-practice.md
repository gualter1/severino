# TEMPLATE DE EXTRAÇÃO — Para Funcionários (Subagentes)

## METADADOS
- **Repositório**: `claude-code-best-practice`
- **Lead Responsável**: `qualy`
- **Funcionário (Subagente)**: `qualy`
- **Data**: `2026-10-08`
- **Tempo gasto**: `0h 45min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Repositório de referência e melhores práticas para configuração do Claude Code (skills, subagents, hooks, commands, workflows). |
| **Público-alvo** | Desenvolvedores, arquitetos, engenheiros de IA e QA engajados em agentic engineering. |
| **Tamanho** | ~100 arquivos (relatórios, tips, apresentações, implementações, documentação de best practices). |
| **Linguagens/Tech** | Markdown, YAML, Python (hooks), SVG/PNG/WebP (assets). |
| **Freshness** | Altamente atualizado (abril de 2026, relatórios e dicas frequentes sobre novas features como test-time compute, subagent verification, Playwright browser testing). |

---

## 2. O QUE PRESTA PARA **TESTING / QUALITY** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Test-Time Compute & Verification Loop | `tips/claude-boris-13-tips-03-jan-26.md:140` | Guideline | `agents/qualy/test-time-compute.md` | 🔴 Alta |
| Verification Skills & External Tools (Playwright, tmux) | `tips/claude-thariq-tips-17-mar-26.md:50` | Pattern | `agents/qualy/verification-skills.md` | 🔴 Alta |
| Code Quality & Review Skills (adversarial-review, testing-practices) | `tips/claude-thariq-tips-17-mar-26.md:88-92` | Template | `agents/qualy/quality-review-skills.md` | 🟠 Média |
| Uncorrelated Context Windows for QA / False Positive Denoising | `videos/claude-cat-every-29-oct-25.md:159-167` | Pattern | `agents/qualy/uncorrelated-qa-agents.md` | 🔴 Alta |
| Front-end E2E testing with Playwright & Client-side error pulling | `videos/claude-cat-every-29-oct-25.md:169` | Tool config | `agents/qualy/playwright-e2e-testing.md` | 🟠 Média |
| Data Contracts between Subagents in Workflows | `agent-teams/agent-teams-prompt.md:26` | Pattern | `agents/qualy/agent-data-contracts.md` | 🟠 Média |
| Desktop App Web Server Testing Automation | `tips/claude-boris-15-tips-30-mar-26.md:99-101` | Tool config | `agents/qualy/desktop-server-testing.md` | 🟢 Baixa |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Testar sem feedback loop (confiar cegamente na IA sem verificação) | `README.md:213` | Causa regressões e bugs silenciosos | Fornecer harness de teste automatizado / verificação estrita |
| Testes manuais não estruturados | `tips/claude-boris-6-tips-16-apr-26.md:99` | Lento, não reproduzível | Playwright E2E automatizado ou scripts `/go` de verificação |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] Gap 1: **Contract Testing formalizado (Pact/Schemathesis)** — O repo fala de data contracts entre agentes, mas falta contrato de API entre microserviços. — Sugestão: Criar guia de Pact contract testing para arquiteturas de agentes.
- [ ] Gap 2: **Mutation Testing (Stryker/Mutatest)** — Ausência de métricas de qualidade de testes (mutation score). — Sugestão: Adicionar padrão de mutation testing em lógica de negócio crítica.
- [ ] Gap 3: **Test Data Management (TDM) robusto** — Falta estratégia de anonimização e factories isoladas por execução. — Sugestão: Criar template de Testcontainers + Factories isoladas.

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: `Estratégia de Test-Time Compute e Verification Skills baseadas em Subagentes Descorrelacionados`
- [ ] **Criar Template**: `Playwright E2E Test Suite Template` — Em: `agents/qualy/templates/`
- [ ] **Criar Checklist**: `Pre-Merge QA Gate Checklist` — Em: `agents/qualy/checklists/`
- [ ] **Criar Runbook**: `Flakiness Triage and Quarantine Runbook` — Em: `agents/qualy/runbooks/`
- [ ] **Criar Skill**: `verification-runner` — Em: `_consolidado/skills/verification-runner/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> `tips/claude-boris-13-tips-03-jan-26.md:140`
> "Probably the most important thing to get great results out of Claude Code — give Claude a way to verify its work. If Claude has that feedback loop, it will 2–3x the quality of the final result."

> `videos/claude-cat-every-29-oct-25.md:167`
> "The value is actually like the uncorrelated context windows where you have like these two context windows that don't know about each other and this is kind of interesting and you tend to get better results this way."

> `README.md:259`
> "any developer should be able to launch Claude, say 'run the tests' and it works on the first try — if it doesn't, your CLAUDE.md is missing essential setup/build/test commands"

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 4 | Excelente visão sobre harness de testes e verification loops para agentes. |
| **Qualidade** | 5 | Conteúdo rico baseado em dicas oficiais de Boris Cherny e Thariq. |
| **Atualidade** | 5 | Atualizado até abril de 2026. |
| **Ação** | 4 | Gera ótimas ideias para verificação automatizada e subagentes de QA. |
| **Completude** | 3 | Foca mais em engenharia de prompt/agentes do que em QA tradicional (unit, contract, chaos), o que é esperado para o escopo. |
| **TOTAL** | **21/25** | Priorizar extração completa |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/qualy/extractions/claude-code-best-practice.md`
- [x] Avisar seu Lead (gerente) que a extração está pronta
- [x] Mover para próximo repo na fila

---
*Template v1.0 — Atualizado para Qualy (Engenheira de Qualidade).*
