import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { REPORT_VESSELS_TABLE_TESTID } from '@platform/config/selectors/report'
import { VESSEL_PROFILE_LINK_TESTID } from '@platform/config/selectors/vessels'
import { SOURCE_TAG_TESTID } from '@platform/config/selectors/workspace'

import { waitForHydration } from '../helpers/hydration'
import { TIMEOUTS } from '../helpers/timeouts'
import { appPath } from '../paths'

const SEE_VESSELS_BUTTON_NAME = 'See vessels'
const VESSELS_LOGIN_GATE_NAME = 'Register or log in to see the active vessels in this area'

export type AreaReport = {
  title: RegExp
  path: string
  start: string
  end: string
}

export const CANARY_ISLANDS_EEZ: AreaReport = {
  title: /Canary Islands/,
  path: appPath('/map/fishing-activity/default-public/report/public-eez-areas/8364'),
  start: '2025-07-01T00:00:00.000Z',
  end: '2026-07-01T00:00:00.000Z',
}

export class ReportPage {
  private page: Page
  readonly reportTitle: Locator
  readonly vesselsTable: Locator
  readonly seeVesselsButton: Locator
  readonly vesselsLoginGate: Locator

  constructor(page: Page) {
    this.page = page
    this.vesselsTable = page.getByTestId(REPORT_VESSELS_TABLE_TESTID)
    this.reportTitle = page.getByRole('heading', { level: 1 })
    this.seeVesselsButton = page.getByRole('button', { name: SEE_VESSELS_BUTTON_NAME })
    this.vesselsLoginGate = page.getByRole('heading', { name: VESSELS_LOGIN_GATE_NAME })
  }

  private sourceTag(datasetId?: string) {
    return datasetId
      ? this.page.locator(`[data-test="${SOURCE_TAG_TESTID}-${datasetId}"]`)
      : this.page.locator(`[data-test^="${SOURCE_TAG_TESTID}-"]`)
  }

  async open({ path, start, end }: AreaReport) {
    await this.page.goto(`${path}?${new URLSearchParams({ start, end })}`)
    await waitForHydration(this.page)
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
