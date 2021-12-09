const lint = require('./index')
module.exports = {
  ...lint,
  extends: [...lint.extends, 'plugin:@next/next/recommended'],
}
