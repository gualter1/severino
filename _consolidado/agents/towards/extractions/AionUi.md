# METADADOS
- **Repositório**: AionUi
- **Lead Responsável**: towards
- **Funcionário (Subagente)**: Towards
- **Data**: 2026-10-09
- **Tempo gasto**: 0h 50min

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Design System & Component Library para aplicativos desktop Electron/React usando Arco Design e UnoCSS |
| **Público-alvo** | Desenvolvedores full-stack, engenheiros de front-end e desktop building applications com Electron |
| **Tamanho** | Monorepo estruturado em pacotes (`packages/desktop`, `packages/web-cli`), centenas de arquivos TypeScript/React |
| **Linguagens/Tech** | TypeScript, React 18, Electron, UnoCSS, Vite, Vitest, Playwright, Justfile |
| **Freshness** | Ativamente mantido (2024-2025), pipelines rigorosos via Justfile, cobertura de testes >80% |

---

## 2. O QUE PRESTA PARA **FULL-STACK / BACKEND / UI ARCHITECTURE**

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| **Strict Process Separation Pattern (Main vs Renderer)** | `packages/desktop/src/process/` vs `packages/desktop/src/renderer/` | Architecture pattern | `agents/towards/electron-process-separation.md` | 🔴 Alta |
| **Type-safe IPC Bridge Contracts** | `packages/desktop/src/process/bridge/` | Code snippet / Pattern | `agents/towards/ipc-bridge-contracts.md` | 🔴 Alta |
| **SQLite Database Repository & Migration Pattern** | `packages/desktop/src/process/services/database/` | Backend pattern | `agents/towards/sqlite-migrations-repository.md` | 🔴 Alta |
| **Multi-Provider Rotating API Clients (OpenAI/Anthropic/Gemini)** | `packages/desktop/src/common/api/` | Architecture pattern | `agents/towards/multi-provider-rotating-client.md` | 🔴 Alta |
| **UnoCSS & Semantic Token Resolution** | `uno.config.ts`, `packages/desktop/src/common/theme/` | Tool config / Pattern | `agents/towards/unocss-token-resolution.md` | 🟠 Média |
| **Modular State & Conversation Runtime Stores** | `packages/desktop/src/renderer/pages/conversation/runtime/` | State Management | `agents/towards/conversation-runtime-store.md` | 🔴 Alta |
| **Justfile Task Runner & CI Workflow Integration** | `Justfile` | Tooling / CI | `templates/justfile/desktop-ci.justfile` | 🟠 Média |
| **Robust Error Recovery & Startup Diagnostics** | `packages/desktop/src/process/startup/` | Resilience pattern | `agents/towards/startup-diagnostics-recovery.md` | 🟠 Média |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno |
|------|-------------|--------|-------------------|
| **Arco Design Web** (`@arco-design/web-react`) | `package.json` | Biblioteca voltada para web pura, exige wrappers customizados em desktop | Migrar gradualmente para `@arco-design/react` ou componentes nativos otimizados para desktop |
| **Dependência de Bun em scripts do Justfile** | `Justfile` | Bun pode não estar disponível em ambientes CI corporativos ou Windows nativo | Adicionar fallbacks para `npm`/`pnpm` |
| **Gerenciamento manual de rotas IPC** | `packages/desktop/src/process/bridge/` | Sem validação de schema robusta (tipo tRPC ou Zod direto nas pontes) | Adicionar validação com Zod em todas as chamadas IPC |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para Backend/Arquitetura)

- [ ] **End-to-end type validation on IPC payloads** — Sugestão: Integrar validação estrita com Zod nas camadas de preload e main process
- [ ] **Database Connection Pooling & Concurrency controls** — Sugestão: Documentar concorrência em Better-Sqlite3 para múltiplos workers/threads
- [ ] **Rate Limiting & Circuit Breaker on Rotating API Clients** — Sugestão: Adicionar circuit breakers em `RotatingApiClient.ts`
- [ ] **Structured Distributed Tracing / Telemetry** — Sugestão: Expandir Sentry/OpenTelemetry nos processos Main e Renderer

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Towards)

- [ ] **Criar Pattern Guide**: `electron-process-separation.md` — Em `agents/towards/`
- [ ] **Criar Code Snippet**: `sqlite-repository-pattern.ts` — Em `templates/backend/`
- [ ] **Criar Checklist**: `ipc-security-validation.md` — Em `checklists/towards/`
- [ ] **Criar ADR**: `ADR-005: Type-safe IPC Bridge with Zod validation` — Para garantir segurança entre Main e Renderer

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES

> `packages/desktop/src/process/services/database/IConversationRepository.ts` – Contrato isolado para repositório de conversas, desacoplando o driver de persistência do restante da aplicação desktop.
> `packages/desktop/src/common/api/RotatingApiClient.ts` – Estratégia de rotação e fallback de provedores de API LLM para alta disponibilidade.
> `packages/desktop/src/renderer/pages/conversation/runtime/conversationRuntimeViewStore.ts` – Gerenciamento de estado reativo otimizado para o runtime de conversações.

---

## 7. SCORE DE VALOR DO REPO (Para Domínio Full-Stack / Backend)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Arquitetura Electron complexa com forte separação de processos, banco de dados local e clientes de API multi-LLM |
| **Qualidade** | 5 | Código TypeScript estrito, arquitetura limpa com repositórios e serviços bem definidos |
| **Atualidade** | 4 | Uso de tecnologias modernas (UnoCSS, Vite, Vitest, SQLite moderno) |
| **Ação** | 5 | Gera padrões excelentes de IPC, persistência e arquitetura desktop |
| **Completude** | 4 | Cobre tanto backend desktop (main/sqlite) quanto frontend reativo |
| **TOTAL** | **23/25** | |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [x] Salvar este arquivo em `_consolidado/agents/towards/extractions/AionUi.md`
- [ ] Avisar Lead (Towards) que a extração de AionUi foi concluída com sucesso
- [ ] Aguardar novas diretrizes para o próximo lote/wave
