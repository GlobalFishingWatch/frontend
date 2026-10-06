import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { TIMEOUTS } from '../helpers/timeouts'

import type { MapViewportWithClick } from './MapPage'

const MAP_POPUP_TESTID = 'map-popup-wrapper'
const OPEN_ANALYSIS_LINK_TESTID = 'open-analysis-link'
const VESSELS_TABLE_TESTID = 'report-vessels-table'
const SEE_VESSELS_BUTTON_NAME = 'See vessels'
const VESSEL_PROFILE_LINK_TESTID = 'link-vessel-profile'
const VESSELS_LOGIN_GATE_NAME = 'Register or log in to see the active vessels in this area'

export const CANARY_ISLANDS_EEZ = {
  title: /Canary Islands/,
  viewport: {
    latitude: 28,
    longitude: -15,
    zoom: 6,
    start: '2025-07-01T00:00:00.000Z',
    end: '2026-07-01T00:00:00.000Z',
    clickCoordinates: [-15, 28],
  } satisfies MapViewportWithClick,
} as const

export class ReportPage {
  private page: Page
  readonly openAnalysisButton: Locator
  readonly reportTitle: Locator
  readonly vesselsTable: Locator
  readonly seeVesselsButton: Locator
  readonly vesselsLoginGate: Locator

  constructor(page: Page) {
    this.page = page
    const mapPopup = page.getByTestId(MAP_POPUP_TESTID)
    this.openAnalysisButton = mapPopup.getByTestId(OPEN_ANALYSIS_LINK_TESTID)
    this.vesselsTable = page.getByTestId(VESSELS_TABLE_TESTID)
    this.reportTitle = page.getByRole('heading', { level: 1 })
    this.seeVesselsButton = page.getByRole('button', { name: SEE_VESSELS_BUTTON_NAME })
    this.vesselsLoginGate = page.getByRole('heading', { name: VESSELS_LOGIN_GATE_NAME })
  }

  private sourceTag(datasetId?: string) {
    return datasetId
      ? this.page.locator(`[data-test="source-tag-item-${datasetId}"]`)
      : this.page.locator('[data-test^="source-tag-item-"]')
  }

  async openAnalysisFromMap() {
    await expect(this.openAnalysisButton).toBeVisible({ timeout: TIMEOUTS.LONG })
    await this.openAnalysisButton.click()
    await this.page.waitForURL(/\/report\//)
  }

  async loadVesselTable() {
    await expect(async () => {
      if (await this.seeVesselsButton.isVisible()) {
        await this.seeVesselsButton.click()
      }
      await expect(this.vesselsTable).toBeVisible({ timeout: TIMEOUTS.LONG })
    }).toPass({ timeout: TIMEOUTS.TEST })
  }

  async expectReportTitleVisible(pattern: RegExp) {
    await expect(this.reportTitle).toBeVisible()
    await expect(this.reportTitle).toHaveText(pattern)
  }

  async expectSourceTagVisible() {
    await expect(this.sourceTag().first()).toBeVisible()
  }

  async expectVesselsLoginGate() {
    await expect(this.vesselsLoginGate).toBeVisible({ timeout: TIMEOUTS.LONG })
    await expect(this.vesselsTable).toBeHidden()
    await expect(this.seeVesselsButton).toBeHidden()
  }

  async expectVesselTableVisible() {
    await expect(this.vesselsTable).toBeVisible()
    await expect(this.vesselsTable.getByTestId(VESSEL_PROFILE_LINK_TESTID).first()).toBeVisible()
  }

  expectReportUrl() {
    const { pathname } = new URL(this.page.url())
    const [, reportPath = ''] = pathname.split('/report/')
    const [datasetId, areaId] = reportPath.split('/')

    expect(pathname, 'should be on a report route').toContain('/report/')
    expect(datasetId, 'report URL should carry a dataset id').toBeTruthy()
    expect(areaId, 'report URL should carry an area id').toBeTruthy()
  }
}
