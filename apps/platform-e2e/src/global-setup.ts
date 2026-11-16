import type { FullConfig } from 'playwright/test'
import { chromium } from 'playwright/test'

import { waitForHydration } from './helpers/hydration'
import { MAP_VIEWPORT } from './helpers/map'
import { TIMEOUTS } from './helpers/timeouts'
import { MAP_PATH } from './paths'

export default async function globalSetup(config: FullConfig) {
  if (process.env.CI) return

  const { baseURL, ignoreHTTPSErrors, httpCredentials } = config.projects[0].use
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ baseURL, ignoreHTTPSErrors, httpCredentials })
    await page.goto(MAP_PATH, { timeout: TIMEOUTS.TEST })
    await waitForHydration(page, undefined, { timeout: TIMEOUTS.TEST })
    await page.locator(MAP_VIEWPORT).waitFor({ timeout: TIMEOUTS.LONG })
  } finally {
    await browser.close()
  }
}
