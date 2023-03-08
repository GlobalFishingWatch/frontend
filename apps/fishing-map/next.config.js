/* eslint-disable @typescript-eslint/no-var-requires */
const withNx = require('@nrwl/next/plugins/with-nx')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
// const CircularDependencyPlugin = require('circular-dependency-plugin')
const { join } = require('path')

// const { i18n } = require('./next-i18next.config')
const basePath =
  process.env.NEXT_PUBLIC_URL || (process.env.NODE_ENV === 'production' ? '/map' : '')

const IS_PRODUCTION =
  process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'production' || process.env.NODE_ENV === 'production'

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // analysis[areaId]=8381
  // analysis[bounds][0]=-32.898692458
  // analysis[bounds][1]=-23.877185253
  // analysis[bounds][2]=-25.294038966
  // analysis[bounds][3]=-17.11870414
  // analysis[sourceId]=context-layer-eez__eez-areas-eez-areas
  // analysis[dsId]=public-eez-areas
  async rewrites() {
    return [
      // Rewrite everything to `pages/index`
      {
        source: '/:any*',
        destination: '/',
      },
      // {
      //   source: '/:any*',
      //   destination: '/',
      // },
    ]
  },
  async redirects() {
    return [
      // Redirect everything in / root to basePath if defined
      {
        source: '/:any((?!report$).*)',
        destination: `${basePath}/fishing-activity/default-public/report/:datasetId`,
        basePath: false,
        permanent: false,
        has: [
          {
            type: 'query',
            key: 'analysis[dsId]',
            value: '(?<datasetId>.*)', // Named capture group to match anything on the value
          },
        ],
      },
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
  // i18n,
  basePath,
  productionBrowserSourceMaps: !IS_PRODUCTION,
  // to deploy on a node server
  output: 'standalone',
  outputFileTracing: true,
  experimental: {
    outputFileTracingRoot: join(__dirname, '../../'),
  },
  cleanDistDir: true,
  distDir: '.next',
}

module.exports = withBundleAnalyzer(withNx(nextConfig))
