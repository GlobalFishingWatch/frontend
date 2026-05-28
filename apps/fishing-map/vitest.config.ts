import { playwright } from '@vitest/browser-playwright'
import { loadEnv } from 'vite'
import type { ViteUserConfig } from 'vitest/config'
import { defineConfig } from 'vitest/config'
import type { BrowserProviderOption } from 'vitest/node'

import { authTokensPlugin, publicAssetsPlugin } from './test/utils/vitest/plugins'
import { basePath, plugins } from './vite.config'

const DEFAULT_VIEWPORT = { width: 1280, height: 720 }

const playwrightProvider: BrowserProviderOption = playwright({
  persistentContext: true,
})

export default defineConfig(({ mode }): ViteUserConfig => {
  const env = loadEnv(mode, process.cwd(), '')

  const isChromeOnly = env.TEST_CHROME_ONLY === 'true'
  const isUiTarget = env.NX_TASK_TARGET_TARGET === 'test:ui'
  const isUiMode = mode === 'ui' || env.VITEST_UI === 'true' || isUiTarget
  const isCoverageMode = mode === 'coverage' || env.VITEST_COVERAGE === 'true'

  return {
    root: __dirname,
    base: basePath,
    cacheDir: '../../node_modules/.vite/apps/fishing-map',
    plugins: [...plugins, publicAssetsPlugin(), authTokensPlugin()],
    resolve: {
      // Without dedupe, different dependency paths (app code vs test helpers vs linked workspace libs) can load separate React copies
      dedupe: ['react', 'react-dom'],
    },

    define: {
      'import.meta.env.VITE_PUBLIC_URL': JSON.stringify(basePath),
      'import.meta.env.VITEST': JSON.stringify(true),
      'process.env.NODE_ENV': JSON.stringify('test'),
      'process.env.TEST_USER_EMAIL': JSON.stringify(env.TEST_USER_EMAIL),
      'process.env.TEST_USER_PASSWORD': JSON.stringify(env.TEST_USER_PASSWORD),
      'process.env.VITE_PUBLIC_API_GATEWAY': JSON.stringify(env.VITE_PUBLIC_API_GATEWAY),
      'process.env.VITE_PUBLIC_WORKSPACE_ENV': JSON.stringify(env.VITE_PUBLIC_WORKSPACE_ENV),
      'process.env.VITEST': JSON.stringify('true'),
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
    test: {
      watch: false,
      deps: {
        optimizer: {
          client: {
            enabled: true,
          },
        },
      },
      include: [
        '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      ],
      fileParallelism: false,
      // maxWorkers: '50%',
      reporters: ['default'],
      coverage: {
        enabled: isCoverageMode,
        reportsDirectory: 'test/coverage/apps/fishing-map',
        provider: 'istanbul',
      },
      testTimeout: 30000,
      setupFiles: './test/setup/vitest.setup.ts',
      globalSetup: './test/setup/vitest.setup-global.ts',
      retry: 0,
      browser: {
        enabled: true,
        provider: playwrightProvider,
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
                },
              ]
            : [
                {
                  browser: 'chromium',
                  name: 'fishing-map-chromium',
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
