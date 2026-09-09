import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { TIMEOUTS } from './timeouts'

const MAP_VIEWPORT = '#view-mapViewport'
const MAP_LOADING_SPINNER = 'map-loading-spinner'

export async function waitForMapIdle(
  page: Page,
  { timeout = TIMEOUTS.MEDIUM }: { timeout?: number } = {}
) {
  await expect(page.getByTestId(MAP_LOADING_SPINNER)).toBeHidden({ timeout })
}

export async function searchMapArea(page: Page, areaName: string) {
  await page.getByTestId('map-search-button').click()

  const searchInput = page.getByTestId('map-search-input')
  await expect(searchInput).toBeVisible()
  await searchInput.fill(areaName)

  const result = page.locator('[data-test^="map-search-result-"]').filter({ hasText: areaName })
  await expect(result.first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM })
  // Click the zoom control so we don't hit the nested "open report" action on the same row.
  await result
    .first()
    .getByTestId(/map-search-result-fit-bounds-/)
    .click()
  await waitForMapIdle(page)
}

export async function clickMapCenter(page: Page) {
  await waitForMapIdle(page)

  await page.click(MAP_VIEWPORT)
}

async function clickMapPosition(page: Page, position: { x: number; y: number }) {
  await waitForMapIdle(page)
  await page.click(MAP_VIEWPORT, { position })
}

async function retryClickUntilVisible(
  click: () => Promise<void>,
  expected: Locator,
  timeout: number
) {
  await expect(async () => {
    await click()
    await expect(expected).toBeVisible({ timeout: TIMEOUTS.MEDIUM })
  }).toPass({ timeout })
}

export async function clickMapCenterUntilVisible(
  page: Page,
  expected: Locator,
  { timeout = TIMEOUTS.LONG }: { timeout?: number } = {}
) {
  await retryClickUntilVisible(() => clickMapCenter(page), expected, timeout)
}

export async function clickMapUntilVisible(
  page: Page,
  position: { x: number; y: number },
  expected: Locator,
  { timeout = TIMEOUTS.LONG }: { timeout?: number } = {}
) {
  await retryClickUntilVisible(() => clickMapPosition(page, position), expected, timeout)
}
