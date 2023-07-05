const nrwlConfig = require('@nx/react/plugins/bundle-rollup')
const { wasm } = require('@rollup/plugin-wasm')

module.exports = (config) => {
  nrwlConfig(config)
  return {
    ...config,
    plugins: [...config.plugins, wasm()],
  }
}
