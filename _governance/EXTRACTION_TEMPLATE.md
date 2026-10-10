# TEMPLATE DE EXTRAÇÃO — Para Funcionários (Subagentes)

**Use este template para cada repositório que analisar.**
Salve em: `_consolidado/agents/{seu_lead}/extractions/{nome-do-repo}.md`

---

## METADADOS
- **Repositório**: `{nome-da-pasta-em-Repositorios}`
- **Lead Responsável**: `{niamaia|trevor|tranquilao|qualy|towards|turing|kaspersky|guanabara|marketing|sales}`
- **Funcionário (Subagente)**: `{seu_nome}`
- **Data**: `{YYYY-MM-DD}`
- **Tempo gasto**: `{Xh Ymin}`

---

## 1. VISÃO GERAL DO REPO
| Campo | Detalhe |
|-------|---------|
| **Propósito declarado** | (o que o README diz que é) |
| **Público-alvo** | (devs, architects, security, QA, etc.) |
| **Tamanho** | (arquivos, linhas, pastas principais) |
| **Linguagens/Tech** | (Markdown, TypeScript, Python, YAML, etc.) |
| **Freshness** | (último commit, issues abertas, manutenção ativa?) |

---

## 2. O QUE PRESTA PARA **{SEU DOMÍNIO}** (Extrair para consolidado)

| Item | Localização (arquivo:linha) | Tipo | Destino sugerido em `_consolidado/` | Prioridade |
|------|----------------------------|------|-------------------------------------|------------|
| Ex: Feature-based package structure | `README.md:184-192` | Guideline | `agents/niamaia/architecture-patterns.md` | 🔴 Alta |
| Ex: Fastlane Match config example | `docs/ci.md:45-60` | Template | `templates/fastlane/Matchfile` | 🟠 Média |
| Ex: Certificate pinning implementation | `security/network.md:120` | Code snippet | `agents/tranquilao/network-security.md` | 🔴 Alta |
| Ex: Threat model template | `docs/threat-model.md` | Template | `agents/kaspersky/threat-models/template.md` | 🟠 Média |
| Ex: Analogy for event loop | `docs/concepts/event-loop.md` | Analogy | `agents/guanabara/analogies/event-loop.md` | 🟢 Baixa |

**Tipos válidos**: `Guideline`, `Template`, `Code snippet`, `Pattern`, `Anti-pattern`, `Tool config`, `Checklist`, `Runbook`, `Analogy`, `Tutorial`, `Decision record`, `Compliance mapping`

---

## 3. O QUE É LIXO / DESATUALIZADO / PERIGOSO

| Item | Localização | Motivo | Substituto moderno (se houver) |
|------|-------------|--------|-------------------------------|
| Ex: Guava library recommendation | `README.md:171` | 13k métodos, deprecated | Kotlin stdlib / Guava-only-if-needed |
| Ex: CocoaPods como default | `README.md:83-108` | SPM é padrão moderno | SPM + Package.resolved |
| Ex: Robolectric para unit tests | `README.md:427` | Mocks platform = inaccurate | JUnit (JVM) + Espresso (UI) |
| Ex: `npm audit` only | `security.md:10` | Não pega transitive deps bem | `npm audit` + `snyk` + `dependabot` |

---

## 4. GAPS — O QUE O REPO **NÃO COBRE** MAS DEVERIA (para seu domínio)

- [ ] Gap 1: `{descrição}` — Sugestão: `{o que criar/documentar}`
- [ ] Gap 2: `{descrição}` — Sugestão: `{o que criar/documentar}`
- [ ] Gap 3: `{descrição}` — Sugestão: `{o que criar/documentar}`

---

## 5. AÇÕES PROPOSTAS PARA SEU LEAD (Gerente)

- [ ] **Criar/Atualizar CONSOLIDATED.md** com: `{resumo do que adicionar}`
- [ ] **Criar ADR**: `{título}` — Para: `{decisão que precisa ser tomada}`
- [ ] **Criar Template**: `{nome}` — Em: `{pasta de templates do lead}`
- [ ] **Criar Checklist**: `{nome}` — Em: `{pasta de checklists do lead}`
- [ ] **Criar Runbook**: `{nome}` — Em: `{pasta de runbooks do lead}`
- [ ] **Criar Skill**: `{nome}` — Em: `_consolidado/skills/{nome}/`
- [ ] **Criar Analogy/Tutorial**: `{tópico}` — Em: `agents/guanabara/{analogies|tutorials}/`
- [ ] **Novo agente necessário**: `{domínio}` — Criar `agents/{novo}/` + adicionar em `cross-cutting/team/roles.md`

---

## 6. CITAÇÕES TEXTUAIS IMPORTANTES (para referência futura)

> Cole aqui trechos curtos (máx 5 linhas cada) que você quer preservar exatamente como estão.
> Formato: `Arquivo:linha` + citação.

---

## 7. SCORE DE VALOR DO REPO (Para seu domínio)

| Critério | 1-5 | Justificativa |
|----------|-----|---------------|
| **Relevância** | | Quão alinhado com seu domínio |
| **Qualidade** | | Profundidade, precisão, exemplos práticos |
| **Atualidade** | | Quão moderno (não legacy) |
| **Ação** | | Gera templates/checklists/ADRs usáveis AGORA |
| **Completude** | | Cobre o tema end-to-end ou tem buracos |
| **TOTAL** | **/25** | |

> **Regra**: Score < 10 = "Arquivar só referência", Score 10-17 = "Extrair seletivo", Score > 17 = "Priorizar extração completa"

---

## 8. PRÓXIMOS PASSOS DO FUNCIONÁRIO

- [ ] Salvar este arquivo em `_consolidado/agents/{lead}/extractions/{repo}.md`
- [ ] Avisar seu Lead (gerente) que a extração está pronta
- [ ] Mover para próximo repo na fila

---

*Template v1.0 — Atualize se precisar de campos extras para seu domínio.*