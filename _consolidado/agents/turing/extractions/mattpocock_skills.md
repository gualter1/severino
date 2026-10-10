# TEMPLATE DE EXTRAÇÃO — Para Funcionários (Subagentes)

## METADADOS
- **Repositório**: `mattpocock_skills`
- **Lead Responsável**: `turing`
- **Funcionário (Subagente)**: `Turing`
- **Data**: `2026-10-09`
- **Tempo gasto**: `0h 5min`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | "Matt Pocock's agent skills for real engineering" – conjunto de skills de automação e boas‑práticas para desenvolvimento TypeScript/JS.
| **Público‑alvo** | Desenvolvedores que criam/maintêm plugins de código, engenheiros que precisam de CLI/automation, revisores de código, QA.
| **Tamanho** | ~101 arquivos em 76 diretórios (≈ 3 KB de código + documentação).
| **Linguagens/Tech** | TypeScript (exemplos), Markdown, Bash, JSON/YAML (manifests), Node (scripts). 
| **Freshness** | Último commit desconhecido (não há badge de CI); repositório parece estável mas sem atividade recente visível.

---

## 2. O QUE PRESTA PARA **TURING** (Extrair para consolidado)
| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| **Deep‑module enforcement pattern** – configuração do `dependency‑cruiser` que obriga importação apenas via entry‑points e evita barrels. | `skills/engineering/setup-ts-deep-modules/SKILL.md:13-34` | Pattern | `agents/turing/deep-modules.md` | 🔴 Alta |
| **Mocking‑at‑seams guideline** – DI + SDK‑style interfaces, nunca mockar código interno. | `skills/engineering/tdd/mocking.md:1-35` | Pattern | `agents/turing/mocking-guidelines.md` | 🔴 Alta |
| **Good/Bad test patterns** – integração via interface, um assert por teste, evitar testes de implementação. | `skills/engineering/tdd/tests.md:1-77` | Pattern | `agents/turing/testing-best-practices.md` | 🔴 Alta |
| **Shoe‑horn migration pattern** – substituição segura de `as` em testes por `fromPartial`/`fromAny`. | `skills/misc/migrate-to-shoehorn/SKILL.md:28-78` | Pattern | `agents/turing/shoehorn-migration.md` | 🟠 Média |
| **CLI feedback‑loop pattern** – usar scripts, curl, Playwright ou `scripts/hitl-loop.template.sh` para diagnosticar bugs rapidamente. | `skills/engineering/diagnosing-bugs/SKILL.md:24-33` | Pattern | `agents/turing/cli-debug-loop.md` | 🟠 Média |
| **Developer‑experience scripts** – `scripts/link-skills.sh`, `scripts/list-skills.sh`, `scripts/sync-plugin-version.mjs`. | `scripts/link-skills.sh:1-10` | Tool config | `agents/turing/dev-scripts.md` | 🟠 Média |
| **Package‑manager agnostic npm scripts** – `changeset`, `version`, `check-plugin-version` no `package.json`. | `package.json:11-15` | CLI pattern | `agents/turing/npm-scripts.md` | 🟢 Baixa |

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO
| Item | Localização | Motivo | Substituto moderno |
|------|-------------|--------|--------------------|
| Ausência de testes automáticos com Vitest/Playwright (repos uses Jest‑style snippets). | Nenhum arquivo de configuração Vitest/Playwright. | Não tira proveito das ferramentas padrão ADR‑005 (Vite + UnoCSS + Vitest). | Adicionar `vitest.config.ts` + `playwright.config.ts` e migrar exemplos. |
| Uso de `as` type assertions em testes (necessita migração). | `skills/misc/migrate-to-shoehorn/SKILL.md`. | Pode gerar falsos positivos de tipo e reduzir segurança. | Migrar para `@total-typescript/shoehorn` conforme guia. |
| Dependência em `dependency‑cruiser` sem version lock (não há verificação de versão). | `skills/engineering/setup-ts-deep-modules/SKILL.md`. | Pode quebrar com atualizações maiores. | Pin `dependency-cruiser` versão no `package.json`. |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)
- [ ] **Vitest + UnoCSS + Playwright stack** conforme padrão da Severino (ADR‑005). 
- [ ] **Design‑system token file** (ex.: `src/theme/tokens.ts`) para padronizar cores, espaçamentos, tipografia.
- [ ] **Storybook/Component docs** para UI components – o repo foca apenas em skills de backend/CLI.
- [ ] **Automated accessibility lint** (ex.: `eslint-plugin-jsx-a11y`) – nada mencionado.
- [ ] **CI pipeline snippets** que rodem `lint:boundaries`, `vitest`, `playwright` em CI.

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)
- [ ] **Criar ADR**: "Adotar Vitest + Playwright como stack de testes padrão".
- [ ] **Criar Template**: `vitest.config.ts` + `playwright.config.ts` nas `templates/testing/`.
- [ ] **Criar Checklist**: "Setup deep‑module repo" – incluir passos de `dependency‑cruiser`, `lint:boundaries`, e CI.
- [ ] **Criar Skill**: `setup-vitest-playwright` (user‑invoked) que gera config e roda `npm test`.
- [ ] **Atualizar CONSOLIDATED.md** com os padrões de **mocking**, **test design**, **deep modules** e **CLI debug loops**.
- [ ] **Documentar** design‑system token conventions em `docs/engineering/design-tokens.md`.

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)
> `skills/engineering/setup-ts-deep-modules/SKILL.md:13-34` – "Make every package a **deep module**… Entry‑point boundary… No barrels."
> 
> `skills/engineering/tdd/mocking.md:18-35` – "Use dependency injection… Prefer SDK‑style interfaces…"
> 
> `skills/engineering/tdd/tests.md:5-24` – "Good Tests… Integration‑style… One logical assertion per test."
> 
> `skills/misc/migrate-to-shoehorn/SKILL.md:28-63` – "Replace `as Type` with `fromPartial()`…"
> 
> `skills/engineering/diagnosing-bugs/SKILL.md:24-33` – "CLI invocation… Playwright / Puppeteer… HITL bash script."

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)
| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | 4 | Muitas práticas DX úteis para TypeScript, porém falta stack de testes front‑end que usamos internamente. |
| **Qualidade** | 4 | Documentação clara, padrões bem definidos (deep modules, mocking, teste). |
| **Atualidade** | 3 | Usa Jest‑style snippets e `dependency‑cruiser`; não incorpora as últimas ferramentas (Vitest, Playwright). |
| **Ação** | 4 | Temos material pronto para gerar templates, checklists e ADRs imediatamente. |
| **Completude** | 3 | Cobertura boa para backend/CLI, mas faltam UI/design‑system e CI. |
| **TOTAL** | **18/25** | 

> **Regra**: Score 18 → “Priorizar extração completa”.

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO
- [ ] Salvar este arquivo em `_consolidado/agents/turing/extractions/mattpocock_skills.md` (feito).
- [ ] Avisar o Lead (gerente) que a extração está pronta.
- [ ] Iniciar a criação dos artefatos listados nas **Ações propostas**.

---

*Template v1.0 — Atualize se precisar de campos extras para seu domínio.*