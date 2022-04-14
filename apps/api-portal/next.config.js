// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx')
// const CircularDependencyPlugin = require('circular-dependency-plugin')

// const { i18n } = require('./next-i18next.config')

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // experimental: {
  //   outputStandalone: true,
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
    return config
  },
  // experimental: {
  //   esmExternals: false,
  // },
  // productionBrowserSourceMaps: true,
  basePath:
    process.env.NEXT_PUBLIC_URL || (process.env.NODE_ENV === 'production' ? '/api-portal' : ''),
  productionBrowserSourceMaps:
    process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'development' ||
    process.env.NODE_ENV === 'development',
}

module.exports = withNx(nextConfig)
