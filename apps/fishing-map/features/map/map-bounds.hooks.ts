import { useCallback, useEffect, useMemo } from 'react'
import { fitBounds } from '@math.gl/web-mercator'
import { atom, useAtom } from 'jotai'

import type { MiniglobeBounds } from '@globalfishingwatch/ui-components'

import { FOOTER_HEIGHT } from 'features/footer/Footer'
import { useMapViewport, useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { TIMEBAR_HEIGHT } from 'features/timebar/timebar.config'
import type { Bbox } from 'types'

import { MAP_CANVAS_ID } from './map.config'

const boundsAtom = atom<MiniglobeBounds>({
  north: 90,
  south: -90,
  west: -180,
  east: 180,
})

export const useMapBounds = (): { bounds: MiniglobeBounds } => {
  const [bounds, setBounds] = useAtom(boundsAtom)
  const viewport = useMapViewport()

  useEffect(() => {
    if (viewport) {
      const wn = viewport.unproject([0, 0])
      const es = viewport.unproject([viewport.width, viewport.height])
      setBounds({
        north: wn[1],
        south: es[1],
        west: wn[0],
        east: es[0],
      })
    }
  }, [setBounds, viewport])

  return useMemo(() => ({ bounds }), [bounds])
}

export type FitBoundsParams = {
  mapDOMId?: string
  mapWidth?: number
  mapHeight?: number
  padding?: number
  fitZoom?: boolean
}

export const getMapCoordinatesFromBounds = (bounds: Bbox, params: FitBoundsParams = {}) => {
  const { mapDOMId = MAP_CANVAS_ID, mapWidth, mapHeight, padding = 60 } = params
  const map = document.getElementById(mapDOMId)
  const mapRect = map?.getBoundingClientRect()
  const width = mapWidth || mapRect?.width || window.innerWidth / 2
  const height = mapHeight || mapRect?.height || window.innerHeight - TIMEBAR_HEIGHT - FOOTER_HEIGHT
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

export function useMapFitBounds() {
  const setMapCoordinates = useSetMapCoordinates()
  const fitBounds = useCallback(
    (bounds: Bbox, params: FitBoundsParams = {}) => {
      const newViewport = getMapCoordinatesFromBounds(bounds, params)
      setMapCoordinates({
        latitude: newViewport.latitude,
        longitude: newViewport.longitude,
        ...(params.fitZoom && {
          zoom: newViewport.zoom,
        }),
      })
    },
    [setMapCoordinates]
  )
  return fitBounds
}
