// Jest configuration for api
const base = require('../../jest.config.base.js')

module.exports = {
  ...base,

  transformIgnorePatterns: base.transformIgnorePatterns.push('/packages\\/.+\\.js/'),
  name: 'vessel-history',
  displayName: 'Vessel History',
}
