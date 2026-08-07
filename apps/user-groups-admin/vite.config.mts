/// <reference types='vitest' />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ command }) => ({
  devtools: command === 'serve' && !!process.env.VITE_DEVTOOLS,
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/user-groups-admin',
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
      ],
    }),
  ],

  build: {
    outDir: '../../dist/apps/user-groups-admin',
    reportCompressedSize: true,
  },
}))
