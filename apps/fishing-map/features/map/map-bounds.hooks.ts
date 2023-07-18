import { useCallback } from 'react'
import { fitBounds } from '@math.gl/web-mercator'
import { atom as jotaiAtom, useAtomValue, Atom } from 'jotai'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { LngLatBounds, Map } from '@globalfishingwatch/maplibre-gl'
import { Bbox } from 'types'
import { FOOTER_HEIGHT } from 'features/footer/Footer'
import { TIMEBAR_HEIGHT } from 'features/timebar/timebar.config'
import { useSetViewState, viewportAtom } from 'features/map/map-viewport.hooks'

export const boundsAtom: Atom<MiniglobeBounds> = jotaiAtom((get): MiniglobeBounds => {
  const viewport = get(viewportAtom)
  const wn = viewport.unproject([0, 0])
  const es = viewport.unproject([viewport.width, viewport.height])
  return {
    north: wn[1],
    south: es[1],
    west: wn[0],
    east: es[0],
  }
})

export const useMapBounds = (): { bounds: MiniglobeBounds } => ({
  bounds: useAtomValue(boundsAtom),
})

export function checkEqualBounds(bounds1?: MiniglobeBounds, bounds2?: MiniglobeBounds) {
  if (!bounds1 || !bounds2) return false
  return (
    bounds1.north === bounds2.north &&
    bounds1.south === bounds2.south &&
    bounds1.west === bounds2.west &&
    bounds1.east === bounds2.east
  )
}

export function mglToMiniGlobeBounds(mglBounds: LngLatBounds) {
  return {
    north: mglBounds.getNorth() as number,
    south: mglBounds.getSouth() as number,
    west: mglBounds.getWest() as number,
    east: mglBounds.getEast() as number,
  }
}

type FitBoundsParams = {
  mapWidth?: number
  mapHeight?: number
  padding?: number
}

export const getMapCoordinatesFromBounds = (
  map: Map,
  bounds: Bbox,
  params: FitBoundsParams = {}
) => {
  const { mapWidth, mapHeight, padding = 60 } = params
  const width = mapWidth || (map ? parseInt(map.getCanvas().style.width) : window.innerWidth / 2)
  const height =
    mapHeight ||
    (map
      ? parseInt(map.getCanvas().style.height)
      : window.innerHeight - TIMEBAR_HEIGHT - FOOTER_HEIGHT)
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

export function convertToTupleBoundingBox(
  flatBoundingBox: Bbox
): [[number, number], [number, number]] {
  if (flatBoundingBox.length !== 4) {
    throw new Error('Invalid flat bounding box')
  }

  const topLeft: [number, number] = [flatBoundingBox[0], flatBoundingBox[1]]
  const bottomRight: [number, number] = [flatBoundingBox[2], flatBoundingBox[3]]

  return [topLeft, bottomRight]
}

export function useMapFitBounds() {
  const viewport = useAtomValue(viewportAtom)
  const setViewState = useSetViewState()
  const fitBounds = useCallback(
    (bounds: Bbox, params: FitBoundsParams = {}) => {
      console.log('fitBounds')
      const newViewport = viewport.fitBounds(convertToTupleBoundingBox(bounds), params)
      setViewState({
        latitude: newViewport.latitude,
        longitude: newViewport.longitude,
        zoom: newViewport.zoom,
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  return fitBounds
}
