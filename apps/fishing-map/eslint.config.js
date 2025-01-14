const gfwConfig = require('../../eslint.config.js')

module.exports = [
  ...gfwConfig,
  {
    ignores: ['.next'],
  },
]
