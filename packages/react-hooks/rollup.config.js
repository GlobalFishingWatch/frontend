const nrwlConfig = require('@nrwl/react/plugins/bundle-rollup')
const svgr = require('@svgr/rollup').default
const { peerDependencies } = require('./package.json')

module.exports = (config) => {
  nrwlConfig(config)
  return {
    ...config,
    inlineDynamicImports: true,
    plugins: [...config.plugins, svgr()],
    external: Object.keys(peerDependencies),
  }
}
