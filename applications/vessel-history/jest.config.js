module.exports = {
  displayName: 'vessel-history',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': './jest.transform.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^workerize-loader(\\?.*)?!(.*)/([^/]*)$': '$2/__mocks__/$3',
  },
  coverageDirectory: '../../coverage/applications/vessel-history',
}
