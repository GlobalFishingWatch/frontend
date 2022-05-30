module.exports = {
  displayName: 'api-types',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/api-types',
  preset: '../../jest.preset.ts',
}
