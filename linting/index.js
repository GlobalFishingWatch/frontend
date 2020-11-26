module.exports = {
  extends: [
    'react-app',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  plugins: ['react', 'import'],
  rules: {
    'import/default': 0,
    'import/no-unresolved': 0,
    'import/no-named-as-default': 0,
    'import/named': 0,
    'import/namespace': 0,
    'eslintjsx-a11y/accessible-emoji': 0,
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
              '{features,store,routes,common,components,redux-modules,types,assets,pages,data}/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    'prettier/prettier': 'error',
    'react/prop-types': 'error',
    'react/require-default-props': 'error',
    'react/jsx-fragments': ['error', 'element'],
  },
}
