import type { Page } from 'playwright/test'

import { expect, test } from '../fixtures'
import { TIMEOUTS } from '../helpers/timeouts'
import { appPath } from '../paths'
import { TAGS } from '../tags'

const VIEWPORT_PARAMS = ['latitude', 'longitude', 'zoom'] as const

type Viewport = Record<(typeof VIEWPORT_PARAMS)[number], number>

// Azores EEZ, same area the vitest navigation helpers use
const REPORT_PATH = appPath('/map/fishing-activity/default-public/report/public-eez-areas/8361')

const WIDE = { width: 1440, height: 900 }
const NARROW = { width: 1000, height: 900 }

// The camera is written to the URL debounced, and fitting waits for the area geometry
const SETTLE_MS = 4_000

async function readFittedViewport(page: Page): Promise<Viewport> {
  await expect
    .poll(
      () => {
        const params = new URL(page.url()).searchParams
        return VIEWPORT_PARAMS.every((param) => Number.isFinite(Number(params.get(param))))
      },
      { timeout: TIMEOUTS.LONG }
    )
    .toBe(true)
  await page.waitForTimeout(SETTLE_MS)
  const params = new URL(page.url()).searchParams
  return Object.fromEntries(
    VIEWPORT_PARAMS.map((param) => [param, Number(params.get(param))])
  ) as Viewport
}

// The report area must be fitted to the width the map actually ends up with. The map panel width
// changes under the report — the aside is 50% and resizable there, and MapLayout commits the new
// width only after a navigation settles — so a fit computed from the previous width leaves the area
// over-zoomed. A window resize is the cheapest way to move that width without depending on map
// picking: after it, the camera must match what a cold load at the same size computes.
test(
  'ReportAreaFit01 - area stays fitted when the map width changes',
  { tag: [TAGS.EXTENDED] },
  async ({ page }) => {
    await page.setViewportSize(WIDE)
    await page.goto(REPORT_PATH)
    const fittedWide = await readFittedViewport(page)

    await page.setViewportSize(NARROW)
    const afterResize = await readFittedViewport(page)

    // Reference: same report, cold load at the narrow size, so the fit can only use that width
    await page.goto(REPORT_PATH.split('?')[0])
    const fittedNarrow = await readFittedViewport(page)

    // Guard the test itself: the two widths must actually produce different fits
    expect(Math.abs(fittedWide.zoom - fittedNarrow.zoom)).toBeGreaterThan(0.1)

    expect(afterResize.zoom).toBeCloseTo(fittedNarrow.zoom, 1)
    expect(afterResize.latitude).toBeCloseTo(fittedNarrow.latitude, 1)
    expect(afterResize.longitude).toBeCloseTo(fittedNarrow.longitude, 1)
  }
)
