/// <reference types='vitest' />
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

const basePath =
  process.env.PUBLIC_URL || (process.env.NODE_ENV === 'production' ? '/data-download' : '')

export default defineConfig(({ command }) => ({
  devtools: command === 'serve' && !!process.env.VITE_DEVTOOLS,
  base: basePath,
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/data-download-portal',
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
    outDir: '../../dist/apps/data-download-portal',
    reportCompressedSize: true,
  },
}))
