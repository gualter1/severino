import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import { theme } from './src/styles/theme';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Inter:400,500,600,700',
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      ...theme.colors,
    },
    borderRadius: {
      ...theme.radii,
    },
    boxShadow: {
      ...theme.shadows,
    },
    breakpoints: {
      ...theme.breakpoints,
    },
  },
  shortcuts: {
    // Design-system shortcuts — single source via UnoCSS
    btn: 'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
    'btn-primary':
      'btn bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus-visible:outline-primary-600',
    'btn-secondary':
      'btn bg-surface text-ink border border-line hover:bg-primary-50 focus-visible:outline-primary-600',
    'btn-ghost': 'btn bg-transparent text-ink hover:bg-primary-50',
    'btn-danger': 'btn bg-danger text-white hover:brightness-95',
    input:
      'w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-primary-600 disabled:opacity-50',
    card: 'rounded-lg border border-line bg-surface p-6 shadow-card',
    'text-heading': 'text-ink font-semibold tracking-tight',
    container: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
  },
  rules: [
    // Focus-visible global garantido mesmo fora dos shortcuts
    [
      'focus-ring',
      {
        outline: '2px solid var(--color-primary-600)',
        'outline-offset': '2px',
      },
    ],
  ],
  preflights: [
    {
      getCSS: () => `
        :root { color-scheme: light dark; }
        *, ::before, ::after { border-color: var(--color-line, #e5e7eb); }
        :focus-visible { outline: 2px solid var(--color-primary-600); outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          *, ::before, ::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `,
    },
  ],
});
