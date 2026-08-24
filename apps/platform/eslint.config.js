import { appPackageJsonConfig } from '@globalfishingwatch/linting/nx'

import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  // Detect circular imports in selector files — these cause undefined selectors in the SSR bundle.
  // Scoped to selectors only because import/no-cycle is slow (full graph traversal per file).
  {
    files: ['**/*.selectors.ts', '**/selectors/*.ts'],
    rules: {
      'import/no-cycle': ['error', { maxDepth: 10, ignoreExternal: true }],
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
  appPackageJsonConfig,
]
