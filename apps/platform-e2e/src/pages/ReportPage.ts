import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { clickMapCenterUntilVisible } from '../helpers/map'

const EEZ_DATAVIEW_ID = 'context-layer-eez'
const MAP_POPUP_TESTID = 'map-popup-wrapper'
const OPEN_ANALYSIS_BUTTON_NAME = 'Create an analysis for this area'

export class ReportPage {
  private page: Page
  readonly openAnalysisButton: Locator
  readonly reportTitle: Locator

  constructor(page: Page) {
    this.page = page
    this.openAnalysisButton = page
      .getByTestId(MAP_POPUP_TESTID)
      .getByRole('button', { name: OPEN_ANALYSIS_BUTTON_NAME })
    this.reportTitle = page.getByRole('heading', { level: 1 })
  }

  private contextLayerToggle(dataviewId: string) {
    return this.page.getByTestId(`context-layer-${dataviewId}`)
  }

  private sourceTagChip(datasetId?: string) {
    return datasetId
      ? this.page.locator(`[data-test="source-tag-item-${datasetId}"]`)
      : this.page.locator('[data-test^="source-tag-item-"]')
  }

  async toggleEezLayer() {
    const contextLayerToggle = this.contextLayerToggle(EEZ_DATAVIEW_ID)
    await contextLayerToggle.scrollIntoViewIfNeeded()
    await contextLayerToggle.click()
  }

  async openAnalysisFromMapCenter() {
    await clickMapCenterUntilVisible(this.page, this.openAnalysisButton)

    await this.openAnalysisButton.click()
    await this.page.waitForURL(/\/report\//)
  }

  async expectReportTitleVisible(pattern: RegExp) {
    await expect(this.reportTitle).toBeVisible()
    await expect(this.reportTitle).toHaveText(pattern)
  }

  async expectSourceTagVisible() {
    await expect(this.sourceTagChip().first()).toBeVisible()
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
