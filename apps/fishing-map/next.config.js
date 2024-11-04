// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require('path')
const path = require('path')
const withNx = require('@nx/next/plugins/with-nx')
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: true, //process.env.ANALYZE === 'true' || process.env.NODE_ENV === 'development',
// })
const CircularDependencyPlugin = require('circular-dependency-plugin')

const basePath =
  process.env.NEXT_PUBLIC_URL || (process.env.NODE_ENV === 'production' ? '/map' : '')

const IS_PRODUCTION =
  process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'production' ||
  process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'staging' ||
  process.env.NODE_ENV === 'production'

/**
 * @param {{ experiments: any; optimization: { moduleIds: string; }; module: { rules: { test: RegExp; type: string; }[]; }; output: { webassemblyModuleFilename: string; }; }} config
 * @param {boolean} isServer
 */
function patchWasmModuleImport(config, isServer) {
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
/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/vessel/:vesselId/:any*',
        destination: '/vessel/:vesselId/:any*',
      },
      {
        source: '/:category/:workspace/vessel/:vesselId/:any*',
        destination: '/:category/:workspace/vessel/:vesselId/:any*',
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
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: true,
  },
  webpack: function (config, options) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
      fs: false,
      net: false,
      tls: false,
    }
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // ...(!IS_PRODUCTION && {
      //   jotai: path.resolve(__dirname, 'node_modules/jotai'),
      // }),
    }
    config.externals = [...config.externals, 'mapbox-gl']
    // config.optimization.minimize = false
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
  // productionBrowserSourceMaps: true,
  basePath,
  reactStrictMode: true,
  productionBrowserSourceMaps: !IS_PRODUCTION,
  // to deploy on a node server
  output: 'standalone',
  outputFileTracingRoot: join(__dirname, '../../'),
  experimental: {
    // reactCompiler: true,
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
  // pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  cleanDistDir: true,
  distDir: '.next',
}

// @ts-ignore
// const configWithNx = withNx(withBundleAnalyzer(nextConfig))
const configWithNx = withNx(nextConfig)

// @ts-ignore
module.exports = async (...args) => {
  return {
    ...(await configWithNx(...args)),
    //...
  }
}
