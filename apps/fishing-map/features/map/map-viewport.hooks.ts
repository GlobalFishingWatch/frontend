import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { MapViewProps, WebMercatorViewport } from '@deck.gl/core'
import { MapView } from '@deck.gl/core'
import { debounce, throttle } from 'es-toolkit'
import { atom, useAtomValue, useSetAtom } from 'jotai'

import { DEFAULT_VIEWPORT } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { useDeckMap } from 'features/map/map-context.hooks'
import { selectIsWorkspaceReady } from 'features/workspace/workspace.selectors'
import { updateUrlViewport } from 'routes/routes.actions'
import type { MapCoordinates } from 'types'
import { getUrlViewstateNumericParam } from 'utils/url'

const URL_VIEWPORT_DEBOUNCED_TIME = 1000

const viewStateAtom = atom<MapCoordinates>({
  longitude: getUrlViewstateNumericParam('longitude') || DEFAULT_VIEWPORT.longitude,
  latitude: getUrlViewstateNumericParam('latitude') || DEFAULT_VIEWPORT.latitude,
  zoom: getUrlViewstateNumericParam('zoom') || DEFAULT_VIEWPORT.zoom,
})

export const useMapViewState = () => {
  return useAtomValue(viewStateAtom)
}
export const useMapSetViewState = () => {
  const setViewState = useSetAtom(viewStateAtom)
  return useMemo(
    () =>
      throttle((coordinates: Partial<MapCoordinates>) => {
        setViewState((prev) => ({ ...prev, ...coordinates }))
      }, 1),
    [setViewState]
  )
}

// Hook to set only the map coordinates (longitude, latitude and zoom)
// this doesn't update any of the deckgl view state properties
export function useSetMapCoordinates() {
  const setMapViewState = useMapSetViewState()
  const deckMap = useDeckMap()
  return useCallback(
    (coordinates: Partial<MapCoordinates>) => {
      setMapViewState(coordinates)
      if (deckMap) {
        // Can't find why this is needed to properly update the view state
        deckMap.setProps({ viewState: coordinates as any })
      }
    },
    [deckMap, setMapViewState]
  )
}

export const useUpdateViewStateUrlParams = () => {
  const viewState = useAtomValue(viewStateAtom)
  const isWorkspaceReady = useSelector(selectIsWorkspaceReady)
  const dispatch = useAppDispatch()

  const updateUrlViewportDebounced = useMemo(
    () => debounce(dispatch(updateUrlViewport), URL_VIEWPORT_DEBOUNCED_TIME),
    [dispatch]
  )

  useEffect(() => {
    if (isWorkspaceReady) {
      const { longitude, latitude, zoom } = viewState
      updateUrlViewportDebounced({ longitude, latitude, zoom })
    }
    return () => {
      updateUrlViewportDebounced.cancel()
    }
  }, [viewState, updateUrlViewportDebounced, isWorkspaceReady])
}

export const MAP_CONTAINER_ID = 'map-container'
export const MAP_VIEW_ID = 'mapViewport'
export const MAP_VIEW = new MapView({
  id: MAP_VIEW_ID,
  repeat: true,
  controller: true,
  bearing: 0,
  pitch: 0,
} as MapViewProps)

export function useMapViewport() {
  const deckMap = useDeckMap()
  try {
    return (deckMap as any)
      ?.getViewports?.()
      .find((v: any) => v.id === MAP_VIEW_ID) as WebMercatorViewport
  } catch (e: any) {
    return undefined
  }
}
