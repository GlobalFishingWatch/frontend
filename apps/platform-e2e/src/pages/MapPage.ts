import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { clickMapCenterUntilVisible } from '../helpers/map'
import { TIMEOUTS } from '../helpers/timeouts'
import { MAP_PATH } from '../paths'

const MAP_POPUP_TESTID = 'map-popup-wrapper'
// VesselsTable renders its `testId` prop as `data-test`, not `data-testid`.
const VESSELS_TABLE_TESTID = 'vessels-table'
const VESSEL_PROFILE_LINK_TESTID = 'link-vessel-profile'

export type MapViewport = {
  latitude: number
  longitude: number
  zoom: number
  start: string
  end: string
}

/**
 * A cell with dense, year-round AIS apparent fishing effort in the East China Sea. Clicking the
 * centre of the map on this viewport lands on a cell that has vessels behind it, so the test does
 * not depend on panning or on picking a feature by pixel offset.
 *
 * The time range is pinned rather than left at the default "last 3 months" window so the tile
 * keeps the same content as the calendar moves. Environment fact: verified against the dev
 * gateway 2026-09-21. If the popup stops listing vessels, re-derive it by clicking a bright cell
 * on the map and reading `latitude` / `longitude` / `zoom` from the resulting URL.
 */
export const EAST_CHINA_SEA_FISHING: MapViewport = {
  latitude: 30,
  longitude: 125,
  zoom: 5,
  start: '2025-01-01T00:00:00.000Z',
  end: '2025-04-01T00:00:00.000Z',
}

export type SelectedVessel = {
  name: string
  vesselId: string
}

export class MapPage {
  private page: Page
  readonly popup: Locator
  readonly vesselsTable: Locator

  constructor(page: Page) {
    this.page = page
    this.popup = page.getByTestId(MAP_POPUP_TESTID)
    this.vesselsTable = page.locator(`[data-test="${VESSELS_TABLE_TESTID}"]`)
  }

  private vesselRow(index: number) {
    return this.page.locator(`[data-test="${VESSELS_TABLE_TESTID}-item-${index}"]`)
  }

  /** Opens the map on a fixed viewport and time range, so the picked cell is reproducible. */
  async gotoViewport({ latitude, longitude, zoom, start, end }: MapViewport) {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      zoom: String(zoom),
      start,
      end,
    })
    await this.page.goto(`${MAP_PATH}?${params.toString()}`)
  }

  /**
   * Clicks the centre of the map until the activity popup lists the cell's top vessels. The click
   * is retried because the vessel list comes from a second request fired after the click, and a
   * click landing while the heatmap is still loading picks no feature at all.
   */
  async openVesselsFromMapTile() {
    await clickMapCenterUntilVisible(this.page, this.vesselsTable, { timeout: TIMEOUTS.TEST })
  }

  /**
   * Selects a vessel listed in the tile popup and waits for its profile route. The name and id
   * are read from the link itself so the assertions compare the profile against the row that was
   * actually clicked, not against hard-coded vessel data.
   */
  async selectVesselFromPopup(index = 0): Promise<SelectedVessel> {
    const vesselLink = this.vesselRow(index).getByTestId(VESSEL_PROFILE_LINK_TESTID)
    await expect(vesselLink).toBeVisible()

    const name = (await vesselLink.innerText()).trim()
    const href = await vesselLink.getAttribute('href')
    const [, vesselId = ''] = new URL(href || '', this.page.url()).pathname.split('/vessel/')

    expect(name, 'popup row should carry a vessel name').not.toBe('')
    expect(vesselId, 'vessel link should point at a vessel profile').not.toBe('')

    await vesselLink.click()
    await this.page.waitForURL(/\/vessel\//, { timeout: TIMEOUTS.LONG })

    return { name, vesselId }
  }

  /** The tile popup is dismissed once the selection navigates away. */
  async expectPopupClosed() {
    await expect(this.popup).toBeHidden()
  }
}
