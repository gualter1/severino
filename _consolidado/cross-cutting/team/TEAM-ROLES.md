# TEAM ROLES, SKILLS & HIRING — Cross-Cutting

**Status**: Consolidado de 10 domínios | **Última atualização**: 2026-10-08

---

## 👥 ROLES & RESPONSABILIDADES (Matriz RACI)

| Role | Domínio | R (Responsible) | A (Accountable) | C (Consulted) | I (Informed) |
|------|---------|-----------------|-----------------|---------------|--------------|
| **Tech Lead (Severino)** | Leader | Estratégia, ADRs, Cross-cutting, Hiring | Severino | Todos Leads | Time |
| **Severino (subagente)** | Leader Ops | Decisões táticas, Bugs pequenos, Config | Severino | - | Leads |
| **Niamaia** | Arquitetura | ADRs técnicos, Tech Stack, Patterns, Legacy Migration | Niamaia | Towards, Trevor, Turing | Todos |
| **Towards** | Features/Refactor | Feature architecture, Refactoring, Debugging, AI Orchestration | Towards | Niamaia, Trevor, Turing | Todos |
| **Turing** | Frontend/DX | Build, Styling, Testing, State, A11y, Performance, Design System | Turing | Niamaia, Trevor, Qualy | Todos |
| **Trevor** | Platform/DevOps | CI/CD, Docker, K8s, Mobile Build, Observability, Secrets, Security Scanning | Trevor | Niamaia, Kaspersky, Qualy | Todos |
| **Tranquilão** | Security/Hardening | Baselines, Compliance, Quality Gates, Logging, AI Security | Tranquilão | Kaspersky, Trevor, Towards | Todos |
| **Kaspersky** | Threat Modeling | STRIDE, SAST/DAST, Compliance Mapping, Supply Chain | Kaspersky | Tranquilão, Trevor, Niamaia | Todos |
| **Qualy** | Testing/Quality | Test Strategy, E2E/Contract, Test Data, Mutation, A11y Tests | Qualy | Turing, Tranquilão, Trevor | Todos |
| **Guanabara** | Teaching/Onboarding | Analogias, Learning Paths, Decision Records Didáticos, Grill-me | Guanabara | Todos Leads | Novos devs |
| **Specialists Pool** | Domínios Descobertos | Skills sob demanda (KMP, SwiftUI, RAG, MCP, etc.) | Severino | Leads relevantes | Time |

---

## 🎯 SKILLS MATRIX (Por Senioridade)

### 🟢 Junior (0-2 anos)
| Skill | Nível Mínimo | Validação |
|-------|--------------|-----------|
| Git + Workflow (branch/PR/rebase) | Executar autonomamente | Grill-me Guanabara Dia 1 |
| Environment Setup (env, deps, lockfile) | Boot válido sem ajuda | Grill-me Guanabara Dia 2 |
| Testing (unit + AAA pattern) | 80/70 coverage em feature mock | Qualy review |
| Code Style (lint/format/naming) | Zero lint errors | CI gate |
| Basic Security (secrets, input validation) | Checklist PR security pass | Tranquilão review |
| Documentation (README, comments) | Template preenchido | Guanabara review |

### 🟡 Mid (2-5 anos)
| Skill | Nível Mínimo | Validação |
|-------|--------------|-----------|
| Feature Architecture (bounded context) | Feature skeleton completa | Niamaia + Towards review |
| Async Store Layer | Interface implementada + testes | Niamaia + Towards |
| CI/CD Pipeline (build→test→deploy) | Pipeline green + quality gates | Trevor review |
| Threat Modeling (STRIDE básico) | Threat model aprovado | Kaspersky review |
| Contract Testing (Pact) | Consumer-driven contract | Qualy + Towards |
| Accessibility (WCAG 2.1 AA) | Axe-core pass + focus management | Turing + Qualy |
| Mentoring Junior | Grill-me session conduzida | Guanabara feedback |

### 🔴 Senior (5-8 anos)
| Skill | Nível Mínimo | Validação |
|-------|--------------|-----------|
| Tech Stack Decisions (ADR author) | ADR aprovada cross-cutting | Severino approval |
| Legacy Migration (Strangler Fig) | Migration plan + execution | Towards + Niamaia |
| Multi-Agent Orchestration | Planner-Executor-Critic led | Towards + Severino |
| Threat Modeling (STRIDE completo) | Threat model aprovado | Kaspersky approval |
| Supply Chain Security (SBOM/SLSA) | Pipeline implementado | Trevor + Kaspersky |
| Cost Optimization (FinOps) | Budget + optimization implemented | Trevor |
| Incident Response | Runbook executed + postmortem | Tranquilão + Trevor |
| Hiring + Onboarding Design | Onboarding curriculum updated | Guanabara + Severino |

### 🟣 Staff/Principal (8+ anos)
| Skill | Nível Mínimo | Validação |
|-------|--------------|-----------|
| Organizational Architecture | Team topology + domain boundaries | Severino |
| Cross-cutting Strategy | ADR portfolio management | Severino |
| Technology Radar | Quarterly tech assessment | Niamaia + Severino |
| Culture & Standards | Engineering culture definition | Severino + Guanabara |
| Executive Communication | Business alignment + trade-offs | Severino |

---

## 📋 HIRING PROFILES (Por Domínio)

| Perfil | Domínios Críticos | Skills Diferenciais | Salário Band (Referência) |
|--------|-------------------|---------------------|---------------------------|
| **Backend Engineer** | Towards, Niamaia, Trevor, Tranquilão, Kaspersky | Node.js (Fastify/Nest), Async Store, SQL/NoSQL, Observability | Senior: 180-250k |
| **Frontend Engineer** | Turing, Qualy, Trevor | Vite/UnoCSS/Vitest, TanStack Query, WCAG AA, Design Tokens | Senior: 180-250k |
| **Mobile Engineer (Android)** | Trevor, Niamaia, Tranquilão, Kaspersky | Kotlin, Compose, Gradle, Play Integrity, ProGuard | Senior: 180-250k |
| **Mobile Engineer (iOS)** | Trevor, Niamaia, Tranquilão, Kaspersky | Swift/SwiftUI, SPM, Signing, App Attest | Senior: 180-250k |
| **AI/ML Engineer** | Towards, Kaspersky, Tranquilão, Turing | LLM Apps, RAG, Agents, Eval, Guardrails | Senior: 200-300k |
| **Platform/DevOps Engineer** | Trevor, Kaspersky, Qualy | K8s/Helm, GitOps, GitHub Actions, OTEL, Supply Chain | Senior: 200-280k |
| **Security Engineer** | Kaspersky, Tranquilão, Trevor | Threat Modeling, SAST/DAST, Compliance, AppSec | Senior: 200-300k |
| **QA/Testing Engineer** | Qualy, Turing, Tranquilão | Test Strategy, E2E/Contract, Mutation, A11y | Senior: 160-220k |
| **Technical Writer/Teacher** | Guanabara | Analogias, Learning Paths, Onboarding, Docs | Mid: 120-180k |

---

## 📚 ONBOARDING CURRICULUM (10 Dias - ADR-019)

| Dia | Tópico | Lead Responsável | Material | Validação |
|-----|--------|------------------|----------|-----------|
| 1 | Git + Workflow | Guanabara | `onboarding/git-workflow.md` + analogia | Commit + PR mock aprovado |
| 2 | Environment | Guanabara + Trevor | `onboarding/env-config.md` + `.env.example` | Boot válido |
| 3 | Dependencies | Guanabara | `onboarding/dep-management.md` + audit checklist | Audit limpo |
| 4 | Testing | Qualy | `onboarding/testing-pyramid.md` + quality gates | Test passing |
| 5 | Structure + Style | Guanabara + Niamaia | `onboarding/project-structure.md` + feature skeleton | Feature mock |
| 6 | Logging + API | Guanabara + Trevor | `onboarding/logging-api.md` + sanitization | Log sanitizado |
| 7 | Accessibility | Guanabara + Turing | `onboarding/a11y-basics.md` + axe-core | Axe pass |
| 8 | Security | Tranquilão + Kaspersky | `onboarding/security-baseline.md` + PR checklist | PR approved |
| 9 | Platform | Trevor + Guanabara | `onboarding/ci-cd.md` + local loop | Pipeline green |
| 10 | **Grill-me** | **Guanabara** | Explicar 3 conceitos para "leigo" | **Aprovação Guanabara** |

---

## 🔄 LEARNING LOOP (ADR-020 implícito)

| Ciclo | Atividade | Participantes | Output |
|-------|-----------|---------------|--------|
| **Daily** | Standup técnico (15min) | Time do domínio | Blockers + progress |
| **Weekly** | **Weekly Digest** (Severino publica) | Todos Leads | `_logs/weekly-digest-YYYY-MM-DD.md` |
| **Bi-weekly** | **Cross-cutting Sync** (30min) | Severino + 2-3 Leads rotativos | Decisões ADR + conflitos resolvidos |
| **Monthly** | **Grill-me Session** (Guanabara) | 1 Lead + Guanabara | Validação ADR/Template |
| **Quarterly** | **Tech Radar Review** | Niamaia + Severino | `_consolidado/tech-radar-YYYY-QN.md` |
| **Semi-annual** | **ADR Review** (6 meses) | Severino + autores ADR | ADRs aprovadas/depreciadas |
| **Annual** | **Team Retrospective + Hiring Plan** | Severino + Todos | `_consolidado/annual-review-YYYY.md` |

---

## 💰 BUDGET ALLOCATION (Sugestão Anual)

| Categoria | % Budget | Detalhamento |
|-----------|----------|--------------|
| **Salários + Benefícios** | 70% | 10-12 engineers + 1 teacher |
| **Tooling + Infra** | 15% | GitHub Actions, Depot, Sentry, Snyk, Chromatic, Figma |
| **Training + Conf** | 5% | 1 conf/engineer/ano + internal workshops |
| **Security Audit** | 5% | Pen test anual + bug bounty |
| **Contingency** | 5% | Unplanned hiring, incidents |

---

*Team consolidado de 10 domínios — Severino (Leader) 2026-10-08*