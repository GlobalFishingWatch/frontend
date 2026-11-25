import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { getRouteToFijiWorkspaceWithAllLayers } from 'test/utils/navigation/navigateToFijiWorkspace'
import { defaultState } from 'test/utils/store'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { deckLayersStateAtom } from '@globalfishingwatch/deck-layer-composer'

import { WORKSPACE } from 'router/routes'
import { makeStore } from 'store'

describe('Marine Manager', () => {
  it('should be able to navigate to marine manager workspace through sidebar', async () => {
    const store = makeStore(defaultState)

    const { getByTestId, getByText, getByRole } = await render({ store })

    await userEvent.click(getByTestId('link-category-marine-manager'))

    await userEvent.click(getByRole('link', { name: 'Fiji' }).first())

    await expect
      .poll(() => store.getState().location)
      .toMatchObject({
        type: WORKSPACE,
        payload: { category: 'marine-manager', workspaceId: 'fiji-public' },
      })
    await expect.element(getByText('Fiji')).toBeInTheDocument()
  })

  it('should show workspace layers matching the workspace configuration', async () => {
    const jotaiStore = createJotaiStore()
    const store = makeStore(defaultState)

    const { router } = await render({ store, jotaiStore })
    await router.navigate(getRouteToFijiWorkspaceWithAllLayers())

    const expectedLayerProps = {
      loaded: expect.any(Boolean),
      cacheHash: expect.any(String),
    }
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
