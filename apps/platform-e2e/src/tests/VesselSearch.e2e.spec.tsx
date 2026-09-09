import { test } from '../fixtures'
import { waitForHydration } from '../helpers/hydration'
import { appPath } from '../paths'
import { TAGS } from '../tags'

const SEARCH_TERM = 'GABU REEFER'

test.beforeEach(async ({ page }) => {
  await page.goto(appPath('/vessel-search'))
  await waitForHydration(page, '[data-testid="search-vessels-basic-input"]')
})

test(
  'Search - basic search returns rendered results (guest)',
  { tag: [TAGS.SMOKE] },
  async ({ searchPage }) => {
    await searchPage.searchBasic(SEARCH_TERM)
    await searchPage.expectResultsVisible()
    await searchPage.expectQueryInUrl(SEARCH_TERM)
  }
)
