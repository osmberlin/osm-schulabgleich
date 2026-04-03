import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['unicorn', 'typescript', 'oxc', 'react', 'vitest'],
  ignorePatterns: ['dist/**', 'node_modules/**', 'public/**'],
  rules: {
    'react/rules-of-hooks': 'error',
    'react/exhaustive-deps': 'off',
    'typescript/no-explicit-any': 'warn',
    'typescript/consistent-type-imports': 'off',
  },
})
