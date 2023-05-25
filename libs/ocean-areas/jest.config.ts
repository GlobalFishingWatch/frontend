/* eslint-disable */
export default {
  displayName: 'ocean-areas',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/ocean-areas',
  preset: '../../jest.preset.js',
}
