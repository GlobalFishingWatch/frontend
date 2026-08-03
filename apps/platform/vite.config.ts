import { sentryTanstackStart } from '@sentry/tanstackstart-react/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

export const basePath =
  import.meta.env?.VITE_PUBLIC_URL || process.env.VITE_PUBLIC_URL || '/platform'

const LOCALE_JSON_CACHE_HEADERS = {
  'cache-control': 'public, max-age=31536000, immutable',
} as const

const IMAGE_CACHE_HEADERS = {
  'cache-control': 'public, max-age=31536000, stale-while-revalidate=604800',
} as const

const NO_CACHE_HEADERS = {
  'cache-control': 'no-store',
} as const

function staticRouteRules(basePath: string, mode: string) {
  const headers = mode === 'production' ? LOCALE_JSON_CACHE_HEADERS : NO_CACHE_HEADERS
  const imageHeaders = mode === 'production' ? IMAGE_CACHE_HEADERS : NO_CACHE_HEADERS
  return {
    '/locales/**': { headers },
    [`${basePath}/locales/**`]: { headers },
    '/images/**': { headers: imageHeaders },
    [`${basePath}/images/**`]: { headers: imageHeaders },
  }
}

export const plugins = [
  tanstackStart({
    srcDirectory: '.',
    router: {
      routesDirectory: 'routes',
      generatedRouteTree: 'routes/routeTree.gen.ts',
      routeFileIgnorePattern: 'routeTree\\.gen',
      basepath: basePath,
    },
    spa: {
      enabled: false,
    },
  }),
  react(),
  svgr({
    include: ['**/*.svg?react'],
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
      dedupe: ['jotai'],
    },
    server: {
      // Dev resolves libs through their `development` export condition (src), so the d.ts/js
      // that `types-watch` keeps re-emitting into libs/*/dist is irrelevant here
      watch: {
        ignored: ['**/libs/*/dist/**', '**/libs/*/src/**/*.gen.*'],
      },
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
          routeRules: staticRouteRules(basePath, mode),
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
          // .git excluded from Docker build context (.dockerignore)
          release: { name: env.COMMIT_SHA, setCommits: false },
        }),
    ],
    envPrefix: ['VITE_', 'i18n_'],
    define: {
      __BUILD_ID__: JSON.stringify(
        process.env.BUILD_ID || process.env.GITHUB_SHA?.slice(0, 12) || String(Date.now())
      ),
    },
    environments: {
      client: {
        build: {
          chunkSizeWarningLimit: 1500,
          rolldownOptions: {
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
                  id.includes('/apps/platform/assets/icons/')
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
        build: {
          rolldownOptions: {
            input: './server.ts',
          },
        },
      },
    },
    ssr: {
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
        // Keep i18next's classes on Node's native require cache so unrelated lib program
        // reloads (e.g. editing api-client) don't tear down/rebuild them mid-request and
        // desync an already-constructed instance from the freshly reloaded prototype.
        'i18next',
        'react-i18next',
      ],
    },
  }
})
