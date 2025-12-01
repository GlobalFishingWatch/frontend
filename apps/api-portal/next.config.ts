import { join } from 'path'

import withNx from '@nx/next/plugins/with-nx'
import CircularDependencyPlugin from 'circular-dependency-plugin'
import type { NextConfig } from 'next'

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: true, //process.env.ANALYZE === 'true' || process.env.NODE_ENV === 'development',
// })
const basePath = process.env.NEXT_PUBLIC_URL || '/api-portal'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  async redirects() {
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
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
      fs: false,
      net: false,
      tls: false,
    }
    // config.optimization.minimize = false

    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'))

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      }
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    config.plugins.push(
      new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /node_modules/,
        // add errors to webpack instead of warnings
        failOnError: false,
        // allow import cycles that include an asyncronous import,
        // e.g. via import(/* webpackMode: "weak" */ './file.js')
        allowAsyncCycles: true,
        // set the current working directory for displaying module paths
        cwd: process.cwd(),
      })
    )
    return config
  },
  // productionBrowserSourceMaps: true,
  basePath,
  reactStrictMode: true,
  productionBrowserSourceMaps: !IS_PRODUCTION,
  // to deploy on a node server
  output: 'standalone',
  outputFileTracingRoot: join(__dirname, '../../'),
  // devIndicators: {
  //   position: 'top-left',
  // },
  devIndicators: false,
  allowedDevOrigins: ['local.globalfishingwatch.org'],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  serverExternalPackages: ['@mastra/*'],
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
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
    // swcPlugins: [['@swc-jotai/react-refresh', {}]],
  },
  cleanDistDir: true,
  distDir: '.next',
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const configWithNx = withNx({ ...nextConfig, nx: { svgr: false } })
// const configWithNx = withNx(withBundleAnalyzer({ ...nextConfig, nx: { svgr: false } }))

module.exports = async (...args: any) => {
  const config = await configWithNx(...args)
  // Remove eslint option as it's no longer supported in Next.js 16
  const { eslint, ...restConfig } = config
  return {
    ...restConfig,
    //...
  }
}
