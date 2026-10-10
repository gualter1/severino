# Tech Radar Q2 2027

**Período**: Q2 2027  
**Data de Publicação**: 2027-04-09  
**Autor**: Niamaia (Arquiteto de Software)  
**Base**: 25 ADRs aprovadas, 3 implementadas em produção (ADR-023/024/025 ✅), Full Pilot concluído em 3 projetos (nodebestpractices, AionUi, ECC)  
**Status**: 🟢 **APROVADO / EM VIGOR**

---

## 1. Resumo Executivo

O **Tech Radar Q2 2027** incorpora os aprendizados do **Full Pilot (Ciclo 2)** executado em 3 projetos reais, onde o template `feature-skeleton` e ADRs 023/024/025 foram validados em cenários de produção:

| Projeto | Feature | Stack | Coverage | Status |
|---------|---------|-------|----------|--------|
| nodebestpractices | error-handling-audit | Node.js/TS + Express | 89.68% | ✅ Validado |
| AionUi | workflow-viewer | React + Arco Design + IPC | 83.66% | ✅ Validado |
| ECC | agent-harness-exec | TS/Python + MCP v2 | 92.40% | ✅ Validado |

**Principais descobertas do Pilot**:
- Template `feature-skeleton` funciona bem mas requer ajustes em imports TS, moduleResolution e exactOptionalPropertyTypes
- ADR-023 (Marketplace), ADR-024 (MCP v2), ADR-025 (Cross-Harness) operacionais e integrados
- Coverage gates ≥80/70 atingidos em todos os 3 projetos
- CI pipeline `feature-ci.yml` validado (lint + typecheck + test + security)

---

## 2. Quadrantes do Radar

### 🟢 ADOPT (Adoção recomendada / padrão da casa)
*Tecnologias, padrões e práticas maduros, validados e obrigatórios em novos projetos.*

* **Feature-based Packaging (ADR-001)**: Organização de código por domínios/features autônomas (`feature-skeleton` **validado em produção**).
* **Async Store / Event Sourcing (ADR-002)**: Camada de store assíncrona padronizada.
* **Multi-Agent Orchestration (ADR-003)**: Padrão Planner-Executor-Critic para fluxos de agentes complexos.
* **Worktrees para Paralelismo (ADR-004)**: Isolamento físico de workspaces via Git Worktrees.
* **Vite + UnoCSS + TanStack Router/Query (ADR-005)**: Stack frontend moderna, de alta performance e tipagem rigorosa.
* **WCAG 2.1 AA (ADR-006)**: Baseline obrigatório de acessibilidade com validação automatizada via axe-core.
* **Node Security Baseline 23/25 (ADR-007)**: Helmet estrito, validação Zod na borda, bcrypt cost 12, JWT rotation e tratamento seguro de erros.
* **Coverage 80/70 + Mutation (ADR-008)**: Gates de linha (≥80%), branch (≥70%) e mutation testing em caminhos críticos (≥80%) — **validado no pilot**.
* **AI Agent Sandbox (ADR-010)**: Isolação de filesystem, restrição de rede, allowlists de ferramentas e logging de auditoria JSONL.
* **Supply Chain SLSA L2+ (ADR-013)**: Geração de SBOM (Syft), verificação Snyk/OSV, assinatura Cosign e varredura Gitleaks.
* **Logging Sanitization (ADR-014)**: Redação estrita de PII/tokens em logs estruturados (JSON).
* **Threat Modeling STRIDE (ADR-015)**: Modelagem de ameaças obrigatória para novos serviços.
* **SAST/DAST Gates (ADR-016)**: Análises estáticas e dinâmicas obrigatórias no CI (Semgrep, Bandit, OWASP ZAP, Garak).
* **Compliance LGPD/SOC2 (ADR-017)**: Mapeamento contínuo de conformidade por domínio.
* **Skill Versioning SemVer (ADR-020)**: Versionamento semântico estrito para skills de agentes.
* **Three-Shape Plugin Model (ADR-021)**: Arquitetura de plugins em três formas (Shell-hook, In-process e Instructions-file).
* **Zero-Dependency Dual-Compat (ADR-022)**: Estratégias de supply chain hardening com dependências mínimas ou zero-dep.
* **Skill Marketplace Governance (ADR-023)** ✅ **IMPLEMENTED** 🟢 (2026-10-09): Registro curado com namespace hierárquico, votação comunitária, gates de segurança (SLSA L2+, cosign) e trust score.
* **Agent-to-Agent Protocol MCP v2 (ADR-024)** ✅ **IMPLEMENTED** 🟢 (2026-10-09): Comunicação bidirecional padronizada entre agentes heterogêneos (WebSocket/STDIO, mTLS, capability negotiation, audit JSONL).
* **Cross-Harness Skill Portability (ADR-025)** ✅ **IMPLEMENTED** 🟢 (2026-10-09): Write-once-run-anywhere para skills entre Claude Code, OpenCode, Cursor via harness adapters + conformance suite.
* **Template `feature-skeleton` V2 (ADR-026)** ✅ **APROVADA** 🟢 (2027-04-09): TS config pilot-validated, barrel exports, ESLint logging override, Vitest coverage focado, CI reutilizável.
* **Multi-Language feature-skeleton (ADR-027)** ✅ **APROVADA** 🟢 (2027-04-09): Variantes Go/Rust/Python com estrutura unificada, contratos compartilhados, quality gates idênticos.
* **DX Metrics & Telemetry (ADR-028)** ✅ **APROVADA** 🟢 (2027-04-09): Pipeline telemetria anônima opt-in (time-to-green, rework, gaps) + dashboard Grafana.

---

### 🟡 TRIAL (Avaliar em projetos piloto / Validação ativa)
*Tecnologias e padrões com alto potencial em avaliação controlada.*

* **LLM App Gate OWASP Top 10 (ADR-011)**: Proteção contra Prompt Injection, Insecure Output e PII Leakage em aplicações LLM — **avaliar em produção no próximo ciclo**.
* **LLM Platform Hardening (Dify Baseline) (ADR-012)**: RBAC multi-tenant, isolamento de RLS e auditoria imutável para plataformas LLMOps.
* **Mobile Security Baseline (ADR-009)**: ProGuard/R8 obrigatório com salvamento de `mapping.txt`, ATS strict, Keychain `WhenUnlockedThisDeviceOnly` e Play Integrity / App Attest.
* **Grill-me Validation (LEARNING_LOOP)**: Gate socrático de validação de entendimento técnico por pares/facilitadores.
* **Skill Marketplace (skillpper)**: Registro, votação e validação estática de skills comunitárias.
* **MCP v2 SDK (ADR-029)** 🟡 **TRIAL** (2027-04-09): SDK oficial `@severino/mcp-v2-sdk` para agent developers — em avaliação no ECC.
* **Agent Observability (ADR-030)** 🟡 **TRIAL** (2027-04-09): OTel + JSONL Audit + W3C TraceContext stack unificado — piloto em 3 agents.

---

### 🟠 ASSESS (Monitorar / POC)
*Inovações e abordagens em observação ou experimentação inicial.*

* **Model Distillation Pipeline (distilly)**: Meta-skills para destilação de modelos, Work+Persona e quality gates.
* **Python Modern Stack (python-guide)**: uv/Poetry, FastAPI, structlog e pytest + hypothesis + mutmut.
* **Game Engine Patterns (superpowers)**: Técnicas avançadas de debugging sistemático, mutation checks e condition-based waiting.
* **Deep Module Enforcement (mattpocock_skills)**: Uso de `dependency-cruiser` para imposição de fronteiras rígidas em módulos profundos.
* **Agent Skills Registry (ECC)**: Ecossistema unificado de skills e bootstrap-first para agentes.
* **xconfig Standard (Mobile)**: Herança, isolamento de secrets e validação em CI para configurações mobile.
* **feature-skeleton Go/Rust/Python Variants** (Nova): Variantes do template canônico para stacks backend — **baseado no gap do pilot**.

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
* **`exactOptionalPropertyTypes: true` no template base**: Causou erros em 3/3 projetos do pilot — **relaxar para `false`**.
* **`moduleResolution: NodeNext` sem `allowImportingTsExtensions`**: Causou import hell — **padronizar `Bundler`**.

---

## 3. Tendências Cross-Cutting (Q2 2027)

1. **Agentic Engineering Maturation**: MCP v2 + Marketplace + Cross-Harness formam o "triângulo da interoperabilidade" — skills são units de deployment portáteis.
2. **Template-Driven Governance**: `feature-skeleton` V2 será o padrão único de estrutura, com validação CI reutilizável (`feature-ci.yml`) e variants por linguagem.
3. **Security by Default**: Zero-dep enforcement, SLSA L2+ provenance, logging sanitization e sandboxing agora são **não-negociáveis** no template base.
4. **Facilitator-Led Learning Loop**: Certificação de facilitadores escala o Grill-Me para além do Guanabara — autonomia dos leads.
5. **DX Metrics**: Time-to-first-test, template-to-production, coverage drift — instrumentação do ciclo de vida da feature.

---

## 4. Migrações em Andamento

| De | Para | Status | Dono |
|----|------|--------|------|
| Feature packs ad-hoc | `feature-skeleton` V2 | 🟢 Adopt | Towards |
| Jest + React Testing Library | Vitest + Playwright | 🟢 Adopt | Turing |
| CI manual / custom scripts | Fast-path CI + Agent Sandbox | 🟢 Adopt | Trevor |
| Pipenv + requirements.txt | uv + pyproject.toml | 🟡 Trial | Niamaia / Qualy |
| Versionamento ad-hoc de skills | SemVer + Registry Validation | ✅ Implementado (ADR-020) | Guanabara / Towards |
| Skill Marketplace desgovernado | Marketplace Governado (ADR-023) | ✅ Implementado 🟢 | Guanabara / Kaspersky / Trevor / Niamaia |
| MCP v1 / protocolo proprietário | MCP v2 Agent-to-Agent (ADR-024) | ✅ Operacional 🟢 | Towards / Trevor / Kaspersky |
| Skills lock-in por harness | Cross-Harness Portability (ADR-025) | ✅ Portabilidade 🟢 | Trevor / Towards / Turing |
| TS config strict puro | TS config pilot-validated | 🟡 Trial | Towards / Niamaia |
| feature-skeleton JS/TS only | Go/Rust/Python variants | 🟠 Assess | Niamaia / Towards |

---

## 5. Próximos Passos (Q3 2027)

- [x] **ADR-026**: Template `feature-skeleton` V2 (incorporar gaps do pilot: TS config, imports, barrel exports, ESLint logging) — ✅ **APROVADA 2027-04-09**
- [x] **ADR-027**: Multi-language feature-skeleton (Go, Rust, Python variants via Sessão 9 outcome) — ✅ **APROVADA 2027-04-09**
- [x] **ADR-028**: DX Metrics & Template-to-Production telemetry — ✅ **APROVADA 2027-04-09**
- [x] **ADR-029**: MCP v2 SDK para agente developers (baseado em ADR-024 pilot) — ✅ **APROVADA 2027-04-09**
- [x] **ADR-030**: Agent Observability padrão (OpenTelemetry + JSONL audit + trace correlation) — ✅ **APROVADA 2027-04-09**
- [x] **DX Telemetry Schema + Dashboard** — ✅ **CRIADOS 2027-04-09** (`dx-telemetry-schema.json`, `dx-telemetry.json`)
- [x] **Lessons Learned Full Pilot** — ✅ **DOCUMENTADO 2027-04-09** (`LESSONS-LEARNED-PILOT.md`)
- [x] **Migration Checklist V1→V2** — ✅ **CRIADO 2027-04-09** (`MIGRATION-V1-V2-CHECKLIST.md`)
- [x] **Facilitator Cycle 3 Kickoff Issues** — ✅ **CRIADOS 2027-04-09** (`FACILITATOR-CYCLE-3-ISSUES.md`)
- [ ] **Ciclo 3 - Facilitator Program**: Certificar 2 facilitadores adicionais via trilha Assistir → Co-facilitar → Solo (Sessão 10 outcome).
- [ ] Implementar ADR-026 (feature-skeleton V2 + script migração + CI atualizado) — aplicar nos 3 projetos pilot.
- [ ] Implementar ADR-027 (feature-skeleton Go/Rust/Python + codegen + CI multi-language) — pilotar 1 feature cada.
- [ ] Implementar ADR-028 (dx-telemetry.js + dashboard Grafana + opt-in) — deploy em 5 features.
- [ ] Implementar ADR-029 (mcp-v2-sdk monorepo + testing + cli + publish) — v1.0.0 no npm.
- [ ] Implementar ADR-030 (otel package + collector config + Grafana dashboards + MCP v2 integration) — pilot em 3 agents.
- [ ] Automatizar trilha de certificação de facilitadores do Grill-Me (CI lint + templates de pauta).
- [ ] Iniciar o ciclo de revisão do Tech Radar para Q3 2027 (Agendado para 2027-07-08).

---

## 6. Lições do Full Pilot (Ciclo 2) — Inputs para ADRs 026+

| Gap Identificado | Projeto(s) | ADR Candidata | Prioridade |
|------------------|------------|---------------|------------|
| `exactOptionalPropertyTypes: true` quebra imports opcionais | 3/3 | ADR-026 (TS Config) | P0 |
| `moduleResolution: NodeNext` exige `.ts` extensions | 2/3 (AionUi, ECC) | ADR-026 | P0 |
| Import paths profundas (`../../../`) sem barrel exports | 2/3 | ADR-026 | P1 |
| `no-console: error` conflita com logger infra | 1/3 (AionUi) | ADR-026 | P1 |
| `isolatedModules: true` conflita com cross-file types | 2/3 | ADR-026 | P1 |
| Falta variante Go/Rust/Python do feature-skeleton | 3/3 (backend) | ADR-027 | P1 |
| Ausência de DX metrics (tempo setup, coverage drift) | 3/3 | ADR-028 | P2 |
| MCP v2 SDK não existe para desenvolvedores externos | ECC | ADR-029 | P2 |
| Observabilidade de agentes não padronizada | ECC | ADR-030 | P2 |

---

## Cross-References
* `_consolidado/cross-cutting/adrs/ADRS-INDEX.md` (25 ADRs — 22 aprovadas, 3 implementadas ✅)
* `_consolidado/cross-cutting/templates/TEMPLATES-INDEX.md` (Templates Canônicos)
* `_consolidado/cross-cutting/team/TEAM-ROLES.md` (Papéis e Atribuições)
* `_consolidado/cross-cutting/team/GRILL-ME-RESULTS.md` (10 sessões concluídas + certificação)
* `_consolidado/cross-cutting/team/grill-me-schedule.md` (Schedule Q1 2027 completo)
* `_governance/LEARNING_LOOP.md` (Ciclo de Aprendizado e Grill-me)