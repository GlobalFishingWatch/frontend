import type { Page } from 'playwright/test'

const HIGHLIGHT_DATAVIEW_INSTANCE_ID = 'sentinel2'

export async function disableWelcomePopups(page: Page) {
  await page.addInitScript(() => {
    const hidden = JSON.stringify({ visible: false, showAgain: false })
    window.localStorage.setItem('WelcomePopup', hidden)
    window.localStorage.setItem('VesselProfilePopup', hidden)
    window.localStorage.setItem('MarineManagerPopup', hidden)
    window.localStorage.setItem('HighlightPopup', `"${HIGHLIGHT_DATAVIEW_INSTANCE_ID}"`)
    window.localStorage.setItem('i18nextLng', '"en"')
    window.localStorage.setItem(
      'hints',
      '{"fishingEffortHeatmap":true,"filterActivityLayers":true,"clickingOnAGridCellToShowVessels":true,"changingTheTimeRange":true,"areaSearch":true,"periodComparisonBaseline":true,"userContextLayers":true}'
    )
  })
}
