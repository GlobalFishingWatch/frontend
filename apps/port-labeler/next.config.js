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

    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'))
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      }
    )
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
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

const configWithNx = withNx({ ...nextConfig, nx: { svgr: false } })

export default async (...args) => {
  return {
    ...(await configWithNx(...args)),
  }
}
