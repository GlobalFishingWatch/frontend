import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { navigateToPolygonEditorAction } from 'test/utils/actions/navigateToPolygonEditor'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { deckLayersStateAtom } from '@globalfishingwatch/deck-layer-composer'

import App from 'features/app/App'
import { mapInstanceAtom } from 'features/map/map.atoms'
import { MAP_VIEW_ID } from 'features/map/map-viewport.hooks'
import { makeStore } from 'store'

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
    await userEvent.click(getByTestId('user-layer-edit-public-hawaii-1771993699463'))

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

  it('should be able to draw a new polygon and see it in the map', async () => {
    const jotaiStore = createJotaiStore()
    const store = makeStore(defaultState, [], true)

    store.dispatch(navigateToPolygonEditorAction)

    const { getByTestId } = await render(<App />, { store, jotaiStore, authenticated: true })

    await new Promise((resolve) => setTimeout(resolve, 2000))

    await userEvent.click(getByTestId('draw-add-polygon'))

    // Simulate drawing a triangle polygon
    await userEvent.click(getByTestId('app-main'), { position: { x: 300, y: 200 } })
    await userEvent.click(getByTestId('app-main'), { position: { x: 400, y: 200 } })
    await userEvent.click(getByTestId('app-main'), { position: { x: 350, y: 300 } })
    await userEvent.click(getByTestId('app-main'), { position: { x: 300, y: 200 } })
    await userEvent.click(getByTestId('draw-save-polygon'))

    // Wait for polygon save and and navigation to map to complete
    await new Promise((resolve) => setTimeout(resolve, 4000))

    store.dispatch(navigateToPolygonEditorAction)

    // Wait for polygon to be loaded in the drawer
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Click on the middle on the triangle to select it with an offset because the focus moved to the right after saving
    await userEvent.click(getByTestId('app-main'), { position: { x: 400, y: 250 } })

    await userEvent.click(getByTestId('draw-delete-polygon'))
    await userEvent.click(getByTestId('draw-save-polygon'))

    // Wait for polygon save and and navigation to map to complete
    await new Promise((resolve) => setTimeout(resolve, 4000))

    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-159.86, 20.82]) || [0, 0]

    await expect
      .element(getByTestId('user-layer-status-public-hawaii-1771993699463'), { timeout: 10000 })
      .toBeEmptyDOMElement()

    // Wait for the layer to draw
    await new Promise((resolve) => setTimeout(resolve, 2000))

    await userEvent.click(getByTestId('app-main'), { position: { x, y } })

    await expect.element(getByTestId('map-popup-wrapper')).not.toBeInTheDocument()
  })
})
