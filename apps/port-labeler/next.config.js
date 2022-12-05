// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require('path')
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
    return config
  },
  // productionBrowserSourceMaps: true,
  basePath:
    process.env.NEXT_PUBLIC_URL || (process.env.NODE_ENV === 'production' ? '/port-labeler' : ''),
  productionBrowserSourceMaps:
    process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'development' ||
    process.env.NODE_ENV === 'development',

  // to deploy on a node server
  output: 'standalone',
  outputFileTracing: true,
  experimental: {
    outputFileTracingRoot: join(__dirname, '../../'),
  },
  cleanDistDir: true,
  distDir: '.next',
}

module.exports = withNx(nextConfig)
