import React from 'react'
import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { addVesselToWorkspaceAction } from 'test/utils/actions/addVesselToWorkspace'
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

  it('should open vessel popup on vessel click and be able to navigate to vessel viewer', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    store.dispatch(addVesselToWorkspaceAction)

    const { getByTestId } = await render(<App />, { store, jotaiStore })

    const mapElement = getByTestId('app-main')

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-15, 28]) || [0, 0]

    await userEvent.click(mapElement, { position: { x, y } })

    await getByTestId('link-vessel-profile').first().click()

    // await expect.element(getByTestId('vv-vessel-name')).toHaveTextContent('Gabu Reefer')
  })

  it('should display the vessel track on the timebar', async () => {
    const store = makeStore(defaultState, [], true)

    store.dispatch(addVesselToWorkspaceAction)

    const { getByTestId, getByText } = await render(<App />, { store })

    const timebarElement = getByTestId('timebar-wrapper')

    await userEvent.hover(timebarElement, { position: { x: 400, y: 35 } })

    await new Promise((resolve) => setTimeout(resolve, 3000))

    await expect
      .element(getByTestId('timeline-tooltip-container').getByText('Gabu Reefer'))
      .toBeVisible()
    await expect.element(getByTestId('timebar-highlighter')).toBeVisible()
    await expect.element(getByText('Friday, December 5, 2025')).toBeVisible()

    await expect.element(getByText(/Docked at Banjul, Gambia \(Republic of The\)/)).toBeVisible()
  })

  it('should be able to pin a vessel to the map and see it on the timebar', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)
    const jotaiStore = createJotaiStore()

    const { getByTestId } = await render(<App />, { store, jotaiStore })

    await getByTestId('activity-layer-panel-switch-ais').click()
    await getByTestId('activity-layer-panel-switch-vms').click()
    await getByTestId('activity-layer-panel-switch-presence').click()

    const mapElement = getByTestId('app-main')

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-83.5, 21.6]) || [0, 0]

    await userEvent.click(mapElement, { position: { x, y } })

    await getByTestId('vessel-pin-button-ibsa-quinto').click()

    const actions = testingMiddleware.getActions()
    const pinAction = actions.findLast((action) => action.type === 'HOME')

    expect(pinAction?.query).toStrictEqual({
      dataviewInstances: [
        {
          id: 'vessel-9375434a0-0b91-7247-5a95-57a10d2b08df',
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
            relatedVesselIds: [
              '19630081d-d249-9b1d-2b6d-46113987f976',
              '9126f54fd-d5b3-2c09-0552-abcceccd10ff',
            ],
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

    await expect.element(getByTestId('vessel-switch-Ibsa-Quinto')).toBeVisible()
  })
})
