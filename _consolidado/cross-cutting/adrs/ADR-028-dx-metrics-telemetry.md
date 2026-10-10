# ADR-028: DX Metrics & Template-to-Production Telemetry

**Status**: ✅ **APROVADO** | **Data**: 2027-04-09 | **Autores**: Towards, Niamaia, Trevor, Qualy, Guanabara | **Decisor**: Severino

---

## Contexto

O Full Pilot revelou **falta de visibilidade** sobre a eficiência real do template `feature-skeleton`:
- Quanto tempo leva do `cp -r feature-skeleton` até primeiro `npm run test:coverage` verde?
- Qual a taxa de features que chegam à produção sem rework?
- Quais gaps do template causam mais retrabalho?

Sem métricas, melhorias são baseadas em intuição, não em dados.

---

## Decisão

Implementar **DX Metrics Pipeline** obrigatório no template `feature-skeleton` V2+ para coletar telemetria anônima de uso:

### 1. Métricas Coletadas (Opt-in, Anônimas)

| Métrica | Descrição | Coleta |
|---------|-----------|--------|
| `template.init.duration_ms` | Tempo do `cp -r` até `npm install` completo | `postinstall` hook |
| `template.first_test.duration_ms` | Tempo até primeiro `test:coverage` PASS | CI `feature-ci.yml` |
| `template.lint_fix_count` | Nº de `eslint --fix` runs necessários | CI |
| `template.typecheck_errors` | Nº de erros TS no primeiro `typecheck` | CI |
| `template.coverage_first_run` | Coverage % no primeiro run (lines/branches) | CI |
| `template.validation_passes` | `validate-feature-structure.js --strict` PASS/FAIL | CI |
| `template.migration_v1_to_v2` | Se feature migrou de V1 (bool) | Manual flag |
| `feature.time_to_prod_days` | Dias do primeiro commit até merge em `main` | GitHub API |
| `feature.rework_commits` | Commits após primeiro "feat complete" PR | Git log analysis |

### 2. Instrumentação no Template

```json
// package.json (feature-skeleton V2)
{
  "scripts": {
    "postinstall": "node ../../../_consolidado/cross-cutting/templates/feature-skeleton/scripts/dx-telemetry.js init",
    "dx:report": "node ../../../_consolidado/cross-cutting/templates/feature-skeleton/scripts/dx-telemetry.js report"
  }
}
```

### 3. CI Integration (`feature-ci.yml`)
```yaml
- name: DX Telemetry — First Run Metrics
  if: github.event_name == 'pull_request' && github.event.pull_request.number == 1
  run: |
    node ../../../_consolidado/cross-cutting/templates/feature-skeleton/scripts/dx-telemetry.js ci \
      --lint-fixes="${{ steps.lint.outputs.fixes }}" \
      --typecheck-errors="${{ steps.typecheck.outputs.errors }}" \
      --coverage-lines="${{ steps.test.outputs.lines }}" \
      --coverage-branches="${{ steps.test.outputs.branches }}"
```

### 4. Dashboard (Grafana/Prometheus ou GitHub Insights)
- **Template Adoption Rate**: Features criadas vs features em produção
- **Time-to-Green**: P50/P95 de `first_test.duration_ms`
- **Rework Rate**: `% features com rework_commits > 0`
- **Gap Frequency**: Top 5 `typecheck_errors` patterns
- **Language Distribution**: TS vs Go vs Rust vs Python adoption

### 5. Privacidade & Governança
- **Opt-in explícito**: `DX_TELEMETRY_ENABLED=true` no `.env` do projeto
- **Zero PII**: Nomes de feature hasheados (SHA256 prefix 8 chars), sem org/repo/user
- **Retenção**: 90 dias, agregação diária
- **Opt-out**: `DX_TELEMETRY_ENABLED=false` ou remover script do `postinstall`

---

## Consequências

### Positivas
- **Data-driven template evolution**: Próximas versões baseadas em gaps reais
- **ROI visível**: Time-to-Prod reduction mensurável
- **Onboarding feedback**: Identifica onde novos devs travam
- **Cross-project benchmarking**: Compara saúde de features entre projetos

### Negativas
- **Instrumentação overhead**: ~200ms no `postinstall`, ~1s no CI
- **Opt-in bias**: Métricas só de quem habilita (mitigado por default-on em projetos internos)
- **Maintenance**: Scripts de telemetria precisam versionamento próprio

### Riscos Mitigados
- PII leakage → Hash + zero campos sensíveis + opt-in
- Scope creep → Métricas fixas no schema, mudança requer ADR
- Tool fatigue → Integrado no `feature-ci.yml` reutilizável, zero config extra

---

## Plano de Implementação

| Fase | Entregável | Responsável | Deadline |
|------|------------|-------------|----------|
| 1 | `dx-telemetry.js` (init + ci + report + schema validation) | Towards | 2027-04-23 |
| 2 | Integrar no `feature-skeleton` V2 `package.json` + `feature-ci.yml` | Trevor | 2027-04-30 |
| 3 | Dashboard Grafana + Prometheus rules + alertas | Trevor + Niamaia | 2027-05-21 |
| 4 | Pilotar em 5 features novas (opt-in interno) | Towards | 2027-06-11 |
| 5 | Review mensal de métricas + ajustes no template | Niamaia + Towards | Mensal a partir 2027-07 |

---

## Implementação de Referência

- `_consolidado/cross-cutting/templates/feature-skeleton/scripts/dx-telemetry.js`
- `_consolidado/cross-cutting/templates/feature-skeleton/scripts/dx-schema.json`
- Dashboard: `grafana/dashboards/dx-template-metrics.json`

---

## Cross-References
* `ADR-026` (feature-skeleton V2) — base onde telemetria é integrada
* `ADR-027` (Multi-language) — telemetria por linguagem
* `TECH-RADAR-Q2-2027.md` — DX Metrics como tendência
* `_governance/LEARNING_LOOP.md` — métricas alimentam learning loop