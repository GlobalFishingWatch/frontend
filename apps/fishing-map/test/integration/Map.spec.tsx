import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { defaultState } from 'test/defaultState'
import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { deckLayersStateAtom } from '@globalfishingwatch/deck-layer-composer'

import { DEFAULT_VIEWPORT } from 'data/config'
import App from 'features/app/App'
import { viewStateAtom } from 'features/map/map.atoms'
import { timerangeState } from 'features/timebar/timebar.hooks'
import { makeStore } from 'store'

describe('Map', () => {
  it('should render a map element and it should be loaded and with the default state', async () => {
    const store = makeStore(defaultState, [], true)
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render(<App />, { store, jotaiStore })
    const mapElement = getByTestId('map-container')
    expect(store.getState().map.loaded).toBe(true)

    const viewState = jotaiStore.get(viewStateAtom)

    await expect.element(mapElement).toBeVisible()

    expect(viewState).toMatchObject({
      latitude: DEFAULT_VIEWPORT.latitude,
      longitude: DEFAULT_VIEWPORT.longitude,
      zoom: DEFAULT_VIEWPORT.zoom,
    })
  })

  it('should pass zoom, latitude and longitude changes of query params to map state', async () => {
    const store = makeStore(defaultState, [], true)
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render(<App />, { store, jotaiStore })

    const mapElement = getByTestId('app-main')

    expect(store.getState().map.loaded).toBe(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    await userEvent.dragAndDrop(mapElement, mapElement, {
      sourcePosition: { x: 400, y: 35 },
      targetPosition: { x: 700, y: 35 },
      steps: 10, // This is needed to trigger the drag event, as a single step is not captured
    })

    await userEvent.click(getByTestId('map-control-zoom-in'))

    // Wait for the debounced URL update (1000ms debounce time)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const viewState = jotaiStore.get(viewStateAtom)
    const urlState = store.getState().location.query

    expect(viewState.longitude).toBe(urlState?.longitude)
    expect(viewState.latitude).toBe(urlState?.latitude)
    expect(viewState.zoom).toBe(urlState?.zoom)
  })

  it('should preserve map state when adding a new layer', async () => {
    const store = makeStore(defaultState, [], true)
    const jotaiStore = createJotaiStore()
    const { getByTestId, getByText } = await render(<App />, { store, jotaiStore })

    const openLayerModalButton = getByTestId('activity-add-layer-button')
    const addLayerButton = getByTestId('add-layer-eez-button')

    expect(store.getState().map.loaded).toBe(true)
    await userEvent.hover(getByTestId('activity-layer-panel-switch-presence'))
    await new Promise((resolve) => setTimeout(resolve, 300))
    await openLayerModalButton.click()
    await expect.element(getByText('Layer Library')).toBeVisible()
    await addLayerButton.click()
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const viewState = jotaiStore.get(viewStateAtom)

    expect(viewState).toMatchObject({
      latitude: DEFAULT_VIEWPORT.latitude,
      longitude: DEFAULT_VIEWPORT.longitude,
      zoom: DEFAULT_VIEWPORT.zoom,
    })
  })

  it('should preserve map state when removing a layer', async () => {
    const store = makeStore(defaultState, [], true)
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render(<App />, { store, jotaiStore })

    const removeLayerButton = getByTestId('activity-layer-panel-remove-presence')

    expect(store.getState().map.loaded).toBe(true)

    await userEvent.hover(getByTestId('activity-layer-panel-switch-presence'))
    await new Promise((resolve) => setTimeout(resolve, 300))
    await removeLayerButton.click()

    const viewState = jotaiStore.get(viewStateAtom)
    expect(viewState).toMatchObject({
      latitude: DEFAULT_VIEWPORT.latitude,
      longitude: DEFAULT_VIEWPORT.longitude,
      zoom: DEFAULT_VIEWPORT.zoom,
    })
  })

  it('should update layers when interacting with the map', async () => {
    const fetchSpy = vi.spyOn(GFWAPI, 'fetch')
    const store = makeStore(defaultState, [], true)
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render(<App />, { store, jotaiStore })

    expect(store.getState().map.loaded).toBe(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const getTileZoomLevels = () => {
      const allUrls = fetchSpy.mock.calls.map((call) => call[0] as string)
      const tileUrls = allUrls.filter((url) => url.includes('/4wings/tile/heatmap/'))

      return tileUrls.map((url) => {
        const match = url.match(/\/tile\/heatmap\/(\d+)\//)
        return match ? parseInt(match[1]) : 0
      })
    }

    const maxZoomBefore = Math.max(...getTileZoomLevels(), 0)
    const callsBeforeZoom = fetchSpy.mock.calls.length

    // Zoom in
    await userEvent.click(getByTestId('map-control-zoom-in'))
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verify zoom increased in viewport
    const viewStateAfter = jotaiStore.get(viewStateAtom)
    expect(viewStateAfter.zoom).toBe(DEFAULT_VIEWPORT.zoom + 1)

    // Get zoom levels from new tile requests
    const newTileZooms = fetchSpy.mock.calls
      .slice(callsBeforeZoom)
      .map((call) => call[0] as string)
      .filter((url) => url.includes('/4wings/tile/heatmap/'))
      .map((url) => {
        const match = url.match(/\/tile\/heatmap\/(\d+)\//)
        return match ? parseInt(match[1]) : 0
      })

    const maxZoomAfter = Math.max(...newTileZooms, 0)

    // Verify new tiles were requested with higher zoom
    expect(newTileZooms.length).toBeGreaterThan(0)
    expect(maxZoomAfter).toBeGreaterThan(maxZoomBefore)

    fetchSpy.mockRestore()
  })

  it('should reflect period changes on the state and map', async () => {
    const store = makeStore(defaultState, [], true)
    const fetchSpy = vi.spyOn(GFWAPI, 'fetch')

    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render(<App />, { store, jotaiStore })

    expect(store.getState().map.loaded).toBe(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    await userEvent.click(getByTestId('interval-btn-year'))

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const timerange = jotaiStore.get(timerangeState)
    const deckLayersState = jotaiStore.get(deckLayersStateAtom)

    expect(timerange).toMatchObject({
      start: '2012-01-01T00:00:00.000Z',
      end: '2026-12-31T23:59:59.999Z',
    })
    expect(deckLayersState['ais,vms'].cacheHash).toMatch(
      /1325376000000,1798761599999,1325376000000,YEAR/
    )
    expect(fetchSpy.mock.calls.some((call) => (call[0] as string).includes('&interval=YEAR'))).toBe(
      true
    )
  })

  it('should preserve map state when changing period', async () => {
    const store = makeStore(defaultState, [], true)
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render(<App />, { store, jotaiStore })

    expect(store.getState().map.loaded).toBe(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    await userEvent.click(getByTestId('map-control-zoom-in'))
    await userEvent.click(getByTestId('interval-btn-year'))

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const viewState = jotaiStore.get(viewStateAtom)

    expect(viewState).toMatchObject({
      latitude: DEFAULT_VIEWPORT.latitude,
      longitude: DEFAULT_VIEWPORT.longitude,
      zoom: DEFAULT_VIEWPORT.zoom + 1,
    })
  })
})
