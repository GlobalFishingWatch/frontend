/* eslint-disable */
export default {
  displayName: 'datasets-client',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/datasets-client',
  preset: '../../jest.preset.js',
}
