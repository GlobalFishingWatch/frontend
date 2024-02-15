const nrwlConfig = require('@nx/react/plugins/bundle-rollup')

module.exports = (config) => {
  nrwlConfig(config)
  return {
    ...config,
    input: ['libs/deck-loaders/src/fourwings/workers/fourwings-worker.ts'],
    plugins: [...config.plugins],
    output: {
      dir: 'dist/libs/deck-loaders/fourwings',
      format: 'cjs',
    },
  }
}
