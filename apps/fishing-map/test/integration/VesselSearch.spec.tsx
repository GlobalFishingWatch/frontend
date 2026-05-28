import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import {
  clickMapAtCoordinates,
  GABU_REEFER_VIEWER_COORDS,
  waitForVesselTrackReady,
} from 'test/utils/map'
import { navigateToVesselSearch } from 'test/utils/navigation/navigateToVesselSearch'
import { defaultState } from 'test/utils/store'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { ROUTE_PATHS } from 'router/routes.utils'
import { makeStore } from 'store'

describe('Vessel search', async () => {
  it('can search for a vessel and see it on the map', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()

    const { getByTestId, router } = await render({
      store,
      jotaiStore,
    })
    await router.navigate(navigateToVesselSearch())

    await userEvent.type(getByTestId('search-vessels-basic-input'), 'Gabu Reefer')
    await userEvent.click(getByTestId('link-vessel-profile'))

    await waitForVesselTrackReady(jotaiStore, getByTestId)
    await clickMapAtCoordinates({
      jotaiStore,
      getByTestId,
      longitude: GABU_REEFER_VIEWER_COORDS[0],
      latitude: GABU_REEFER_VIEWER_COORDS[1],
    })

    await expect
      .element(getByTestId('map-popup-wrapper').getByText('Gabu Reefer').first())
      .toBeVisible()
  })

  it('preserves vessel search value when navigating away and back', async () => {
    const store = makeStore(defaultState)

    const { getByTestId, router } = await render({
      store,
    })
    await router.navigate(navigateToVesselSearch())
    await userEvent.type(getByTestId('search-vessels-basic-input'), 'Gabu Reefer')
    await expect
      .poll(() => store.getState().location.query.query, { timeout: 5000 })
      .toBe('Gabu Reefer')
    await router.navigate({
      to: ROUTE_PATHS.WORKSPACE,
      params: {
        category: 'fishing-activity',
        workspaceId: 'default-public',
      },
      search: store.getState().location.query,
    })
    await router.navigate(navigateToVesselSearch({ query: 'Gabu Reefer' }))

    await expect
      .poll(() => (getByTestId('search-vessels-basic-input').element() as HTMLInputElement).value, {
        timeout: 10000,
      })
      .toBe('Gabu Reefer')
  })

  it('reacts to clearing the search input', async () => {
    const store = makeStore(defaultState)

    const { getByTestId, router } = await render({
      store,
    })
    await router.navigate(navigateToVesselSearch())
    const searchVesselInput = getByTestId('search-vessels-basic-input')
    await userEvent.type(searchVesselInput, 'Gabu Reefer')

    await expect.element(getByTestId('link-vessel-profile')).toBeVisible()

    await userEvent.clear(searchVesselInput)

    await expect.element(getByTestId('link-vessel-profile')).not.toBeInTheDocument()
  })
})
