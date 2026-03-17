import { defineConfig, devices } from '@playwright/test'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, '.env') })

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/e2e',
  testMatch: /.*\.e2e\.spec\.(ts|tsx)$/,

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  timeout: 180 * 1000, // 3 minutes per test
  expect: {
    /* Timeout for expect assertions */
    timeout: 10 * 1000, // 10 seconds
  },
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3003',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video on failure */
    video: 'retain-on-failure',
    httpCredentials: {
      username: process.env.BASIC_AUTH_USER || 'user',
      password: process.env.BASIC_AUTH_PASS || 'password',
    }
  },

  /* Configure projects for major browsers */
  projects: [
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

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  /*
   * Using dependsOn in project.json (simpler, Nx-native approach).
   * Nx will start the server before running tests.
   * For CI, you can optionally use webServer here for health checks.
   */
})
