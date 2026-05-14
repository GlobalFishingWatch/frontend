import { playwright } from '@vitest/browser-playwright'
import path from 'path'
import type { ConfigEnv, Plugin, PluginOption } from 'vite'
import { loadEnv, mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
// @ts-expect-error TS cannot resolve `./vite.config.mts` without allowImportingTsExtensions (Vite resolves it at runtime).
import viteAppConfig from './vite.config.mts'
import { publicAssetsPlugin, authTokensPlugin, svgMockPlugin } from './test/utils/vitest/plugins'

const DEFAULT_VIEWPORT = { width: 1280, height: 720 }

const defaultPlaywrightProvider = playwright()

/** Flatten Vite plugin option (arrays, conditional false, etc.). */
function flattenPlugins(plugins: PluginOption | PluginOption[] | undefined): Plugin[] {
  if (plugins === undefined) return []
  const list = (Array.isArray(plugins) ? plugins : [plugins]).flat(10) as PluginOption[]
  return list.filter(
    (p): p is Plugin =>
      Boolean(p) &&
      p !== false &&
      typeof p === 'object' &&
      p !== null &&
      'name' in p &&
      !('then' in p)
  )
}

export default defineConfig((configEnv) => {
  const env = loadEnv(configEnv.mode, process.cwd(), '')

  const isChromeOnly = env.TEST_CHROME_ONLY === 'true'
  const isUiTarget = env.NX_TASK_TARGET_TARGET === 'test:ui'
  const isUiMode = configEnv.mode === 'ui' || env.VITEST_UI === 'true' || isUiTarget
  const isCoverageMode = configEnv.mode === 'coverage' || env.VITEST_COVERAGE === 'true'

  // Mirror dev server tooling so `#tanstack-router-entry` (and peers) resolve
  // via `@tanstack/react-start`'s Vite plugin, same as production.
  const viteEnv: ConfigEnv = {
    command: configEnv.command === 'build' ? 'build' : 'serve',
    mode: configEnv.mode,
    isSsrBuild: false,
  }

  const appConfig = typeof viteAppConfig === 'function' ? viteAppConfig(viteEnv) : viteAppConfig

  // Keep test SVG behaviour: `.svg` → mock component. Production uses SVGR;
  // after merge it would win on some paths, so exclude it here.
  //
  // Drop TanStack Router *code-splitter* plugins in Vitest browser: Start wires
  // `codeSplittingOptions.addHmr: true` for the client splitter, which clashes
  // with transforms here (duplicate lexical `hot`).
  const appPluginsForVitest = flattenPlugins(appConfig.plugins).filter((p) => {
    const n = typeof (p as { name?: unknown }).name === 'string' ? (p as { name: string }).name : ''
    if (n === 'vite-plugin-svgr') return false
    if (n.includes('tanstack-router:code-splitter')) return false
    return true
  })

  /**
   * Test-only path aliases (`reducers`, `features/...`). Production relies on
   * tsconfigPaths in `vite.config.mts`; browser tests still expect these
   * explicit entries (match previous vitest-only setup).
   */
  const vitestAliases = [
    { find: 'data/config', replacement: path.resolve(__dirname, './data/config') },
    { find: 'data', replacement: path.resolve(__dirname, './data') },
    { find: 'features', replacement: path.resolve(__dirname, './features') },
    { find: 'routes', replacement: path.resolve(__dirname, './routes') },
    { find: 'services', replacement: path.resolve(__dirname, './services') },
    { find: 'utils', replacement: path.resolve(__dirname, './utils') },
    { find: 'types', replacement: path.resolve(__dirname, './types') },
    { find: 'queries', replacement: path.resolve(__dirname, './queries') },
    { find: 'middlewares', replacement: path.resolve(__dirname, './middlewares') },
    { find: 'store', replacement: path.resolve(__dirname, './store') },
    { find: 'appTestUtils', replacement: path.resolve(__dirname, './appTestUtils') },
    { find: 'test', replacement: path.resolve(__dirname, './test') },
    { find: 'hooks', replacement: path.resolve(__dirname, './hooks') },
  ]

  const setupPath = path.resolve(__dirname, './test/setup/vitest.setup.ts')

  return mergeConfig(appConfig, {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/fishing-map',
    plugins: [
      ...appPluginsForVitest,
      svgMockPlugin(),
      publicAssetsPlugin(),
      authTokensPlugin(),
    ],
    resolve: {
      ...appConfig.resolve,
      dedupe: ['react', 'react-dom'],
      alias: vitestAliases,
    },
    define: {
      ...appConfig.define,
      'process.env.VITE_PUBLIC_API_GATEWAY': JSON.stringify(env.VITE_PUBLIC_API_GATEWAY),
      'process.env.VITE_PUBLIC_WORKSPACE_ENV': JSON.stringify(env.VITE_PUBLIC_WORKSPACE_ENV),
      'process.env.NODE_ENV': JSON.stringify('test'),
      'process.env.VITEST': JSON.stringify('true'),
      'process.env.TEST_USER_EMAIL': JSON.stringify(env.TEST_USER_EMAIL),
      'process.env.TEST_USER_PASSWORD': JSON.stringify(env.TEST_USER_PASSWORD),
    },
    optimizeDeps: {
      ...appConfig.optimizeDeps,
      // `i18next-fs-backend` (SSR only, via `i18n.server.ts`) uses `node:fs`.
      // `@tanstack/router-generator` uses `node:fs/promises` for filesystem
      // crawling — it must not be pre-bundled for the Vitest *browser* client
      // graph (Vite externalizes `fs` and prints noisy warnings; that code never
      // runs in the browser).
      exclude: [
        ...(Array.isArray(appConfig.optimizeDeps?.exclude) ? appConfig.optimizeDeps.exclude : []),
        'i18next-fs-backend',
        '@tanstack/router-generator',
      ],
      include: [
        ...(Array.isArray(appConfig.optimizeDeps?.include) ? appConfig.optimizeDeps.include : []),
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ],
      entries: [...(Array.isArray(appConfig.optimizeDeps?.entries) ? appConfig.optimizeDeps.entries : []), setupPath],
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
  })
})
