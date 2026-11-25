import { test } from '../fixtures'
import { clickMapCenterUntilVisible } from '../helpers/map'
import type { MapViewport } from '../pages/MapPage'
import { GALICIA_PRESENCE } from '../pages/MapPage'
import { TAGS } from '../tags'

const VESSEL_NAME = 'Rocio Un'

// Mid-Atlantic, at the zoom the old integration test reached (default 1.49 + 8 zoom-ins). Moved
// here from the platform integration specs (Map.spec.tsx). The time range is pinned to the one
// that spec ran with (3 months ending at its TEST_END_DATE): under the app's default range, which
// follows today's date, this spot is empty and the click opens no popup. The map is centred on
// the vessel's position in that range, because clickMapCenterUntilVisible clicks the view centre.
const ATLANTIC_POSITIONS: MapViewport = {
  latitude: 19.2818,
  longitude: -36.9255,
  zoom: 9.49,
  start: '2025-11-18T12:00:00.000Z',
  end: '2026-02-18T12:00:00.000Z',
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
