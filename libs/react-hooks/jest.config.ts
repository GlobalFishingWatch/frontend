export default {
  displayName: 'react-hooks',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/react-hooks',
  preset: '../../jest.preset.js',
}
