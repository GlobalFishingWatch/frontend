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
      'mapbox-gl': '@globalfishingwatch/maplibre-gl',
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
          // next-pwa Configuration
          // see https://github.com/shadowwalker/next-pwa#configuration for more details
          dest: 'public',
          buildExcludes: [/middleware-manifest.json$/],
          runtimeCaching,
          scope: '/vessel-viewer',

          // Given that next-pwa only looks inside the public folder (relative path), when compiling from a
          // different working directory other than the apps, the files are not found and not precached.
          // So we need to build the list of compiled files to include and pass it to next-pwa
          // (https://dev.to/sfiquet/precaching-pages-with-next-pwa-31f2)
          additionalManifestEntries: [
            ...getStaticPrecacheEntries({
              ...nextConfig,
              // exclude icon-related files from the precache since they are platform specific
              // note: no need to pass publicExcludes to next-pwa, it's not used for anything else
              publicExcludes: ['!*.png', '!*.ico', '!browserconfig.xml'],
              // set the public folder path (Very Important, otherwise it does not include
              // static files to precache)
              publicPath: `${cwd()}/apps/vessel-history/public`,
            }),
          ],
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
