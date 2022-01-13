// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx')
// const CircularDependencyPlugin = require('circular-dependency-plugin')

// const { i18n } = require('./next-i18next.config')

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
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
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: true,
  },
  webpack: function (config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'mapbox-gl': '@globalfishingwatch/maplibre-gl',
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
      fs: false,
      net: false,
      tls: false,
    }
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
  // i18n,
  // i18n,
  basePath: process.env.NEXT_PUBLIC_URL || (process.env.NODE_ENV === 'production' ? '/map' : ''),
  productionBrowserSourceMaps:
    process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'development' ||
    process.env.NODE_ENV === 'development',
}

module.exports = withNx(nextConfig)
