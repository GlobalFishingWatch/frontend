import rootConfig from '../../eslint.config.js'

export default [
  {
    ignores: ['.nitro/**', 'dist/**', 'coverage/**'],
  },
  ...rootConfig,
  // Disable @nx/dependency-checks for fishing-map package.json
  {
    files: ['package.json'],
    rules: {
      '@nx/dependency-checks': 'off',
    },
  },
]
