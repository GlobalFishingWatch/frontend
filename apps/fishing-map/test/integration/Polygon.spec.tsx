import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { navigateToPolygonEditorAction } from 'test/utils/actions/navigateToPolygonEditor'
import { getDefaultStateWithDatasets } from 'test/utils/store/redux-store-test'
import {
  USER_POLYGON_DATASET,
  USER_POLYGON_DATASET_ID,
} from 'test/utils/store/redux-store-test.data'
import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import { deckLayersStateAtom } from '@globalfishingwatch/deck-layer-composer'

import App from 'features/app/App'
import { mapInstanceAtom } from 'features/map/map.atoms'
import { MAP_VIEW_ID } from 'features/map/map-viewport.hooks'
import { makeStore } from 'store'

const defaultState = getDefaultStateWithDatasets([USER_POLYGON_DATASET])

describe('Polygon', () => {
  it('should be able to navigate to the polygon editor', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)

    const { getByTestId, getByRole } = await render(<App />, { authenticated: true, store })

    await userEvent.click(getByTestId('activity-layer-panel-switch-ais'))
    await userEvent.click(getByTestId('activity-layer-panel-switch-vms'))

    const openLayerModalButton = getByTestId('activity-add-layer-button')
    await userEvent.click(openLayerModalButton)

    await userEvent.click(getByRole('button', { name: 'User' }))

    await userEvent.click(getByTestId('user-context-layer:v1-add-to-map-0').first())

    await userEvent.hover(getByTestId('context-layer-user-polygons-1771416000000-1771416000000'))
    await new Promise((resolve) => setTimeout(resolve, 300))
    await userEvent.click(getByTestId(`user-layer-edit-${USER_POLYGON_DATASET_ID}`))

    const navigateAction = testingMiddleware.getLastActionByType('HOME')

    expect(navigateAction.query).toMatchObject(navigateToPolygonEditorAction.query)
  })

  it('should load the polygon in the map', async () => {
    const jotaiStore = createJotaiStore()
    const store = makeStore(defaultState, [], true)

    store.dispatch(navigateToPolygonEditorAction)

    await render(<App />, { store, jotaiStore })

    await new Promise((resolve) => setTimeout(resolve, 2000))

    await expect
      .poll(
        () => {
          return jotaiStore.get(deckLayersStateAtom)
        },
        { timeout: 20000 }
      )
      .toMatchObject({
        basemap: {
          loaded: true,
          cacheHash: '',
        },
        'user-polygons-1771416000000-1771416000000': {
          loaded: true,
          cacheHash: '',
        },
        'draw-layer': {
          loaded: true,
          cacheHash: '',
        },
      })
  })

  it('should be able to draw a new polygon, see it in the map and delete it', async () => {
    const testTimestamp = 1771416000000 + Math.floor(Math.random() * 1000000000)
    const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(testTimestamp)

    const jotaiStore = createJotaiStore()
    const store = makeStore(defaultState, [], true)
    const { getByTestId, getByText } = await render(<App />, {
      store,
      jotaiStore,
      authenticated: true,
    })

    await userEvent.click(getByTestId('draw-polygon-button'))

    // Define triangle vertices in [longitude, latitude] format
    await expect
      .poll(() => jotaiStore.get(mapInstanceAtom), {
        timeout: 10000,
        interval: 500,
      })
      .toBeDefined()
    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    if (!viewport) {
      throw new Error('Map viewport not found - cannot project coordinates')
    }
    const vertex1 = viewport?.project([-57.85, 49]) || [300, 200]
    const vertex2 = viewport?.project([-32.8, 49.09]) || [400, 200]
    const vertex3 = viewport?.project([-45.34, 29.9]) || [350, 300]

    // Draw a triangle polygon
    await userEvent.click(getByTestId('app-main'), { position: { x: vertex1[0], y: vertex1[1] } })
    await userEvent.click(getByTestId('app-main'), { position: { x: vertex2[0], y: vertex2[1] } })
    await userEvent.click(getByTestId('app-main'), { position: { x: vertex3[0], y: vertex3[1] } })
    await userEvent.click(getByTestId('app-main'), { position: { x: vertex1[0], y: vertex1[1] } })
    await userEvent.fill(getByTestId('input-layer-name'), 'Polygon drawing test')
    await userEvent.click(getByTestId('draw-save-polygon'))
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Wait for all layers to be loaded
    await expect.element(getByTestId('map-loading-spinner')).toBeVisible()
    await expect.element(getByTestId('map-loading-spinner')).not.toBeVisible()

    // Click on the middle on the triangle to select it with an offset because the focus moved to the right after saving
    const [x, y] = viewport?.project([-90, 49]) || [150, 200]
    await userEvent.click(getByTestId('app-main'), { position: { x, y } })

    await expect
      .element(
        getByTestId('map-popup-wrapper').getByRole('heading', { name: 'Polygon drawing test' })
      )
      .toBeVisible()

    //Delete layer after test
    // await cleanupExistingTestPolygon(store)
    window.confirm = () => true
    await userEvent.click(getByTestId('sidebar-login-icon'))
    await userEvent.click(getByText('Dataset'))

    await expect.poll(() => getByTestId('datasets-spinner')).not.toBeInTheDocument()

    const deleteButtons = getByTestId(/polygon-drawing-test-/).all()

    for (const button of deleteButtons) {
      await userEvent.click(button)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    expect(getByText('Polygon drawing test')).not.toBeInTheDocument()
    dateNowSpy?.mockRestore()
  })
})
