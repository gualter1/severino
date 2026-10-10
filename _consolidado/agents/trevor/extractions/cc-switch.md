# METADADOS
- **Repositório**: `cc-switch`
- **Lead Responsável**: `trevor`
- **Funcionário (Subagente)**: `trevor`
- **Data**: `2026-10-09`
- **Tempo gasto**: `0h 45min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Gerenciador all-in-one para Claude Code, Claude Desktop, Codex, Gemini CLI, Grok Build, OpenCode, OpenClaw, Hermes, Pi e MiniMax Code — troca provedores em 1 clique, gere MCP, Skills e Prompts sem editar JSON/TOML/YAML manualmente. |
| **Público-alvo** | Desenvolvedores backend, engenheiros de plataforma e power-users que utilizam múltiplos harnesses de IA. |
| **Tamanho** | 35 pastas/arquivos principais, construído com Tauri 2 (Rust + React/TypeScript/Vite), Tailwind CSS. |
| **Linguagens/Tech** | Rust (Tauri backend), TypeScript, React, Tailwind, Tauri 2, Vite, Vitest. |
| **Freshness** | Muito ativo (v4.0.4 recente, dependências modernas, pnpm 10). |

---

## 2. O QUE PRESTA PARA **TREVOR** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Multi-Harness Switch Engine & Config Reconciler | `README.md:217-230` | Pattern | `agents/trevor/patterns/multi-harness-switching.md` | 🔴 Alta |
| Local HTTP Proxy with API Format Conversion & Failover | `README.md:360-368` | Tool config / Architecture | `agents/trevor/architecture/local-proxy-failover.md` | 🔴 Alta |
| Tauri Security Model & Trust Boundary Scope (IPC & Proxy) | `SECURITY.md:14-63` | Guideline / Security | `agents/trevor/security/desktop-app-threat-model.md` | 🔴 Alta |
| Aggregation Mode (Multi-provider model routing) | `README.md:370-375` | Pattern | `agents/trevor/patterns/model-aggregation.md` | 🟠 Média |
| Unified MCP, Skills & Prompts Synchronization | `README.md:377-381` | Tool config | `agents/trevor/templates/mcp-skills-sync.md` | 🟠 Média |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO
*N/A — O projeto é moderno, utiliza Tauri 2, dependências atualizadas e possui uma política de segurança explícita e rigorosa para Desktop Apps.*

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)
- [ ] Gap 1: **Automated CI/CD for Tauri App Distribution** — O repo foca na arquitetura client-side mas falta documentar o pipeline de build/code-signing/notarização multiplataforma (GitHub Actions). — Sugestão: `_consolidado/agents/trevor/templates/tauri-ci-pipeline.yml`
- [ ] Gap 2: **Zero-Trust Network Policies for Local Proxy** — Como o proxy HTTP pode opcionalmente ligar em interfaces não-loopback, falta um guia de hardening de rede local. — Sugestão: `_consolidado/agents/trevor/security/proxy-hardening.md`

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)
- [ ] **Criar/Atualizar CONSOLIDATED.md** com: padrões de multi-harness switching e arquitetura de proxy local para tradução de formatos de API de IA.
- [ ] **Criar Template**: `multi-harness-config-reconciliation` — Em: `agents/trevor/templates/`
- [ ] **Criar Runbook**: `local-proxy-failover-troubleshooting` — Em: `agents/trevor/runbooks/`
- [ ] **Criar Analogy/Tutorial**: `Como o Proxy Local Traduz Protocolos de IA (Anthropic <-> OpenAI)` — Em: `agents/guanabara/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)
> `SECURITY.md:16` — "CC Switch is a local desktop application. It manages configuration files for AI coding CLIs on the user's own machine. There is no project-operated cloud backend, no multi-user model, and no privilege separation from the user who runs it."
> `SECURITY.md:20` — "It does, however, run a **local HTTP proxy** whose listen address and port are user-configurable and **may be bound to a non-loopback interface**. Requests arriving at that listener are untrusted input and are in scope."

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)
| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Perfeito para context-mode, multi-harness e arquitetura de proxy local. |
| **Qualidade** | 5 | Documentação impecável, política de segurança detalhada, arquitetura limpa em Tauri 2. |
| **Atualidade** | 5 | Stack moderna (Tauri 2, pnpm 10, Vite, Vitest). |
| **Ação** | 5 | Gera excelentes padrões de reconciliation e design de ferramentas de CLI. |
| **Completude** | 4 | Cobre muito bem o escopo de desktop management de harnesses de IA. |
| **TOTAL** | **24/25** | |

> **Regra**: Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO
- [ ] Salvar este arquivo em `_consolidado/agents/trevor/extractions/cc-switch.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila
