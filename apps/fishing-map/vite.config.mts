import svgr from 'vite-plugin-svgr'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nitro } from 'nitro/vite'
import { visualizer } from 'rollup-plugin-visualizer'

const basePath = import.meta.env?.VITE_PUBLIC_URL || process.env.VITE_PUBLIC_URL || '/map'

export default defineConfig(({ command }) => ({
  root: __dirname,
  base: basePath,
  devtools: command === 'serve',
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3003,
    strictPort: true,
  },
  plugins: [
    nxViteTsPaths(),
    tanstackStart({
      srcDirectory: '.',
      router: {
        routesDirectory: 'routes',
        basepath: basePath,
      },
      spa: {
        enabled: false,
      },
    }),
    react(),
    svgr({
      include: ['**/*.svg', '**/*.svg?react'],
    }),
    command === 'build' &&
      nitro({
        baseURL: basePath,
        rollupConfig: {
          external: ['assert', 'fsevents', 'chokidar', /^@vitejs\//, '@opentelemetry/api-logs'],
        },
      }),
    process.env.ANALYZE === 'true' &&
      visualizer({
        // Written to the app root so it's easy to open after the build
        filename: 'bundle-analysis.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),
  ],
  envPrefix: ['VITE_', 'i18n_'],
  environments: {
    ssr: { build: { rollupOptions: { input: './server.ts' } } },
  },
  ssr: {
    noExternal: ['@mastra/core', '@mastra/client-js'],
    // Prevent browser-only packages from being bundled into the SSR output.
    external: [
      'html2canvas',
      '@deck.gl/core',
      '@deck.gl/layers',
      '@deck.gl/extensions',
      '@deck.gl/geo-layers',
      '@deck.gl/react',
      '@deck.gl/mesh-layers',
    ],
  },
}))
