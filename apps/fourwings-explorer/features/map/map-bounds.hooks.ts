import { useCallback, useEffect } from 'react'
import { atom, useRecoilState } from 'recoil'
import type { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import type { LngLatBounds } from '@globalfishingwatch/maplibre-gl'
import useMapInstance from 'features/map/map-context.hooks'
import { useMapReady } from 'features/map/map-state.hooks'
import { useViewport } from 'features/map/map-viewport.hooks'

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
