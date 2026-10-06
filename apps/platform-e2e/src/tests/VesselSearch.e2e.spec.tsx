import { test } from '../fixtures'
import { waitForHydration } from '../helpers/hydration'
import { appPath } from '../paths'
import { TAGS } from '../tags'

const SEARCH_TERM = 'GABU REEFER'
const VESSEL_IDENTIFIERS = [
  { searchParam: 'MMSI', value: '616852000' },
  { searchParam: 'IMO', value: '8300949' },
  { searchParam: 'call sign', value: 'D6FJ2' },
]

test.beforeEach(async ({ page }) => {
  await page.goto(appPath('/vessel-search'))
  await waitForHydration(page, '[data-testid="search-vessels-basic-input"]')
})

test(
  'Search - basic search returns rendered results (guest)',
  { tag: [TAGS.SMOKE] },
  async ({ searchPage }) => {
    await searchPage.searchBasic(SEARCH_TERM)
    await searchPage.awaitSearchFinishes()
    await searchPage.expectResultsVisible()
    await searchPage.expectQueryInUrl(SEARCH_TERM)
  }
)

test.describe('Vessel search by parameters (MMSI, IMO, call sign)', () => {
  for (const { searchParam, value } of VESSEL_IDENTIFIERS) {
    test(
      `Search - basic search by ${searchParam} finds the vessel (guest)`,
      { tag: [TAGS.EXTENDED] },
      async ({ searchPage }) => {
        await searchPage.searchBasic(value)
        await searchPage.awaitSearchFinishes()
        await searchPage.expectResultWithIdentifier(value)
      }
    )
  }
})

test.skip(
  'Search - select a result and see it on map (guest)',
  { tag: [TAGS.REGRESSION] },
  async ({ searchPage }) => {
    await searchPage.searchBasic(SEARCH_TERM)
    await searchPage.awaitSearchFinishes()
    await searchPage.expectResultsVisible()
    await searchPage.expectQueryInUrl(SEARCH_TERM)

    //const { vesselId } = await searchPage.readFirstResult()
    //await searchPage.selectFirstResult()
    //await searchPage.clickSeeVesselsOnMap()
    //await searchPage.expectVesselsOnMap(vesselId)
  }
)

test.skip(
  'Search - click result name opens the vessel profile (guest)',
  { tag: [TAGS.REGRESSION] },
  async ({ searchPage }) => {
    await searchPage.searchBasic(SEARCH_TERM)
    await searchPage.awaitSearchFinishes()

    //await searchPage.readFirstResult()
    //await searchPage.clickFirstResultName()
    //await searchPage.expectVesselProfileOpen()
  }
)
test.skip(
  'Search - query in the URL restores the search (guest)',
  { tag: [TAGS.REGRESSION] },
  async ({ page, searchPage }) => {
    //await searchPage.gotoWithQuery(SEARCH_TERM)
    //await waitForHydration(page, SEARCH_INPUT_SELECTOR)
    await searchPage.expectResultsVisible()
    await searchPage.expectQueryInUrl(SEARCH_TERM)
  }
)
