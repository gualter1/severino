# EXTRAÇÃO — nodebestpractices

## METADADOS
- **Repositório**: `nodebestpractices` | **Lead**: `niamaia` | **Data**: `2026-10-08` | **Tempo**: `60min`

---

## 1. VISÃO GERAL
| Campo | Detalhe |
|-------|---------|
| Propósito | 100+ best practices Node.js curadas (edição 2026) — arquitetura, erros, estilo, testes, prod, segurança, Docker, performance |
| Público | Backend devs, architects, SREs |
| Tamanho | README gigante + sections/ (projectstructre, errorhandling, testingandquality...) + Practica.js starter |
| Tech | Node 22, Express/Fastify/Nest, TypeScript, Docker |
| Freshness | Alta — atualizado Jan 2024+, tags #new/#updated, edição 2026 |

---

## 2. O QUE PRESTA PARA NIAMAIA (foco arquitetura)

| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| 1.1 Structure by business components (bounded context, apps/ + libraries/) | `README.md:229-248` + `sections/projectstructre/breakintcomponents.md` | Pattern | `agents/niamaia/architecture-patterns.md` | 🔴 Alta |
| 1.2 3-tier por component: entry-points / domain / data-access; não vazar req/res para domain | `README.md:252-271` + `createlayers.md` | Pattern | `agents/niamaia/architecture-patterns.md` | 🔴 Alta |
| 1.3 Wrap common utilities as packages (package.json próprio, exports explícito) | `README.md:275-293` + `wraputilities.md` | Pattern | `agents/niamaia/modularization.md` | 🔴 Alta |
| 1.4 Env-aware hierarchical config com validação fail-fast (convict/env-var/zod) | `README.md:297-305` + `configguide.md` | Template | `templates/node/config/` | 🔴 Alta |
| 1.5 Framework decision: Nest (OOP/grande) vs Fastify (microservices simples) vs Express/Koa + pros/cons | `README.md:309-317` + `choose-framework.md` | Decision record | `agents/niamaia/adrs/ADR-node-framework.md` | 🔴 Alta |
| 1.6 TypeScript sparingly — tipos simples, advanced só com necessidade real | `README.md:319-327` + `typescript-considerations.md` | Decision record | `agents/niamaia/adrs/ADR-typescript-scope.md` | 🟠 Média |
| 2.4 Centralized error handling object (não só middleware) chamado por todos entry-points | `README.md:369-375` | Pattern | `agents/niamaia/error-architecture.md` | 🔴 Alta |
| 2.2/2.3 App Error estendendo Error + operational vs catastrophic (restart) | `README.md:345-365` | Pattern | `agents/niamaia/error-architecture.md` | 🟠 Média |
| 5.12 Stateless (escala horizontal, sem sticky session) | `README.md:5.12` | Pattern | `agents/niamaia/scalability.md` | 🔴 Alta |
| 5.3 Reverse proxy para gzip/SSL (não no Node) | `README.md:5.3` | Decision record | `agents/niamaia/scalability.md` | 🟠 Média |
| 5.14 Transaction ID por log (correlação distribuída) | `README.md:5.14` | Pattern | `agents/niamaia/observability.md` | 🟠 Média |
| 5.18 Log para stdout, infra decide destino | `README.md:5.18` | Guideline | `agents/niamaia/observability.md` | 🟠 Média |
| 3.9 Explicit entry point (index.js / package exports) como interface pública | `README.md:641-664` | Pattern | `agents/niamaia/modularization.md` | 🟠 Média |

---

## 3. LIXO / DESATUALIZADO
| Item | Motivo | Substituto |
|------|--------|------------|
| Recomendação genérica "Express default" em partes antigas | Fastify/Nest superam em DX/perf para casos específicos | Ver 1.5 guide |
| Winston como única opção em trechos | Pino é mais rápido, padrão atual | Pino (ver 2.7) |

---

## 4. GAPS (arquitetura)
- [ ] Saga/Choreography, Outbox, Event-driven patterns — quase ausente; sugerir `async-patterns.md`
- [ ] API versioning / backward compat / strangler fig — ausente
- [ ] Multi-tenancy boundaries — ausente
- [ ] Caching strategies (Redis, CDN, stale-while-revalidate) — parcial
- [ ] Graceful shutdown + health/readiness probes detalhado — parcial (5.7 maintenance endpoint cobre superficial)

---

## 5. AÇÕES
- [ ] CONSOLIDATED: component+3-tier como padrão backend; framework decision matrix; config template
- [ ] ADR: `ADR-node-framework` (Nest vs Fastify vs Express)
- [ ] ADR: `ADR-error-taxonomy` (operational vs catastrophic)
- [ ] Template: `config/` com convict/zod + `.env.example`
- [ ] Checklist: production readiness (stateless, probes, stdout logs, tx-id)

---

## 6. CITAÇÕES
> `README.md:233` — "Each component represents a product domain (i.e., bounded context)... With an autonomous component, every change is performed over a granular and smaller scope."
> `README.md:256` — "Each component should contain 'layers'... The primary principle... is to separate the technical concerns (e.g., HTTP, DB, etc) from the pure logic of the app."
> `README.md:269` — "It's often seen that developer pass web objects like request/response to functions in the domain/logic layer - this violates the separation principle."
> `README.md:313` — "Nest.js is the best match for teams who wish to go OOP and/or build large-scale apps... Fastify is our recommendation for apps with reasonably-sized components."
> `breakintcomponents.md:7` — "Other components are allowed to consume its functionality only through its public interface or API."

---

## 7. SCORE
| Relevância 5 | Qualidade 5 | Atualidade 5 | Ação 5 | Completude 4 | **TOTAL 24/25 → Priorizar extração completa** |

## 8. SALVO
- [x] `extractions/nodebestpractices.md`