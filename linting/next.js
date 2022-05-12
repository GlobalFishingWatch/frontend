const lint = require('./index')
module.exports = {
  ...lint,
  extends: [...lint.extends, 'plugin:@next/next/recommended'],
  rules: {
    'import/no-unresolved': 0,
    '@next/next/no-html-link-for-pages': 0,
  },
}
