import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { TIMEOUTS } from './timeouts'

const MAP_VIEWPORT = '#view-mapViewport'
const MAP_LOADING_SPINNER = 'map-loading-spinner'
const MAP_SEARCH_LABEL = 'Search an area of interest e.g. ocean, sea, port, MPA, EEZ, RFMO'

export async function waitForMapIdle(
  page: Page,
  { timeout = TIMEOUTS.MEDIUM }: { timeout?: number } = {}
) {
  await expect(page.getByTestId(MAP_LOADING_SPINNER))
    .toBeHidden({ timeout })
    .catch(() => {})
}

export async function searchMapArea(page: Page, areaName: string) {
  await page.getByRole('button', { name: MAP_SEARCH_LABEL }).click()

  const searchInput = page.getByPlaceholder(MAP_SEARCH_LABEL)
  await expect(searchInput).toBeVisible()
  await searchInput.fill(areaName)

  const firstResult = page.getByRole('option').first()
  await expect(firstResult).toBeVisible({ timeout: TIMEOUTS.MEDIUM })
  await firstResult.click()
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
