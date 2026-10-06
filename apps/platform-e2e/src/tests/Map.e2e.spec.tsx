import { test } from '../fixtures'
import { waitForHydration } from '../helpers/hydration'
import { ACTIVITY_LAYERS, toggleOnlyLayer } from '../helpers/sidebar'
import { GALICIA_PRESENCE } from '../pages/MapPage'
import { MAP_PATH } from '../paths'
import { TAGS } from '../tags'

const VESSEL_NAME = 'Rocio Un'

test.beforeEach(async ({ page }) => {
  await page.goto(MAP_PATH)
  await waitForHydration(page)
})
test(
  'Map - vessel presence popup opens the profile of a listed vessel',
  { tag: [TAGS.EXTENDED] },
  async ({ page, mapPage, vesselProfilePage }) => {
    await toggleOnlyLayer(page, ACTIVITY_LAYERS, ACTIVITY_LAYERS.PRESENCE)
    await mapPage.applyViewportAndClick(GALICIA_PRESENCE)
    await waitForHydration(page)
    await mapPage.selectVesselFromPopupByName(VESSEL_NAME)
    await vesselProfilePage.expectProfileFor(VESSEL_NAME)
  }
)
