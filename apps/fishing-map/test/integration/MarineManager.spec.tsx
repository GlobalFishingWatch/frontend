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

    expect(action).toMatchObject(navigateToFijiWorkspaceAction)
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

    // Wait for layers to initialize
    await new Promise((resolve) => setTimeout(resolve, 5000))

    const deckLayersState = jotaiStore.get(deckLayersStateAtom)

    expect(deckLayersState).toMatchObject({
      basemap: {
        loaded: false,
        cacheHash: '',
      },
      'context-layer-high-seas': {
        loaded: true,
        cacheHash: '',
      },
      'context-layer-rfmo': {
        loaded: true,
        cacheHash: '',
      },
      'context-layer-mpa': {
        loaded: true,
        cacheHash: '',
      },
      'context-layer-eez': {
        loaded: true,
        cacheHash: '',
      },
      'sar-match-auxiliar': {
        loaded: true,
        cacheHash: '',
      },
      'sentinel2-auxiliar': {
        loaded: true,
        cacheHash: '',
      },
      'global-sea-surface-temperature': {
        loaded: true,
        cacheHash:
          '1761955200000,1771372800000,1759276800000,DAY,,,-global-sea-surface-temperature-public-global-sst:v20231213--|false|true',
      },
      'global-water-salinity': {
        loaded: true,
        cacheHash:
          '1761955200000,1771372800000,1759276800000,DAY,,,-global-water-salinity-public-global-salinity:v20231213--|false|true',
      },
      'global-chlorophyl': {
        loaded: true,
        cacheHash:
          '1735689600000,1771372800000,1704067200000,MONTH,,,-global-chlorophyl-public-global-chlorophyl:v20231213--|false|true',
      },
      'sentinel2,viirs-match,sar-match': {
        loaded: true,
        cacheHash:
          '1761955200000,1771372800000,1759276800000,DAY,,,-sentinel2,viirs-match,sar-match-public-global-sentinel2-presence:v4.0,public-global-viirs-presence:v4.0,public-global-sar-presence:v4.0--,,|false|true',
      },
      'fishing,presence': {
        loaded: true,
        cacheHash:
          '1761955200000,1771372800000,1759276800000,DAY,,,-fishing,presence-public-global-fishing-effort:v4.0,public-global-presence:v4.0--,|false|true',
      },
      'encounter-events': {
        loaded: true,
        cacheHash: 'true',
      },
      'basemap-labels': {
        loaded: true,
        cacheHash: '',
      },
      'context-layer-graticules': {
        loaded: true,
        cacheHash: '',
      },
    })
  })
})
