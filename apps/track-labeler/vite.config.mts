/// <reference types='vitest' />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ command }) => ({
  devtools: command === 'serve' && !!process.env.VITE_DEVTOOLS,
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/track-labeler',
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
        {
          src: './src/assets/**/*',
          dest: 'assets',
        },
      ],
    }),
  ],

  build: {
    outDir: '../../dist/apps/track-labeler',
    reportCompressedSize: true,
  },
}))
