import { test } from '../fixtures'
import { waitForHydration } from '../helpers/hydration'
import { BASIC_INPUT_SELECTOR, SEARCH_PATH } from '../pages/SearchPage'
import { TAGS } from '../tags'

const SEARCH_TERM = 'GABU REEFER'
const VESSEL_IDENTIFIERS = [
  { searchParam: 'MMSI', value: '616852000' },
  { searchParam: 'IMO', value: '8300949' },
  { searchParam: 'call sign', value: 'D6FJ2' },
]

test(
  'Search - basic search returns rendered results (guest)',
  { tag: [TAGS.SMOKE] },
  async ({ searchPage }) => {
    await searchPage.gotoWithQuery(SEARCH_TERM)
    await searchPage.expectResultsVisible()
  }
)

test.describe('Vessel search by parameters (MMSI, IMO, call sign)', () => {
  for (const { searchParam, value } of VESSEL_IDENTIFIERS) {
    test(
      `Search - basic search by ${searchParam} finds the vessel (guest)`,
      { tag: [TAGS.EXTENDED] },
      async ({ searchPage }) => {
        await searchPage.gotoWithQuery(value)
        await searchPage.expectResultWithIdentifier(value)
      }
    )
  }
})

test.describe('Search typed in the input', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SEARCH_PATH)
    await waitForHydration(page, BASIC_INPUT_SELECTOR)
  })

  test.skip(
    'Search - select a result and see it on map (guest)',
    { tag: [TAGS.REGRESSION] },
    async ({ searchPage }) => {
      await searchPage.searchBasic(SEARCH_TERM)
      await searchPage.awaitSearchFinishes()
      await searchPage.expectResultsVisible()

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
})

test.skip(
  'Search - query in the URL restores the search (guest)',
  { tag: [TAGS.REGRESSION] },
  async ({ searchPage }) => {
    await searchPage.gotoWithQuery(SEARCH_TERM)
    await searchPage.expectResultsVisible()
  }
)
