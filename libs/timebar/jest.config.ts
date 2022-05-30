module.exports = {
  displayName: 'timebar',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/timebar',
  preset: '../../jest.preset.ts',
}
