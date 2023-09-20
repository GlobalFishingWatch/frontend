/* eslint-disable */
export default {
  displayName: 'ui-components',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/ui-components',
  preset: '../../jest.preset.js',
}
