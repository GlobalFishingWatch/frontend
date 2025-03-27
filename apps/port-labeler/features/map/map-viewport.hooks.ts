import { useCallback } from 'react'
import type { ViewStateChangeEvent } from 'react-map-gl'
import { atom, useAtom } from 'jotai'

import { DEFAULT_VIEWPORT } from 'data/config'
import type { MapCoordinates } from 'types'

type ViewportKeys = 'latitude' | 'longitude' | 'zoom' | 'pitch' | 'bearing'
export type ViewportProps = Record<ViewportKeys, number>
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

export function useViewport(): UseViewport {
  const [viewport, setViewport] = useAtom(viewportAtom)

  const setMapCoordinates = useCallback((coordinates: Partial<ViewportProps>) => {
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
