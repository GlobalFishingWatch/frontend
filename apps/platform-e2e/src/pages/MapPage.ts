import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { MAP_POPUP_TESTID } from '@platform/config/selectors/map'

import { TIMEOUTS } from '../helpers/timeouts'
import { MAP_PATH } from '../paths'

export type MapViewportWithClick = {
  latitude: number
  longitude: number
  zoom: number
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
