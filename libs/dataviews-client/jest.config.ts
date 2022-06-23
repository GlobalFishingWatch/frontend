export default {
  displayName: 'dataviews-client',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/dataviews-client',
  preset: '../../jest.preset.js',
}
