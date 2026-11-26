import { VESSEL_NAME_TESTID } from '@platform/config/selectors/vessels'

import { expect, test } from '../fixtures'
import { TIMEOUTS } from '../helpers/timeouts'
import { appPath, MAP_PATH } from '../paths'
import { TAGS } from '../tags'

// A vessel from the private Brazil VMS dataset. The test user's account is granted access to it;
// that grant is what this test checks, so it runs against the real API rather than replayed
// fixtures (which never contain private data). Moved here from the platform integration specs.
const PRIVATE_BRAZIL_VMS_VESSEL_ID = '1cb06bd01-1bd9-befb-75b8-b9178581ebe8'
// The private dataset has no v5.0 yet (checked 2026-11-19); move it when it does.
const PRIVATE_BRAZIL_VMS_DATASET = 'private-vms-bra-vessel-identity:v4.0'

const privateBrazilVmsProfilePath = () => {
  const search = new URLSearchParams({
    vDi: PRIVATE_BRAZIL_VMS_DATASET, // vesselDatasetId
    vIs: 'selfReportedInfo', // vesselIdentitySource
    vSRi: PRIVATE_BRAZIL_VMS_VESSEL_ID, // vesselSelfReportedId
  })
  return appPath(
    `/map/fishing-activity/default-public/vessel/${PRIVATE_BRAZIL_VMS_VESSEL_ID}?${search}`
  )
}

test(
  'VP01 - private VMS Brazil identity fields are shown to a user with access',
  { tag: [TAGS.EXTENDED] },
  async ({ page, loginPage }) => {
    await page.goto(MAP_PATH)
    await loginPage.login()

    await page.goto(privateBrazilVmsProfilePath())
    await expect(page.getByTestId(VESSEL_NAME_TESTID)).toBeVisible({ timeout: TIMEOUTS.LONG })

    // The VMS-BRA field group. A public VMS-BRA vessel shows the same labels with no values
    // (integration VesselsVMSBrazil.spec.tsx); with access to the private dataset they are filled.
    for (const field of [
      'Vessel registration number',
      'Fleet code',
      'Fishing license code',
      'Fishing license status',
      'Fishing license start date',
      'Fishing license end date',
      'Year built',
      'Length',
      'Gross tonnage',
      'Horse power',
    ]) {
      await expect(page.getByText(field, { exact: true }).first()).toBeVisible()
    }
    await expect(page.getByRole('tabpanel').first()).not.toContainText(
      /Vessel registration number\s*---/
    )

    // The public Brazil VMS fields are not part of the private identity
    for (const field of ['Fishing zone', 'Main gear', 'Target species']) {
      await expect(page.getByText(field, { exact: true })).toHaveCount(0)
    }
  }
)
