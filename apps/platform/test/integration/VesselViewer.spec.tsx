import { render } from 'test/appTestUtils'
import { navigateToVesselViewer } from 'test/utils/navigation/navigateToVesselViewer'
import { GFWAPITestUtils } from 'test/utils/network/gfw-api-test'
import { defaultState } from 'test/utils/store'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { makeStore } from 'store'

describe('Vessel viewer', async () => {
  it('should renders tabs and vessel basic info', async () => {
    const store = makeStore(defaultState)

    const { getByTestId, getByText, router } = await render({ store })
    await router.navigate(navigateToVesselViewer())

    await expect.element(getByTestId('vv-vessel-name')).toHaveTextContent('Gabu Reefer')
    await expect.element(getByText('Registry', { exact: true })).toBeVisible()
    await expect.element(getByText('AIS', { exact: true })).toBeVisible()
    await expect.element(getByText('Name').first()).toBeVisible()
    await expect.element(getByText('Flag', { exact: true })).toBeVisible()
    await expect.element(getByText('Registry sources')).toBeVisible()
    await expect.element(getByText('Dates')).toBeVisible()
    await expect.element(getByText('Gear Type')).toBeVisible()
    await expect.element(getByText('Year Built')).toBeVisible()
    await expect.element(getByText('MMSI')).toBeVisible()
    await expect.element(getByText('IMO', { exact: true })).toBeVisible()
    await expect.element(getByText('Call Sign')).toBeVisible()
    await expect.element(getByText('Length (M)')).toBeVisible()
    await expect.element(getByText('Depth (M)')).toBeVisible()
    await expect.element(getByText('Gross Tonnage')).toBeVisible()
    await expect.element(getByText('Owner').first()).toBeVisible()
    await expect.element(getByText('Operator')).toBeVisible()
    await expect.element(getByText('Authorization')).toBeVisible()
    await expect.element(getByText('View in')).toBeVisible()
    // await expect.element(getByTestId('vv-summary-tab')).toBeVisible()
    // await expect.element(getByTestId('vv-areas-tab')).toBeVisible()
    // await expect.element(getByTestId('vv-related-tab')).toBeVisible()
    // await expect.element(getByTestId('vv-insights-tab')).toBeVisible()

    // await expect
    //   .element(
    //     getByTestId('vessel-profile-info').getByText(
    //       /\d+ Events? in \d+ voyages? between \w+ \d+, \d{4} and \w+ \d+, \d{4}/
    //     )
    //   )
    //   .toBeVisible()
  })

  it('should change tab when clicking on a tab', async () => {
    const store = makeStore(defaultState)

    const { getByText, getByTestId, router } = await render({ store })
    await router.navigate(navigateToVesselViewer())

    await userEvent.click(getByText('AIS', { exact: true }))

    const aisPanel = getByTestId('identity-section-selfreportedbyvessel')
    const predictionsPanel = getByTestId('identity-section-gfwpredictions')
    await expect.element(aisPanel).toBeVisible()
    await expect.element(predictionsPanel).toBeVisible()
    await expect
      .element(aisPanel.getByText('Self reported by vessel', { exact: true }))
      .toBeVisible()
    await expect.element(aisPanel.getByText('Name', { exact: true })).toBeVisible()
    await expect.element(aisPanel.getByText('Vessel type', { exact: true })).toBeVisible()
    await expect.element(aisPanel.getByText('Flag', { exact: true })).toBeVisible()
    await expect.element(aisPanel.getByText('MMSI')).toBeVisible()
    await expect.element(aisPanel.getByText('IMO', { exact: true })).toBeVisible()
    await expect.element(aisPanel.getByText('Call sign')).toBeVisible()
    await expect.element(predictionsPanel.getByText('Vessel type')).toBeVisible()
    await expect.element(predictionsPanel.getByText('Gear type')).toBeVisible()
    // await expect.element(getByText('View in')).toBeVisible()
    // await expect.element(getByTestId('vv-summary-tab')).toBeVisible()
    // await expect.element(getByTestId('vv-areas-tab')).toBeVisible()
    // await expect.element(getByTestId('vv-related-tab')).toBeVisible()
    // await expect.element(getByTestId('vv-insights-tab')).toBeVisible()
  })

  it('should render summary tab by type', async () => {
    const GFWAPITest = new GFWAPITestUtils()
    const store = makeStore(defaultState)

    const { getByTestId, router } = await render({ store, authenticated: true })
    await router.navigate(navigateToVesselViewer())

    await GFWAPITest.waitForRequest('/events')
    await userEvent.click(getByTestId('vv-summary-tab'))
    await expect.element(getByTestId('vv-list-port_visit')).toBeVisible()
  })

  it('should render summary tab by timeline', async () => {
    const GFWAPITest = new GFWAPITestUtils()
    const store = makeStore(defaultState)

    const { getByRole, getByText, router } = await render({ store, authenticated: true })
    await router.navigate(navigateToVesselViewer())

    await GFWAPITest.waitForRequest('/events')
    await userEvent.click(getByRole('button').filter({ hasText: 'Timeline by voyages' }))
    await expect.element(getByText(/\d+ Events? between .+ and .+/).first()).toBeVisible()
  })

  it('should render areas tab and its tabs', async () => {
    const store = makeStore(defaultState)

    const { getByTestId, router } = await render({ store, authenticated: true })
    await router.navigate(navigateToVesselViewer())
    await userEvent.click(getByTestId('vv-areas-tab'))

    await expect.element(getByTestId('vv-area-eez')).toBeVisible()
    await expect.element(getByTestId('vv-area-fao')).toBeVisible()
    await expect.element(getByTestId('vv-area-rfmo')).toBeVisible()
    await expect.element(getByTestId('vv-area-mpa')).toBeVisible()
  })

  it('should render related vessels tab', async () => {
    const store = makeStore(defaultState)

    const { getByTestId, getByText, getByRole, router } = await render({
      store,
      authenticated: true,
    })
    await router.navigate(navigateToVesselViewer())
    await userEvent.click(getByTestId('vv-related-tab'))

    await expect
      .element(getByText('There are no encounters fully contained in your timerange.'))
      .toBeVisible()

    await userEvent.click(getByRole('button').filter({ hasText: 'Owners' }))
    await expect.element(getByText(/Fishing Cargo Services/i).first()).toBeVisible()
  })

  it('should render insights tab', async () => {
    const store = makeStore(defaultState)

    const { getByTestId, getByText, router } = await render({ store, authenticated: true })
    await router.navigate(navigateToVesselViewer())
    await userEvent.click(getByTestId('vv-insights-tab'))

    await expect
      .element(getByText(/Vessel insights between \w+ \d+, \d{4} and \w+ \d+, \d{4}/))
      .toBeVisible()
  })
})
