export default {
  displayName: 'layer-composer',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/layer-composer',
  preset: '../../jest.preset.js',
}
