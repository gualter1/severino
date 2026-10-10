# ADR-026: Template `feature-skeleton` V2 — Incorporar Gaps do Full Pilot

**Status**: ✅ **APROVADO** | **Data**: 2027-04-09 | **Autores**: Towards, Niamaia, Trevor, Turing, Tranquilão | **Decisor**: Severino

---

## Contexto

O **Full Pilot (Ciclo 2)** validou o template `feature-skeleton` em 3 projetos reais de stacks diferentes:

| Projeto | Feature | Stack | Coverage | Gaps Críticos |
|---------|---------|-------|----------|---------------|
| nodebestpractices | error-handling-audit | Node.js/TS + Express | 89.68% | exactOptionalPropertyTypes, import paths |
| AionUi | workflow-viewer | React + Arco Design + IPC | 83.66% | moduleResolution, ESLint logging, allowImportingTsExtensions |
| ECC | agent-harness-exec | TS/Python + MCP v2 | 92.40% | isolatedModules, barrel exports, MCP v2 types |

Todos os 3 projetos exigiram **ajustes manuais pós-template** para passar em `lint`, `typecheck` e `test:coverage`. Esses gaps devem ser incorporados no template canônico para eliminar fricção em novas features.

---

## Decisão

Evoluir o template `feature-skeleton` para **V2** com as seguintes correções obrigatórias:

### 1. TypeScript Config Pilot-Validated
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "exactOptionalPropertyTypes": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": false,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "types": ["node", "vitest/globals"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

**Mudanças vs V1**:
- `moduleResolution: "Bundler"` (era `NodeNext`) — resolve import hell `.js`/`.ts`
- `allowImportingTsExtensions: true` — permite imports explícitos `.ts`
- `exactOptionalPropertyTypes: false` — evita erros em DTOs/ports com campos opcionais
- `noUnusedLocals/Parameters: false` — evita false positives em barrel exports
- `isolatedModules: false` — permite cross-file type resolution
- `noEmit: true` — typecheck only, build via `tsc -b` ou bundler

### 2. Barrel Exports (`index.ts`) em Cada Layer
```typescript
// src/domain/index.ts
export * from './entities';
export * from './value-objects';
export * from './services';
export * from './events';

// src/application/index.ts
export * from './commands';
export * from './queries';
export * from './handlers';

// src/infrastructure/index.ts
export * from './persistence';
export * from './messaging';
export * from './external';
export * from './logging';

// src/interfaces/index.ts
export * from './http';
export * from './grpc';
export * from './cli';
```

**Benefício**: Elimina imports `../../../` — uso `import { ErrorHandlingService } from '../domain'`.

### 3. ESLint Config — Logging Permitido em Infra
```javascript
// eslint.config.js
export default [
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 2022,
    },
    rules: {
      'no-console': 'warn',
      eqeqeq: ['error', 'always'],
      'no-throw-literal': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  {
    files: ['src/infrastructure/logging/**/*.ts'],
    rules: {
      'no-console': 'off', // Loggers usam console intencionalmente
    },
  },
];
```

### 4. vitest.config.ts — Coverage Focado em Core Layers
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: [
        'src/domain/**/*.ts',
        'src/application/**/*.ts',
        'src/infrastructure/**/*.ts',
      ],
      exclude: [
        'src/index.ts',
        'src/interfaces/**',
        'src/infrastructure/external/**',
        'src/infrastructure/logging/**',
      ],
      thresholds: {
        lines: 80,
        branches: 70,
        functions: 70,
        statements: 80,
      },
    },
  },
});
```

### 5. package.json Scripts Atualizados
```json
{
  "scripts": {
    "build": "tsc -b",
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "lint": "eslint src tests",
    "format": "prettier --write \"src/**/*.ts\" \"tests/**/*.ts\"",
    "typecheck": "tsc --noEmit",
    "test:unit": "vitest run tests/unit",
    "test:integration": "vitest run tests/integration",
    "test:contract": "vitest run tests/contract",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "validate": "node ../../../_consolidado/cross-cutting/templates/feature-skeleton/scripts/validate-feature-structure.js . --strict"
  }
}
```

### 6. CI Workflow Reutilizável (`feature-ci.yml`)
```yaml
# .github/workflows/feature-ci.yml
name: Feature CI
on:
  pull_request:
    paths:
      - 'src/features/**'
      - '.github/workflows/feature-ci.yml'
  workflow_call:
jobs:
  lint-typecheck-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:coverage
      - run: npm run validate
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: gitleaks/gitleaks-action@v2
      - uses: returntocorp/semgrep-action@v1
      - run: npm audit --audit-level=high
  docker:
    runs-on: ubuntu-latest
    needs: [lint-typecheck-test, security]
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t feature-${{ github.event.repository.name }} .
```

---

## Consequências

### Positivas
- **Zero-config para novas features**: `cp -r feature-skeleton src/features/nova-feature && npm i && npm run validate` → passa
- **Consistência garantida**: TS config, ESLint, Vitest, CI idênticos em todos projetos
- **Onboarding acelerado**: Novo dev cria feature válida em <10 min
- **Coverage gates confiáveis**: Thresholds focados no core (domain/app/infra), não em boilerplate

### Negativas
- **Migração de features existentes**: Features V1 precisam update manual (script de migração recomendado)
- **`exactOptionalPropertyTypes: false`**: Perde rigor em tipagem de campos opcionais (mitigado por validation runtime Zod)
- **`moduleResolution: Bundler`**: Requer bundler compatível (Vite, Turbopack, esbuild) — não funciona com `tsc` puro

### Riscos Mitigados
- Import hell (`.js` vs `.ts` extensions) → `Bundler` + `allowImportingTsExtensions`
- False positive `no-unused` em barrel exports → `noUnusedLocals/Parameters: false`
- Logger infra bloqueado por `no-console: error` → override em `src/infrastructure/logging/**`
- Coverage falha por boilerplate (cli, grpc, index.ts) → `exclude` patterns no vitest

---

## Plano de Migração

| Fase | Ação | Responsável | Deadline |
|------|------|-------------|----------|
| 1 | Publicar `feature-skeleton` V2 no `_consolidado/cross-cutting/templates/` | Towards | 2027-04-16 |
| 2 | Criar script `migrate-feature-v1-to-v2.js` (auto-fix tsconfig, eslint, vitest) | Towards | 2027-04-23 |
| 3 | Migrar 3 features do pilot para V2 (validação regressiva) | Towards | 2027-04-30 |
| 4 | Atualizar `feature-ci.yml` com V2 | Trevor | 2027-04-23 |
| 5 | Documentar breaking changes no `TEMPLATES-INDEX.md` | Niamaia | 2027-05-07 |
| 6 | Grill-Me de validação do V2 com leads | Guanabara | 2027-05-14 |

---

## Implementação de Referência

- `_consolidado/cross-cutting/templates/feature-skeleton/` (atualizado para V2)
- `_consolidado/cross-cutting/templates/feature-skeleton/scripts/validate-feature-structure.js` (atualizado para validar V2)
- `_consolidado/cross-cutting/templates/feature-skeleton/.github/workflows/feature-ci.yml`
- Script de migração: `_consolidado/cross-cutting/templates/feature-skeleton/scripts/migrate-v1-to-v2.js`

---

## Cross-References
* `ADR-001` (Feature-based Packaging) — base arquitetural
* `ADR-008` (Coverage Gates) — thresholds mantidos
* `ADR-018` (Warnings-as-Errors) — `strict: true` mantido
* `TECH-RADAR-Q2-2027.md` § HOLD — configurações V1 movidas para HOLD
* `_consolidado/cross-cutting/team/GRILL-ME-RESULTS.md` — Sessão 4 (template unificado) + lições do pilot