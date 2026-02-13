import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import type { MapViewProps, ViewStateMap, WebMercatorViewport } from '@deck.gl/core'
import { MapView } from '@deck.gl/core'
import { throttle } from 'es-toolkit'
import { useAtomValue, useSetAtom } from 'jotai'

import { boundsAtom, viewStateAtom } from 'features/map/map.atoms'
import { useDeckMap } from 'features/map/map-context.hooks'
import { selectIsWorkspaceReady } from 'features/workspace/workspace.selectors'
import { replaceQueryParams } from 'router/routes.actions'
import type { WorkspaceViewport } from 'types'

export const useMapViewState = () => {
  return useAtomValue(viewStateAtom)
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

export const useUpdateViewStateUrlParams = () => {
  const viewState = useAtomValue(viewStateAtom)
  const isWorkspaceReady = useSelector(selectIsWorkspaceReady)
  const pendingRef = useRef<WorkspaceViewport | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (isWorkspaceReady) {
      const { longitude, latitude, zoom } = viewState
      pendingRef.current = { longitude, latitude, zoom }
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        if (pendingRef.current) {
          replaceQueryParams(pendingRef.current)
          pendingRef.current = null
        }
      })
    }
    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [viewState, isWorkspaceReady])
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
