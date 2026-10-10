# Lessons Learned — Full Pilot (Ciclo 2)

**Período**: Q1 2027 (Janeiro–Março 2027)  
**Projetos**: nodebestpractices, AionUi, ECC  
**Template Validado**: `feature-skeleton` V1 → V2 (ADR-026)  
**ADRs Testadas**: 023 (Marketplace), 024 (MCP v2), 025 (Cross-Harness)  
**Status**: ✅ **CONCLUÍDO COM SUCESSO** — 3/3 projetos passing CI, coverage ≥80%

---

## 1. Resumo Executivo

| Métrica | nodebestpractices | AionUi | ECC |
|---------|-------------------|--------|-----|
| **Feature** | error-handling-audit | workflow-viewer | agent-harness-exec |
| **Stack** | Node.js/TS + Express | React + Arco Design + IPC | TS/Python + MCP v2 |
| **Coverage Final** | 89.68% | 83.66% | 92.40% |
| **CI Pass** | ✅ | ✅ | ✅ |
| **Tempo Setup→Green** | ~12 min | ~18 min | ~22 min |
| **Rework Commits** | 2 | 4 | 1 |

**Conclusão**: O template `feature-skeleton` funciona em produção, mas **precisa de ajustes (V2)** para eliminar fricção nos primeiros runs.

---

## 2. Gaps Críticos Identificados (→ ADR-026)

| Gap | Projetos Afetados | Impacto | Fix no V2 |
|-----|-------------------|---------|-----------|
| `exactOptionalPropertyTypes: true` | 3/3 | TS errors em DTOs com campos opcionais | `false` |
| `moduleResolution: NodeNext` exige `.ts` | 2/3 (AionUi, ECC) | Import hell, erros de módulo | `Bundler` + `allowImportingTsExtensions` |
| `noUnusedLocals/Parameters: true` | 2/3 | False positives em barrel exports | `false` |
| `isolatedModules: true` | 2/3 | Conflito com cross-file types | `false` |
| `no-console: error` bloqueia logger | 1/3 (AionUi) | Logger infra não compila | Override `off` em `logging/**` |
| Coverage falha por boilerplate | 2/3 | CLI, gRPC, index.ts baixam coverage | `exclude` patterns no vitest |
| Barrel exports ausentes | 2/3 | Imports `../../../` profundos | `index.ts` em cada layer |
| DX Telemetry ausente | 3/3 | Zero visibilidade time-to-green | `dx-telemetry.js` (ADR-028) |

---

## 3. O que Funcionou Bem (Manter)

| Prática | Evidência |
|---------|-----------|
| **Estrutura feature-skeleton** | 3/3 projetos organizaram código consistentemente |
| **Domain/Application/Infra separation** | Facilitou testes isolados e mocking |
| **Contracts (OpenAPI + MCP manifest)** | Descoberta automática de capacidades |
| **CI unificado (feature-ci.yml)** | Lint + typecheck + test + security em <5 min |
| **Coverage gates 80/70** | Forçaram testes reais, não "coverage theater" |
| **MCP v2 protocol** | Comunicação cross-agent funcionou no ECC |
| **Skill versioning SemVer** | Marketplace governance validada |
| **Audit logger JSONL** | Rastreabilidade completa para compliance |
| **OTel auto-instrumentation** | Traces cross-agent sem config manual |

---

## 4. Decisões de Arquitetura Validadas

| ADR | Validada? | Nota |
|-----|-----------|------|
| ADR-001 Feature Packaging | ✅ | Base para todos 3 projetos |
| ADR-002 Async Store | ✅ | ECC usa intensivamente |
| ADR-003 Multi-Agent Orchestration | ✅ | Tech Lead → Workers pattern |
| ADR-004 Worktrees | ✅ | Paralelismo isolado |
| ADR-005 Frontend Stack | ✅ | AionUi: Vite + UnoCSS + TanStack |
| ADR-006 WCAG 2.1 AA | ✅ | AionUi passou axe-core |
| ADR-007 Node Security | ✅ | 23/25 checks passados |
| ADR-008 Coverage Gates | ✅ | 3/3 ≥80/70 |
| ADR-010 Agent Sandbox | ✅ | ECC: filesystem + network isolation |
| ADR-023 Marketplace | ✅ | Skills publicadas e consumidas |
| ADR-024 MCP v2 | ✅ | Handshake + tool invocation + streaming |
| ADR-025 Cross-Harness | ✅ | Skill roda em OpenCode + Claude Code |

---

## 5. Surpresas / Descobertas Não-Planejadas

| Descoberta | Impacto | Ação Futura |
|------------|---------|-------------|
| **ECC é "Bíblia de arquitetura de agents"** | 48 dirs, 68 agents, 293 skills, 94 commands | Usar como referência para ADR-027 (multi-lang) |
| **Python no ECC requer uv + pyproject.toml** | pipenv deprecated, uv 10x mais rápido | ADR-027 Python variant usa uv |
| **React + IPC no AionUi** | Main/renderer communication via IPC | Documentar pattern no template |
| **Mutation testing pegou bugs que coverage não pegou** | Stryker mutmut encontraram edge cases | Manter mutation ≥80% em caminhos críticos |
| **Gitleaks achou secrets em .env.example** | Templates de config não devem ter exemplos reais | Adicionar regra no CI |
| **Semgrep rules custom pegaram 12 issues** | Regras específicas do projeto > regras genéricas | Compartilhar rules no template |

---

## 5. Métricas de DX (Para ADR-028)

| Métrica | nodebestpractices | AionUi | ECC | Média |
|---------|-------------------|--------|-----|-------|
| **Init Duration** | 8.2s | 12.1s | 15.4s | 11.9s |
| **First Test Pass** | 3.1min | 5.7min | 8.2min | 5.7min |
| **Lint Fixes (1º run)** | 3 | 7 | 5 | 5 |
| **Typecheck Errors (1º run)** | 0 | 4 | 2 | 2 |
| **Coverage Lines (1º run)** | 78% | 65% | 82% | 75% |
| **Coverage Branches (1º run)** | 71% | 58% | 75% | 68% |
| **Validation Pass (1º run)** | ✅ | ❌ | ❌ | 33% |
| **Rework Commits** | 2 | 4 | 1 | 2.3 |
| **Time to Prod** | 2 dias | 5 dias | 1 dia | 2.7 dias |

---

## 6. Recomendações para Próximos Ciclos

### Imediato (Já em ADR-026/027/028/029/030)
- [x] **TS Config V2**: Bundler, exactOptionalPropertyTypes:false, allowImportingTsExtensions
- [x] **Barrel Exports**: index.ts em cada layer
- [x] **ESLint Override**: logging/** no-console:off
- [x] **Vitest Exclude**: interfaces, cli, external, logging
- [x] **DX Telemetry**: Opt-in, anon, dashboard Grafana
- [x] **Multi-lang Variants**: Go, Rust, Python
- [x] **MCP v2 SDK**: Pacote oficial para developers
- [x] **Agent Observability**: OTel + JSONL + W3C TraceContext

### Curto Prazo (Q2 2027)
- [ ] **Script de migração V1→V2 automatizado** testado nos 3 projetos pilot
- [ ] **Template `feature-skeleton-go/rust/python`** pilotados em 1 feature cada
- [ ] **MCP v2 SDK v1.0.0** publicado no npm + GitHub Packages
- [ ] **Facilitator Cycle 3**: Certificar 2 novos facilitadores
- [ ] **ADR-031**: Skill composition patterns (pipeline, parallel, fallback)

### Médio Prazo (Q3 2027)
- [ ] **Agent Registry** com discovery automático + health checks
- [ ] **Skill Composition DSL** para orquestração declarativa
- [ ] **Cost-based routing** para LLM calls (ADR-028 economics)
- [ ] **Compliance automation** LGPD/SOC2 evidence collection

---

## 7. Checklist de "Pronto para Produção" (Template V2)

Um feature criada com `feature-skeleton` V2 deve passar em:

- [ ] `npm run validate` → estrutura OK
- [ ] `npm run lint` → 0 errors, 0 warnings (exceto logging)
- [ ] `npm run typecheck` → 0 errors
- [ ] `npm run test:coverage` → lines ≥80%, branches ≥70%
- [ ] `npm run test:mutation` → critical paths ≥80%
- [ ] `docker build` → imagem <200MB, multi-stage
- [ ] Security scan → 0 high/critical (gitleaks, semgrep, npm audit)
- [ ] Observability → OTel metrics + audit log + traces
- [ ] MCP v2 → agentCard + manifest + tool registration
- [ ] Documentation → README + CHANGELOG + contracts atualizados

---

## 8. Próximos Passos Imediatos

1. **Aplicar ADR-026 nos 3 projetos pilot** — rodar `migrate-v1-to-v2.js` e validar regressão
2. **Publicar ADR-027 templates** — Go, Rust, Python variants
3. **Deploy DX Telemetry** — dashboard Grafana + opt-in em 5 features novas
4. **Lançar MCP v2 SDK** — monorepo + testing + CLI + docs
5. **Iniciar Facilitator Cycle 3** — 2 candidatos, 10 semanas

---

*Documentado por: Severino (Leader) + Towards (Full-stack) + Niamaia (Arch) + Trevor (Platform) + Qualy (Quality)*  
*Data: 2027-04-09*  
*Base: 126 extrações, 25 ADRs, 3 projetos pilot, 10 Grill-Me sessions*