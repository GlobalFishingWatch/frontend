const lint = require('./index')
module.exports = {
  ...lint,
  extends: [...lint.extends, 'plugin:@next/next/recommended'],
  rules: {
    '@next/next/no-html-link-for-pages': 0,
  },
}
