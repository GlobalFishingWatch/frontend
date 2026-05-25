import importPlugin from 'eslint-plugin-import'

import rootConfig from '../../eslint.config.js'

export default [
  {
    ignores: ['.nitro/**', '.output/**', 'dist/**', 'coverage/**'],
  },
  ...rootConfig,
  // Detect circular imports in selector files — these cause undefined selectors in the SSR bundle.
  // Scoped to selectors only because import/no-cycle is slow (full graph traversal per file).
  {
    files: ['**/*.selectors.ts', '**/selectors/*.ts'],
    plugins: { import: importPlugin },
    rules: {
      'import/no-cycle': ['error', { maxDepth: 10, ignoreExternal: true }],
    },
  },
  // Disable @nx/dependency-checks for fishing-map package.json
  {
    files: ['package.json'],
    rules: {
      '@nx/dependency-checks': 'off',
    },
  },
]
