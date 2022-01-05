// eslint-disable-next-line @typescript-eslint/no-var-requires
const { cwd } = require('process')
const withPlugins = require('next-compose-plugins')
const withNx = require('@nrwl/next/plugins/with-nx')
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const getStaticPrecacheEntries = require('./utils/staticprecache')

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
  basePath:
    process.env.NEXT_PUBLIC_URL || (process.env.NODE_ENV === 'production' ? '/vessel-viewer' : ''),
  productionBrowserSourceMaps:
    process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'development' ||
    process.env.NODE_ENV === 'development',
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
      withPWA,
      {
        pwa: {
          // disable: process.env.NODE_ENV === 'development',
          // register: true,
          dest: 'public',
          // customWorkerDir: 'offline',
          buildExcludes: [/middleware-manifest.json$/],
          runtimeCaching,
          scope: '/vessel-viewer',
          additionalManifestEntries: [
            ...getStaticPrecacheEntries({
              ...nextConfig,
              // exclude icon-related files from the precache since they are platform specific
              // note: no need to pass publicExcludes to next-pwa, it's not used for anything else
              publicExcludes: ['!*.png', '!*.ico', '!browserconfig.xml'],
              // set the public folder path
              publicPath: `${cwd()}/apps/vessel-history/public`,
            }),
          ],
          // dynamicStartUrl: true,
          // scope: '/vessel-viewer',
          // sw: 'sw.js',
          //...
        },
        workbox: {
          // swSrc: 'offline/service-worker.ts',
          //   // .
          //   // ..
          //   // ... any workbox-webpack-plugin.GenerateSW option
        },
      },
    ],
  ],
  nextConfig
)
