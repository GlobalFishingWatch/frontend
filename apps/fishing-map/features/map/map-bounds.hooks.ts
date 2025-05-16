import { useCallback, useEffect, useMemo } from 'react'
import { FlyToInterpolator } from '@deck.gl/core'
import { fitBounds } from '@math.gl/web-mercator'
import { useAtom } from 'jotai'

import { useDebounce } from '@globalfishingwatch/react-hooks'
import type { MiniglobeBounds } from '@globalfishingwatch/ui-components'

import { FOOTER_HEIGHT } from 'features/footer/Footer'
import { boundsAtom } from 'features/map/map.atoms'
import { useMapSetViewState, useMapViewport } from 'features/map/map-viewport.hooks'
import { DEFAULT_TIMEBAR_HEIGHT } from 'features/timebar/timebar.config'
import type { Bbox } from 'types'

import { MAP_CANVAS_ID } from './map.config'

export const useMapBounds = (): { bounds: MiniglobeBounds } => {
  const [bounds, setBounds] = useAtom(boundsAtom)
  const viewport = useMapViewport()
  const debouncedViewport = useDebounce(viewport, 16)

  useEffect(() => {
    if (debouncedViewport) {
      const wn = debouncedViewport.unproject([0, 0])
      const es = debouncedViewport.unproject([debouncedViewport.width, debouncedViewport.height])
      setBounds({
        north: wn[1],
        south: es[1],
        west: wn[0],
        east: es[0],
      })
    }
  }, [setBounds, debouncedViewport])

  return useMemo(() => ({ bounds }), [bounds])
}

export type FitBoundsParams = {
  mapDOMId?: string
  mapWidth?: number
  mapHeight?: number
  maxZoom?: number
  padding?: number
  fitZoom?: boolean
  flyTo?: boolean
}

export const getMapCoordinatesFromBounds = (bounds: Bbox, params: FitBoundsParams = {}) => {
  const { mapDOMId = MAP_CANVAS_ID, mapWidth, mapHeight, padding = 60 } = params
  const map = document.getElementById(mapDOMId)
  const mapRect = map?.getBoundingClientRect()
  const width = mapWidth || mapRect?.width || window.innerWidth / 2
  const height =
    mapHeight || mapRect?.height || window.innerHeight - DEFAULT_TIMEBAR_HEIGHT - FOOTER_HEIGHT
  const { latitude, longitude, zoom } = fitBounds({
    bounds: [
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    ],
    width,
    height,
    padding,
  })
  return { latitude, longitude, zoom }
}

export const FLY_TO_TRANSITION = 2000
const transitionInterpolator = new FlyToInterpolator({
  speed: 2,
  maxDuration: FLY_TO_TRANSITION,
})
export function useMapFitBounds() {
  const setMapViewState = useMapSetViewState()
  const [{ isTransitioning }, setIsTransitioning] = useAtom(boundsAtom)
  const fitBounds = useCallback(
    (bounds: Bbox, params: FitBoundsParams = {}) => {
      const newViewport = getMapCoordinatesFromBounds(bounds, params)
      setMapViewState({
        latitude: newViewport.latitude,
        longitude: newViewport.longitude,
        ...(params.fitZoom && {
          zoom: params.maxZoom ? Math.min(newViewport.zoom, params.maxZoom) : newViewport.zoom,
        }),
        ...(params.flyTo &&
          !isTransitioning && {
            transitionInterpolator,
            transitionDuration: 'auto',
            onTransitionEnd: () => {
              setMapViewState({
                transitionInterpolator: undefined,
                transitionDuration: 0,
                onTransitionEnd: undefined,
              })
              setIsTransitioning((prev) => ({ ...prev, isTransitioning: false }))
            },
          }),
      })
    },
    [isTransitioning, setIsTransitioning, setMapViewState]
  )
  return fitBounds
}
