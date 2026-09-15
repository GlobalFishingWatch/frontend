import { useCallback, useMemo } from 'react'
import type { MapView, ViewStateMap } from '@deck.gl/core'
import { throttle } from 'es-toolkit'
import { useAtomValue, useSetAtom } from 'jotai'

import { boundsAtom, viewStateAtom } from 'features/_map/map/map.atoms'
import { useDeckMap } from 'features/_map/map/map-context.hooks'

export const getSafeViewState = (coordinates: Partial<ViewStateMap<MapView>>) => {
  // Web Mercator is only defined up to ±85.051129°; at ±90 the projection goes to infinity.
  const MAX_MERCATOR_LATITUDE = 85.051129
  const entries: [string, unknown][] = []
  for (const [key, value] of Object.entries(coordinates)) {
    if (value === undefined) continue
    if (typeof value !== 'number') {
      entries.push([key, value])
      continue
    }
    if (!Number.isFinite(value)) continue
    entries.push([
      key,
      key === 'latitude'
        ? Math.min(Math.max(value, -MAX_MERCATOR_LATITUDE), MAX_MERCATOR_LATITUDE)
        : value,
    ])
  }
  return Object.fromEntries(entries)
}

export const useMapSetViewState = () => {
  const setViewState = useSetAtom(viewStateAtom)
  return useMemo(
    () =>
      throttle((coordinates: Partial<ViewStateMap<MapView>>) => {
        setViewState((prev) => ({ ...prev, ...getSafeViewState(coordinates) }))
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
          const viewState = getSafeViewState(coordinates) as ViewStateMap<MapView>
          // Can't find why this is needed to properly update the view state
          deckMap.setProps({ viewState })
        }
      }
    },
    [deckMap, isTransitioning, setMapViewState]
  )
}
