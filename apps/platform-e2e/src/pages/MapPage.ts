import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { TIMEOUTS } from '../helpers/timeouts'

const MAP_POPUP_TESTID = 'map-popup-wrapper'

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
    const url = new URL(this.page.url())
    url.searchParams.set('latitude', String(latitude))
    url.searchParams.set('longitude', String(longitude))
    url.searchParams.set('zoom', String(zoom))
    url.searchParams.set('start', start)
    url.searchParams.set('end', end)
    url.searchParams.set('cCo[0]', String(clickLongitude))
    url.searchParams.set('cCo[1]', String(clickLatitude))
    await this.page.goto(url.toString())
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
