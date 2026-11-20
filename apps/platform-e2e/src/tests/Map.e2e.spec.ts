import { test } from '../fixtures'
import { clickMapCenterUntilVisible } from '../helpers/map'
import type { MapViewport } from '../pages/MapPage'
import { GALICIA_PRESENCE } from '../pages/MapPage'
import { TAGS } from '../tags'

const VESSEL_NAME = 'Rocio Un'

// Mid-Atlantic, at the zoom the old integration test reached (default 1.49 + 8 zoom-ins). The
// vessel below is real data under the default time range (the last 3 months of data), so it can
// drop out as that window moves. Moved here from the platform integration specs (Map.spec.tsx).
const ATLANTIC_POSITIONS: MapViewport = {
  latitude: 19.0776,
  longitude: -37.0458,
  zoom: 9.49,
}
const POSITIONS_VESSEL_NAME = /No\.805 Oryong/i

test(
  'Map - vessel presence popup links a listed vessel to its profile',
  { tag: [TAGS.EXTENDED] },
  async ({ mapPage }) => {
    await mapPage.applyViewportAndClick(GALICIA_PRESENCE)
    await mapPage.waitForPopupLoaded()
    await mapPage.expectVesselProfileLinkInPopup(VESSEL_NAME)
  }
)

test(
  'Map - positions visualization shows a vessel in the popup',
  { tag: [TAGS.EXTENDED] },
  async ({ page, loginPage, mapPage }) => {
    // positions are not available to guest users
    await mapPage.goToViewport(ATLANTIC_POSITIONS)
    await loginPage.login()

    await mapPage.switchActivityToPositions()

    // asserts the popup lists the vessel, retrying the click until it does
    await clickMapCenterUntilVisible(page, mapPage.popup.getByText(POSITIONS_VESSEL_NAME))
  }
)
