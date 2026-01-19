import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import withNx from '@nx/next/plugins/with-nx.js'
import process from 'node:process'

const __dirname = dirname(fileURLToPath(import.meta.url))

const basePath =
  process.env.NEXT_PUBLIC_URL || (process.env.NODE_ENV === 'production' ? '/port-labeler' : '')

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
    config.resolve.alias = {
      ...config.resolve.alias,
      'mapbox-gl': 'maplibre-gl',
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
  basePath,
  productionBrowserSourceMaps:
    process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'development' ||
    process.env.NODE_ENV === 'development',
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
