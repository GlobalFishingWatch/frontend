/// <reference types='vitest' />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/data-download-portal',

  server: {
    port: 3000,
    host: 'localhost',
  },

  preview: {
    port: 3001,
    host: 'localhost',
  },

  plugins: [
    react(),
    svgr(),
    nxViteTsPaths(),
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
    outDir: '../../dist/apps/data-download-portal',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  define: {
    'process.env': {},
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
  //     reportsDirectory: '../../coverage/apps/data-download-portal',
  //     provider: 'v8',
  //   },
  // },
})
