module.exports = {
  displayName: 'vessel-history',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^workerize-loader(\\?.*)?!(.*)/([^/]*)$': '$2/__mocks__/$3',
  },
  coverageDirectory: '../../coverage/applications/vessel-history',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/types/**/*.*'],
}
