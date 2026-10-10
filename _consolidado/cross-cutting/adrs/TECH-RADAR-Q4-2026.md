# Tech Radar Q4 2026

**Período**: Q4 2026  
**Data de Publicação**: 2026-10-09  
**Autor**: Niamaia (Arquiteto de Software)  
**Base**: 25 ADRs aprovadas, 3 implementadas em produção (ADR-001 a ADR-025 — ADR-023/024/025 ✅ IMPLEMENTED 2026-10-09) + Decisões de Stack dos Templates Canônicos  
**Status**: 🟢 **APROVADO / EM VIGOR — 3 ADRs IMPLEMENTADAS EM PRODUÇÃO (ADR-023, 024, 025)**

---

## 1. Resumo Executivo

O **Tech Radar Q4 2026** consolida a evolução arquitetural e as diretrizes tecnológicas do ecossistema, fundamentado em **25 ADRs aprovadas, 3 implementadas em produção** (ADR-001 a ADR-025, com ADR-023/024/025 ✅ IMPLEMENTED em 2026-10-09; conclusão bem-sucedida das sessões de Grill-Me da Wave 3 e Q1 2027 Week 1 — Sessões 1-7 e 5-10 concluídas). 

O foco estratégico deste trimestre orbita em torno de cinco eixos fundamentais:
1. **Agentic Engineering**: Orquestração multi-agente segura, isolamento por Git Worktrees e padronização de Skills.
2. **AI Sandbox & LLMOps**: Isolação de ambientes para agentes autônomos, mitigação do OWASP LLM Top 10 e hardenings de plataformas como Dify.
3. **Skill Ecosystem & Versioning**: Padronização de distribuição de skills via SemVer e modelos de plugins em três formas (Shell-hook / In-process / Instructions-file).
4. **Frontend DX & Performance**: Adoção de Vite, UnoCSS, TanStack Router/Query, Vitest e baseline estrito de acessibilidade (WCAG 2.1 AA).
5. **Supply Chain Security & Governance**: SBOMs, SLSA L2+, verificação com Cosign, varredura de segredos com Gitleaks e políticas rigorosas de SAST/DAST/Mutation testing.

---

## 2. Quadrantes do Radar

### 🟢 ADOPT (Adoção recomendada / padrão da casa)
*Tecnologias, padrões e práticas maduros, validados e obrigatórios em novos projetos.*

* **Feature-based Packaging (ADR-001)**: Organização de código por domínios/features autônomas (`feature-skeleton`).
* **Async Store / Event Sourcing (ADR-002)**: Camada de store assíncrona padronizada (TanStack Query + Zustand / Repositórios async / Combine/async-await).
* **Multi-Agent Orchestration (ADR-003)**: Padrão Planner-Executor-Critic para fluxos de agentes complexos.
* **Worktrees para Paralelismo (ADR-004)**: Isolamento físico de workspaces via Git Worktrees para humanos e agentes.
* **Vite + UnoCSS + TanStack Router/Query (ADR-005)**: Stack frontend moderna, de alta performance e tipagem rigorosa.
* **WCAG 2.1 AA (ADR-006)**: Baseline obrigatório de acessibilidade com validação automatizada via axe-core.
* **Node Security Baseline 23/25 (ADR-007)**: Helmet estrito, validação Zod na borda, bcrypt cost 12, JWT rotation e tratamento seguro de erros.
* **Coverage 80/70 + Mutation (ADR-008)**: Gates de linha (≥80%), branch (≥70%) e mutation testing em caminhos críticos (≥80%).
* **AI Agent Sandbox (ADR-010)**: Isolação de filesystem, restrição de rede, allowlists de ferramentas e logging de auditoria JSONL.
* **Supply Chain SLSA L2+ (ADR-013)**: Geração de SBOM (Syft), verificação Snyk/OSV, assinatura Cosign e varredura Gitleaks.
* **Logging Sanitization (ADR-014)**: Redação estrita de PII/tokens em logs estruturados (JSON).
* **Threat Modeling STRIDE (ADR-015)**: Modelagem de ameaças obrigatória para novos serviços.
* **SAST/DAST Gates (ADR-016)**: Análises estáticas e dinâmicas obrigatórias no CI (Semgrep, Bandit, OWASP ZAP, Garak).
* **Compliance LGPD/SOC2 (ADR-017)**: Mapeamento contínuo de conformidade por domínio.
* **Skill Versioning SemVer (ADR-020)**: Versionamento semântico estrito para skills de agentes com validação automatizada no CI.
* **Three-Shape Plugin Model (ADR-021)**: Arquitetura de plugins em três formas (Shell-hook, In-process e Instructions-file).
* **Zero-Dependency Dual-Compat (ADR-022)**: Estratégias de supply chain hardening com dependências mínimas ou zero-dep.
* **Skill Marketplace Governance (ADR-023)** ✅ **IMPLEMENTED** 🟢 (2026-10-09): Registro curado com namespace hierárquico, votação comunitária, gates de segurança (SLSA L2+, cosign) e trust score.
* **Agent-to-Agent Protocol MCP v2 (ADR-024)** ✅ **IMPLEMENTED** 🟢 (2026-10-09): Comunicação bidirecional padronizada entre agentes heterogêneos (WebSocket/STDIO, mTLS, capability negotiation, audit JSONL).
* **Cross-Harness Skill Portability (ADR-025)** ✅ **IMPLEMENTED** 🟢 (2026-10-09): Write-once-run-anywhere para skills entre Claude Code, OpenCode, Cursor via harness adapters + conformance suite.

---

### 🟡 TRIAL (Avaliar em projetos piloto / Validação ativa)
*Tecnologias e padrões com alto potencial em avaliação controlada.*

* **LLM App Gate OWASP Top 10 (ADR-011)**: Proteção contra Prompt Injection, Insecure Output e PII Leakage em aplicações LLM.
* **LLM Platform Hardening (Dify Baseline) (ADR-012)**: RBAC multi-tenant, isolamento de RLS e auditoria imutável para plataformas LLMOps.
* **Mobile Security Baseline (ADR-009)**: ProGuard/R8 obrigatório com salvamento de `mapping.txt`, ATS strict, Keychain `WhenUnlockedThisDeviceOnly` e Play Integrity / App Attest.
* **Grill-me Validation (LEARNING_LOOP)**: Gate socrático de validação de entendimento técnico por pares/facilitadores.
* **Skill Marketplace (skillpper)**: Registro, votação e validação estática de skills comunitárias.

---

### 🟠 ASSESS (Monitorar / POC)
*Inovações e abordagens em observação ou experimentação inicial.*

* **Model Distillation Pipeline (distilly)**: Meta-skills para destilação de modelos, Work+Persona e quality gates.
* **Python Modern Stack (python-guide)**: uv/Poetry, FastAPI, structlog e pytest + hypothesis + mutmut.
* **Game Engine Patterns (superpowers)**: Técnicas avançadas de debugging sistemático, mutation checks e condition-based waiting.
* **Deep Module Enforcement (mattpocock_skills)**: Uso de `dependency-cruiser` para imposição de fronteiras rígidas em módulos profundos.
* **Agent Skills Registry (ECC)**: Ecossistema unificado de skills e bootstrap-first para agentes.
* **xconfig Standard (Mobile)**: Herança, isolamento de secrets e validação em CI para configurações mobile.

---

### 🔴 HOLD (Não recomendado / Legado)
*Tecnologias, padrões ou práticas vetadas por riscos de segurança, débito técnico ou obsolescência.*

* **Pipenv**: Vetado em favor de `uv` ou `Poetry`.
* **Travis CI**: Vetado em favor de `GitHub Actions`.
* **`eval` / `Function` / `exec` sem review**: Bloqueado pelo Tranquilão.
* **`--dangerously-skip-permissions` em produção**: Violação direta de segurança de agentes.
* **`curl | bash` sem pin SHA**: Vetado por risco de supply chain poisoning.
* **SafetyNet**: Descontinuado em favor do Play Integrity API.
* **`allowBackup=true` / `NSAllowsArbitraryLoads=true`**: Inseguranças nativas mobile vetadas.
* **Keychain `Always`**: Substituído por `WhenUnlockedThisDeviceOnly`.
* **`temperature=0` como "segurança"**: Falsa sensação de segurança em LLMs (deve ser combinado com sandboxing e guardrails).

---

## 3. Tendências Cross-Cutting

1. **Agentic Engineering**: Skills deixam de ser apenas documentação e passam a ser unidades de deployment e pacotes executáveis validados por SemVer em registries cross-harness.
2. **Security by Design**: Defesa em profundidade aplicada desde a concepção (Threat Modeling STRIDE), com sandboxing obrigatório para execução de código por agentes e sanitização rigorosa de PII.
3. **DX First & Quality Gates**: Templates canônicos padronizados (`feature-skeleton`), feedback loops ultra-rápidos (Vite/Vitest) e automação rigorosa de gates de cobertura, mutação e SAST/DAST.
4. **Learning Loop & Onboarding**: Integração entre o processo de onboarding estruturado em 10 dias, sessões de "Grill-me" e documentação viva.

---

## 4. Migrações em Andamento

| De | Para | Status | Dono |
|----|------|--------|------|
| Feature packs ad-hoc | `feature-skeleton` | 🟢 Adopt | Towards |
| Jest + React Testing Library | Vitest + Playwright | 🟢 Adopt | Turing |
| CI manual / custom scripts | Fast-path CI + Agent Sandbox | 🟢 Adopt | Trevor |
| Pipenv + requirements.txt | uv + pyproject.toml | 🟡 Trial | Niamaia / Qualy |
| Versionamento ad-hoc de skills | SemVer + Registry Validation | ✅ Implementado (ADR-020) | Guanabara / Towards |
| Skill Marketplace desgovernado | Marketplace Governado (ADR-023) | ✅ Implementado 🟢 (2026-10-09) | Guanabara / Kaspersky / Trevor / Niamaia |
| MCP v1 / protocolo proprietário | MCP v2 Agent-to-Agent (ADR-024) | ✅ Operacional 🟢 (2026-10-09) | Towards / Trevor / Kaspersky |
| Skills lock-in por harness | Cross-Harness Portability (ADR-025) | ✅ Portabilidade 🟢 (2026-10-09) | Trevor / Towards / Turing |

---

## 5. Próximos Passos (Q1 2027)

- [x] Validar propostas de ADR da Wave 3 e Q1 2027 (ADR-020 a ADR-025) através de sessões de Grill-Me (Sessões 1-7). (Concluído com sucesso)
- [x] Grill-Me Sessões 5-8 (ADR-023/024 Skill Marketplace + MCP v2) — ✅ Concluídas (2027-01-06/07)
- [x] Grill-Me Sessões 9-10 (ADR-025 Cross-Harness Portability) — ✅ Concluídas (2027-01-08)
- [x] Implementar ADR-023 Skill Marketplace Governance — ✅ IMPLEMENTADA (2026-10-09) — pipeline `skill-marketplace.yml` + Yank Policy
- [x] Implementar ADR-024 Agent-to-Agent Protocol MCP v2 — ✅ IMPLEMENTADA (2026-10-09) — schema/registry/SDK/resilience/sandbox
- [x] Implementar ADR-025 Cross-Harness Skill Portability — ✅ IMPLEMENTADA (2026-10-09) — Core + ShapeAdapter + CI matrix 3 harnesses
- [ ] Expandir o template `feature-skeleton` para variantes em Go, Rust e Python.
- [ ] Automatizar a trilha de certificação de facilitadores do Grill-Me.
- [ ] Iniciar o ciclo de revisão do Tech Radar para Q2 2027 (Agendado para 2027-04-08).

---

## Cross-References
* `_consolidado/cross-cutting/adrs/ADRS-INDEX.md` (25 ADRs — 22 aprovadas, 3 implementadas ✅ ADR-023/024/025)
* `TEMPLATES-INDEX.md` (Templates Canônicos)
* `TEAM-ROLES.md` (Papéis e Atribuições)
* `LEARNING_LOOP.md` (Ciclo de Aprendizado e Grill-me)
