import React from 'react'
import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { navigateToVesselSearchAction } from 'test/utils/actions/navigateToVesselSearch'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import App from 'features/app/App'
import { mapInstanceAtom } from 'features/map/map.atoms'
import { MAP_VIEW_ID } from 'features/map/map-viewport.hooks'
import { makeStore } from 'store'

describe('Vessel search', async () => {
  it('can search for a vessel and see it on the map', async () => {
    const store = makeStore(defaultState, [], true)
    const jotaiStore = createJotaiStore()

    store.dispatch(navigateToVesselSearchAction)

    const { getByTestId } = await render(<App />, {
      store,
      jotaiStore,
    })

    await userEvent.type(getByTestId('search-vessels-basic-input'), 'Gabu Reefer')
    await userEvent.click(getByTestId('link-vessel-profile'))

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mapInstance = jotaiStore.get(mapInstanceAtom)
    const viewport = mapInstance?.getViewports?.().find((v: any) => v.id === MAP_VIEW_ID)
    const [x, y] = viewport?.project([-15, 28]) || [0, 0]

    await userEvent.hover(getByTestId('app-main'), { position: { x, y } })
    await userEvent.click(getByTestId('app-main'), { position: { x, y } })

    await expect.element(getByTestId('map-popup-wrapper').getByText('Gabu Reefer')).toBeVisible()
  })

  it('preserves vessel search value when navigating away and back', async () => {
    const store = makeStore(defaultState, [], true)

    const { getByTestId } = await render(<App />, {
      store,
    })

    store.dispatch(navigateToVesselSearchAction)
    await userEvent.type(getByTestId('search-vessels-basic-input'), 'Gabu Reefer')
    await userEvent.click(getByTestId('link-search'))
    await userEvent.click(getByTestId('link-search'))

    expect(getByTestId('search-vessels-basic-input')).toHaveValue('Gabu Reefer')
  })

  it('reacts to clearing the search input', async () => {
    const store = makeStore(defaultState, [], true)

    const { getByTestId } = await render(<App />, {
      store,
    })

    store.dispatch(navigateToVesselSearchAction)
    const searchVesselInput = getByTestId('search-vessels-basic-input')
    await userEvent.type(searchVesselInput, 'Gabu Reefer')

    await expect.element(getByTestId('link-vessel-profile')).toBeVisible()

    await userEvent.clear(searchVesselInput)

    await expect.element(getByTestId('link-vessel-profile')).not.toBeInTheDocument()
  })
})
