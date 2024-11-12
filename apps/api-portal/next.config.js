// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require('path')
const withNx = require('@nx/next/plugins/with-nx')
// const CircularDependencyPlugin = require('circular-dependency-plugin')

const basePath =
  process.env.NEXT_PUBLIC_URL || (process.env.NODE_ENV === 'production' ? '/api-portal' : '')

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
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
    return config
  },
  // experimental: {
  //   esmExternals: false,
  // },
  // productionBrowserSourceMaps: true,
  basePath,
  productionBrowserSourceMaps:
    process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'development' ||
    process.env.NODE_ENV === 'development',

  // to deploy on a node server
  output: 'standalone',
  outputFileTracingRoot: join(__dirname, '../../'),
  experimental: {},
  cleanDistDir: true,
  distDir: '.next',
}

module.exports = withNx(nextConfig)
