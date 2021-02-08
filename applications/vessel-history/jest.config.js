import { exit } from 'process'
const baseConfig = require('../../jest.config.base')
console.log(baseConfig)
module.exports = {
  ...baseConfig,
  rootDir: './',
  transformIgnorePatterns: [
    // 'node_modules/(?!@globalfishingwatch/|(?!ui-components)|ng-dynamic)',
    // 'ui-components',
  ],
}
