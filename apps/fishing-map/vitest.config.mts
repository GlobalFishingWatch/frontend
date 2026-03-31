import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import path from 'path'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import { publicAssetsPlugin, authTokensPlugin, svgMockPlugin } from './test/utils/vitest/plugins'

const DEFAULT_VIEWPORT = { width: 1280, height: 720 }

const defaultPlaywrightProvider = playwright()
// Not needed for Playwright 1.57.0 but will need in future versions
// Not used as version 1.58.2 runs much much slower than 1.57.0 (keep an eye on this)
// const chromiumPlaywrightProvider = playwright({
//   launchOptions: {
//     // Playwright 1.58 restricts SwiftShader WebGL by default for security reasons
//     // so this is needed to fix Deck.gl context creation in headless mode.
//     args: ['--enable-unsafe-swiftshader'],
//   },
// })

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const isChromeOnly = env.TEST_CHROME_ONLY === 'true'
  const isUiTarget = env.NX_TASK_TARGET_TARGET === 'test:ui'
  const isUiMode = mode === 'ui' || env.VITEST_UI === 'true' || isUiTarget
  const isCoverageMode = mode === 'coverage' || env.VITEST_COVERAGE === 'true'

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/fishing-map',
    plugins: [react(), nxViteTsPaths(), svgMockPlugin(), publicAssetsPlugin(), authTokensPlugin()],
    resolve: {
      // Without dedupe, different dependency paths (app code vs test helpers vs linked workspace libs) can load separate React copies
      dedupe: ['react', 'react-dom'],
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
      'process.env.NEXT_PUBLIC_API_GATEWAY': JSON.stringify(env.NEXT_PUBLIC_API_GATEWAY),
      'process.env.NEXT_PUBLIC_WORKSPACE_ENV': JSON.stringify(env.NEXT_PUBLIC_WORKSPACE_ENV),
      'process.env.NODE_ENV': JSON.stringify('test'),
      'process.env.VITEST': JSON.stringify('true'),
      'process.env.TEST_USER_EMAIL': JSON.stringify(env.TEST_USER_EMAIL),
      'process.env.TEST_USER_PASSWORD': JSON.stringify(env.TEST_USER_PASSWORD),
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
    test: {
      watch: false,
      include: [
        '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      ],
      fileParallelism: false,
      reporters: ['default'],
      coverage: {
        enabled: isCoverageMode,
        reportsDirectory: 'test/coverage/apps/fishing-map',
        provider: 'istanbul',
      },
      testTimeout: 30000,
      setupFiles: './test/setup/vitest.setup.ts',
      globalSetup: './test/setup/vitest.setup-global.ts',
      browser: {
        retry: 1,
        enabled: true,
        provider: defaultPlaywrightProvider,
        ui: isUiMode,
        headless: !isUiMode,
        viewport: DEFAULT_VIEWPORT,
        trace: {
          screenshots: true,
          snapshots: true,
          mode: isUiMode ? 'on' : 'on-first-retry',
        },
        instances:
          isUiMode || isChromeOnly
            ? [
                {
                  browser: 'chromium',
                  name: 'fishing-map-chromium',
                  // provider: chromiumPlaywrightProvider,
                },
              ]
            : [
                {
                  browser: 'chromium',
                  name: 'fishing-map-chromium',
                  // provider: chromiumPlaywrightProvider,
                },
                {
                  browser: 'firefox',
                  name: 'fishing-map-firefox',
                },
                {
                  browser: 'webkit',
                  name: 'fishing-map-webkit',
                },
              ],
      },
    },
  }
})
