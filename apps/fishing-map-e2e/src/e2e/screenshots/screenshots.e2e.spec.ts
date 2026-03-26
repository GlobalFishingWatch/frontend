import test, { expect } from '@playwright/test'

import { MAP_URLS } from './screenshots.config'

const TILES_RENDER_TIMEOUT = 20_000

test.use({
  baseURL: undefined,
  httpCredentials: undefined,
  viewport: { width: 1920, height: 1080 },
})

for (const { id, url } of MAP_URLS) {
  test.describe(`Screenshot comparison - ${id}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })

      const closeButton = page.getByTestId('modal-close-button')
      if (await closeButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await closeButton.click()
      }

      const dismissButton = page.getByText('Dismiss').first()
      if (await dismissButton.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await dismissButton.click()
      }

      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(TILES_RENDER_TIMEOUT)
    })

    test('full page', async ({ page }) => {
      await expect(page).toHaveScreenshot(`${id}-full-page.png`, {
        maxDiffPixels: 2,
      })
    })
  })
}
