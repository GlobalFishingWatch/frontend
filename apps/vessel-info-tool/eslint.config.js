const gfwConfig = require('../../eslint.config.js')

module.exports = [
  ...gfwConfig,
  {
    ignores: ['.nitro', '.output', '.tanstack'],
  },
]
