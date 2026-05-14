import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import { navigateToFijiWorkspaceWithAllLayersAction } from 'test/utils/actions/navigateToFijiWorkspace'
import { defaultState } from 'test/utils/store/redux-store-test'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { deckLayersStateAtom } from '@globalfishingwatch/deck-layer-composer'

import App from 'features/app/App'
import { makeStore } from 'store'

describe('Marine Manager', () => {
  it('should be able to navigate to marine manager workspace through sidebar', async () => {
    const testingMiddleware = createTestingMiddleware()
    const store = makeStore(defaultState, [testingMiddleware.createMiddleware()])

    const { getByTestId, getByText, getByRole } = await render(<App />, { store })

    await userEvent.click(getByTestId('link-category-marine-manager'))

    await userEvent.click(getByRole('link', { name: 'Fiji' }).first())

    // After the TanStack Router migration, the WORKSPACE navigation is
    // captured as a `location/setLocation` action; payload mirrors LocationState.
    const action = testingMiddleware.getLastLocationActionByType('WORKSPACE')

    expect(action).toBeDefined()
    expect(action?.payload).toMatchObject({
      type: 'WORKSPACE',
      payload: {
        category: 'marine-manager',
        workspaceId: 'fiji-public',
      },
      pathname: '/marine-manager/fiji-public',
    })
    expect(store.getState().location.payload).toMatchObject({
      category: 'marine-manager',
      workspaceId: 'fiji-public',
    })
    await expect.element(getByText('Fiji')).toBeInTheDocument()
  })

  it('should show workspace layers matching the workspace configuration', async () => {
    const jotaiStore = createJotaiStore()
    const store = makeStore(defaultState, [])
    store.dispatch(navigateToFijiWorkspaceWithAllLayersAction)

    await render(<App />, { store, jotaiStore })

    // const state = store.getState()

    // const fijiWorkspace = state.workspaces.entities['fiji-public']

    // expect(fijiWorkspace).toBeDefined()

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
        'sentinel2-auxiliar': expectedLayerProps,
        'global-sea-surface-temperature': expectedLayerProps,
        'global-water-salinity': expectedLayerProps,
        'global-chlorophyl': expectedLayerProps,
        'encounter-events': expectedLayerProps,
        'basemap-labels': expectedLayerProps,
        'context-layer-graticules': expectedLayerProps,
      })
  })
})
