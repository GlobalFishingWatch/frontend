import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { sentryTanstackStart } from '@sentry/tanstackstart-react/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

export const basePath = import.meta.env?.VITE_PUBLIC_URL || process.env.VITE_PUBLIC_URL || '/map'

export const plugins = [
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
]

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    root: __dirname,
    base: basePath,
    devtools: command === 'serve',
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      port: 3003,
      strictPort: true,
      allowedHosts: ['local.globalfishingwatch.org'],
    },
    plugins: [
      ...plugins,
      command === 'build' &&
        nitro({
          baseURL: basePath,
          sourcemap: true,
          compressPublicAssets: {
            gzip: true,
            brotli: true,
          },
          rollupConfig: {
            // Only Node.js built-ins — npm packages cannot be external because the
            // production Docker image copies only .output/ with no node_modules.
            external: ['assert', 'fsevents', 'chokidar', /^@vitejs\//, '@opentelemetry/api-logs'],
            output: {
              // Prevents Rolldown from reordering inlined SSR chunks in a way that places
              // __exportAll() calls before the var declaration runs.
              // Track: https://github.com/vitejs/vite/issues/22291
              //        https://github.com/rolldown/rolldown/issues/9441
              hoistTransitiveImports: false,
            },
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
      !!process.env.CI &&
        !!env.SENTRY_AUTH_TOKEN &&
        sentryTanstackStart({
          org: 'global-fishing-watch',
          project: 'frontend',
          authToken: env.SENTRY_AUTH_TOKEN,
          telemetry: false,
        }),
    ],
    envPrefix: ['VITE_', 'i18n_'],
    environments: {
      client: {
        build: {
          chunkSizeWarningLimit: 1500,
          rollupOptions: {
            output: {
              // Prevents Rolldown from reordering inlined chunks in a way that places
              // __exportAll() calls before the var declaration runs (e.g. recharts' YAxis
              // chunk throwing "t is not a function" at module init). Same fix as the SSR output.
              // Track: https://github.com/vitejs/vite/issues/22291
              //        https://github.com/rolldown/rolldown/issues/9441
              hoistTransitiveImports: false,
              // Ensures CJS-heavy chunks (recharts → es-toolkit/compat) execute in import order.
              // Track: https://github.com/rolldown/rolldown/issues/8803
              strictExecutionOrder: true,
              manualChunks(id) {
                if (
                  id.includes('/libs/timebar/src/icons/') ||
                  id.includes('/apps/fishing-map/assets/icons/')
                ) {
                  return 'icons-bundle'
                }
                if (
                  id.includes('/node_modules/@reduxjs/') ||
                  id.includes('/node_modules/redux/') ||
                  id.includes('/node_modules/react-redux/') ||
                  id.includes('/node_modules/immer/') ||
                  id.includes('/node_modules/reselect/')
                ) {
                  return 'vendor-redux'
                }
                if (
                  id.includes('/node_modules/es-toolkit/compat/') ||
                  id.includes('/node_modules/es-toolkit/')
                ) {
                  return 'vendor-es-toolkit'
                }
                if (id.includes('/node_modules/jsts/')) {
                  return 'vendor-jsts'
                }
              },
            },
          },
        },
      },
      ssr: {
        build: { rollupOptions: { input: './server.ts' } },
      },
    },
    ssr: {
      noExternal: ['@mastra/core', '@mastra/client-js'],
      // Prevent browser-only packages from being bundled into the SSR output.
      external: [
        '@deck.gl-community/editable-layers',
        '@deck.gl/core',
        '@deck.gl/extensions',
        '@deck.gl/geo-layers',
        '@deck.gl/layers',
        '@deck.gl/mesh-layers',
        '@deck.gl/react',
        'papaparse',
      ],
    },
  }
})
