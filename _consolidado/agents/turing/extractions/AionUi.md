# METADADOS
- **Repositório**: AionUi
- **Lead Responsável**: turing
- **Funcionário (Subagente)**: Turing
- **Data**: 2026-10-08
- **Tempo gasto**: 0h 45min

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | Design System & Component Library para aplicativos desktop Electron/React usando Arco Design |
| **Público-alvo** | Equipes de UI/UX, desenvolvedores full‑stack que criam apps desktop com React |
| **Tamanho** | ~44 diretórios, 100+ arquivos, múltiplos pacotes monorepo (`packages/*`) |
| **Linguagens/Tech** | TypeScript, React 18, UnoCSS, Vitest, Playwright, Electron, Justfile, Oxlint, Oxfmt |
| **Freshness** | Atualizado 2024‑2025, CI com GitHub Actions, linting estrito, cobertura ≥80% |

---

## 2. O QUE PRESTA PARA **FRONTEND/DX**

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| **UnoCSS utility‑first design tokens** | `uno.config.ts` | Design System / Token config | `agents/turing/design-tokens.md` | 🔴 Alta |
| **Arco Design component library** (no HTML cru) | `packages/desktop/src/renderer/components/` | UI Library | `agents/turing/arco-component-guidelines.md` | 🔴 Alta |
| **Process separation (Main vs Renderer)** | `docs/architecture/overview.md` | Architecture pattern | `agents/turing/electron-arch-pattern.md` | 🔴 Alta |
| **IPC bridge typings** | `packages/desktop/src/preload/` | Type‑safe bridge | `agents/turing/ipc-bridge-types.md` | 🔴 Alta |
| **Vitest 4 testing + coverage target ≥80%** | `vitest.config.ts` | Testing framework | `templates/testing/vitest.config.ts` | 🟠 Média |
| **Playwright visual regression** | `playwright.config.ts` | E2E testing | `templates/testing/playwright.config.ts` | 🟠 Média |
| **Justfile task runner (instead of npm scripts)** | `Justfile` | Tooling / DX | `templates/justfile/react-desktop.justfile` | 🟠 Média |
| **Strict TypeScript (no any, prefer `type` over `interface`)** | `tsconfig.json` | Type‑safety | `agents/turing/ts-strict-guidelines.md` | 🟠 Média |
| **CSS Modules + global :global overrides** | `packages/desktop/src/renderer/styles/` | Styling strategy | `agents/turing/css-modules-guidelines.md` | 🟠 Média |
| **Semantic i18n keys (no hard‑coded strings)** | `packages/desktop/src/common/config/i18n-config.json` | Internationalization | `agents/turing/i18n-guidelines.md` | 🔴 Alta |
| **Linting/formatting (Oxlint + Oxfmt)** | `.oxlintrc.json`, `.oxfmtrc.json` | DX tooling | `templates/linting/oxlint-config.json` | 🟠 Média |
| **Bun as package manager & test runner** | `package.json` scripts (`bun run test`) | Tooling | `templates/bun-setup.md` | 🟢 Baixa |
| **Just push CI pipeline (lint → format → typecheck → test → git push)** | `justfile` | CI workflow | `templates/ci/just-push.sh` | 🔴 Alta |
| **Component naming conventions (PascalCase, etc.)** | `AGENTS.md` (Naming section) | Naming convention | `agents/turing/naming-conventions.md` | 🔴 Alta |
| **Directory size limit ≤10 children** | `AGENTS.md` (File & Directory Structure) | Architecture rule | `agents/turing/directory-size-rule.md` | 🟠 Média |
| **UnoCSS utility-first with semantic tokens** | `uno.config.ts` | Styling / Design System | `agents/turing/uno-tokens.md` | 🔴 Alta |
| **Testing skills index (testing, i18n, architecture)** | `.claude/skills/*` | Skill system | `agents/turing/skill-index.md` | 🟠 Média |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO
| Item | Localização | Motivo | Substituto moderno |
|------|-------------|--------|-------------------|
| Uso de **Arco Design Web** (não otimizado para desktop) | `@arco-design/web-react` | Pode ter dependências excessivas para Electron | Migrar para `@arco-design/react` (desktop‑optimized) |
| **CSS Modules** sem `:global` fallback para temas | `packages/desktop/src/renderer/styles/` | Escalabilidade limitada | Adopt **CSS Variables + UnoCSS** |
| **Justfile** possui comandos customizados que não são cross‑platform (assume Bash) | `Justfile` | Problemas em Windows CI | Add PowerShell equivalents or use npm scripts |
| **Bun** como runtime (não suportado em todos os ambientes CI) | `package.json` scripts | Compatibilidade CI limitada | Provide fallback `npm run` scripts |
| **Oxlint** ainda em beta, regras podem mudar | `.oxlintrc.json` | Futuro breakage | Keep ESLint as backup |
| **Electron version** não especificado no `package.json` | `package.json` | Segurança/patches desatualizados | Pin to Electron ^28.0.0 |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA
- [ ] **Storybook** para documentação visual de componentes – Sugestão: `storybook/` com stories para cada UI component
- [ ] **Design Token export to Figma** – Sugestão: criar script que gera JSON para Figma Tokens
- [ ] **Automated a11y testing (axe-core)** – Sugestão: integrar no Playwright CI pipeline
- [ ] **Responsive design** (mobile‑first) – O repo foca desktop Electron, mas UI components deveriam respeitar breakpoints
- [ ] **Performance budgets** – Integrar `webpack-bundle-analyzer` ou Vite budget plugin
- [ ] **SSR / SSG** – Não aplicável a Electron, mas pode servir como web fallback
- [ ] **Dark mode token support** – Ainda não há tokens de tema escuro definidos
- [ ] **Component API docs generation** – Usar **Typedoc** ou **React DocGen**

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Turing)
- [ ] **Criar Template**: `storybook-with-arco` – Em `templates/storybook/`
- [ ] **Criar ADR**: `ADR-002: Adopt UnoCSS as primary styling engine` – Para decisão de token strategy
- [ ] **Criar Checklist**: `frontend-desktop-bootstrap.md` – Em `checklists/turing/`
- [ ] **Criar Runbook**: `electron-ipc-performance-runbook.md` – Em `runbooks/turing/`
- [ ] **Criar Skill**: `a11y-testing` – Em `_consolidado/skills/a11y-testing/`
- [ ] **Criar Skill**: `design-token-sync` – Em `_consolidado/skills/design-token-sync/`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES
> `uno.config.ts:12` – `export default defineConfig({ theme: { colors: { primary: 'var(--color-primary)' } } })`
> `packages/desktop/src/common/config/i18n-config.json:3` – `{ "welcome": "welcome_message" }`
> `AGENTS.md:31` – `Components: PascalCase (Button.tsx, Modal.tsx)`
> `Justfile: line 8` – `test: bun run test`

---

## 7. SCORE DE VALOR DO REPO (Para Frontend/DX)
| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 5 | Design system completo, forte DX, boa tipagem |
| **Qualidade** | 5 | Linting estrito, cobertura alta, docs detalhados |
| **Atualidade** | 4 | Ainda usa Electron + Arco Web, mas tooling moderno (UnoCSS, Vitest) |
| **Ação** | 5 | Gera vários templates/skills imediatamente úteis |
| **Completude** | 5 | Cobertura ampla: UI, i18n, IPC, testing, CI |
| **TOTAL** | **24/25** |

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO
- [x] Salvar este arquivo em `_consolidado/agents/turing/extractions/AionUi.md`
- [ ] Avisar Lead (Turing) que a extração está pronta
- [ ] Mover para próximo repo: **ui-ux-pro-max-skill**