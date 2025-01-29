import { useCallback } from 'react'
import type { ViewStateChangeEvent } from 'react-map-gl'
import { fitBounds } from '@math.gl/web-mercator'
import { atom, useAtom } from 'jotai'
import type { Bbox, MapCoordinates } from 'types'

import type { MiniglobeBounds } from '@globalfishingwatch/ui-components'

import { DEFAULT_VIEWPORT } from 'data/config'

import useMapInstance from './map-context.hooks'

type ViewportKeys = 'latitude' | 'longitude' | 'zoom' | 'pitch' | 'bearing'
type ViewportProps = Record<ViewportKeys, number>
type UseViewport = {
  viewport: MapCoordinates
  onViewportChange: (e: ViewStateChangeEvent) => void
  setMapCoordinates: (viewport: ViewportProps) => void
}

export const getUrlViewstateNumericParam = (key: string) => {
  if (typeof window === 'undefined') return null
  const urlParam = new URLSearchParams(window.location.search).get(key)
  return urlParam ? parseFloat(urlParam) : null
}

const viewportAtom = atom<MapCoordinates>({
  longitude: getUrlViewstateNumericParam('longitude') || DEFAULT_VIEWPORT.longitude,
  latitude: getUrlViewstateNumericParam('latitude') || DEFAULT_VIEWPORT.latitude,
  zoom: getUrlViewstateNumericParam('zoom') || DEFAULT_VIEWPORT.zoom,
})

export default function useViewport(): UseViewport {
  const [viewport, setViewport] = useAtom(viewportAtom)

  const setMapCoordinates = useCallback((coordinates: ViewportProps) => {
    setViewport((viewport) => ({ ...viewport, ...coordinates }))
  }, [])

  const onViewportChange = useCallback((ev: ViewStateChangeEvent) => {
    const { latitude, longitude, zoom } = ev.viewState
    if (latitude && longitude && zoom) {
      setViewport({ latitude, longitude, zoom })
    }
  }, [])

  return { viewport, onViewportChange, setMapCoordinates }
}

const boundsState = atom({} as MiniglobeBounds)

export function useMapBounds() {
  const map = useMapInstance()
  const [bounds, setBounds] = useAtom(boundsState)
  const setMapBounds = useCallback(() => {
    if (map) {
      const rawBounds = map.getBounds()
      if (rawBounds) {
        setBounds({
          north: rawBounds.getNorth() as number,
          south: rawBounds.getSouth() as number,
          west: rawBounds.getWest() as number,
          east: rawBounds.getEast() as number,
        })
      }
    }
  }, [map, setBounds])
  return { bounds, setMapBounds }
}

// TBD when timebar is implemented
const TIMEBAR_HEIGHT = 0
const FOOTER_HEIGHT = 0

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
        (map
          ? parseInt(map.getCanvas().style.height)
          : window.innerHeight - TIMEBAR_HEIGHT - FOOTER_HEIGHT)

      const targetSize = [width - padding - padding, height - padding - padding]
      const { latitude, longitude, zoom } = fitBounds({
        bounds: [
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]],
        ],
        width,
        height,
        padding: {
          // Adjust padding to not exceed width and height
          top: targetSize[1] > 0 ? padding : targetSize[1] + padding,
          bottom: targetSize[1] > 0 ? padding : targetSize[1] + padding,
          left: targetSize[0] > 0 ? padding : targetSize[0] + padding,
          right: targetSize[0] > 0 ? padding : targetSize[0] + padding,
        },
      })
      setMapCoordinates({ latitude, longitude, zoom, pitch: 0, bearing: 0 })
    },
    [map, setMapCoordinates]
  )
  return fitMapBounds
}
