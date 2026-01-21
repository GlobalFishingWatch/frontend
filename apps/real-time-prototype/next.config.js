import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import withNx from '@nx/next/plugins/with-nx.js'
import process from 'node:process'

const __dirname = dirname(fileURLToPath(import.meta.url))

const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const basePath = IS_PRODUCTION ? '/map' : ''

/** @type {import('@nx/next/plugins/with-nx').WithNxOptions} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ]
  },
  async redirects() {
    return [
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
  nx: {},
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
      fs: false,
      net: false,
      tls: false,
    }
    return config
  },
  basePath,
  productionBrowserSourceMaps: !IS_PRODUCTION,
  output: 'standalone',
  outputFileTracingRoot: join(__dirname, '../../'),
  experimental: {},
  cleanDistDir: true,
  distDir: '.next',
}

const configWithNx = withNx(nextConfig)

export default async (...args) => {
  return {
    ...(await configWithNx(...args)),
  }
}
