import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { createTestingMiddleware } from 'test/testingStoreMiddeware'
import {
  navigateToFijiWorkspaceAction,
  navigateToFijiWorkspaceWithAllLayersAction,
} from 'test/utils/actions/navigateToFijiWorkspace'
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

    await userEvent.click(getByTestId('link-category-marine-manager'))

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

    const expectedProps = {
      loaded: expect.any(Boolean),
      cacheHash: expect.any(String),
    }
    // Wait for layers to initialize
    await expect
      .poll(() => jotaiStore.get(deckLayersStateAtom), { timeout: 20000, interval: 1000 })
      .toMatchObject({
        basemap: expectedProps,
        'context-layer-high-seas': expectedProps,
        'context-layer-rfmo': expectedProps,
        'context-layer-mpa': expectedProps,
        'context-layer-eez': expectedProps,
        'sar-match-auxiliar': expectedProps,
        'sentinel2-auxiliar': expectedProps,
        'global-sea-surface-temperature': expectedProps,
        'global-water-salinity': expectedProps,
        'global-chlorophyl': expectedProps,
        'sentinel2,viirs-match,sar-match': expectedProps,
        'fishing,presence': expectedProps,
        'encounter-events': expectedProps,
        'basemap-labels': expectedProps,
        'context-layer-graticules': expectedProps,
      })
  })
})
