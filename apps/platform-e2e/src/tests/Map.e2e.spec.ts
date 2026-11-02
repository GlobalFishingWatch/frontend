import { test } from '../fixtures'
import { waitForHydration } from '../helpers/hydration'
import { GALICIA_PRESENCE } from '../pages/MapPage'
import { MAP_PATH } from '../paths'
import { TAGS } from '../tags'

const VESSEL_NAME = 'Rocio Un'

test.beforeEach(async ({ page }) => {
  await page.goto(MAP_PATH)
  await waitForHydration(page)
})
test(
  'Map - vessel presence popup links a listed vessel to its profile',
  { tag: [TAGS.EXTENDED] },
  async ({ mapPage }) => {
    await mapPage.applyViewportAndClick(GALICIA_PRESENCE)
    await mapPage.waitForPopupLoaded()
    await mapPage.expectVesselProfileLinkInPopup(VESSEL_NAME)
  }
)
