import path from 'node:path'

import rootConfig from '../../eslint.config.js'

const tsconfigPath = path.join(import.meta.dirname, 'tsconfig.json')

export default [
  {
    ignores: ['.nitro/**/*', '.output/**/*', 'dist/**/*', 'coverage/**/*'],
  },
  ...rootConfig,
  // Pin resolver to this app — avoids stale fishing-map tsconfig after rename.
  {
    settings: {
      'import/resolver': {
        typescript: {
          project: tsconfigPath,
        },
      },
    },
  },
  // Detect circular imports in selector files — these cause undefined selectors in the SSR bundle.
  // Scoped to selectors only because import/no-cycle is slow (full graph traversal per file).
  {
    files: ['**/*.selectors.ts', '**/selectors/*.ts'],
    rules: {
      'import/no-cycle': ['error', { maxDepth: 10, ignoreExternal: true }],
    },
  },
  {
    files: ['**/routes/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: [
      'routes/**/*',
      'features/layouts/**/*',
      'features/nav/**/*',
      'features/modals/**/*',
      'features/hints/**/*',
      'features/app/**/*',
      'features/i18n/**/*',
      'features/user/**/*',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@globalfishingwatch/ui-components',
              message:
                'Eager path: import the leaf subpath instead, e.g. @globalfishingwatch/ui-components/icon.',
            },
            {
              name: '@globalfishingwatch/deck-layers',
              message: 'Eager path: use @globalfishingwatch/deck-layers/constants.',
            },
            {
              name: '@globalfishingwatch/timebar',
              message:
                'Eager path: the timebar root barrel pulls @deck.gl/react via ./charts. Use @globalfishingwatch/timebar/constants.',
            },
          ],
        },
      ],
    },
  },
  // Disable @nx/dependency-checks for platform package.json
  {
    files: ['package.json'],
    rules: {
      '@nx/dependency-checks': 'off',
    },
  },
]
