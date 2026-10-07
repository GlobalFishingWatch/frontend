import { test } from '../fixtures'
import { CANARY_ISLANDS_EEZ } from '../pages/ReportPage'
import { TAGS } from '../tags'

test.beforeEach(async ({ reportPage }) => {
  await reportPage.open(CANARY_ISLANDS_EEZ)
})

test('Report - open an area report from its URL', { tag: [TAGS.SMOKE] }, async ({ reportPage }) => {
  await reportPage.expectReportTitleVisible(/km²/)
  await reportPage.expectSourceTagVisible()
  reportPage.expectReportUrl()
})
test(
  'Report - a logged-in user loads the vessel table for an area report',
  { tag: [TAGS.EXTENDED] },
  async ({ loginPage, reportPage }) => {
    await reportPage.expectReportTitleVisible(CANARY_ISLANDS_EEZ.title)
    await reportPage.expectVesselsLoginGate()
    await loginPage.login() //login via storage state file
    await reportPage.loadVesselTable()
    await reportPage.expectVesselTableVisible()
  }
)
