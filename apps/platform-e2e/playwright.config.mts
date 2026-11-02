import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { defineConfig, devices } from '@playwright/test'
import * as dotenv from 'dotenv'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, '.env'), quiet: true })

// Origin only — absolute paths like /platform/map replace the URL path entirely,
// so embedding /platform in baseURL does not work with goto('/map').
const baseURL = new URL(process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3003').origin
// Only the smoke-test action's local-ssl-proxy setup sets this: its cert is self-signed.
// Everywhere else a bad cert must still fail the run.
const ignoreHTTPSErrors = process.env.PLAYWRIGHT_IGNORE_HTTPS_ERRORS === 'true'
// Only the `screenshots` target sets this (project.json). Nx builds the graph without it, so the
// per-file `test-ci--*` tasks never include the pixel comparisons, whose baselines are local.
const screenshots = process.env.PLAYWRIGHT_SCREENSHOTS === 'true'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: screenshots ? './src/screenshots' : './src/tests',
  testMatch: /.*\.e2e\.spec\.(ts|tsx)$/,
  /* Warms the cold Vite dev server before the first test (no-op on CI). */
  globalSetup: './src/global-setup.ts',

  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  timeout: 180 * 1000, // 3 minutes per test
  expect: {
    /* Timeout for expect assertions */
    timeout: 30 * 1000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? undefined : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Origin only; tests navigate to /platform/map via appPath() / MAP_PATH. */
    baseURL,
    ignoreHTTPSErrors,
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video on failure */
    video: 'retain-on-failure',
    // Only enable basic auth when it is actually configured (deployed/preview envs).
    // Setting it unconditionally makes the context credentialed, which blocks the
    // app's cross-origin requests to the API gateway (whose CORS uses a wildcard
    // origin) and breaks the guest/login flow against a local dev server.
    ...(process.env.BASIC_AUTH_USER && {
      httpCredentials: {
        username: process.env.BASIC_AUTH_USER,
        password: process.env.BASIC_AUTH_PASS || '',
        origin: baseURL,
      },
    }),
  },
  /* Configure projects for major browsers */
  projects: (() => {
    const allProjects = [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },
    ]
    const filter = process.env.PLAYWRIGHT_BROWSER?.trim()
    if (!filter || filter === 'all') {
      return allProjects
    }
    const allowed = new Set(
      filter
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean)
    )
    return allProjects.filter((project) => allowed.has(project.name))
  })(),

  /*
   * `command` is an `nx run` call, so the Nx Playwright plugin turns it into a real task
   * dependency: every inferred target waits for `platform:start` to be ready (`nxReadySignal()`
   * in its Vite config). Keep it a bare `nx run`, with no `env` or `wait` here, or the plugin
   * stops inferring that. The smoke run (`test`, against the built image and its TLS proxy) opts
   * out in project.json; there reuseExistingServer finds the image already listening on `url`, so
   * the command never runs.
   */
  webServer: {
    command: 'pnpm nx run platform:start',
    url: baseURL,
    ignoreHTTPSErrors,
    reuseExistingServer: true,
    timeout: 120 * 1000,
    // Playwright ignores the server's stdout by default, which hides Nx's task lines and Vite's
    // startup: only the stderr spinners showed, then nothing until the first test.
    stdout: 'pipe',
    // Without this Playwright SIGKILLs the command's process group, so Nx never stops its
    // continuous tasks: they run outside that group and Vite kept listening on 3003 (plus the
    // i18n watcher) after the run. SIGINT is Nx's Ctrl-C path: it stops them silently, while
    // SIGTERM also works but prints every task as failed. SIGKILL after 10s if Nx hangs.
    gracefulShutdown: { signal: 'SIGINT', timeout: 10_000 },
  },
})
