/* eslint-disable */
export default {
  displayName: 'deck-layers',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/deck-layers',
  preset: '../../jest.preset.js',
}
