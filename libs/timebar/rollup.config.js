const nrwlConfig = require('@nrwl/react/plugins/bundle-rollup')
const svgr = require('@svgr/rollup')

module.exports = (config) => {
  nrwlConfig(config)
  return {
    ...config,
    plugins: [...config.plugins, svgr()],
  }
}
