/* eslint-disable */
export default {
  displayName: 'dataviews-client',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/dataviews-client',
  preset: '../../jest.preset.js',
}
