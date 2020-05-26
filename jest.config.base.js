module.exports = {
  // roots: ['<rootDir>/src', '<rootDir>/tests'],
  transform: { '.(ts|tsx)': 'ts-jest' },
  // testRegex: '(.*.(test|spec)).(jsx?|tsx?|ts?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  verbose: true,
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },
}
