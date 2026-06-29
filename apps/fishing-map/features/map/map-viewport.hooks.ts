import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { MapViewProps, ViewStateMap, WebMercatorViewport } from '@deck.gl/core'
import { MapView } from '@deck.gl/core'
import { debounce, throttle } from 'es-toolkit'
import { useAtomValue, useSetAtom } from 'jotai'

import { boundsAtom, viewStateAtom } from 'features/map/map.atoms'
import { useDeckMap } from 'features/map/map-context.hooks'
import { selectIsWorkspaceReady } from 'features/workspace/workspace.selectors'
import { useReplaceQueryParams } from 'router/routes.hook'
import type { WorkspaceViewport } from 'types'
import { getIsBrowser } from 'utils/dom'
import { getUrlViewstateNumericParam } from 'utils/url'

export const useMapViewState = () => {
  return useAtomValue(viewStateAtom)
}

// Runs before paint on the client, no-ops on the server.
const useIsomorphicLayoutEffect = getIsBrowser() ? useLayoutEffect : useEffect

export const useMapViewStateUrlSync = () => {
  const setViewState = useSetAtom(viewStateAtom)
  useIsomorphicLayoutEffect(() => {
    const longitude = getUrlViewstateNumericParam('longitude')
    const latitude = getUrlViewstateNumericParam('latitude')
    const zoom = getUrlViewstateNumericParam('zoom')
    const urlViewport = Object.fromEntries(
      Object.entries({ longitude, latitude, zoom }).filter(([, value]) => value !== null)
    )
    if (Object.keys(urlViewport).length > 0) {
      setViewState((prev) => ({ ...prev, ...urlViewport }))
    }
    // mount-only: URL viewport is the initial deep-link, not a live source
  }, [])
}
export const useMapSetViewState = () => {
  const setViewState = useSetAtom(viewStateAtom)
  return useMemo(
    () =>
      throttle((coordinates: Partial<ViewStateMap<MapView>>) => {
        const cleanCoordinates = Object.fromEntries(
          Object.entries(coordinates).filter(([key, value]) => value !== undefined)
        )
        setViewState((prev) => ({ ...prev, ...cleanCoordinates }))
      }, 1),
    [setViewState]
  )
}

// Hook to set only the map coordinates (longitude, latitude and zoom)
// this doesn't update any of the deckgl view state properties
export function useSetMapCoordinates() {
  const setMapViewState = useMapSetViewState()
  const { isTransitioning } = useAtomValue(boundsAtom)
  const deckMap = useDeckMap()
  return useCallback(
    (coordinates: Partial<ViewStateMap<MapView>>) => {
      if (!isTransitioning) {
        setMapViewState(coordinates)
        if (deckMap) {
          const viewState = Object.fromEntries(
            Object.entries(coordinates).filter(([key, value]) => value !== undefined)
          ) as ViewStateMap<MapView>
          // Can't find why this is needed to properly update the view state
          deckMap.setProps({ viewState })
        }
      }
    },
    [deckMap, isTransitioning, setMapViewState]
  )
}

const VIEW_STATE_URL_DEBOUNCE = 300

export const useUpdateViewStateUrlParams = () => {
  const viewState = useAtomValue(viewStateAtom)
  const isWorkspaceReady = useSelector(selectIsWorkspaceReady)
  const { replaceQueryParams } = useReplaceQueryParams()

  const debouncedReplace = useMemo(
    () =>
      debounce((viewport: WorkspaceViewport) => {
        replaceQueryParams(viewport)
      }, VIEW_STATE_URL_DEBOUNCE),
    [replaceQueryParams]
  )

  useEffect(() => {
    if (isWorkspaceReady) {
      const { longitude, latitude, zoom } = viewState
      debouncedReplace({ longitude, latitude, zoom })
    }
    return () => {
      debouncedReplace.cancel()
    }
  }, [viewState, isWorkspaceReady, debouncedReplace])
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
