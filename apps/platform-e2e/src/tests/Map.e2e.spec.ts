import { test } from '../fixtures'
import { GALICIA_PRESENCE } from '../pages/MapPage'
import { TAGS } from '../tags'

const VESSEL_NAME = 'Rocio Un'

test(
  'Map - vessel presence popup links a listed vessel to its profile',
  { tag: [TAGS.EXTENDED] },
  async ({ mapPage }) => {
    await mapPage.applyViewportAndClick(GALICIA_PRESENCE)
    await mapPage.waitForPopupLoaded()
    await mapPage.expectVesselProfileLinkInPopup(VESSEL_NAME)
  }
)
