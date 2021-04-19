// TODO couldn't disable prettier so I cop`y pasted this from the linting packg

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'react-app',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  plugins: ['@typescript-eslint', 'react', 'import'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  rules: {
    'import/default': 0,
    'import/no-unresolved': 0,
    'import/no-named-as-default': 0,
    'import/named': 0,
    'import/namespace': 0,
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'never',
        pathGroups: [
          {
            pattern: '@globalfishingwatch/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern:
              '{features,store,routes,common,components,redux-modules,types,assets,pages,data,hooks,utils}',
            group: 'internal',
          },
          {
            pattern:
              '{features,store,routes,common,components,redux-modules,types,assets,pages,data,hooks,utils}/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    'react/jsx-fragments': ['error', 'element'],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-redeclare': 0,
    // note you must disable the base rule as it can report incorrect errors
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-am-using-a-rule-from-eslint-core-and-it-doesnt-work-correctly-with-typescript-code
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/camelcase': 0,
  },
}
