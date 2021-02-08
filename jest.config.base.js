module.exports = {
  transform: {
    // '^.+\\.js$': 'babel-jest',
    '\\.ts$': ['ts-jest'],
    '\\.html$': ['ts-jest'],
  },
  preset: 'ts-jest',
  projects: ['<rootDir>/applications/*/jest.config.js'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/types/**/*.*'],
  moduleDirectories: ['node_modules', './'],
  modulePaths: ['node_modules', './'],
  testEnvironment: 'node',
  transformIgnorePatterns: [
    // '(../)*node_modules/(?!@globalfishingwatch/|(?!ui-components)|ng-dynamic)',
    // 'ui-components',
  ],
  verbose: true,
  // projects: [
  //         '<rootDir>/packages/*/jest.config.js',
  // ],
  // coverageDirectory: '<rootDir>/coverage/',
  // collectCoverageFrom: [
  //     '<rootDir>/packages/*/src/**/*.{ts,tsx}',
  // ],
  // testURL: 'http://localhost/',
  // moduleNameMapper: {
  //     '.json$': 'identity-obj-proxy',
  // },
  // moduleDirectories: [
  //     'node_modules',
  //     'packages'
  // ],
  // snapshotSerializers: [
  //     'enzyme-to-json/serializer',
  // ],
}
