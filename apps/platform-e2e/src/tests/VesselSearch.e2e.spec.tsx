import { test } from '../fixtures'
import { appPath } from '../paths'
import { TAGS } from '../tags'

test.beforeEach(async ({ page }) => {
  await page.goto(appPath('/vessel-search'))
  await waitForHydration(page, '[data-testid="search-vessels-basic-input"]')
})

test(
  'Search - basic search returns rendered results (guest)',
  { tag: [TAGS.SMOKE] },
  async ({ searchPage }) => {
    await searchPage.searchBasic('GABU REEFER')
    await searchPage.expectResultsVisible()
    searchPage.expectQueryInUrl()
  }
)
