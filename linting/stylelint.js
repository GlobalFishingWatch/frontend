export default {
  extends: ['stylelint-config-standard', 'stylelint-config-css-modules'],
  rules: {
    'alpha-value-notation': 'number',
    'value-keyword-case': [
      'lower',
      {
        ignoreProperties: ['composes'],
      },
    ],
    'color-function-notation': 'legacy',
    'color-function-alias-notation': 'with-alpha',
    'selector-class-pattern': '.*',
    'selector-id-pattern': '.*',
    'custom-property-pattern': '.*',
    'keyframes-name-pattern': '.*',
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
}
