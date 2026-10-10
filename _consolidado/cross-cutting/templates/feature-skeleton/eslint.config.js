// ESLint flat config — TS-aware checks enforced by `tsc --noEmit` (strict).
// why: keep pilot dependency-light; only the parser is required to parse .ts/.tsx.
import tsParser from '@typescript-eslint/parser';

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