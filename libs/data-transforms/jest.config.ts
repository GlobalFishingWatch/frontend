/* eslint-disable */
export default {
  displayName: 'data-transforms',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/data-transforms',
  preset: '../../jest.preset.js',
}
