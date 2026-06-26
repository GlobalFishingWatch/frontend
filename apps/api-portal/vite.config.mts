/// <reference types='vitest' />
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineConfig, loadEnv } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import 'dotenv/config'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const basePath = env.PUBLIC_URL || (mode === 'production' ? '/api-portal' : '')

  return {
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
        PUBLIC_URL: env.PUBLIC_URL,
        API_GATEWAY: env.API_GATEWAY,
        GOOGLE_TAG_MANAGER_ID: env.GOOGLE_TAG_MANAGER_ID,
        GOOGLE_MEASUREMENT_ID: env.GOOGLE_MEASUREMENT_ID,
      },
    },
  }
})
