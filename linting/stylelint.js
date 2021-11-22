module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-prettier',
  ],
  rules: {
    'alpha-value-notation': 'number',
    'value-keyword-case': [
      'lower',
      {
        ignoreProperties: ['composes'],
      },
    ],
    'color-function-notation': 'legacy',
    'selector-class-pattern': '.*',
    'selector-id-pattern': '.*',
    'keyframes-name-pattern': '.*',
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
}
