module.exports = {
  displayName: 'fourwings-aggregate',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/fourwings-aggregate',
  preset: '../../jest.preset.ts',
}
