import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { waitForHydration } from '../helpers/hydration'
import { TIMEOUTS } from '../helpers/timeouts'
import { appPath } from '../paths'

export const SEARCH_PATH = appPath('/vessel-search')
export const BASIC_INPUT_SELECTOR = '[data-testid="search-vessels-basic-input"]'
const BASIC_INPUT_PLACEHOLDER = 'Type to search for vessels (Name, IMO, MMSI or call sign)'

export class SearchPage {
  private page: Page
  readonly basicInput: Locator
  readonly resultRows: Locator
  readonly loadingSearchText: Locator
  constructor(page: Page) {
    this.page = page
    this.basicInput = page.getByPlaceholder(BASIC_INPUT_PLACEHOLDER)
    this.resultRows = page.locator('[data-test^="search-vessels-option-"]')
    this.loadingSearchText = page.getByText(/Searching more than .* vessels/)
  }

  async gotoWithQuery(term: string) {
    await this.page.goto(`${SEARCH_PATH}?qry=${encodeURIComponent(term)}`)
    await waitForHydration(this.page, BASIC_INPUT_SELECTOR)
  }

  async searchBasic(term: string) {
    await expect(this.basicInput).toBeVisible()
    await expect(this.basicInput).toBeEnabled()
    await this.basicInput.fill(term)
  }

  async expectResultsVisible() {
    await expect(this.resultRows.first()).toBeVisible({ timeout: TIMEOUTS.LONG })
  }

  async awaitSearchFinishes() {
    await expect(this.loadingSearchText).toHaveCSS('opacity', '1')
    await expect(this.loadingSearchText).toBeHidden({ timeout: TIMEOUTS.LONG })
  }

  async expectResultWithIdentifier(identifier: string) {
    await expect(this.resultRows.filter({ hasText: identifier }).first()).toBeVisible({
      timeout: TIMEOUTS.LONG,
    })
  }
}
