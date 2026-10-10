/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      // ADR-008: 80% lines / 70% branches
      thresholds: {
        lines: 80,
        branches: 70,
        functions: 75,
        statements: 80,
      },
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.spec.{ts,tsx}',
        '**/*.test.{ts,tsx}',
        '**/*.stories.{ts,tsx}',
        'src/types/',
        'vite.config.ts',
        'vitest.config.ts',
        'playwright.config.ts',
        'uno.config.ts',
      ],
    },
  },
});
