# ADR-022: Zero-Dependency Dual-Compat (V1/V2)

- **Status**: ✅ Aprovado (Grill-Me Session 3)
- **Data**: 2026-10-09
- **Autores**: Guanabara, Kaspersky, Trevor, Niamaia, Towards
- **Decisores**: Severino (Líder)

## Contexto
Plugins precisam rodar tanto no OpenCode V1 (legacy, callbacks) quanto V2 (moderno, promises/async), sem duplicar código ou depender de bibliotecas de terceiros (`dependencies` no `package.json`). Dependências externas aumentam superfície de ataque (supply chain), bundle size e complexidade de build.

## Decisão
Duas regras obrigatórias para todos os plugins/skills publicados:

### 1. Zero-Dependency Enforcement
- **Regra**: `package.json` **não deve conter** campo `dependencies` (apenas `devDependencies` para tooling).
- **CI Gate**: Pipeline falha se `npm ls --prod --parseable` retornar qualquer linha.
- **Exceção**: Apenas via **waiver assinado** por Kaspersky + Trevor (máx 30 dias, expiração automática), com issue link e justificativa documentada em `SECURITY.md`.
- **Alternativa aprovada**: Vendor código necessário no core do plugin ou expor interface para o harness prover.

### 2. Dual-Compat V1/V2 via Bridge Pattern
- **Arquitetura**: `compat-layer.ts` implementa Bridge Pattern.
  - `PluginAPI` = interface estável (contrato do core).
  - `V1Adapter` = traduz callbacks V1 → promises.
  - `V2Adapter` = passa direto (API nativa).
- **Detecção runtime** (<1ms): `typeof opencode?.v2 !== 'undefined' ? 'v2' : 'v1'`.
- **Build único**: Single artifact, entrypoint único, adapters internos.
- **Testes**: Suite parametrizada roda contra V1 e V2 no CI.

## Consequências
- **Positivas**: Segurança supply chain (0 deps runtime); longevidade (roda em V1 e V2); manutenibilidade (core único); SLSA provenance simplificado.
- **Negativas**: Requer disciplina para não usar libs externas; adapters exigem manutenção se APIs V1/V2 divergirem.
- **Riscos Mitigados**: Supply chain attacks; vendor lock-in; fragmentação V1 vs V2.

## Implementação de Referência
- `_consolidado/cross-cutting/templates/skill-template/src/compat-layer.ts`
- CI rule: `skill-review.yaml` rule `DEP001`