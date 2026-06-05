import type { Store as JotaiStore } from 'jotai/vanilla/store'
import { expect, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import { mapInstanceAtom } from 'features/map/map.atoms'
import { MAP_VIEW_ID } from 'features/map/map-viewport.hooks'

import type { render } from '../appTestUtils'

/** Geographic coords where Gabu Reefer track is clickable at default workspace zoom */
export const GABU_REEFER_CLICK_COORDS: [number, number] = [-17.3, 26.4]
/** Alternate coords used for vessel-viewer link test */
export const GABU_REEFER_VIEWER_COORDS: [number, number] = [-15, 28]

type MapTestId = Awaited<ReturnType<typeof render>>['getByTestId']

export const waitForMapLoaded = async (
  getByTestId: Awaited<ReturnType<typeof render>>['getByTestId'],
  timeout = 60000
) => {
  await expect.element(getByTestId('map-loading-spinner'), { timeout }).not.toBeVisible()
}

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
    { timeout }
  )
}

export async function waitForMapSpinnerHidden(getByTestId: MapTestId, timeout = 60000) {
  await expect.element(getByTestId('map-loading-spinner'), { timeout }).not.toBeVisible()
}

/** Wait for vessel track tiles to render before map interaction */
export async function waitForVesselTrackReady(jotaiStore: JotaiStore, getByTestId: MapTestId) {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  await waitForMapViewport(jotaiStore)
  await waitForMapSpinnerHidden(getByTestId).catch(() => undefined)
}

export async function clickMapAtCoordinates({
  jotaiStore,
  getByTestId,
  longitude,
  latitude,
  hoverDelayMs = 500,
}: {
  jotaiStore: JotaiStore
  getByTestId: MapTestId
  longitude: number
  latitude: number
  hoverDelayMs?: number
}) {
  await waitForMapViewport(jotaiStore)

  const mapInstance = jotaiStore.get(mapInstanceAtom)
  const viewport = mapInstance?.getViewports?.().find((v: { id?: string }) => v.id === MAP_VIEW_ID)
  if (!viewport) {
    throw new Error('Map viewport not found - cannot project coordinates')
  }

  const [x, y] = viewport.project([longitude, latitude]) || [0, 0]
  const mapElement = getByTestId('app-main')

  await userEvent.hover(mapElement, { position: { x, y } })

  if (hoverDelayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, hoverDelayMs))
  }

  await userEvent.click(mapElement, { position: { x, y } })

  return { x, y }
}

export async function openVesselOnMap({
  jotaiStore,
  getByTestId,
  longitude = GABU_REEFER_CLICK_COORDS[0],
  latitude = GABU_REEFER_CLICK_COORDS[1],
  hoverDelayMs = 500,
}: {
  jotaiStore: JotaiStore
  getByTestId: MapTestId
  longitude?: number
  latitude?: number
  hoverDelayMs?: number
}) {
  await waitForVesselTrackReady(jotaiStore, getByTestId)
  await clickMapAtCoordinates({
    jotaiStore,
    getByTestId,
    longitude,
    latitude,
    hoverDelayMs,
  })
}
