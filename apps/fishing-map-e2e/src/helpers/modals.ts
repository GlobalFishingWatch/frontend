import type { Page } from 'playwright/test'

export async function disableWelcomePopups(page: Page) {
  await page.addInitScript(() => {
    const hidden = JSON.stringify({ visible: false, showAgain: false })
    const hints = JSON.stringify({
      fishingEffortHeatmap: true,
      filterActivityLayers: true,
      clickingOnAGridCellToShowVessels: true,
      changingTheTimeRange: true,
      areaSearch: true,
      periodComparisonBaseline: true,
      userContextLayers: true,
    })
    window.localStorage.setItem('WelcomePopup', hidden)
    window.localStorage.setItem('VesselProfilePopup', hidden)
    window.localStorage.setItem('MarineManagerPopup', hidden)
    window.localStorage.setItem('HighlightPopup', '"sentinel2"')
    window.localStorage.setItem('i18nextLng', '"en"')
    window.localStorage.setItem('hints', hints)
  })
}
