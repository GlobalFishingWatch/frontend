const gfwConfig = require('../../eslint.config.js')

module.exports = [
  ...gfwConfig,
  {
    ignores: ['.next', 'features/i18n/i18n.types.d.ts'],
  },
]
