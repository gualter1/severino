# METADADOS
- **Repositório**: `context-mode`
- **Lead Responsável**: `trevor`
- **Funcionário (Subagente)**: `trevor`
- **Data**: `2026-10-09`
- **Tempo gasto**: `1h 30min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | MCP plugin that saves 98% of your context window across Claude Code, Gemini CLI, VS Code Copilot, OpenCode, and Codex CLI. Sandboxed code execution, FTS5 knowledge base, and intent-driven search. |
| **Público-alvo** | Software engineers, AI platform architects, security engineers, DevOps. |
| **Tamanho** | ~100 arquivos TS/JS, testes extensivos vitest, configs de adapters de IA. |
| **Linguagens/Tech** | TypeScript 5.7, Node.js 22.5+, Bun, SQLite (better-sqlite3 com FTS5), Esbuild, GitHub Actions, Vitest. |
| **Freshness** | Altamente ativo, múltiplos fix releases recentes (v1.0.x), version-sync rigoroso. |

---

## 2. O QUE PRESTA PARA **TREVOR** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| **Multi-OS CI Matrix** | `.github/workflows/ci.yml:12-16` | Template | `templates/github-actions/multi-os-ci.yml` | 🔴 Alta |
| **Test Output / Teardown Race Parser** | `.github/workflows/ci.yml:68-96` | Runbook | `runbooks/ci/vitest-flake-handling.md` | 🔴 Alta |
| **Bundle & Invariant Guardrails** | `.github/workflows/bundle.yml:31-33` | Checklist | `checklists/ts/quality-gates.md` | 🔴 Alta |
| **Version-Sync Multi-Plugin Script** | `scripts/version-sync.mjs:1-97` | Code snippet | `runbooks/release/version-sync-multi-plugin.md` | 🟠 Média |
| **Post-Install Hard-Fail Node/Linux Check** | `scripts/postinstall.mjs:45-78` | Guideline | `agents/trevor/node-platform-gate.md` | 🟠 Média |
| **MCP Security Policy Engine (Glob-to-Regex)** | `src/security.ts:50-120` | Code snippet | `agents/kaspersky/mcp-security-model.md` | 🔴 Alta |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO
| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| **Auto-commit direto no `main` em Bundle workflow** | `.github/workflows/bundle.yml:40` | Viola regra de PR obrigatório para envs/artifacts compartilhados e gera race conditions | Usar PR automation + auto-merge bot |
| **Postinstall auto-heal invasivo no `HOME` sem flag de opt-in claro** | `scripts/postinstall.mjs:118-130` | Modifica configs globais do usuário automaticamente em global installs, podendo mascarar corrupções profundas | Health check com relatório (`ctx doctor`) e comando explícito de reparo |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)
- [ ] Gap 1: **Falta de containerização (Dockerfile/Compose)** — O repositório foca em plugin/CLI local, mas carece de imagem oficial Docker para uso headless ou server-side isolado. — Sugestão: `templates/docker/Dockerfile.node.mcp`
- [ ] Gap 2: **Falta de SBOM e Assinatura de Artefatos (Cosign/SLSA)** — Os pacotes distribuídos via npm/git não geram bill of materials nem provenance. — Sugestão: `checklists/security/sbom-generation.md`
- [ ] Gap 3: **Ausência de Staging/Canary para CLI Releases** — O release é direto no npm registry via publish without staged canary verification. — Sugestão: `templates/github-actions/npm-canary-release.yml`

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)
- [ ] **Criar/Atualizar CONSOLIDATED.md** com: `{padrões de multi-OS CI, version-sync de múltiplos manifests e tratamento robusto de flake de Vitest no Windows}`
- [ ] **Criar Runbook**: `Vitest Flake & Teardown Race Handling` — Em: `_consolidado/agents/trevor/runbooks/ci/vitest-flake-handling.md`
- [ ] **Criar Template**: `Multi-OS Matrix CI + Guardrails` — Em: `_consolidado/templates/github-actions/multi-os-ci.yml`
- [ ] **Criar Runbook**: `Version-Sync Multi-Manifest` — Em: `_consolidado/runbooks/release/version-sync-multi-plugin.md`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)
> `.github/workflows/ci.yml:68-71`
> ```bash
> # Vitest fork workers can crash during cleanup on CI (native addon teardown race)
> # even when all tests pass. We check the actual test results instead of relying
> # solely on the exit code.
> ```

> `scripts/version-sync.mjs:8-14`
> ```js
> // Single source of truth for the set of manifests whose version must track
> // package.json. Exported so tests can derive lockstep + git add coverage
> // assertions from this exact list instead of a hand-copied duplicate.
> ```

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)
| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 4 | Excelente em CI multi-OS, version-sync e automação de bundles. |
| **Qualidade** | 5 | Código TypeScript extremamente robusto com testes unitários impecáveis e guardrails de build. |
| **Atualidade** | 5 | Node 22+, ES modules, Vitest 4, state-of-the-art tooling. |
| **Ação** | 4 | Gera ótimos templates de CI multi-OS e version-sync multi-manifest. |
| **Completude** | 4 | Focado em CLI/MCP plugins, faltando infraestrutura de nuvem/K8s/Docker. |
| **TOTAL** | **22/25** | Priorizar extração completa para o consolidado de plataforma. |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO
- [ ] Salvar este arquivo em `_consolidado/agents/trevor/extractions/context-mode.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila
