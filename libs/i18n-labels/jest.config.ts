/* eslint-disable */
export default {
  displayName: 'i18n-labels',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/i18n-labels',
  preset: '../../jest.preset.js',
}
