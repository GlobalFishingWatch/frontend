import { join } from 'path'

import withNx from '@nx/next/plugins/with-nx'
import { withSentryConfig } from '@sentry/nextjs'
import CircularDependencyPlugin from 'circular-dependency-plugin'
import type { NextConfig } from 'next'

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: true, //process.env.ANALYZE === 'true' || process.env.NODE_ENV === 'development',
// })

const basePath = process.env.NEXT_PUBLIC_URL || '/map'

const IS_PRODUCTION =
  process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'production' ||
  process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'staging' ||
  process.env.NODE_ENV === 'production'

function patchWasmModuleImport(
  config: {
    experiments: any
    optimization: { moduleIds: string }
    module: { rules: { test: RegExp; type: string }[] }
    output: { webassemblyModuleFilename: string }
  },
  isServer: boolean
) {
  config.experiments = Object.assign(config.experiments || {}, {
    asyncWebAssembly: true,
    // syncWebAssembly: true,
  })

  config.optimization.moduleIds = 'named'

  config.module.rules.push({
    test: /\.wasm$/,
    type: 'webassembly/async',
  })

  // TODO: improve this function -> track https://github.com/vercel/next.js/issues/25852
  if (isServer) {
    config.output.webassemblyModuleFilename = './../static/wasm/[modulehash].wasm'
  } else {
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm'
  }
}

const nextConfig: NextConfig = {
  transpilePackages: [
    '@globalfishingwatch/api-client',
    '@globalfishingwatch/api-types',
    '@globalfishingwatch/data-transforms',
    '@globalfishingwatch/datasets-client',
    '@globalfishingwatch/dataviews-client',
    '@globalfishingwatch/deck-layer-composer',
    '@globalfishingwatch/deck-layers',
    '@globalfishingwatch/deck-loaders',
    '@globalfishingwatch/i18n-labels',
    '@globalfishingwatch/ocean-areas',
    '@globalfishingwatch/pbf-decoders',
    '@globalfishingwatch/react-hooks',
    '@globalfishingwatch/responsive-visualizations',
    '@globalfishingwatch/timebar',
    '@globalfishingwatch/ui-components',
  ],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
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
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors https://* http://*',
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
    patchWasmModuleImport(config, options.isServer)
    return config
  },
  basePath,
  reactStrictMode: true,
  // Must be true in production for Sentry to find and upload client source maps
  productionBrowserSourceMaps: true,
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
  // reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: false,
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

const configWithSentry = withSentryConfig(configWithNx, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'global-fishing-watch',

  project: 'frontend',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Use runAfterProductionCompile so Next.js passes the actual distDir (works with Nx's
  // custom outputPath, e.g. dist/apps/fishing-map/.next). Ensures Sentry finds source maps.
  useRunAfterProductionCompileHook: true,

  // Delete source maps after uploading to Sentry (keeps them private)
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
})

module.exports = async (...args: any) => {
  const config = await configWithSentry(...args)
  // Remove eslint option as it's no longer supported in Next.js 16
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { eslint, ...restConfig } = config
  return {
    ...restConfig,
    //...
  }
}

export default module.exports
