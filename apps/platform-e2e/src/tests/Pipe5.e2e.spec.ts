import { test } from '../fixtures'
import { clickMapCenterUntilVisible } from '../helpers/map'
import { ACTIVITY_LAYERS, toggleOnlyLayer } from '../helpers/sidebar'
import { COSTA_RICA } from '../pages/MapPage'
import { TAGS } from '../tags'

const COSTA_RICA_FLAG = 'CRI'
const UNKNOWN_VESSEL_NAME = 'Unknown vessel'

test(
  'Pipe5 - Costa Rica VMS vessels are named Unknown vessel in the popup and the profile',
  { tag: [TAGS.REGRESSION] },
  async ({ page, mapPage, vesselProfilePage }) => {
    await mapPage.applyViewportAndClick(COSTA_RICA)
    await toggleOnlyLayer(page, ACTIVITY_LAYERS, ACTIVITY_LAYERS.VMS)

    // The click restored from the URL does not reopen the popup, so click the centered point
    const costaRicaVessels = mapPage.popupVesselLinksWithFlag(COSTA_RICA_FLAG)
    await clickMapCenterUntilVisible(page, costaRicaVessels.first())
    await mapPage.waitForPopupLoaded()
    await mapPage.expectPopupVesselsWithFlagNamed(COSTA_RICA_FLAG, UNKNOWN_VESSEL_NAME)

    await costaRicaVessels.first().click()
    await vesselProfilePage.expectProfileFor(UNKNOWN_VESSEL_NAME)
  }
)
