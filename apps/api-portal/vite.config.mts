/// <reference types='vitest' />
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import 'dotenv/config'

const basePath =
  import.meta.env?.PUBLIC_URL || (process.env.NODE_ENV === 'production' ? '/our-apis' : '')

export default defineConfig(({ command }) => ({
  devtools: command === 'serve',
  base: basePath,
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/api-portal',

  server: {
    port: 3000,
    host: 'localhost',
    forwardConsole: true,
  },

  preview: {
    port: 3001,
    host: 'localhost',
  },

  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
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
    outDir: '../../dist/apps/api-portal',
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
