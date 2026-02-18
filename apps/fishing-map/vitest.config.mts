import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { IncomingMessage, ServerResponse } from 'http'
import path from 'path'
import type { Connect, Plugin, PreviewServer, ViteDevServer } from 'vite'
import { defineConfig } from 'vitest/config'

// Plugin to transform SVG imports for testing
const svgMockPlugin = (): Plugin => ({
  name: 'svg-mock',
  transform(_code: string, id: string) {
    if (id.endsWith('.svg')) {
      return {
        code: 'export default () => null',
        map: null,
      }
    }
  },
})

// Plugin to serve public assets from /map path, this is needed because not having events-color-sprite.png causes timebar to throw an error an not load any events
const publicAssetsPlugin = (): Plugin => ({
  name: 'public-assets',
  configureServer(server: ViteDevServer) {
    server.middlewares.use(
      (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        if (req.url?.startsWith('/map/')) {
          req.url = req.url.replace('/map/', '/')
        }
        next()
      }
    )
  },
  configurePreviewServer(server: PreviewServer) {
    server.middlewares.use(
      (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        if (req.url?.startsWith('/map/')) {
          req.url = req.url.replace('/map/', '/')
        }
        next()
      }
    )
  },
})

export default defineConfig({
  root: '.',
  cacheDir: '../../node_modules/.vite/apps/fishing-map',
  plugins: [react(), nxViteTsPaths(), svgMockPlugin(), publicAssetsPlugin()],
  resolve: {
    alias: {
      data: path.resolve(__dirname, './data'),
      features: path.resolve(__dirname, './features'),
      routes: path.resolve(__dirname, './routes'),
      services: path.resolve(__dirname, './services'),
      utils: path.resolve(__dirname, './utils'),
      'data/config': path.resolve(__dirname, './data/config'),
      types: path.resolve(__dirname, './types'),
      queries: path.resolve(__dirname, './queries'),
      middlewares: path.resolve(__dirname, './middlewares'),
      store: path.resolve(__dirname, './store'),
      appTestUtils: path.resolve(__dirname, './appTestUtils'),
      test: path.resolve(__dirname, './test'),
      hooks: path.resolve(__dirname, './hooks'),
    },
  },

  define: {
    'process.env.NEXT_PUBLIC_API_GATEWAY': JSON.stringify(process.env.NEXT_PUBLIC_API_GATEWAY),
    'process.env.NODE_ENV': JSON.stringify('test'),
    'process.env.VITEST': JSON.stringify('true'),
  },
  test: {
    watch: false,
    include: [
      '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'vitest-example/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      '/apps/fishing-map/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    fileParallelism: false,
    reporters: ['default'],
    coverage: {
      reportsDirectory: 'test/coverage/apps/fishing-map',
      provider: 'istanbul',
    },
    testTimeout: 30000,
    setupFiles: './test/vitest.setup.ts',
    browser: {
      enabled: true,
      provider: playwright(),
      trace: {
        screenshots: true,
        snapshots: true,
        mode: 'on',
      },
      instances: [
        {
          browser: 'chromium',
          name: 'fishing-map-chromium',
          headless: true,
          viewport: { width: 1280, height: 720 },
        },
        {
          browser: 'firefox',
          name: 'fishing-map-firefox',
          headless: true,
          viewport: { width: 1280, height: 720 },
        },
        {
          browser: 'webkit',
          name: 'fishing-map-webkit',
          headless: true,
          viewport: { width: 1280, height: 720 },
        },
      ],
    },
  },
})
