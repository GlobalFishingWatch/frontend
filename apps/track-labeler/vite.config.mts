import path from 'path'
// import { defineConfig } from 'vitest/config'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   test: {
//     globals: true,
//     environment: 'jsdom',
//     setupFiles: ['./src/setupTests.ts'],
//     coverage: {
//       provider: 'v8',
//       reporter: ['text', 'json', 'html'],
//     },
//     include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
//   },
//   resolve: {
//     alias: {
//       'src': path.resolve(__dirname, './src'),
//       // Add other aliases matching vite.config.ts
//     }
//   }
// }) 


/// <reference types='vitest' />
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import 'dotenv/config'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/image-labeler',

  server: {
    port: 3000,
    host: 'localhost',
  },

  preview: {
    port: 3001,
    host: 'localhost',
  },

  // resolve: {
  //   alias: {
  //     'src': path.resolve(__dirname, './src'),
  //     'assets': path.resolve(__dirname, './src/assets'),
  //     'components': path.resolve(__dirname, './src/components'),
  //     'features': path.resolve(__dirname, './src/features'),
  //     'types': path.resolve(__dirname, './src/types'),
  //     'utils': path.resolve(__dirname, './src/utils'),
  //     'data': path.resolve(__dirname, './src/data'),
  //     'routes': path.resolve(__dirname, './src/routes'),
  //   }
  // },

  plugins: [
    react(),
    svgr({
      svgrOptions: { exportType: 'default', ref: true, svgo: false, titleProp: true },
      include: '**/*.svg',
    }),
    nxViteTsPaths(),
    TanStackRouterVite({
      routesDirectory: './apps/image-labeler/src/routes',
      generatedRouteTree: './apps/image-labeler/src/routeTree.gen.ts',
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'nginx.conf',
          dest: '',
        },
        {
          src: '../../config/entrypoint.sh',
          dest: '',
        },
      ],
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../dist/apps/image-labeler',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  define: {
    'process.env': {
      API_GATEWAY: process.env.API_GATEWAY,
    },
  },

  // test: {
  //   globals: true,
  //   cache: {
  //     dir: '../../node_modules/.vitest',
  //   },
  //   environment: 'jsdom',
  //   include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

  //   reporters: ['default'],
  //   coverage: {
  //     reportsDirectory: '../../coverage/apps/image-labeler',
  //     provider: 'v8',
  //   },
  // },
})
