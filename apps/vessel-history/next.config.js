// eslint-disable-next-line @typescript-eslint/no-var-requires
const { cwd } = require('process')
const { join } = require('path')
const withNx = require('@nx/next/plugins/with-nx')
const withPWAConstructor = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const getStaticPrecacheEntries = require('./utils/staticprecache')

// const { i18n } = require('./next-i18next.config')
const basePath =
  process.env.NEXT_PUBLIC_URL || (process.env.NODE_ENV === 'production' ? '/vessel-viewer' : '')

const IS_PRODUCTION =
  process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'production' ||
  process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'staging' ||
  process.env.NODE_ENV === 'production'

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
    // Redirect everything in / root to basePath if defined
    return basePath !== ''
      ? [
          {
            source: '/',
            destination: basePath,
            basePath: false,
            permanent: false,
          },
        ]
      : []
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-robots-tag',
            value: 'noindex',
          },
        ],
      },
    ]
  },
  webpack: function (config, options) {
    if (!options.isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        net: false,
        tls: false,
      }
    }
    // config.optimization.minimize = false
    // config.externals = [...config.externals, 'mapbox-gl']
    config.module.rules.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    })
    return config
  },
  transpilePackages: ['d3-geo', 'lodash-es'],
  basePath,
  reactStrictMode: true,
  productionBrowserSourceMaps: !IS_PRODUCTION,
  // to deploy on a node server
  output: 'standalone',
  outputFileTracingRoot: join(__dirname, '../../'),
  experimental: {
    esmExternals: true,
    optimizePackageImports: [
      '@globalfishingwatch/api-client',
      '@globalfishingwatch/api-types',
      '@globalfishingwatch/data-transforms',
      '@globalfishingwatch/datasets-client',
      '@globalfishingwatch/dataviews-client',
      '@globalfishingwatch/deck-layer-composer',
      '@globalfishingwatch/deck-layers',
      '@globalfishingwatch/deck-loaders',
      '@globalfishingwatch/ocean-areas',
      '@globalfishingwatch/pbf-decoders',
      '@globalfishingwatch/react-hooks',
      '@globalfishingwatch/timebar',
      '@globalfishingwatch/ui-components',
    ],
  },
  cleanDistDir: true,
  distDir: '.next',
}

const withPWA = withPWAConstructor({
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
})
const configWithNx = withNx(nextConfig)

module.exports = async (...args) => {
  return {
    ...withPWA(await configWithNx(...args)),
  }
}
