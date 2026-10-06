import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { TIMEOUTS } from '../helpers/timeouts'

const VESSEL_NAME_TESTID = 'vv-vessel-name'

export class VesselProfilePage {
  private page: Page
  readonly vesselName: Locator

  constructor(page: Page) {
    this.page = page
    this.vesselName = page.getByTestId(VESSEL_NAME_TESTID)
  }

  async expectProfileFor(name: string) {
    expect(new URL(this.page.url()).pathname).toContain('/vessel/')
    await expect(this.vesselName).toBeVisible({ timeout: TIMEOUTS.LONG })
    await expect(this.vesselName).toContainText(name)
  }
}
