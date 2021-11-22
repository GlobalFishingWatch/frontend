// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPlugins = require('next-compose-plugins')
const withNx = require('@nrwl/next/plugins/with-nx')
const withWorkbox = require('next-with-workbox')

// const { i18n } = require('./next-i18next.config')

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
  webpack: function (config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'mapbox-gl': '@globalfishingwatch/mapbox-gl',
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
      fs: false,
      net: false,
      tls: false,
    }
    return config
  },

  // i18n,
  productionBrowserSourceMaps: process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'development',
}

module.exports = withPlugins(
  [
    [
      withNx,
      {
        nx: {
          // Set this to true if you would like to to use SVGR
          // See: https://github.com/gregberge/svgr
          svgr: true,
        },
      },
    ],
    [
      withWorkbox,
      {
        workbox: {
          swSrc: 'offline/service-worker.ts',
          // .
          // ..
          // ... any workbox-webpack-plugin.GenerateSW option
        },
      },
    ],
  ],
  nextConfig
)
