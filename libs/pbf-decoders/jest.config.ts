/* eslint-disable */
export default {
  displayName: 'pbf-decoders',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/pbf-decoders',
  preset: '../../jest.preset.js',
}
