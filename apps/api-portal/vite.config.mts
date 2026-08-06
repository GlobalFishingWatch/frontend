/// <reference types='vitest' />
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineConfig, loadEnv } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import 'dotenv/config'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, import.meta.dirname, '')
  const basePath = env.PUBLIC_URL || (mode === 'production' ? '/api-portal' : '')

  return {
    devtools: command === 'serve',
    base: basePath,
    root: import.meta.dirname,
    cacheDir: '../../node_modules/.vite/apps/api-portal',
    resolve: { tsconfigPaths: true },

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
        VITE_API_GATEWAY: env.VITE_API_GATEWAY,
        VITE_GOOGLE_TAG_MANAGER_ID: env.VITE_GOOGLE_TAG_MANAGER_ID,
        VITE_GOOGLE_MEASUREMENT_ID: env.VITE_GOOGLE_MEASUREMENT_ID,
      },
    },
  }
})
