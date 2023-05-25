/* eslint-disable */
export default {
  displayName: 'api-types',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/api-types',
  preset: '../../jest.preset.js',
}
