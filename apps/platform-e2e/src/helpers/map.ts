import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { MAP_LOADING_SPINNER_TESTID, MAP_VIEW_ID } from '@platform/config/selectors/map'

import { TIMEOUTS } from './timeouts'

export const MAP_VIEWPORT = `#view-${MAP_VIEW_ID}`
const MAP_SEARCH_LABEL = 'Search an area of interest e.g. ocean, sea, port, MPA, EEZ, RFMO'

export async function setLowResActivityTiles(page: Page) {
  await page.addInitScript(() => {
    const settings = JSON.parse(window.localStorage.getItem('userSettings') || '{}')
    if (!settings.preferredFourwingsVisualisationMode) {
      settings.preferredFourwingsVisualisationMode = 'heatmap-low-res'
      window.localStorage.setItem('userSettings', JSON.stringify(settings))
    }
  })
}

export async function waitForMapIdle(
  page: Page,
  { timeout = TIMEOUTS.MEDIUM }: { timeout?: number } = {}
) {
  await expect(page.getByTestId(MAP_LOADING_SPINNER_TESTID))
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
