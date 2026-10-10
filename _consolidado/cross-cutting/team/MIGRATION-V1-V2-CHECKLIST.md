# Migração V1→V2 — Projetos Pilot (Checklist)

**Data**: 2027-04-09  
**Script**: `migrate-v1-to-v2.js` (ADR-026)  
**Projetos**: nodebestpractices, AionUi, ECC  
**Objetivo**: Validar regressão zero após migração para feature-skeleton V2

---

## Checklist por Projeto

### 1. nodebestpractices — `error-handling-audit`

| Item | Status | Notas |
|------|--------|-------|
| Backup da feature original | ☐ Pendente | `cp -r src/features/error-handling-audit ../backup/` |
| Rodar `migrate-v1-to-v2.js` | ☐ Pendente | `node ../../_consolidado/cross-cutting/templates/feature-skeleton/scripts/migrate-v1-to-v2.js src/features/error-handling-audit` |
| Validar `npm run validate` | ☐ Pendente | Deve passar --strict |
| Validar `npm run lint` | ☐ Pendente | 0 errors |
| Validar `npm run typecheck` | ☐ Pendente | 0 errors |
| Validar `npm run test:coverage` | ☐ Pendente | lines ≥80%, branches ≥70% |
| Validar `npm run test:mutation` | ☐ Pendente | critical paths ≥80% |
| Build Docker | ☐ Pendente | `docker build -t nodebestpractices/error-handling-audit .` |
| CI Pipeline (feature-ci.yml) | ☐ Pendente | Push para branch `chore/migrate-v2` |
| Comparar coverage antes/depois | ☐ Pendente | Baseline: 89.68% |

**Responsável**: Towards  
**Prazo**: 2027-04-16

---

### 2. AionUi — `workflow-viewer`

| Item | Status | Notas |
|------|--------|-------|
| Backup da feature original | ☐ Pendente | `cp -r packages/desktop/src/renderer/features/workflow-viewer ../backup/` |
| Rodar `migrate-v1-to-v2.js` | ☐ Pendente | Ajustar path para monorepo |
| Validar `npm run validate` | ☐ Pendente | |
| Validar `npm run lint` | ☐ Pendente | Verificar override logging |
| Validar `npm run typecheck` | ☐ Pendente | Verificar moduleResolution |
| Validar `npm run test:coverage` | ☐ Pendente | Baseline: 83.66% |
| Validar `npm run test:mutation` | ☐ Pendente | |
| Build Docker | ☐ Pendente | |
| CI Pipeline | ☐ Pendente | |
| Testar IPC main/renderer | ☐ Pendente | Específico do AionUi |

**Responsável**: Turing  
**Prazo**: 2027-04-23

---

### 3. ECC — `agent-harness-exec`

| Item | Status | Notas |
|------|--------|-------|
| Backup da feature original | ☐ Pendente | `cp -r src/features/agent-harness-exec ../backup/` |
| Rodar `migrate-v1-to-v2.js` | ☐ Pendente | |
| Validar `npm run validate` | ☐ Pendente | |
| Validar `npm run lint` | ☐ Pendente | |
| Validar `npm run typecheck` | ☐ Pendente | Python + TS configs |
| Validar `npm run test:coverage` | ☐ Pendente | Baseline: 92.40% |
| Validar `npm run test:mutation` | ☐ Pendente | |
| Validar MCP v2 handshake | ☐ Pendente | Crítico: agent-to-agent |
| Validar Cross-Harness | ☐ Pendente | Skill roda em OpenCode + Claude Code |
| Build Docker | ☐ Pendente | Multi-stage TS + Python |
| CI Pipeline | ☐ Pendente | |

**Responsável**: Trevor + Towards  
**Prazo**: 2027-04-30

---

## Script de Validação Automatizada

```bash
#!/bin/bash
# validate-migration.sh — roda em cada projeto

PROJECT_PATH=$1
FEATURE_NAME=$2

echo "🔍 Validando migração V1→V2 para $FEATURE_NAME em $PROJECT_PATH"

cd "$PROJECT_PATH"

echo "1️⃣  Validate structure..."
npm run validate -- --strict || exit 1

echo "2️⃣  Lint..."
npm run lint || exit 1

echo "3️⃣  Typecheck..."
npm run typecheck || exit 1

echo "4️⃣  Tests + Coverage..."
npm run test:coverage || exit 1

echo "5️⃣  Mutation Testing (critical paths)..."
npm run test:mutation 2>/dev/null || echo "⚠️  Mutation não configurado (opcional)"

echo "6️⃣  Docker Build..."
docker build -t "migration-test/$FEATURE_NAME" . || exit 1

echo "✅ $FEATURE_NAME: MIGRAÇÃO VÁLIDA"
```

---

## Critérios de Aprovação (Gate)

| Critério | Threshold | Bloqueante? |
|----------|-----------|-------------|
| Structure validation | PASS | ✅ Sim |
| Lint | 0 errors | ✅ Sim |
| Typecheck | 0 errors | ✅ Sim |
| Coverage lines | ≥80% | ✅ Sim |
| Coverage branches | ≥70% | ✅ Sim |
| Mutation (critical) | ≥80% | ⚠️ Warning |
| Docker build | SUCCESS | ✅ Sim |
| CI Pipeline | GREEN | ✅ Sim |
| Coverage regression | ≤2% drop | ✅ Sim |
| MCP v2 handshake (ECC) | PASS | ✅ Sim |

---

## Rollback Plan

Se qualquer projeto falhar:

```bash
# 1. Restaurar backup
rm -rf src/features/$FEATURE_NAME
cp -r ../backup/$FEATURE_NAME src/features/

# 2. Documentar falha
echo "FALHA: $FEATURE_NAME - $(date)" >> migration-failures.log
# Incluir: erro, stack trace, diff do migrate script

# 3. Abrir issue no GitHub
gh issue create --title "Migration V2 failed: $FEATURE_NAME" --body "$(cat migration-failures.log)"

# 4. Notificar team no Slack/Discord
```

---

## Métricas de Sucesso (Pós-Migração)

| Métrica | Target |
|---------|--------|
| **3/3 projetos passing** | 100% |
| **Coverage regression** | <2% drop vs baseline |
| **Time-to-green (novo dev)** | <10 min (vs ~15 min atual) |
| **Lint fixes (1º run)** | 0 (template V2 resolve) |
| **Typecheck errors (1º run)** | 0 (TS config V2 resolve) |
| **Validation pass rate** | 100% (vs 33% no pilot) |

---

## Status Geral

```
📊 MIGRAÇÃO V1→V2 — PILOT PROJECTS
├── nodebestpractices/error-handling-audit  [ ] Backup  [ ] Migrate  [ ] Validate  [ ] CI
├── AionUi/workflow-viewer                   [ ] Backup  [ ] Migrate  [ ] Validate  [ ] CI
└── ECC/agent-harness-exec                   [ ] Backup  [ ] Migrate  [ ] Validate  [ ] CI

🎯 Target: 2027-04-30 (todas validadas)
📋 Próximo: ADR-026 migration script review + Grill-Me validação
```

---

*Este checklist será atualizado conforme execução. Cada item ✅ = commit com tag `migration-v2-<project>-<feature>`.*