/* eslint-disable */
export default {
  displayName: 'react-hooks',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/react-hooks',
  preset: '../../jest.preset.js',
}
