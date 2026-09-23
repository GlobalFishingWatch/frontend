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

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src',
  testMatch: /.*\.e2e\.spec\.(ts|tsx)$/,

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
  snapshotPathTemplate: '{testDir}/{testFileDir}/__screenshots__/{arg}{ext}',
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Origin only; tests navigate to /platform/map via appPath() / MAP_PATH. */
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
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
   * The dev server is started by Nx's `dependsOn: platform:start` (project.json), not by this
   * config — but that only guarantees the process was launched, not that it's accepting
   * connections yet. `command` here is a no-op that just idles: reuseExistingServer means it's
   * only spawned if Nx's server isn't already listening on the port, and it must not exit before
   * `url` responds or Playwright treats that as a startup failure. Either way, the real wait
   * happens on `url`.
   */
  webServer: {
    command: 'node -e "setInterval(() => {}, 60000)"',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
})
