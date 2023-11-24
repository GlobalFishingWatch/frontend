/* eslint-disable */
export default {
  displayName: 'loaders',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/loaders',
  preset: '../../jest.preset.js',
}
