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

  /**
   * Asserts the profile that opened belongs to the vessel that was selected. The identity is
   * checked twice on purpose: the route carries the vessel id, and the header is rendered from
   * the vessel-info request that follows it, so a stale or mismatched fetch is still caught.
   */
  async expectProfileFor({ name, vesselId }: { name: string; vesselId: string }) {
    expect(new URL(this.page.url()).pathname).toContain(`/vessel/${vesselId}`)
    await expect(this.vesselName).toBeVisible({ timeout: TIMEOUTS.LONG })
    // The heading also carries a hint tooltip ("Check the vessel profile here"), so match loosely.
    await expect(this.vesselName).toContainText(name)
  }
}
