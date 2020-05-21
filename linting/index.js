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
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '@globalfishingwatch/**/*',
            group: 'internal',
          },
        ],
      },
    ],
    'prettier/prettier': 'error',
    'react/prop-types': 'error',
    'react/require-default-props': 'error',
    'react/jsx-fragments': ['error', 'element'],
  },
}
