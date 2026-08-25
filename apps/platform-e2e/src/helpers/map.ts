import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { TIMEOUTS } from './timeouts'

const MAP_VIEWPORT = '#view-mapViewport'

// Clicking the map only picks data once the layer under the cursor is loaded and interactive
// this retries the click itself until the expected content shows up.
export async function clickMapUntilVisible(
  page: Page,
  position: { x: number; y: number },
  expected: Locator,
  { timeout = TIMEOUTS.LONG }: { timeout?: number } = {}
) {
  await expect(async () => {
    await page.click(MAP_VIEWPORT, { position })
    await expect(expected).toBeVisible({ timeout: TIMEOUTS.MEDIUM })
  }).toPass({ timeout })
}
