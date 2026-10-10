# 🏭 Severino Agent Factory — Learning by Report

> **Filosofia**: Robôs não aprendem sozinhos. Eles **executam e relatam**. O **Severino (Master)** absorve, cura e injeta contexto nas próximas tarefas.
> Tarefa 1 = lenta. Tarefa 10 = receita pronta.

---

## 🎯 Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SEVERINO (Master Orchestrator)                     │
│  ├── severino-learning/          # Learning Loop Centralizado                │
│  │   ├── absorb-report.ts        # Processa relatório → atualiza contexto    │
│  │   ├── curated-context.ts      # Tipos: Pattern, Trap, Shortcut, Context   │
│  │   ├── curated-context-store.ts # Persistência JSON (git-friendly)        │
│  │   └── context-builder.ts      # API principal: buildContext + absorb      │
│  │                                                              │
│  ├── create-robot.ts             # Factory: cria robô + quarto isolado       │
│  └── room-template/              # Template do quarto do robô                │
│      ├── agent.json              # Manifesto do robô                        │
│      └── instructions.md         # Regras + formato do relatório obrigatório │
└─────────────────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
       ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
       │ ROBÔ A      │ │ ROBÔ B      │ │ ROBÔ C      │
       │ (backend)   │ │ (frontend)  │ │ (qa)        │
       │ room/       │ │ room/       │ │ room/       │
       │ ├── agent.json                │
       │ ├── instructions.md           │
       │ ├── workspace/                │
       │ └── learning/ (passivo)       │
       └─────────────┘ └─────────────┘ └─────────────┘
```

---

## 🔄 Ciclo de Vida da Tarefa

### 1. ANTES — Severino Injeta Contexto
```typescript
const { injectionMarkdown, taskSignature } = await severinoLearning.buildContextForRobot(
  "backend",
  "Criar endpoint POST /api/v1/webhooks/stripe com validação HMAC"
);

// Injeta no prompt do robô
const robotPrompt = `
${objetivo}

${injectionMarkdown}

---
⚠️ OBRIGATÓRIO: Ao final, gere relatório no formato JSON válido (schema execution-report-v1).
`;
```

### 2. DURANTE — Robô Executa + Gera Relatório
O robô recebe o contexto, executa a tarefa e **DEVE** anexar ao final da resposta:
```json
{
  "meta": { "robotId": "...", "taskSignature": "webhook-stripe-hmac", ... },
  "objective": "...",
  "contextReceived": { "version": 2, "patterns": [...], "traps": [...], ... },
  "steps": [...],
  "decisions": [...],
  "toolsUsed": [...],
  "traps": [...],
  "skillCandidates": [...],
  "artifacts": [...],
  "metrics": { "totalTimeMs": 137000, ... }
}
```

### 3. DEPOIS — Severino Absorve
```typescript
const { summary } = await severinoLearning.absorbRobotReport(report);
console.log(summary);
// 🧠 Learning Loop: Relatório absorvido
//    Tarefa: `webhook-stripe-hmac` (backend)
//    Contexto: v3 | Relatórios totais: 7
//    Novos: 1 padrões, 0 armadilhas, 1 atalhos
//    Promovidos: 1 skills → official
//    ⚡ Speedup atual: 3.2x
```

---

## 📁 Estrutura de Pastas

```
_consolidado/cross-cutting/templates/agent-factory/
├── create-robot.ts                    # CLI: cria robô + quarto
├── room-template/
│   ├── agent.schema.json              # Schema do manifesto
│   ├── agent.json.example             # Exemplo backend
│   └── instructions.md                # Regras + template do relatório
│
├── severino-learning/
│   ├── index.ts                       # Exportações principais
│   ├── report-schema.ts               # Zod schema do relatório
│   ├── curated-context.ts             # Tipos do contexto curado
│   ├── curated-context-store.ts       # Store JSON + formatação p/ prompt
│   ├── absorb-report.ts               # Motor de absorção (merge, promoção)
│   └── context-builder.ts             # API de alto nível (buildContext + absorb)
│
└── _consolidado/rooms/                # Criado em runtime (gitignored)
    ├── robot-backend-001/
    │   ├── agent.json
    │   ├── instructions.md
    │   ├── workspace/
    │   └── learning/
    │       ├── room-metadata.json
    │       ├── memory/
    │       ├── skills/{generated,evolved,registry.json}
    │       ├── nudges/{schedule.json,pending.json}
    │       └── evolution/{promote-policy.json}
    └── robot-frontend-001/
        └── ...
```

---

## 🤖 Criando Robôs

```bash
# Via template (usa defaults do papel)
npx tsx create-robot.ts --from-template backend --id robot-backend-003

# Customizado
npx tsx create-robot.ts --role backend --id robot-backend-004 --name "Stripe Specialist"

# Lista robôs
npx tsx create-robot.ts list

# Remove
npx tsx create-robot.ts delete --id robot-backend-003
```

### Roles Disponíveis
| Role | Model | Capabilities Padrão | Skill Kits |
|------|-------|---------------------|------------|
| `backend` | claude-3.5-sonnet | github, npm, db, stripe, docker | backend-dev-kit |
| `frontend` | claude-3.5-sonnet | github, npm, browser, playwright | frontend-ux-kit |
| `qa` | claude-3.5-sonnet | playwright, vitest, k6 | qa-engineer-kit |
| `devops` | claude-3.5-sonnet | kubectl, helm, terraform, aws | devops-platform-kit |
| `security` | claude-3.5-sonnet | semgrep, snyk, zap | security-appsec-kit |
| `sales` | claude-3.5-sonnet | hubspot, linkedin, email | sales-b2b-kit |
| `product` | claude-3.5-sonnet | linear, notion, figma | product-manager-kit |
| `research` | claude-3.5-sonnet | arxiv, web-search, pdf | deep-researcher-kit |
| `data` | claude-3.5-sonnet | python, jupyter, duckdb | data-ai-kit |
| `tech-lead` | claude-3.5-sonnet | github, linear, arch-review | tech-lead-kit |

---

## 📊 Contexto Curado (O que Severino Acumula)

Para cada `domain::taskSignature` (ex: `backend::webhook-stripe-hmac`), Severino mantém:

### Patterns (Padrões Validados)
> "Para webhooks Stripe, **SEMPRE** use `rawBody: true` no Fastify ANTES do parser JSON"

### Traps (Armadilhas Conhecidas)
> ⚠️ `stripe-node v14` exige `rawBody` como **Buffer**, não string
> Sintoma: `constructEvent` falha com "invalid signature"
> Prevenção: Configure `rawBody: true` na rota específica

### Shortcuts (Atalhos & Skills)
| Skill | Status | Trigger | Economia |
|-------|--------|---------|----------|
| `skill:fastify-webhook-stripe` | 🧪 candidate | "criar webhook stripe" | ~5min |
| `skill:zod-validation-patterns` | ✅ official | "validar payload" | ~3min |

### Métricas de Efetividade
- **Speedup**: Tempo médio COM contexto / SEM contexto
- **Taxa de sucesso**: Com vs sem contexto
- **Relatórios absorvidos**: Quantos alimentaram este contexto

---

## 🧪 Exemplo Prático: Tarefas 1 → 3 → 10

### Tarefa 1 (Contexto v0 — vazio)
```
Robô: "Criar webhook Stripe..."
→ Gasta 15min descobrindo rawBody, HMAC, testes
→ Relatório: 3 traps, 1 skill candidate, 0 patterns
→ Severino absorve → Contexto v1 criado
```

### Tarefa 3 (Contexto v2 — 2 relatórios absorvidos)
```
Severino injeta:
- Pattern: "Use rawBody antes do parser"
- Trap: "stripe-node exige Buffer"
- Shortcut: "skill:fastify-route-template v2.1"

Robô: Executa em 4min (seguindo atalhos)
→ Relatório: 0 traps, 0 novos, 2 skills reutilizadas
→ Severino atualiza métricas → Speedup ~3.7x
```

### Tarefa 10 (Contexto v8 — maduro)
```
Severino injeta contexto rico (8 patterns, 4 traps, 5 shortcuts official)
Robô: Executa em 1min 30s — segue receita pronta
→ Relatório: confirma padrões, promove skill candidate → official
```

---

## 🔌 Integração Futura: Resource Broker

Quando o **Resource Broker (Recepção/Porteiro)** estiver pronto, o relatório ganhará campos extras:

```json
"resourceUsage": [
  {
    "capability": "browser",
    "checkedOutAt": "2026-10-10T10:00:05Z",
    "checkedInAt": "2026-10-10T10:01:45Z",
    "durationMs": 100000,
    "poolWaitMs": 2000
  }
]
```

E o Severino aprenderá:
- Quais ferramentas são gargalo (pool saturation)
- Quotas ideais por tipo de robô
- Padrões de uso para pre-carregar pools

---

## 🚀 Próximos Passos

1. **Criar primeiros robôs**: `npx tsx create-robot.ts --from-template backend`
2. **Integrar no Severino**: Importar `severinoLearning` no orquestrador principal
3. **Testar ciclo**: Mandar 3 tarefas similares → ver speedup
4. **Resource Broker**: Implementar checkout/checkin de ferramentas
5. **Dashboard**: Visualizar contextos curados, speedups, skills promovidas

---

## 📝 Notas de Design

- **Zero infra no robô**: Apenas `instructions.md` exige relatório JSON
- **Git-friendly**: Contextos curados = arquivos JSON em `_consolidado/rooms/` (ou store central)
- **Auditoria total**: Cada padrão/trap/atalho rastreia `sourceReportIds`
- **Promoção controlada**: Candidate → Validated → Official com regras claras
- **Extensível**: Schema Zod permite evoluir sem quebrar robôs existentes