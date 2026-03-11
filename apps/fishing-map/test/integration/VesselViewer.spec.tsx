import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { navigateToVesselViewerAction } from 'test/utils/actions/navigateToVesselViewer'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import App from 'features/app/App'
import { makeStore } from 'store'

describe('Vessel viewer', async () => {
  it('should renders tabs and vessel basic info', async () => {
    const store = makeStore(defaultState, [], true)

    const { getByTestId, getByText } = await render(<App />, { store })

    store.dispatch(navigateToVesselViewerAction)

    await expect.element(getByTestId('vv-vessel-name')).toHaveTextContent('Gabu Reefer')
    await expect.element(getByText('Registry', { exact: true })).toBeVisible()
    await expect.element(getByText('AIS', { exact: true })).toBeVisible()
    await expect.element(getByText('Name')).toBeVisible()
    await expect.element(getByText('Flag', { exact: true })).toBeVisible()
    await expect.element(getByText('Registry sources')).toBeVisible()
    await expect.element(getByText('Dates')).toBeVisible()
    await expect.element(getByText('Gear Types')).toBeVisible()
    await expect.element(getByText('Year Built')).toBeVisible()
    await expect.element(getByText('MMSI')).toBeVisible()
    await expect.element(getByText('IMO', { exact: true })).toBeVisible()
    await expect.element(getByText('Call Sign')).toBeVisible()
    await expect.element(getByText('Length (M)')).toBeVisible()
    await expect.element(getByText('Depth (M)')).toBeVisible()
    await expect.element(getByText('Gross Tonnage')).toBeVisible()
    await expect.element(getByText('Owner')).toBeVisible()
    await expect.element(getByText('Operator')).toBeVisible()
    await expect.element(getByText('Authorization')).toBeVisible()
    await expect.element(getByText('View in')).toBeVisible()
    await expect.element(getByTestId('vv-summary-tab')).toBeVisible()
    await expect.element(getByTestId('vv-areas-tab')).toBeVisible()
    await expect.element(getByTestId('vv-related-tab')).toBeVisible()
    await expect.element(getByTestId('vv-insights-tab')).toBeVisible()

    await expect
      .element(
        getByTestId('vessel-profile-info').getByText(
          '6 Events in 5 voyages between Dec 3, 2025 and Feb 18, 2026 in 1 MPA, 3 EEZs, 5 RFMOs areas.',
          {
            exact: true,
          }
        )
      )
      .toBeVisible()
  })

  it('should change tab when clicking on a tab', async () => {
    const store = makeStore(defaultState, [], true)

    const { getByText, getByTestId } = await render(<App />, { store })
    store.dispatch(navigateToVesselViewerAction)

    await userEvent.click(getByText('AIS', { exact: true }))

    await expect.element(getByText('Name')).toBeVisible()
    await expect.element(getByText('Flag', { exact: true })).toBeVisible()
    await expect.element(getByText('MMSI')).toBeVisible()
    await expect.element(getByText('IMO', { exact: true })).toBeVisible()
    await expect.element(getByText('Call Sign')).toBeVisible()
    await expect.element(getByText('GFW Vessel type')).toBeVisible()
    await expect.element(getByText('GFW Gear type')).toBeVisible()
    await expect.element(getByText('View in')).toBeVisible()
    await expect.element(getByTestId('vv-summary-tab')).toBeVisible()
    await expect.element(getByTestId('vv-areas-tab')).toBeVisible()
    await expect.element(getByTestId('vv-related-tab')).toBeVisible()
    await expect.element(getByTestId('vv-insights-tab')).toBeVisible()
  })

  it('should render summary tab by type', async () => {
    const store = makeStore(defaultState, [], true)

    const { getByTestId } = await render(<App />, { store })
    store.dispatch(navigateToVesselViewerAction)

    await userEvent.click(getByTestId('vv-summary-tab'))
    await expect.element(getByTestId('vv-list-port_visit')).toBeVisible()
    await expect.element(getByTestId('vv-list-loitering')).toBeVisible()
  })

  it('should render summary tab by timeline', async () => {
    const store = makeStore(defaultState, [], true)

    const { getByTestId, getByText } = await render(<App />, { store })
    store.dispatch(navigateToVesselViewerAction)

    await userEvent.click(getByTestId('vv-summary-tab'))
    await userEvent.click(getByText('Timeline by voyages'))
    await expect
      .element(getByText('0 Events between Feb 24, 2026 (CONAKRY) and Feb 17, 2026 (CONAKRY)'))
      .toBeVisible()
  })

  it('should render areas tab and its tabs', async () => {
    const store = makeStore(defaultState, [], true)

    const { getByTestId } = await render(<App />, { store })
    store.dispatch(navigateToVesselViewerAction)
    await userEvent.click(getByTestId('vv-areas-tab'))

    await expect.element(getByTestId('vv-area-eez')).toBeVisible()
    await expect.element(getByTestId('vv-area-fao')).toBeVisible()
    await expect.element(getByTestId('vv-area-rfmo')).toBeVisible()
    await expect.element(getByTestId('vv-area-mpa')).toBeVisible()
  })

  it('should render related vessels tab', async () => {
    const store = makeStore(defaultState, [], true)

    const { getByTestId, getByText } = await render(<App />, { store })
    store.dispatch(navigateToVesselViewerAction)
    await userEvent.click(getByTestId('vv-related-tab'))

    await expect
      .element(getByText('There are no encounters fully contained in your timerange.'))
      .toBeVisible()

    await userEvent.click(getByText('Owners'))
    await expect
      .element(
        getByText('Fishing Cargo Services (Panama) Aug 7, 2024 - Jan 31, 2026', { exact: true })
      )
      .toBeVisible()
  })

  it('should render insights tab', async () => {
    const store = makeStore(defaultState, [], true)

    const { getByTestId, getByText } = await render(<App />, { store })
    store.dispatch(navigateToVesselViewerAction)
    await userEvent.click(getByTestId('vv-insights-tab'))

    await expect
      .element(getByText(/Vessel insights between \w+ \d+, \d{4} and \w+ \d+, \d{4}/))
      .toBeVisible()
  })
})
