import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsConfigPaths from 'vite-tsconfig-paths'

import { pluginSSRCssModuleFix } from '../../config/vite.plugins'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/apps/vessel-info-tool',
  build: {
    outDir: '../../dist/apps/vessel-info-tool',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: ['exceljs'],
    },
  },
  server: {
    host: true,
    port: 3000,
    allowedHosts: ['local.globalfishingwatch.org'],
  },
  // define: {
  //   'process.env': {
  //     API_GATEWAY: process.env.API_GATEWAY,
  //     API_VERSION: process.env.API_VERSION,
  //   },
  // },
  plugins: [
    tanstackStart(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    nxViteTsPaths(),
    tailwindcss(),
    svgr({
      include: ['**/*.svg', '**/*.svg?react'],
    }),
    nxCopyAssetsPlugin(['*.md']),
    pluginSSRCssModuleFix(),
  ],
})
