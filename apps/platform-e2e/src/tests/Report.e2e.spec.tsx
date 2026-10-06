import { test } from '../fixtures'
import { waitForHydration } from '../helpers/hydration'
import { REFERENCE_LAYERS, toggleOnLayer } from '../helpers/sidebar'
import { CANARY_ISLANDS_EEZ } from '../pages/ReportPage'
import { MAP_PATH } from '../paths'
import { TAGS } from '../tags'

test.beforeEach(async ({ page }) => {
  await page.goto(MAP_PATH)
  await waitForHydration(page)
})

test(
  'Report - create an area report from map',
  { tag: [TAGS.SMOKE] },
  async ({ page, mapPage, reportPage }) => {
    await toggleOnLayer(page, REFERENCE_LAYERS.EEZ)
    await mapPage.applyViewportAndClick(CANARY_ISLANDS_EEZ.viewport)
    await reportPage.openAnalysisFromMap()
    await reportPage.expectReportTitleVisible(/km²/)
    await reportPage.expectSourceTagVisible()
    reportPage.expectReportUrl()
  }
)
test(
  'Report - a logged-in user loads the vessel table for an area report',
  { tag: [TAGS.EXTENDED] },
  async ({ page, mapPage, loginPage, reportPage }) => {
    await toggleOnLayer(page, REFERENCE_LAYERS.EEZ)
    await mapPage.applyViewportAndClick(CANARY_ISLANDS_EEZ.viewport)
    await reportPage.openAnalysisFromMap()
    await reportPage.expectReportTitleVisible(CANARY_ISLANDS_EEZ.title)
    await reportPage.expectVesselsLoginGate()
    await loginPage.login()
    await reportPage.loadVesselTable()
    await reportPage.expectVesselTableVisible()
  }
)
