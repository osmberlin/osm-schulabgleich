import { defineConfig } from 'oxfmt'

export default defineConfig({
  useTabs: false,
  tabWidth: 2,
  printWidth: 100,
  singleQuote: true,
  jsxSingleQuote: false,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  semi: false,
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: 'lf',
  // Biome only formatted source + config; never `public/`. Pipeline artifacts use minified
  // `JSON.stringify` only — see `writeJson` in `scripts/lib/pipelineCommon.ts`.
  ignorePatterns: ['public/**', 'dist/**', 'node_modules/**'],
  sortPackageJson: true,
  sortImports: {
    groups: ['import'],
    newlinesBetween: false,
  },
  sortTailwindcss: {
    stylesheet: 'src/index.css',
    functions: ['cn', 'clsx', 'twMerge', 'twJoin'],
  },
})
