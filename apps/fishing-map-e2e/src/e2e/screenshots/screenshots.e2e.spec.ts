import test, { expect } from '@playwright/test'

import { MAP_URLS } from './screenshots.config'

const TILES_RENDER_TIMEOUT = 20_000
// const MASK_SELECTORS = [
//   // Legend values are data-driven and change over time
//   '[class*="MapLegend-module"][class*="legend"]',
// ]

test.use({
  baseURL: undefined,
  httpCredentials: undefined,
  viewport: { width: 1920, height: 1080 },
})

for (const { id, url } of MAP_URLS) {
  test.describe(`Screenshot comparison - ${id}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.setItem('MarineManagerPopup', '{"visible":false,"showAgain":false}')
        localStorage.setItem('VesselProfilePopup', '{"visible":false,"showAgain":false}')
        localStorage.setItem('WelcomePopup', '{"visible":false,"showAgain":false}')
        localStorage.setItem('DeepSeaMiningPopup', '{"visible":false,"showAgain":false}')
        // We need to ensure this is set to ensure the highlight popup is using the same
        // HIGHLIGHT_DATAVIEW_INSTANCE_ID but the import is not working in the e2e tests
        localStorage.setItem('HighlightPopup', '"sentinel2"')
        localStorage.setItem(
          'hints',
          '{"fishingEffortHeatmap":true,"filterActivityLayers":true,"clickingOnAGridCellToShowVessels":true,"changingTheTimeRange":true,"areaSearch":true,"periodComparisonBaseline":true,"userContextLayers":true}'
        )
      })
      const parsedUrl = new URL(url)
      parsedUrl.searchParams.set('skipColorDomainSampling', 'true')
      await page.goto(parsedUrl.toString(), { waitUntil: 'networkidle', timeout: 60_000 })
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(TILES_RENDER_TIMEOUT)
    })

    test('full page', async ({ page }) => {
      // const mask = (MASK_SELECTORS ?? []).map((selector) => page.locator(selector))
      await expect(page).toHaveScreenshot(`${id}-full-page.png`, {
        maxDiffPixels: 2,
        // mask,
      })
    })
  })
}
