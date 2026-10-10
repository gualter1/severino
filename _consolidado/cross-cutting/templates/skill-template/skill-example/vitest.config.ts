import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
      // skill-example/src contém apenas lógica própria (index + logic);
      // o compat-layer herdado do template é excluído da métrica.
      include: ['src/**/*.ts'],
      exclude: ['tests/**/*'],
    },
    testTimeout: 10000,
    hookTimeout: 5000,
    teardownTimeout: 3000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@tests': resolve(__dirname, 'tests'),
    },
  },
});
