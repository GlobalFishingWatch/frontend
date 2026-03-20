import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import {
  navigateToFijiWorkspaceAction,
  navigateToFijiWorkspaceWithAllLayersAction,
} from 'test/utils/actions/navigateToFijiWorkspace'
import { defaultState } from 'test/utils/store/redux-store-test'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { deckLayersStateAtom } from '@globalfishingwatch/deck-layer-composer'

import App from 'features/app/App'
import { makeStore } from 'store'

describe('Marine Manager', () => {
  it('should be able to navigate to marine manager workspace through sidebar', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()], true)

    const { getByTestId, getByText, getByRole } = await render(<App />, { store })

    await userEvent.click(getByTestId('category-tab-marine-manager'))

    await userEvent.click(getByRole('link', { name: 'Fiji' }).first())

    const action = testingMiddleware.getLastActionByType('WORKSPACE')

    expect(action).toMatchObject({
      ...navigateToFijiWorkspaceAction,
      meta: {
        ...navigateToFijiWorkspaceAction.meta,
        location: {
          ...navigateToFijiWorkspaceAction.meta.location,
          kind: expect.stringMatching(/redirect|push/),
          prev: expect.any(Object),
        },
      },
    })
    await expect.element(getByText('Fiji')).toBeInTheDocument()
  })

  it('should show workspace layers matching the workspace configuration', async () => {
    const jotaiStore = createJotaiStore()
    const store = makeStore(defaultState, [], true)
    store.dispatch(navigateToFijiWorkspaceWithAllLayersAction)

    await render(<App />, { store, jotaiStore })

    const state = store.getState()

    const fijiWorkspace = state.workspaces.entities['fiji-public']

    expect(fijiWorkspace).toBeDefined()

    const expectedLayerProps = {
      loaded: expect.any(Boolean),
      cacheHash: expect.any(String),
    }
    // Wait for layers to initialize
    await expect
      .poll(() => jotaiStore.get(deckLayersStateAtom), { timeout: 20000, interval: 1000 })
      .toMatchObject({
        basemap: expectedLayerProps,
        'context-layer-high-seas': expectedLayerProps,
        'context-layer-rfmo': expectedLayerProps,
        'context-layer-mpa': expectedLayerProps,
        'context-layer-eez': expectedLayerProps,
        'sar-match-auxiliar': expectedLayerProps,
        'sentinel2-auxiliar': expectedLayerProps,
        'global-sea-surface-temperature': expectedLayerProps,
        'global-water-salinity': expectedLayerProps,
        'global-chlorophyl': expectedLayerProps,
        'sentinel2,viirs-match,sar-match': expectedLayerProps,
        'fishing,presence': expectedLayerProps,
        'encounter-events': expectedLayerProps,
        'basemap-labels': expectedLayerProps,
        'context-layer-graticules': expectedLayerProps,
      })
  })
})
