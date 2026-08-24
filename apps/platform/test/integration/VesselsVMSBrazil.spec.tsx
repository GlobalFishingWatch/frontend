import { render } from 'test/appTestUtils'
import { navigateToVesselViewer } from 'test/utils/navigation/navigateToVesselViewer'
import { defaultState } from 'test/utils/store'
import { describe, expect, it } from 'vitest'

import { makeStore } from 'store'

const PUBLIC_BRAZIL_VMS_VESSEL_ID = '80fda2e12-2dab-34da-aa7a-b6b275bce00f'
const PRIVATE_BRAZIL_VMS_VESSEL_ID = '1cb06bd01-1bd9-befb-75b8-b9178581ebe8'

const navigateToPublicBrazilVMSViewer = () =>
  navigateToVesselViewer({
    vesselId: PUBLIC_BRAZIL_VMS_VESSEL_ID,
    vesselDatasetId: 'public-vms-bra-vessel-identity:v4.0',
    vesselIdentitySource: 'selfReportedInfo',
    vesselSelfReportedId: PUBLIC_BRAZIL_VMS_VESSEL_ID,
  })

const navigateToPrivateBrazilVMSViewer = () =>
  navigateToVesselViewer({
    vesselId: PRIVATE_BRAZIL_VMS_VESSEL_ID,
    vesselDatasetId: 'private-vms-bra-vessel-identity:v4.0',
    vesselIdentitySource: 'selfReportedInfo',
    vesselSelfReportedId: PRIVATE_BRAZIL_VMS_VESSEL_ID,
  })

describe('Vessel identity properties based on the VMS source', () => {
  it('should render public VMS Brazil identity fields', async () => {
    const store = makeStore(defaultState)

    const { getByText, router } = await render({ store })
    await router.navigate(navigateToPublicBrazilVMSViewer())

    await expect.element(getByText('Fishing zone')).toBeVisible()
    await expect.element(getByText('Main gear')).toBeVisible()
    await expect.element(getByText('Target species')).toBeVisible()
    await expect.element(getByText('External ID')).toBeVisible()

    expect(getByText('Fishing license code', { exact: true }).elements()).toHaveLength(0)
    expect(getByText('Fleet code', { exact: true }).elements()).toHaveLength(0)
    expect(getByText('Vessel registration number', { exact: true }).elements()).toHaveLength(0)
  })

  it('should render private-only VMS Brazil identity fields', async () => {
    const store = makeStore(defaultState)

    const { getByText, router } = await render({ store, authenticated: true })
    await router.navigate(navigateToPrivateBrazilVMSViewer())

    await expect.element(getByText('Vessel registration number')).toBeVisible()
    await expect.element(getByText('Fleet code')).toBeVisible()
    await expect.element(getByText('Fishing license code')).toBeVisible()
    await expect.element(getByText('Fishing license status')).toBeVisible()
    await expect.element(getByText('Fishing license start date')).toBeVisible()
    await expect.element(getByText('Fishing license end date')).toBeVisible()
    await expect.element(getByText('Horse power')).toBeVisible()

    expect(getByText('Fishing zone', { exact: true }).elements()).toHaveLength(0)
    expect(getByText('Main gear', { exact: true }).elements()).toHaveLength(0)
    expect(getByText('Target species', { exact: true }).elements()).toHaveLength(0)
  })
})
