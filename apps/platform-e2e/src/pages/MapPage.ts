import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import {
  ACTIVITY_SECTION_TESTID,
  ACTIVITY_VISUALIZATIONS_CHANGE_TESTID,
  MAP_POPUP_TESTID,
} from '@platform/config/selectors/map'

import { MAP_VIEWPORT, waitForMapIdle } from '../helpers/map'
import { TIMEOUTS } from '../helpers/timeouts'
import { MAP_PATH } from '../paths'

export type MapViewport = {
  latitude: number
  longitude: number
  zoom: number
}

export type MapViewportWithClick = MapViewport & {
  start: string
  end: string
  clickCoordinates: [number, number]
}

export const GALICIA_PRESENCE: MapViewportWithClick = {
  latitude: 43.469776,
  longitude: -8.382315,
  zoom: 6.605977688877899,
  start: '2025-07-01T00:00:00.000Z',
  end: '2026-07-01T00:00:00.000Z',
  clickCoordinates: [-8.382315, 43.469776],
}

export class MapPage {
  private page: Page
  readonly popup: Locator

  constructor(page: Page) {
    this.page = page
    this.popup = page.getByTestId(MAP_POPUP_TESTID)
  }

  async applyViewportAndClick({
    latitude,
    longitude,
    zoom,
    start,
    end,
    clickCoordinates: [clickLongitude, clickLatitude],
  }: MapViewportWithClick) {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      zoom: String(zoom),
      start,
      end,
      'cCo[0]': String(clickLongitude),
      'cCo[1]': String(clickLatitude),
    })
    await this.page.goto(`${MAP_PATH}?${params}`)
  }

  async goToViewport({ latitude, longitude, zoom }: MapViewport) {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      zoom: String(zoom),
    })
    await this.page.goto(`${MAP_PATH}?${params}`)
  }

  /** Needs a logged-in user and a zoom where the activity layer reports positions available. */
  async switchActivityToPositions() {
    await waitForMapIdle(this.page)
    const positionsButton = this.page
      .getByTestId(ACTIVITY_SECTION_TESTID)
      .getByTestId(`${ACTIVITY_VISUALIZATIONS_CHANGE_TESTID}-positions`)
    // disabled until the fourwings layer has loaded and allows positions at this zoom
    await expect(positionsButton).toBeEnabled({ timeout: TIMEOUTS.LONG })
    await positionsButton.click()
    await waitForMapIdle(this.page)
  }

  /**
   * Draws a triangle around the map centre and closes it by clicking its first vertex again.
   * Needs the draw dialog open. Where it lands on the globe does not matter.
   */
  async drawTriangle() {
    await waitForMapIdle(this.page)
    const viewport = this.page.locator(MAP_VIEWPORT)
    const box = await viewport.boundingBox()
    if (!box) {
      throw new Error('Map viewport is not rendered')
    }
    const centerX = box.width / 2
    const centerY = box.height / 2
    const vertices = [
      { x: centerX - 100, y: centerY - 80 },
      { x: centerX + 100, y: centerY - 80 },
      { x: centerX, y: centerY + 90 },
    ]
    for (const position of [...vertices, vertices[0]]) {
      // The view div is pointer-events: none, so force sends the click to the canvas under it
      await viewport.click({ position, force: true })
    }
  }

  async waitForPopupLoaded() {
    await expect(this.popup).toBeVisible({ timeout: TIMEOUTS.LONG })
    await expect(this.popup.locator('svg[class*="spinner"]')).toHaveCount(0, {
      timeout: TIMEOUTS.LONG,
    })
  }

  async expectVesselProfileLinkInPopup(name: string) {
    const vesselLink = this.popup.getByRole('link', { name, exact: true })
    await expect(vesselLink).toBeVisible({ timeout: TIMEOUTS.LONG })
    await expect(vesselLink).toHaveAttribute('href', /\/default-public\/vessel\//)
  }
}
