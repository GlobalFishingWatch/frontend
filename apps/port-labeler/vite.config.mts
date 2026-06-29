/// <reference types='vitest' />
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import 'dotenv/config'

const basePath =
  process.env.PUBLIC_URL || (process.env.NODE_ENV === 'production' ? '/port-labeler' : '')

export default defineConfig(({ command }) => ({
  devtools: command === 'serve',
  base: basePath,
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/port-labeler',

  server: {
    port: 3000,
    host: 'localhost',
    forwardConsole: true,
  },

  preview: {
    port: 3001,
    host: 'localhost',
  },

  resolve: {
    alias: {
      'mapbox-gl': 'maplibre-gl',
    },
  },

  plugins: [
    react(),
    svgr({
      include: ['**/*.svg', '**/*.svg?react'],
    }),
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

  build: {
    outDir: '../../dist/apps/port-labeler',
    reportCompressedSize: true,
  },

  define: {
    'process.env': {
      PUBLIC_URL: process.env.PUBLIC_URL,
      API_GATEWAY: process.env.API_GATEWAY,
      GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
      GOOGLE_MEASUREMENT_ID: process.env.GOOGLE_MEASUREMENT_ID,
    },
  },
}))
