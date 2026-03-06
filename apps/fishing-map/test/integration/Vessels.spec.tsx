import React from 'react'
import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { addVesselToWorkspaceAction } from 'test/utils/actions/addVesselToWorkspace'
import { GFWAPITestUtils } from 'test/utils/network/gfw-api-test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import App from 'features/app/App'
import { mapInstanceAtom } from 'features/map/map.atoms'
import { MAP_VIEW_ID } from 'features/map/map-viewport.hooks'
import { makeStore } from 'store'

describe('Vessel map popup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should open vessel popup on vessel click and show tile related info', async () => {
    const store = makeStore(defaultState, [], true)
    const jotaiStore = createJotaiStore()

    store.dispatch(addVesselToWorkspaceAction)

    const { getByTestId } = await render(<App />, { store, jotaiStore })

    const mapElement = getByTestId('app-main')
    const mapPopup = getByTestId('map-popup-wrapper')

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-17.3, 26.4]) || [0, 0]

    // hover first to select the hover info more consistently, then click to open the popup
    await userEvent.hover(mapElement, { position: { x, y } })
    await userEvent.click(mapElement, { position: { x, y } })

    await expect.element(mapPopup.getByText('Gabu Reefer')).toBeVisible()
    await expect.element(mapPopup.getByText('Dec 27, 2025, 6:26 PM UTC')).toBeVisible()
    await expect.element(mapPopup.getByText('Speed: 7.10 knots')).toBeVisible()
    await expect.element(mapPopup.getByText('Depth: -2999 meters')).toBeVisible()
  })

  it('should be able to close an opened popup', async () => {
    const store = makeStore(defaultState, [], true)
    const jotaiStore = createJotaiStore()

    store.dispatch(addVesselToWorkspaceAction)

    const { getByTestId } = await render(<App />, { store, jotaiStore })

    const mapElement = getByTestId('app-main')
    const mapPopup = getByTestId('map-popup-wrapper')

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-17.3, 26.4]) || [0, 0]

    // hover first to select the hover info more consistently, then click to open the popup
    await userEvent.hover(mapElement, { position: { x, y } })
    await userEvent.click(mapElement, { position: { x, y } })
    await userEvent.click(getByTestId('close-popup-button'))

    await expect.element(mapPopup).not.toBeInTheDocument()
  })

  it('should be able to navigate to vessel viewer inside the vessel popup', async () => {
    const store = makeStore(defaultState, [], true)
    const jotaiStore = createJotaiStore()

    store.dispatch(addVesselToWorkspaceAction)

    const { getByTestId } = await render(<App />, { store, jotaiStore })

    const mapElement = getByTestId('app-main')

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-15, 28]) || [0, 0]

    await userEvent.click(mapElement, { position: { x, y } })

    await expect.element(getByTestId('link-vessel-profile').first()).toBeVisible()
    await getByTestId('link-vessel-profile').first().click()

    await expect.element(getByTestId('vv-vessel-name')).toHaveTextContent('Gabu Reefer')
  })

  it('should display the vessel track on the timebar', async () => {
    const GFWAPITest = new GFWAPITestUtils()
    const store = makeStore(defaultState, [], true)

    store.dispatch(addVesselToWorkspaceAction)

    const { getByTestId, getByText } = await render(<App />, { store })

    const timebarElement = getByTestId('timebar-wrapper')

    await GFWAPITest.waitForRequest('/events')

    await userEvent.hover(timebarElement, { position: { x: 400, y: 35 } })

    await expect
      .element(getByTestId('timeline-tooltip-container').getByText('Gabu Reefer'))
      .toBeVisible()
    await expect.element(getByTestId('timebar-highlighter')).toBeVisible()
    await expect.element(getByText('Saturday, December 6, 2025')).toBeVisible()

    await expect.element(getByText(/Docked at Banjul, Gambia \(Republic of The\)/)).toBeVisible()
  })

  it('should be able to see vessel info on hover and pin a vessel to the map to see it on the sidebar', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    const { getByTestId, getByText } = await render(<App />, { store, jotaiStore })

    const mapElement = getByTestId('app-main')
    const mapPopup = getByTestId('map-popup-wrapper')

    await userEvent.click(getByTestId('activity-layer-panel-switch-ais'))
    await userEvent.click(getByTestId('activity-layer-panel-switch-vms'))
    await userEvent.click(getByTestId('activity-layer-panel-switch-presence'))

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([8.5, -48]) || [0, 0]

    await userEvent.click(mapElement, { position: { x, y } })

    await expect.element(getByTestId('vessel-pin-button-ibsa-quinto')).toBeVisible()
    await getByTestId('vessel-pin-button-ibsa-quinto').click()

    const actions = testingMiddleware.getActions()
    const pinAction = actions.findLast((action) => action.type === 'HOME')

    expect(pinAction?.query).toStrictEqual({
      dataviewInstances: [
        {
          id: 'vessel-9375434a0-0b91-7247-5a95-57a10d2b08df:v4.0',
          dataviewId: 'fishing-map-vessel-track-v-4',
          config: {
            info: 'public-global-vessel-identity:v4.0',
            track: 'public-global-all-tracks:v4.0',
            events: [
              'public-global-fishing-events:v4.0',
              'public-global-port-visits-events:v4.0',
              'public-global-encounters-events:v4.0',
              'public-global-loitering-events:v4.0',
              'public-global-gaps-events:v4.0',
            ],
            relatedVesselIds: [],
            color: '#F95E5E',
            colorCyclingType: undefined,
          },
          deleted: false,
        },
        {
          id: 'presence',
          config: {
            visible: true,
          },
        },
        {
          id: 'vms',
          config: {
            visible: false,
          },
        },
        {
          id: 'ais',
          config: {
            visible: false,
          },
        },
      ],
      bivariateDataviews: null,
      longitude: 26,
      latitude: 19,
      zoom: 1.49,
      timebarVisualisation: 'vessel',
    })

    await userEvent.hover(mapPopup.getByText('Siempre Bella Vista'))

    await expect.element(getByTestId('vessel-switch-Siempre-Bella-Vista')).toBeVisible()

    await expect
      .element(getByText('Siempre Bella Vista - (Spain) (Jan 2, 2012 - Feb 8, 2026)'))
      .toBeVisible()
  })

  it('should show vessel info on vessel hover', async () => {
    const store = makeStore(defaultState, [], true)
    const jotaiStore = createJotaiStore()

    store.dispatch(addVesselToWorkspaceAction)

    const { getByTestId, getByText } = await render(<App />, { store, jotaiStore })
    const mapElement = getByTestId('app-main')

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-15, 28]) || [0, 0]

    await userEvent.hover(mapElement, { position: { x, y } })

    await expect.element(getByText('Gabu Reefer')).toBeVisible()
    await expect.element(getByText(/Docked at Las Palmas, Spain/)).toBeVisible()
  })

  it('should show vessel name, flag and date on vessel name hover on sidebar', async () => {
    const store = makeStore(defaultState, [], true)

    store.dispatch(addVesselToWorkspaceAction)

    const { getByTestId, getByText } = await render(<App />, { store })

    const vesselNameElement = getByTestId('vessel-layer-vessel-name')

    await userEvent.hover(vesselNameElement)

    await expect
      .element(getByText('Gabu Reefer - (Gambia (Republic of The)) (Jan 2, 2012 - Feb 8, 2026)'))
      .toBeVisible()
  })

  it('should be able to filter vessels by flag', async () => {
    const store = makeStore(defaultState, [], true)
    const jotaiStore = createJotaiStore()

    const { getByTestId, getByText } = await render(<App />, { store, jotaiStore })

    await userEvent.click(getByTestId('activity-layer-panel-switch-ais'))
    await userEvent.click(getByTestId('activity-layer-panel-switch-vms'))
    await userEvent.click(getByTestId('activity-layer-panel-switch-presence'))

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const filterButton = getByTestId('activity-layer-panel-btn-filter-presence')

    await userEvent.hover(filterButton)
    await userEvent.click(filterButton)
    await userEvent.click(getByTestId('multi-select-input').first())
    await userEvent.type(getByTestId('multi-select-input').first(), 'Spa')
    await userEvent.click(getByTestId('multi-select-option-ESP'))
    await userEvent.tab()
    await userEvent.click(getByText('Confirm'))

    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-15, 28]) || [0, 0]

    await userEvent.click(getByTestId('app-main'), { position: { x, y } })

    await expect.element(getByText('ESP')).toHaveLength(6)
  })

  it.only('should be able to interact with vessels after filtering by flag', async () => {
    const store = makeStore(defaultState, [], true)
    const jotaiStore = createJotaiStore()
    store.dispatch(addVesselToWorkspaceAction)

    const { getByTestId, getByText } = await render(<App />, { store, jotaiStore })

    await userEvent.click(getByTestId('activity-layer-panel-switch-ais'))
    await userEvent.click(getByTestId('activity-layer-panel-switch-vms'))
    await userEvent.click(getByTestId('activity-layer-panel-switch-presence'))

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const filterButton = getByTestId('activity-layer-panel-btn-filter-presence')

    await userEvent.hover(filterButton)
    await userEvent.click(filterButton)
    await userEvent.click(getByTestId('multi-select-input').first())
    await userEvent.type(getByTestId('multi-select-input').first(), 'Spa')
    await userEvent.click(getByTestId('multi-select-option-ESP'))
    await userEvent.tab()
    await userEvent.click(getByText('Confirm'))

    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-17.3, 26.4]) || [0, 0]

    await userEvent.hover(getByTestId('app-main'), { position: { x, y } })
    await userEvent.click(getByTestId('app-main'), { position: { x, y } })

    await expect.element(getByTestId('map-popup-wrapper').getByText('Gabu Reefer')).toBeVisible()
  })
})
