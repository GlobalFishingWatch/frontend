/* eslint-disable */
export default {
  displayName: 'layer-composer',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/layer-composer',
  preset: '../../jest.preset.js',
}
