import { render } from 'test/appTestUtils'
import { navigateToVesselViewer } from 'test/utils/navigation/navigateToVesselViewer'
import { defaultState } from 'test/utils/store'
import { describe, expect, it } from 'vitest'

import { makeStore } from 'store'

const PUBLIC_BRAZIL_VMS_VESSEL_ID = '80fda2e12-2dab-34da-aa7a-b6b275bce00f'

const VMS_BRA_FIELDS = [
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
]

const navigateToPublicBrazilVMSViewer = () =>
  navigateToVesselViewer({
    vesselId: PUBLIC_BRAZIL_VMS_VESSEL_ID,
    vesselDatasetId: 'public-vms-bra-vessel-identity:v4.0',
    vesselIdentitySource: 'selfReportedInfo',
    vesselSelfReportedId: PUBLIC_BRAZIL_VMS_VESSEL_ID,
  })

describe('Vessel identity properties based on the VMS source', () => {
  it('should render public VMS Brazil identity fields', async () => {
    const store = makeStore(defaultState)

    const { getByText, getByRole, router } = await render({ store })
    await router.navigate(navigateToPublicBrazilVMSViewer())

    await expect.element(getByRole('tab', { name: 'VMS-BRA', selected: true })).toBeVisible()
    const identity = getByRole('tabpanel').first()

    // Identity fields every source has
    await expect.element(identity.getByText('Dom Rodrigo')).toBeVisible()
    await expect.element(identity).toMatchTextContent(/Flag\s*Brazil/)
    await expect.element(identity).toMatchTextContent(/Gear type.*Purse seine/)

    // The VMS-BRA group is shown, empty: none of these values are public
    for (const field of VMS_BRA_FIELDS) {
      await expect.element(identity).toMatchTextContent(new RegExp(`${field}\\s*---`))
    }

    // Pipe 3 fields are no longer part of the Brazil VMS identity
    for (const field of ['Fishing zone', 'Main gear', 'Target species']) {
      await expect.element(getByText(field, { exact: true })).not.toBeInTheDocument()
    }
  })
})
