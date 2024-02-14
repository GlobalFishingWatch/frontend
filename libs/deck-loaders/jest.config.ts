/* eslint-disable */
export default {
  displayName: 'deck-loaders',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/deck-loaders',
  preset: '../../jest.preset.js',
}
