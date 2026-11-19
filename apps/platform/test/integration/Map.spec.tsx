import { createStore as createJotaiStore } from 'jotai'
import { render } from 'test/appTestUtils'
import { clickLayerAction } from 'test/utils/layers'
import {
  hoverThenClickMap,
  projectToMap,
  waitForLayersLoaded,
  waitForMapViewport,
} from 'test/utils/map'
import { defaultState, defaultViewport } from 'test/utils/store'
import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { deckLayersStateAtom } from '@globalfishingwatch/deck-layer-composer'

import { viewStateAtom } from 'features/_map/map/map.atoms'
import { timerangeState } from 'features/_map/timebar/timerange.hooks'
import { makeStore } from 'store'

describe('Map', () => {
  it('should render a map element and it should be loaded and with the default state', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render({ store, jotaiStore })
    const mapElement = getByTestId('map-container')

    await expect.element(mapElement).toBeVisible()

    // The URL viewport reaches the atom when the map mounts (useMapViewStateUrlSync), after
    // render() resolves. Reading it straight away returns the atom's initial default instead.
    await expect.poll(() => jotaiStore.get(viewStateAtom)).toMatchObject(defaultViewport)
  })

  it('should pass zoom, latitude and longitude changes of query params to map state', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render({ store, jotaiStore })

    const mapElement = getByTestId('app-main')

    // deck has to be mounted to receive the drag
    await waitForMapViewport(jotaiStore)

    await userEvent.dragAndDrop(mapElement, mapElement, {
      sourcePosition: { x: 400, y: 35 },
      targetPosition: { x: 700, y: 35 },
      steps: 10, // This is needed to trigger the drag event, as a single step is not captured
    })

    await userEvent.click(getByTestId('map-control-zoom-in'))

    // The viewport reaches the URL after a debounce: wait until both agree.
    await expect
      .poll(() => {
        const view = jotaiStore.get(viewStateAtom)
        const url = store.getState().location.query
        return (
          view.longitude === url?.longitude &&
          view.latitude === url?.latitude &&
          view.zoom === url?.zoom
        )
      })
      .toBe(true)

    const viewState = jotaiStore.get(viewStateAtom)
    const urlState = store.getState().location.query

    expect(viewState.longitude).toBe(urlState?.longitude)
    expect(viewState.latitude).toBe(urlState?.latitude)
    expect(viewState.zoom).toBe(urlState?.zoom)
  })

  it('should preserve map state when adding a new layer', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId, getByText } = await render({ store, jotaiStore })

    const openLayerModalButton = getByTestId('activity-add-layer-button')
    const addLayerButton = getByTestId('add-layer-eez-button')

    await openLayerModalButton.click()
    await expect.element(getByText('Layer Library')).toBeVisible()
    await addLayerButton.click()
    await waitForLayersLoaded(jotaiStore)

    const viewState = jotaiStore.get(viewStateAtom)

    expect(viewState).toMatchObject(defaultViewport)
  })

  it('should preserve map state when removing a layer', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render({ store, jotaiStore })

    await clickLayerAction(getByTestId, {
      row: 'activity-layer-panel-switch-presence',
      action: 'activity-layer-panel-remove-presence',
    })
    // Any viewport reset would happen as the layers re-render
    await waitForLayersLoaded(jotaiStore)

    const viewState = jotaiStore.get(viewStateAtom)
    expect(viewState).toMatchObject(defaultViewport)
  })

  it('should update layers when interacting with the map', async () => {
    const fetchSpy = vi.spyOn(GFWAPI, 'fetch')
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render({ store, jotaiStore })

    await waitForLayersLoaded(jotaiStore)

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

    // Zoom in, then wait for the tiles of the new zoom
    await userEvent.click(getByTestId('map-control-zoom-in'))
    await expect.poll(() => jotaiStore.get(viewStateAtom).zoom).toBe(defaultViewport.zoom + 1)
    await waitForLayersLoaded(jotaiStore)

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
    const store = makeStore(defaultState)
    const fetchSpy = vi.spyOn(GFWAPI, 'fetch')
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render({ store, jotaiStore })

    await waitForLayersLoaded(jotaiStore)

    await userEvent.click(getByTestId('interval-btn-year'))

    // The activity layer picks up the new period when its cacheHash changes
    await expect
      .poll(() => jotaiStore.get(deckLayersStateAtom)['ais,vms']?.cacheHash)
      .toMatch(/YEAR/)
    await waitForLayersLoaded(jotaiStore)

    const timerange = jotaiStore.get(timerangeState)
    const deckLayersState = jotaiStore.get(deckLayersStateAtom)

    // The end is exclusive: the first instant after the last year, matching the API's date-range.
    expect(timerange).toMatchObject({
      start: '2012-01-01T00:00:00.000Z',
      end: '2027-01-01T00:00:00.000Z',
    })
    expect(deckLayersState['ais,vms'].cacheHash).toMatch(
      /1325376000000,1798761600000,1325376000000,YEAR/
    )
    expect(fetchSpy.mock.calls.some((call) => (call[0] as string).includes('&interval=YEAR'))).toBe(
      true
    )
  })

  it('should preserve map state when changing period', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render({ store, jotaiStore })

    await waitForLayersLoaded(jotaiStore)

    await userEvent.click(getByTestId('map-control-zoom-in'))
    await expect.poll(() => jotaiStore.get(viewStateAtom).zoom).toBe(defaultViewport.zoom + 1)
    await userEvent.click(getByTestId('interval-btn-year'))
    await expect
      .poll(() => jotaiStore.get(deckLayersStateAtom)['ais,vms']?.cacheHash)
      .toMatch(/YEAR/)
    await waitForLayersLoaded(jotaiStore)

    const viewState = jotaiStore.get(viewStateAtom)

    expect(viewState).toMatchObject({
      ...defaultViewport,
      zoom: defaultViewport.zoom + 1,
    })
  })

  it('should be able to set map visualization to positions and see the corresponding layers on the map', async () => {
    const store = makeStore(defaultState)
    const jotaiStore = createJotaiStore()
    const { getByTestId } = await render({ store, jotaiStore, authenticated: true })

    await userEvent.dragAndDrop(getByTestId('app-main'), getByTestId('app-main'), {
      sourcePosition: { x: 100, y: 35 },
      targetPosition: { x: 380, y: 35 },
      steps: 10,
    })

    // Zoom in multiple times to enable positions layer; each click must land before the next
    for (let i = 0; i < 8; i++) {
      const zoomBefore = jotaiStore.get(viewStateAtom).zoom
      await userEvent.click(getByTestId('map-control-zoom-in'))
      await expect.poll(() => jotaiStore.get(viewStateAtom).zoom).toBe(zoomBefore + 1)
    }
    await waitForLayersLoaded(jotaiStore)

    await userEvent.click(
      getByTestId('activity-section').getByTestId('activity-visualizations-change-positions')
    )
    await waitForLayersLoaded(jotaiStore)

    const position = await projectToMap(jotaiStore, -37.0458, 19.0776)
    await hoverThenClickMap(getByTestId, position)

    await expect.element(getByTestId('map-popup-wrapper').getByText(/No.805 Oryong/i)).toBeVisible()
  })
})
