import type { Locator, Page } from 'playwright/test'
import { expect } from 'playwright/test'

import { TIMEOUTS } from '../helpers/timeouts'

const BASIC_INPUT_PLACEHOLDER = 'Type to search for vessels (Name, IMO, MMSI or call sign)'

export class SearchPage {
  private page: Page
  readonly basicInput: Locator
  readonly resultRows: Locator

  constructor(page: Page) {
    this.page = page
    this.basicInput = page.getByPlaceholder(BASIC_INPUT_PLACEHOLDER)
    this.resultRows = page.locator('[data-test^="search-vessels-option-"]')
  }

  async searchBasic(term: string) {
    await expect(this.basicInput).toBeVisible()
    await expect(this.basicInput).toBeEnabled()

    await this.basicInput.fill(term)

    await expect(this.resultRows.first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM })
  }

  async expectResultsVisible() {
    await expect(this.resultRows.first()).toBeVisible()
  }

  expectQueryInUrl() {
    expect(this.page.url()).toContain('qry=')
  }
}
