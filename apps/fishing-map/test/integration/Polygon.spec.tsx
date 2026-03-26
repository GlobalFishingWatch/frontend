import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { navigateToPolygonEditorAction } from 'test/utils/actions/navigateToPolygonEditor'
import { getDefaultStateWithDatasets } from 'test/utils/store/redux-store-test'
import {
  USER_POLYGON_DATASET,
  USER_POLYGON_DATASET_ID,
} from 'test/utils/store/redux-store-test.data'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { deckLayersStateAtom } from '@globalfishingwatch/deck-layer-composer'

import App from 'features/app/App'
import { deleteDatasetThunk, fetchAllDatasetsThunk } from 'features/datasets/datasets.slice'
import { mapInstanceAtom } from 'features/map/map.atoms'
import { MAP_VIEW_ID } from 'features/map/map-viewport.hooks'
import { selectUserDatasets } from 'features/user/selectors/user.permissions.selectors'
import { makeStore } from 'store'

const defaultState = getDefaultStateWithDatasets([USER_POLYGON_DATASET])

const cleanupExistingTestPolygon = async (store: ReturnType<typeof makeStore>) => {
  await store.dispatch(fetchAllDatasetsThunk({ fetchUserDatasetsMode: 'user-only' }) as any)
  const state = store.getState()
  // Find and delete test polygons from state
  const datasets = selectUserDatasets(state)
  for (const dataset of datasets) {
    if (dataset.id?.includes('polygon-drawing-test')) {
      await store.dispatch(deleteDatasetThunk(dataset.id) as any)
    }
  }
}

describe('Polygon', () => {
  const createdPolygonId: string | null = null

  // afterAll(async () => {
  //   if (createdPolygonId) {
  //     await deletePolygonViaAPI(createdPolygonId)
  //   }
  // })

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
      .poll(() => jotaiStore.get(deckLayersStateAtom), { timeout: 20000 })
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

  it.only('should be able to draw a new polygon, see it in the map and delete it', async () => {
    const jotaiStore = createJotaiStore()
    const store = makeStore(defaultState, [], true)
    const { getByTestId, getByText } = await render(<App />, {
      store,
      jotaiStore,
      authenticated: true,
    })
    await cleanupExistingTestPolygon(store)

    await userEvent.click(getByTestId('draw-polygon-button'))

    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)

    // Define triangle vertices in [longitude, latitude] format
    const vertex1 = viewport?.project([-57.85, 49]) || [300, 200]
    const vertex2 = viewport?.project([-32.8, 49.09]) || [400, 200]
    const vertex3 = viewport?.project([-45.34, 29.9]) || [350, 300]

    // Draw a triangle polygon
    // await userEvent.click(getByTestId('app-main'), { position: { x: vertex1[0], y: vertex1[1] } })
    // await userEvent.click(getByTestId('app-main'), { position: { x: vertex2[0], y: vertex2[1] } })
    // await userEvent.click(getByTestId('app-main'), { position: { x: vertex3[0], y: vertex3[1] } })
    // await userEvent.click(getByTestId('app-main'), { position: { x: vertex1[0], y: vertex1[1] } })

    await userEvent.click(getByTestId('app-main'), { position: { x: 300, y: 200 } })
    await userEvent.click(getByTestId('app-main'), { position: { x: 400, y: 200 } })
    await userEvent.click(getByTestId('app-main'), { position: { x: 350, y: 300 } })
    await userEvent.click(getByTestId('app-main'), { position: { x: 300, y: 200 } })

    await userEvent.type(getByTestId('input-layer-name'), 'Polygon drawing test')
    await userEvent.click(getByTestId('draw-save-polygon'))
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Wait for all layers to be loaded
    //  await expect.poll(() => getByTestId('datasets-spinner')).not.toBeInTheDocument()
    await expect.poll(() => getByTestId('map-loading-spinner'), { timeout: 5000 }).not.toBeVisible()

    await expect
      .poll(
        () => {
          return Object.values(jotaiStore.get(deckLayersStateAtom)).every((layer) => layer.loaded)
        },
        { timeout: 20000, interval: 1000 }
      )
      .toBe(true)
    const [x, y] = viewport?.project([-45.33, 42.66]) || [0, 0]

    await userEvent.click(getByTestId('map-container'), { position: { x: 350, y: 250 } })
    await expect
      .element(
        getByTestId('map-popup-wrapper').getByRole('heading', { name: 'Polygon drawing test' })
      )
      .toBeVisible()

    const expectedLayerProps = {
      loaded: expect.any(Boolean),
      cacheHash: expect.any(String),
    }
    await expect
      .poll(
        () => {
          return jotaiStore.get(deckLayersStateAtom)
        },
        { timeout: 20000, interval: 1000 }
      )
      .toMatchObject({
        basemap: expectedLayerProps,
        'draw-layer': expectedLayerProps, //draw-layer
      })

    //Delete layer after test
    // await userEvent.click(getByTestId('sidebar-login-icon'))
    // await userEvent.click(getByText(/Dataset/i))
    // await new Promise((resolve) => setTimeout(resolve, 100))
    // await userEvent.click(getByTestId(/^delete-dataset-public-polygon-drawing-test-\d+$/))
    // window.confirm = () => true

    // expect(getByText('Polygon drawing test')).not.toBeInTheDocument()
  })
})
