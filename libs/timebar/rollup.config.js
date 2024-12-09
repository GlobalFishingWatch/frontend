/* eslint-disable @typescript-eslint/no-require-imports */
const nrwlConfig = require('@nx/react/plugins/bundle-rollup')
const svgr = require('@svgr/rollup')
const pkg = require('./package.json')

module.exports = (config) => {
  nrwlConfig(config)
  return {
    ...config,
    plugins: [...config.plugins, svgr()],
    external: Object.keys(pkg.dependencies || {}),
  }
}
