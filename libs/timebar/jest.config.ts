/* eslint-disable */
export default {
  displayName: 'timebar',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/timebar',
  preset: '../../jest.preset.js',
}
