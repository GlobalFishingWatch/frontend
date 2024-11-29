import { useCallback, useEffect } from 'react'
import { atom, useRecoilState } from 'recoil'
import { fitBounds } from '@math.gl/web-mercator'
import type { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import type { LngLatBounds } from '@globalfishingwatch/maplibre-gl'
import type { Bbox } from '@globalfishingwatch/data-transforms'
import useMapInstance from 'features/map/map-context.hooks'
import { useMapReady } from 'features/map/map-state.hooks'
import { useViewport } from 'features/map/map-viewport.hooks'
import { TIMEBAR_HEIGHT } from 'data/config'

const boundsState = atom<MiniglobeBounds | undefined>({
  key: 'mapBounds',
  default: undefined,
})

export function checkEqualBounds(bounds1: MiniglobeBounds, bounds2: MiniglobeBounds) {
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

export function useMapBounds() {
  const map = useMapInstance()
  const mapReady = useMapReady()
  const [bounds, setBounds] = useRecoilState(boundsState)
  const { viewport } = useViewport()

  const setMapBounds = useCallback(() => {
    if (map) {
      const rawBounds = map.getBounds()
      if (rawBounds) {
        setBounds(mglToMiniGlobeBounds(rawBounds))
      }
    }
  }, [map, setBounds])

  useEffect(() => {
    if (viewport) {
      setMapBounds()
    }
  }, [viewport, setMapBounds])

  useEffect(() => {
    if (mapReady) {
      setMapBounds()
    }
  }, [mapReady, setMapBounds])

  return bounds
}

type FitBoundsParams = {
  mapWidth?: number
  mapHeight?: number
  padding?: number
}
export function useMapFitBounds() {
  const map = useMapInstance()
  const { setMapCoordinates } = useViewport()

  const fitMapBounds = useCallback(
    (bounds: Bbox, params: FitBoundsParams = {}) => {
      const { mapWidth, mapHeight, padding = 60 } = params
      const width =
        mapWidth || (map ? parseInt(map.getCanvas().style.width) : window.innerWidth / 2)
      const height =
        mapHeight ||
        (map ? parseInt(map.getCanvas().style.height) : window.innerHeight - TIMEBAR_HEIGHT)
      const { latitude, longitude, zoom } = fitBounds({
        bounds: [
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]],
        ],
        width,
        height,
        padding,
      })
      setMapCoordinates({ latitude, longitude, zoom: Math.max(0, zoom) })
    },
    [map, setMapCoordinates]
  )
  return fitMapBounds
}
