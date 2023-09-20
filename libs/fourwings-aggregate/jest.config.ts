/* eslint-disable */
export default {
  displayName: 'fourwings-aggregate',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/fourwings-aggregate',
  preset: '../../jest.preset.js',
}
