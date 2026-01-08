import { createRequire } from 'module'

import nrwlConfig from '@nx/react/plugins/bundle-rollup'
import svgr from '@svgr/rollup'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

export default (config) => {
  nrwlConfig(config)
  return {
    ...config,
    plugins: [...config.plugins, svgr()],
    external: Object.keys(pkg.dependencies || {}),
  }
}
