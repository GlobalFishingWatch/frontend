import { playwright } from '@vitest/browser-playwright'
import { loadEnv } from 'vite'
import type { ViteUserConfig } from 'vitest/config'
import { defineConfig } from 'vitest/config'
import type { BrowserProviderOption } from 'vitest/node'

import { authTokensPlugin, publicAssetsPlugin } from './test/utils/vitest/plugins'
import { basePath, plugins } from './vite.config'

const DEFAULT_VIEWPORT = { width: 1280, height: 720 }

// Mirrors compilerOptions.paths in tsconfig.json.
//
// `resolve.tsconfigPaths` alone is not enough here: esbuild's dependency *scanner* runs before that
// plugin applies, so bare aliases (`store`, `test/appTestUtils`) fail the scan. Vite then skips
// pre-bundling entirely and optimizes deps lazily mid-run, which reloads the page and kills specs
// with "Failed to fetch dynamically imported module" / "Cannot connect to the iframe".
// Explicit aliases ARE visible to the scanner, so pre-bundling succeeds and the run stays stable.
const PREFIX_ALIAS_DIRS = [
  'assets',
  'data',
  'features',
  'hooks',
  'pages',
  'queries',
  'router',
  'routes',
  'server-functions',
  'server',
  'test',
  'types',
  'utils',
]
// Exact aliases whose file lives at a different path than the bare name (see tsconfig paths).
const EXACT_ALIAS_MODULES: Record<string, string> = {
  middlewares: 'store/middlewares',
  queries: 'queries',
  reducers: 'store/reducers',
  store: 'store/store',
  types: 'types',
}

const tsconfigPathAliases = [
  // Exact matches first so `types` does not get shadowed by the `types/` prefix rule.
  ...Object.entries(EXACT_ALIAS_MODULES).map(([name, path]) => ({
    find: new RegExp(`^${name}$`),
    replacement: `${import.meta.dirname}/${path}`,
  })),
  ...PREFIX_ALIAS_DIRS.map((dir) => ({
    find: new RegExp(`^${dir}/`),
    replacement: `${import.meta.dirname}/${dir}/`,
  })),
]

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
    root: import.meta.dirname,
    base: basePath,
    cacheDir: '../../node_modules/.vite/apps/platform',
    plugins: [...plugins, publicAssetsPlugin(), authTokensPlugin()],
    resolve: {
      // This object REPLACES vite.config's `resolve`, so anything needed there must be repeated
      // here. Without tsconfigPaths the path aliases (utils/*, data/*, features/*) don't resolve and
      // every spec dies importing test/setup/vitest.setup.ts.
      tsconfigPaths: true,
      alias: tsconfigPathAliases,
      // Without dedupe, different dependency paths (app code vs test helpers vs linked workspace libs) can load separate React copies
      dedupe: ['react', 'react-dom', 'jotai'],
    },

    define: {
      __BUILD_ID__: JSON.stringify('dev'),
      'import.meta.env.VITE_API_GATEWAY': JSON.stringify(env.VITE_API_GATEWAY),
      'import.meta.env.VITE_PUBLIC_URL': JSON.stringify(basePath),
      'import.meta.env.VITE_WORKSPACE_ENV': JSON.stringify(env.VITE_WORKSPACE_ENV),
      'import.meta.env.VITEST': JSON.stringify(true),
      'process.env.NODE_ENV': JSON.stringify('test'),
      'process.env.TEST_USER_EMAIL': JSON.stringify(env.TEST_USER_EMAIL),
      'process.env.TEST_USER_PASSWORD': JSON.stringify(env.TEST_USER_PASSWORD),
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
        reportsDirectory: 'test/coverage/apps/platform',
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
                  name: 'platform-chromium',
                },
              ]
            : [
                {
                  browser: 'chromium',
                  name: 'platform-chromium',
                },
                {
                  browser: 'firefox',
                  name: 'platform-firefox',
                },
                {
                  browser: 'webkit',
                  name: 'platform-webkit',
                },
              ],
      },
    },
  }
})
