 
export default {
  displayName: 'vessel-history',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '^@globalfishingwatch/(api-client/?.*)$': '<rootDir>/../../libs/$1/src/index.ts',
    '^@globalfishingwatch/(api-types/?.*)$$': '<rootDir>/../../libs/$1/src/index.ts',
    '^@globalfishingwatch/(data-transforms/?.*)$$': '<rootDir>/../../libs/$1/src/index.ts',
    '^@globalfishingwatch/(dataviews-client/?.*)$$': '<rootDir>/../../libs/$1/src/index.ts',
    '^@globalfishingwatch/(fourwings-aggregate/?.*)$$': '<rootDir>/../../libs/$1/src/index.ts',
    '^@globalfishingwatch/(i18n-labels/?.*)$$': '<rootDir>/../../libs/$1/src/index.ts',
    '^@globalfishingwatch/(layer-composer/?.*)$$': '<rootDir>/../../libs/$1/src/index.ts',
    '^@globalfishingwatch/(ocean-areas/?.*)$$': '<rootDir>/../../libs/$1/src/index.ts',
    '^@globalfishingwatch/(pbf/?.*)$$': '<rootDir>/../../libs/$1/src/index.ts',
    '^@globalfishingwatch/(react-hooks/?.*)$$': '<rootDir>/../../libs/$1/src/index.ts',
    '^@globalfishingwatch/(timebar/?.*)$$': '<rootDir>/../../libs/$1/src/index.ts',
    '^@globalfishingwatch/(ui-components/?.*)$$': '<rootDir>/../../libs/$1/src/index.ts',
  },
  coverageDirectory: '../../coverage/apps/vessel-history',
  transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
  preset: '../../jest.preset.js',
}
