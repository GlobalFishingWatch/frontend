import { useCallback, useEffect } from 'react'
import type { Deck } from '@deck.gl/core'
import { fitBounds } from '@math.gl/web-mercator'
import { atom, useAtom } from 'jotai'
import type { Bbox } from 'types'

import type { MiniglobeBounds } from '@globalfishingwatch/ui-components'

import { FOOTER_HEIGHT } from 'features/footer/Footer'
import { useMapViewport, useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { TIMEBAR_HEIGHT } from 'features/timebar/timebar.config'

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

  return { bounds }
}

export type FitBoundsParams = {
  mapWidth?: number
  mapHeight?: number
  padding?: number
  fitZoom?: boolean
}

export const getMapCoordinatesFromBounds = (
  map: Deck,
  bounds: Bbox,
  params: FitBoundsParams = {}
) => {
  const { mapWidth, mapHeight, padding = 60 } = params
  const width = mapWidth || (map?.width ? map.width : window.innerWidth / 2)
  const height =
    mapHeight || (map ? map.height : window.innerHeight - TIMEBAR_HEIGHT - FOOTER_HEIGHT)
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

function convertToTupleBoundingBox(flatBoundingBox: Bbox): [[number, number], [number, number]] {
  if (flatBoundingBox.length !== 4) {
    throw new Error('Invalid flat bounding box')
  }

  const topLeft: [number, number] = [flatBoundingBox[0], flatBoundingBox[1]]
  const bottomRight: [number, number] = [flatBoundingBox[2], flatBoundingBox[3]]

  return [topLeft, bottomRight]
}

export function useMapFitBounds() {
  const viewport = useMapViewport()
  const setMapCoordinates = useSetMapCoordinates()
  const fitBounds = useCallback(
    (bounds: Bbox, params: FitBoundsParams = {}) => {
      if (viewport) {
        const newViewport = viewport.fitBounds(convertToTupleBoundingBox(bounds), params)
        setMapCoordinates({
          latitude: newViewport.latitude,
          longitude: newViewport.longitude,
          zoom: params.fitZoom ? newViewport.zoom : viewport.zoom,
        })
      }
    },
     
    [viewport]
  )
  return fitBounds
}
