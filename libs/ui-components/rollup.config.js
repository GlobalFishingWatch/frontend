/* eslint-disable @typescript-eslint/no-require-imports */
const nrwlConfig = require('@nx/react/plugins/bundle-rollup')
const svgr = require('@svgr/rollup')
const dynamicImportVars = require('@rollup/plugin-dynamic-import-vars')
const pkg = require('./package.json')

module.exports = (config) => {
  nrwlConfig(config)
  return {
    ...config,
    plugins: [...config.plugins, svgr(), dynamicImportVars()],
    external: Object.keys(pkg.dependencies || {}),
  }
}
