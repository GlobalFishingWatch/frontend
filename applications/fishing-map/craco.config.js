const CracoEsbuildPlugin = require('craco-esbuild')

module.exports = {
  webpack: {
    alias: {
      'mapbox-gl': '@globalfishingwatch/mapbox-gl',
    },
  },
  plugins: [
    {
      plugin: CracoEsbuildPlugin,
      options: {
        // includePaths: ['/external/dir/with/components'], // Optional. If you want to include components which are not in src folder
        enableSvgr: true,
        esbuildLoaderOptions: {
          loader: 'tsx',
          target: 'es2015',
        },
      },
    },
  ],
}
