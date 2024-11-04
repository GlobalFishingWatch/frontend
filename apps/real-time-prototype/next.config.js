/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require('path')
const withNx = require('@nx/next/plugins/with-nx')
// const CircularDependencyPlugin = require('circular-dependency-plugin')

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const basePath = IS_PRODUCTION ? '/map' : ''

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  async rewrites() {
    return [
      // Rewrite everything to `pages/index`
      {
        source: '/:any*',
        destination: '/',
      },
    ]
  },
  async redirects() {
    return [
      // Redirect everything in / root to basePath if defined
      ...(basePath !== ''
        ? [
            {
              source: '/',
              destination: basePath,
              basePath: false,
              permanent: false,
            },
          ]
        : []),
    ]
  },
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
  basePath,
  productionBrowserSourceMaps: !IS_PRODUCTION,
  // to deploy on a node server
  output: 'standalone',
  outputFileTracingRoot: join(__dirname, '../../'),
  experimental: {},
  cleanDistDir: true,
  distDir: '.next',
}

const configWithNx = withNx(nextConfig)
module.exports = async (...args) => {
  return {
    ...(await configWithNx(...args)),
    //...
  }
}
