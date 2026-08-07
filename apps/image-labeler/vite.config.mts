/// <reference types='vitest' />
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig(({ command }) => ({
  devtools: command === 'serve' && !!process.env.VITE_DEVTOOLS,
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/image-labeler',

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

  resolve: {
    tsconfigPaths: true,
    alias: {
      jimp: new URL('../../node_modules/jimp/dist/esm/index.js', import.meta.url).pathname,
    },
  },

  build: {
    outDir: '../../dist/apps/image-labeler',
    reportCompressedSize: true,
  },
}))
