export default {
  displayName: 'features-aggregate',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/features-aggregate',
  preset: '../../jest.preset.js',
}
