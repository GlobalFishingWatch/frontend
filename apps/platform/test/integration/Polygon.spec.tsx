import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { USER_POLYGON_DATASET, USER_POLYGON_DATASET_ID } from 'test/utils/fixtures'
import { clickLayerAction } from 'test/utils/layers'
import { navigateToPolygonEditor } from 'test/utils/navigation/navigateToPolygonEditor'
import { getDefaultStateWithDatasets } from 'test/utils/store'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { deckLayersStateAtom } from '@globalfishingwatch/deck-layer-composer'

import { makeStore } from 'store'

const defaultState = getDefaultStateWithDatasets([USER_POLYGON_DATASET])

describe('Polygon', () => {
  it('should be able to navigate to the polygon editor', async () => {
    const store = makeStore(defaultState)

    const { getByTestId } = await render({ authenticated: true, store })

    await userEvent.click(getByTestId('activity-layer-panel-switch-ais'))
    await userEvent.click(getByTestId('activity-layer-panel-switch-vms'))

    const openLayerModalButton = getByTestId('user-add-layer-button')
    await userEvent.click(openLayerModalButton)

    // await userEvent.click(getByRole('button', { name: 'User' }))

    await userEvent.click(getByTestId('user-context-layer:v1-add-to-map-0').first())

    await clickLayerAction(getByTestId, {
      // The instance id is `user-polygons-${Date.now()}-${Date.now()}` (getUserPolygonsDataviewInstance,
      // then LayerLibraryUserPanel), and the test clock moves, so neither timestamp is fixed
      row: /^context-layer-user-polygons-\d+-\d+$/,
      action: `user-layer-edit-${USER_POLYGON_DATASET_ID}`,
    })

    const { mapDrawing, mapDrawingEditId } = navigateToPolygonEditor().search as {
      mapDrawing: string
      mapDrawingEditId: string
    }
    await expect
      .poll(() => store.getState().location.query)
      .toMatchObject({ mapDrawing, mapDrawingEditId })
  })

  it('should load the polygon in the map', async () => {
    const jotaiStore = createJotaiStore()
    const store = makeStore(defaultState)

    const { router } = await render({ store, jotaiStore })

    await router.navigate(navigateToPolygonEditor())

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
          cacheHash: expect.stringContaining('user-polygons-1771416000000-1771416000000'),
        },
        'draw-layer': {
          loaded: true,
          cacheHash: '',
        },
      })
  })
})
