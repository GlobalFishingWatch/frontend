 
const withNx = require('@nx/next/plugins/with-nx')
// const CircularDependencyPlugin = require('circular-dependency-plugin')

const IS_PRODUCTION =
  process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'production' || process.env.NODE_ENV === 'production'

const BASE_PATH = process.env.NEXT_PUBLIC_URL || IS_PRODUCTION ? '/data-explorer' : ''

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  output: 'export',
  distDir: 'exported',
  // async rewrites() {
  //   return [
  //     // Rewrite everything to `pages/index`
  //     {
  //       source: '/:any*',
  //       destination: '/',
  //     },
  //   ]
  // },
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: true,
  },
  webpack: function (config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
      fs: false,
      net: false,
      tls: false,
    }
    config.externals = [...config.externals, 'mapbox-gl']
    // config.optimization.minimize = false
    // config.plugins.push(
    //   new CircularDependencyPlugin({
    //     // exclude detection of files based on a RegExp
    //     exclude: /node_modules/,
    //     // add errors to webpack instead of warnings
    //     failOnError: true,
    //     // allow import cycles that include an asyncronous import,
    //     // e.g. via import(/* webpackMode: "weak" */ './file.js')
    //     allowAsyncCycles: true,
    //     // set the current working directory for displaying module paths
    //     cwd: process.cwd(),
    //   })
    // )
    return config
  },
  // productionBrowserSourceMaps: true,
  ...(BASE_PATH && { basePath: BASE_PATH }),
  // productionBrowserSourceMaps: !IS_PRODUCTION,
  experimental: {},
}

const configWithNx = withNx(nextConfig)
module.exports = async (...args) => {
  return {
    ...(await configWithNx(...args)),
    //...
  }
}
