import { useCallback, useMemo } from 'react'
import type { MapView, ViewStateMap } from '@deck.gl/core'
import { throttle } from 'es-toolkit'
import { useAtomValue, useSetAtom } from 'jotai'

import { boundsAtom, viewStateAtom } from 'features/_map/map/map.atoms'
import { useDeckMap } from 'features/_map/map/map-context.hooks'

/**
 * Writing the map view state, without pulling deck.gl at runtime.
 *
 * Split out of map-viewport.hooks.ts, which constructs `new MapView(...)` and therefore imports
 * @deck.gl/core as a *value*. MainNav is rendered on every route and only needs to move the camera, so
 * it imports from here; map-viewport.hooks re-exports both for its existing consumers.
 *
 * Every deck.gl reference in this module must stay type-only — `check-store-graph.mjs` enforces it for
 * the reducer map, but not for this file directly.
 */

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
