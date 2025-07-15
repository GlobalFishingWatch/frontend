import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import svgr from 'vite-plugin-svgr'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/apps/vessel-info-tool',
  build: {
    outDir: '../../dist/apps/vessel-info-tool',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    port: 3000,
  },
  define: {
    'process.env': {
      API_GATEWAY: process.env.API_GATEWAY,
      API_VERSION: process.env.API_VERSION,
    },
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({ customViteReactPlugin: true }),
    react(),
    nxViteTsPaths(),
    svgr({
      include: ['**/*.svg', '**/*.svg?react'],
    }),
    nxCopyAssetsPlugin(['*.md']),
  ],
})
