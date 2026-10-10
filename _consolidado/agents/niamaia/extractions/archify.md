# EXTRAÇÃO — archify

## METADADOS
- **Repositório**: `archify` | **Lead**: `niamaia` | **Data**: `2026-10-08` | **Tempo**: `45min`

---

## 1. VISÃO GERAL
| Campo | Detalhe |
|-------|---------|
| Propósito | Ferramenta técnica precisa para mapas de arquitetura interativos e confiáveis — do código/descrição → HTML standalone com SVG inline, temas dark/light, motion opt-in, export multi-formato |
| Público | Architects, tech leads, SREs, devs que precisam comunicar sistemas complexos |
| Tamanho | archify/ (CLI Node.js + renderers + schemas), viewer/ (runtime JS), examples/, docs/ |
| Tech | Node.js 18+, JSON Schema typed IR, custom renderers (não Mermaid), ESM, sem deps pesadas |
| Freshness | v3.0.1 (Sep 2026), ativo, 130K+ installs, #1 GitHub Trending weekly |

---

## 2. O QUE PRESTA PARA NIAMAIA

| Item | Localização | Tipo | Destino | Prioridade |
|------|-------------|------|---------|------------|
| 5 diagram types: Architecture, Workflow, Sequence, Data Flow, Lifecycle — cada um com schema dedicado | `README.md:244-250`, `archify/schemas/*.schema.json` | Pattern | `agents/niamaia/diagram-taxonomy.md` | 🔴 Alta |
| Typed JSON IR como contrato estável entre LLM/agent e renderer | `README.md:300`, `DESIGN.md:98-100` | Decision record | `agents/niamaia/adrs/ADR-typed-ir.md` | 🔴 Alta |
| Atomic validation before delivery (schema + layout + HTML/SVG + route + label clearance) | `README.md:301`, `SKILL.md:32-42` | Pattern | `agents/niamaia/validation-gates.md` | 🔴 Alta |
| Evidence-backed nodes: `SRC n` beacon → links Git verificados (arquivo:linha @ commit) | `README.md:305`, `DESIGN.md:203-205` | Pattern | `agents/niamaia/source-evidence.md` | 🔴 Alta |
| Deployment-ownership profile: fail-closed se owners/region/private DB/crossings ausentes | `README.md:252` | Decision record | `agents/niamaia/adrs/ADR-deployment-ownership.md` | 🟠 Média |
| Architecture Delta: Before/Delta/After com machine receipt (sem inferir risco/merge safety) | `README.md:254-258` | Pattern | `agents/niamaia/architecture-delta.md` | 🟠 Média |
| Semantic color vocabulary fixo (7 cores): frontend/Backend/database/cloud/security/messagebus/external | `DESIGN.md:102-117` | Decision record | `templates/archify/design-system.yml` | 🔴 Alta |
| Mono-forward typography (JetBrains Mono) — hierarquia por weight/scale/spacing | `DESIGN.md:129-148` | Guideline | `templates/archify/design-system.yml` | 🟠 Média |
| Layout judgment over generic auto-layout — agent escolhe hierarquia/espaçamento/ênfase | `README.md:299`, `DESIGN.md:86-88` | Decision record | `agents/niamaia/adrs/ADR-layout-judgment.md` | 🟠 Média |
| Truthful interaction: focus/reach/route/lens reusam nodes/edges autorais — não inventa topologia | `README.md:304`, `DESIGN.md:216-223` | Anti-pattern avoidance | `agents/niamaia/diagram-integrity.md` | 🔴 Alta |
| Portable by default: 1 HTML file, exports sem viewer state temporário | `README.md:306`, `SKILL.md:107-109` | Pattern | `agents/niamaia/portability.md` | 🟠 Média |
| Failures with repair receipt: validação emite rule codes, subject, evidence, supported fixes | `README.md:302`, `SKILL.md:41-42` | Pattern | `agents/niamaia/validation-gates.md` | 🟠 Média |
| Last-good live preview: loopback-only desktop watcha JSON, mantém último verificado | `README.md:303`, `SKILL.md:20-22` | Pattern | `agents/niamaia/dev-loop.md` | 🟢 Baixa |
| Viewer runtime: search(/), upstream/downstream reach, route probe, semantic lens, semantic radar | `README.md:361-373` | Tool config | `agents/niamaia/viewer-runtime.md` | 🟢 Baixa |
| Share cards: Route (1200x630) + Reach (preserva full diagram como contexto quiet) | `README.md:167-173`, `DESIGN.md:220-223` | Pattern | `agents/niamaia/share-cards.md` | 🟢 Baixa |
| Semantic Passport: 1 proof surface por node focado (metadata, relationships, sources) | `DESIGN.md:199-202` | Pattern | `agents/niamaia/diagram-integrity.md` | 🟢 Baixa |

---

## 3. LIXO / DESATUALIZADO / PERIGOSO
| Item | Motivo | Substituto |
|------|--------|------------|
| Mermaid parsing auto / auto-layout genérico / WYSIWYG | Fora de escopo intencional (README:396) | Manter fora — foco em judgment |
| Hosted sharing | Fora de escopo | Export HTML + share |

---

## 4. GAPS
- [ ] Schema evolution / versioning strategy — ausente (schema_version const=1)
- [ ] Multi-diagram workspaces / cross-diagram references — ausente
- [ ] CI/CD integration patterns (PR comment bot, delta on merge) — parcial (delta existe)
- [ ] Plugin system para custom node types/renderers — não documentado

---

## 5. AÇÕES
- [ ] CONSOLIDATED: typed IR + validation gates + evidence-backed + deployment-ownership + delta
- [ ] ADR: `ADR-diagram-ir` — JSON Schema typed IR como contrato universal
- [ ] ADR: `ADR-evidence-backed` — source evidence opt-in, verificado no commit
- [ ] Template: design-system.yml (cores, tipografia, spacing)
- [ ] Checklist: architecture diagram quality gates

---

## 6. CITAÇÕES
> `README.md:298-306` — "Layout judgment over generic auto-layout... Typed JSON IR... Atomic validation before delivery... Failures come with a repair receipt... Last-good live preview... Truthful interaction... Source evidence, only when requested... Portable by default"
> `DESIGN.md:86-88` — "Archify is a composed technical instrument, not a drawing suite. The canvas carries one spatial narrative; restrained controls and progressive disclosure let a reader move from the primary path to exact authored relationships... without losing orientation."
> `SKILL.md:31` — "Use fresh IDs, wording, and layout. Go directly to the candidate without preliminary help... Use automatic routes first; add explicit routing only for necessary branch..."

---

## 7. SCORE
| Relevância 5 | Qualidade 5 | Atualidade 5 | Ação 5 | Completude 4 | **TOTAL 24/25 → Priorizar extração completa** |

## 8. SALVO
- [x] `extractions/archify.md`