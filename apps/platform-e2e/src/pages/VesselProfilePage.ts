import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { VESSEL_NAME_TESTID } from '@platform/config/selectors/vessels'

import { TIMEOUTS } from '../helpers/timeouts'

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
