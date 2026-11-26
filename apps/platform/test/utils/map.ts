import type { NavigateOptions } from '@tanstack/react-router'
import { expect, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import { deckLayersStateAtom } from '@globalfishingwatch/deck-layer-composer'
import { MAP_POPUP_TESTID, MAP_VIEW_ID } from '@platform/config/selectors/map'

import { mapInstanceAtom, viewStateAtom } from 'features/_map/map/map.atoms'
import type { QueryParams } from 'types'

import type { JotaiStore, render } from '../appTestUtils'

/**
 * Waits until every deck layer reports loaded (the same state the map spinner shows), and keeps
 * reporting it for `settleMs`.
 *
 * WHY the settle window: right after an action (add a layer, zoom, change the period) the new
 * layer or its tiles may not have started loading yet, so "nothing is loading" is briefly true
 * before the load begins. A single check — or waiting for the spinner to be hidden — passes in
 * that gap. Pass `layerIds` when the test knows which layer it waits for; a layer that has not
 * been created yet then counts as not loaded.
 *
 * Basemap layers are not waited for unless named in `layerIds`: they are static imagery from GCS
 * (passed through to the real network, dozens of tiles), no spec asserts on them, and they were
 * the slowest layer to report loaded — 10s+ after every data layer had finished.
 *
 * Uses performance.now(): `Date` is frozen by vi.setSystemTime in the setup file.
 */
export async function waitForLayersLoaded(
  jotaiStore: JotaiStore,
  {
    layerIds = [],
    settleMs = 300,
    timeout = 20000,
  }: { layerIds?: string[]; settleMs?: number; timeout?: number } = {}
) {
  const start = performance.now()
  let loadedSince: number | undefined
  let lastLog = start
  for (;;) {
    const layers = jotaiStore.get(deckLayersStateAtom)
    const pending = Object.entries(layers)
      .filter(
        ([id, layer]) => !layer.loaded && (!id.startsWith('basemap') || layerIds.includes(id))
      )
      .map(([id]) => id)
    const missing = layerIds.filter((id) => !layers[id])
    const now = performance.now()
    if (import.meta.env.VITEST_NETWORK_DEBUG === 'true' && now - lastLog > 1000) {
      lastLog = now
      console.log(
        `[layers] ${Math.round(now - start)}ms loading: [${pending.join(', ')}] missing: [${missing.join(', ')}]`
      )
    }
    if (!pending.length && !missing.length && Object.keys(layers).length > 0) {
      loadedSince ??= now
      if (now - loadedSince >= settleMs) return
    } else {
      loadedSince = undefined
    }
    if (now - start > timeout) {
      throw new Error(
        `Layers not loaded after ${timeout}ms. Loading: [${pending.join(', ')}]. Missing: [${missing.join(', ')}]`
      )
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
}

/**
 * Hovers a map position, then clicks it. The hover popup appearing is the signal that deck has
 * picked the feature under the pointer; positions with nothing to show on hover still get clicked
 * after a short wait, so this works for both.
 */
export async function hoverThenClickMap(
  getByTestId: MapTestId,
  { x, y }: { x: number; y: number }
) {
  const mapElement = getByTestId('app-main')
  await userEvent.hover(mapElement, { position: { x, y } })
  await expect
    .element(getByTestId(MAP_POPUP_TESTID).first(), { timeout: 2000 })
    .toBeVisible()
    .catch(() => undefined)
  await userEvent.click(mapElement, { position: { x, y } })
}

/** Geographic coords where Gabu Reefer track is clickable at default workspace zoom */
export const GABU_REEFER_CLICK_COORDS: [number, number] = [-17.3, 26.4]
/** Alternate coords used for vessel-viewer link test */
export const GABU_REEFER_VIEWER_COORDS: [number, number] = [-15, 28]

type MapTestId = Awaited<ReturnType<typeof render>>['getByTestId']

export async function waitForMapInstance(jotaiStore: JotaiStore, timeout = 15000) {
  await expect
    .poll(() => jotaiStore.get(mapInstanceAtom), {
      timeout,
      interval: 500,
    })
    .toBeDefined()
}

export async function waitForMapViewport(jotaiStore: JotaiStore, timeout = 10000) {
  await waitForMapInstance(jotaiStore, timeout)
  await vi.waitFor(
    () => {
      const mapInstance = jotaiStore.get(mapInstanceAtom)
      const viewport = mapInstance
        ?.getViewports?.()
        .find((v: { id?: string }) => v.id === MAP_VIEW_ID)
      if (!viewport) {
        throw new Error('Map viewport not ready')
      }
      return viewport
    },
    { timeout, message: 'map viewport ready' }
  )
}

/** Wait for vessel track tiles to render before map interaction */
export async function waitForVesselTrackReady(jotaiStore: JotaiStore) {
  await waitForMapViewport(jotaiStore)
  await waitForLayersLoaded(jotaiStore)
}

/**
 * Waits until the camera has stopped moving for `settleMs`. Views that fit the map to a track or
 * an area animate the camera; a lon/lat projected mid-animation lands in a different pixel — and a
 * different 4wings cell — from one run to the next, so the recorded response no longer matches.
 */
export async function waitForViewportSettled(
  jotaiStore: JotaiStore,
  { settleMs = 300, timeout = 10000 }: { settleMs?: number; timeout?: number } = {}
) {
  const start = performance.now()
  let last = JSON.stringify(jotaiStore.get(viewStateAtom))
  let stableSince = start
  for (;;) {
    await new Promise((resolve) => setTimeout(resolve, 50))
    const now = performance.now()
    const current = JSON.stringify(jotaiStore.get(viewStateAtom))
    if (current !== last) {
      last = current
      stableSince = now
    } else if (now - stableSince >= settleMs) {
      return
    }
    if (now - start > timeout) {
      throw new Error(`Map viewport still moving after ${timeout}ms`)
    }
  }
}

/**
 * Pixels (relative to the map element) of some object drawn by the layer whose id passes
 * `matchLayerId`, found by asking deck what is under a grid of points.
 *
 * For layers whose objects sit where the data puts them, such as event clusters: a spec that needs
 * "a cluster" cannot know where one is drawn, and a fixed pixel lands between them.
 */
export async function findLayerObjectPosition(
  jotaiStore: JotaiStore,
  matchLayerId: (layerId: string) => boolean,
  { step = 24, timeout = 10000 }: { step?: number; timeout?: number } = {}
) {
  await waitForMapViewport(jotaiStore)
  await waitForViewportSettled(jotaiStore)
  return vi.waitFor(
    () => {
      const deck = jotaiStore.get(mapInstanceAtom)
      const viewport = deck?.getViewports?.().find((v: { id?: string }) => v.id === MAP_VIEW_ID)
      if (!deck || !viewport) throw new Error('Map viewport not ready')
      for (let y = step / 2; y < viewport.height; y += step) {
        for (let x = step / 2; x < viewport.width; x += step) {
          const info = deck.pickObject({ x, y, radius: 0 })
          if (info?.layer && matchLayerId(info.layer.id)) return { x, y }
        }
      }
      throw new Error('No object of the layer on screen yet')
    },
    { timeout, interval: 500 }
  )
}

/** Projects a lon/lat to pixels relative to the map element, once the camera has settled. */
export async function projectToMap(jotaiStore: JotaiStore, longitude: number, latitude: number) {
  await waitForMapViewport(jotaiStore)
  await waitForViewportSettled(jotaiStore)
  const mapInstance = jotaiStore.get(mapInstanceAtom)
  const viewport = mapInstance?.getViewports?.().find((v: { id?: string }) => v.id === MAP_VIEW_ID)
  if (!viewport) {
    throw new Error('Map viewport not found - cannot project coordinates')
  }
  const [x, y] = viewport.project([longitude, latitude]) || [0, 0]
  return { x, y }
}

export async function clickMapAtCoordinates({
  jotaiStore,
  getByTestId,
  longitude,
  latitude,
}: {
  jotaiStore: JotaiStore
  getByTestId: MapTestId
  longitude: number
  latitude: number
}) {
  const position = await projectToMap(jotaiStore, longitude, latitude)
  await hoverThenClickMap(getByTestId, position)
  return position
}

export async function openMapPopupAt({
  jotaiStore,
  router,
  longitude,
  latitude,
}: {
  jotaiStore: JotaiStore
  router: MapRouter
  longitude: number
  latitude: number
}) {
  await waitForMapViewport(jotaiStore)
  await waitForLayersLoaded(jotaiStore)
  await waitForViewportSettled(jotaiStore)
  const clickedCoordinates: [number, number] = [longitude, latitude]
  const options: NavigateOptions & {
    search?: QueryParams | ((prev: QueryParams) => QueryParams)
  } = {
    replace: true,
    search: (prev: QueryParams) => ({ ...prev, clickedCoordinates }),
  }
  await router.navigate(options)
  await expect.element(page.getByTestId(MAP_POPUP_TESTID).first()).toBeVisible()
}

type MapRouter = Awaited<ReturnType<typeof render>>['router']

export async function openVesselOnMap({
  jotaiStore,
  getByTestId,
  longitude = GABU_REEFER_CLICK_COORDS[0],
  latitude = GABU_REEFER_CLICK_COORDS[1],
}: {
  jotaiStore: JotaiStore
  getByTestId: MapTestId
  longitude?: number
  latitude?: number
}) {
  await waitForVesselTrackReady(jotaiStore)
  await clickMapAtCoordinates({ jotaiStore, getByTestId, longitude, latitude })
}
