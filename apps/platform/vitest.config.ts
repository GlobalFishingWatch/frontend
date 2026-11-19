import { playwright } from '@vitest/browser-playwright'
import { loadEnv } from 'vite'
import type { ViteUserConfig } from 'vitest/config'
import { configDefaults, defineConfig } from 'vitest/config'
import type { BrowserProviderOption } from 'vitest/node'

import { authTokensPlugin, publicAssetsPlugin } from './test/utils/vitest/plugins.ts'
import { basePath, plugins } from './vite.config.ts'

const DEFAULT_VIEWPORT = { width: 1280, height: 720 }

// Pinned so a local .env cannot swap the nav the specs drive (PlatformNav vs LegacyNav). CI has
// no .env and production builds without the flag, so the specs are written against LegacyNav.
// It has to be process.env: Vite gives variables already in the environment priority over .env
// files, while a `define` for `import.meta.env.VITE_PLATFORM_MODE` does not reach the env object
// that data/env.ts parses.
// Specs for platform-only pages (Help Hub, Areas, Ports…) cannot run under this pin and stay in
// LEGACY_SPECS. Mocking `PLATFORM_MODE` per file closes the browser page — see HelpHub.spec.tsx.
process.env.VITE_PLATFORM_MODE = 'false'
// Every dataset and dataview id the app requests carries this version, so the recordings in
// test/fixtures/api depend on it. Pinned for the same reason as above; when the app's default
// (libs/datasets-client/src/constants.ts) moves on, change it here and re-record.
process.env.VITE_PIPE_DATASET_VERSION = '5'

// Specs not yet moved onto the network stub (test/utils/network). They still depend on the live
// API, so they are kept out of every run, CI included: @nx/vitest infers the integration-ci--*
// tasks from `include` minus `exclude`. Remove a spec from this list in the PR that converts it.
const LEGACY_SPECS = [
  // Needs platform mode, which the suite pins off (see the VITE_PLATFORM_MODE pin).
  'test/integration/HelpHub.spec.tsx',
  'test/integration/Datasets.spec.tsx',
  'test/integration/MarineManager.spec.tsx',
  'test/integration/Map.spec.tsx',
  'test/integration/Polygon.spec.tsx',
  'test/integration/PrivateWorkspace.spec.tsx',
  'test/integration/Reports.spec.tsx',
  'test/integration/Timebar.spec.tsx',
  'test/integration/UserDatasets.spec.tsx',
  'test/integration/Vessels.spec.tsx',
  'test/integration/VesselSearch.spec.tsx',
  'test/integration/VesselsVMSBrazil.spec.tsx',
  'test/integration/VesselViewer.spec.tsx',
]

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

// The persistent profile keeps the browser HTTP cache (tiles) warm across spec files. Chromium
// refuses a profile another process already holds, so:
// - CI shares one profile per worker. integration-tests.yml runs `integration-ci` with
//   --parallel=1, so a worker's specs run one after another and each reuses the tiles the
//   previous ones fetched.
// - Locally, split tasks may run in parallel, so each Nx task gets its own profile.
const profileName = process.env.CI ? 'ci' : (process.env.NX_TASK_TARGET_TARGET ?? 'default')
const playwrightProvider: BrowserProviderOption = playwright({
  persistentContext: `./node_modules/.cache/vitest-playwright-user-data/${profileName.replace(/[^\w.-]+/g, '_')}`,
  // Without this the browser inherits the OS UI language, so on a pt-BR machine i18next detects
  // `pt` from navigator.language and Intl/Luxon format numbers and dates in Portuguese. Pin it so
  // local runs match CI. Also applies to the persistent context (passed to launchPersistentContext).
  contextOptions: { locale: 'en-US' },
})

export default defineConfig(({ mode }): ViteUserConfig => {
  const env = loadEnv(mode, process.cwd(), '')

  const isChromeOnly = env.TEST_CHROME_ONLY === 'true'
  const isUiTarget = env.NX_TASK_TARGET_TARGET === 'test:ui'
  const isUiMode = mode === 'ui' || env.VITEST_UI === 'true' || isUiTarget
  const isCoverageMode = mode === 'coverage' || env.VITEST_COVERAGE === 'true'
  // Record mode forwards stubbed requests to the real API and saves the responses as fixtures
  // (test/utils/network/mock-network.ts). Only it needs a real login.
  const isRecordMode = env.VITEST_RECORD === 'true'

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
      'import.meta.env.VITEST_RECORD': JSON.stringify(String(isRecordMode)),
      'import.meta.env.VITEST_NETWORK_DEBUG': JSON.stringify(env.VITEST_NETWORK_DEBUG ?? 'false'),
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
      // Spread the defaults: setting `exclude` replaces them, and node_modules would be globbed.
      // INTEGRATION_INCLUDE_LEGACY=true runs them anyway, e.g. to see what a spec still needs stubbed.
      exclude: [
        ...configDefaults.exclude,
        ...(env.INTEGRATION_INCLUDE_LEGACY === 'true' ? [] : LEGACY_SPECS),
      ],
      fileParallelism: false,
      // Expected with real API data: datasets without geometryType are hidden on purpose.
      onConsoleLog: (log) => !log.includes('Dataset hidden from the layer library'),
      // maxWorkers: '50%',
      reporters: ['default'],
      coverage: {
        enabled: isCoverageMode,
        reportsDirectory: 'test/coverage/apps/platform',
        provider: 'istanbul',
      },
      testTimeout: 30000,
      setupFiles: './test/setup/vitest.setup.ts',
      globalSetup: isRecordMode ? './test/setup/vitest.setup-global.ts' : undefined,
      retry: 0,
      browser: {
        enabled: true,
        provider: playwrightProvider,
        ui: isUiMode,
        headless: !isUiMode,
        viewport: DEFAULT_VIEWPORT,
        locators: {
          // vitest 5 flipped this to `true`.
          exact: false,
        },
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
