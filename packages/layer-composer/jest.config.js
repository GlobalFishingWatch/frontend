const base = require('../../jest.config.base.js')

const package = require('./package')
const name = package.name.replace('@globalfishingwatch/', '')

const config = {
  ...base,
  name: package.name,
  displayName: name,
  rootDir: './',
  testMatch: [`./**/*.test.ts`],
}

module.exports = config
