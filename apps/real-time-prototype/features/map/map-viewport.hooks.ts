import { useCallback, useMemo } from 'react'
import type { ViewStateChangeEvent } from 'react-map-gl'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { DEFAULT_VIEWPORT } from 'data/config'

export type MapViewport = {
  latitude: number
  longitude: number
  zoom: number
  pitch?: number
  bearing?: number
}

export const getUrlViewstateNumericParam = (key: string) => {
  if (typeof window === 'undefined') return null
  const urlParam = new URLSearchParams(window.location.search).get(key)
  return urlParam ? parseFloat(urlParam) : null
}

const viewportAtom = atomWithStorage<MapViewport>('map-viewport', {
  longitude: getUrlViewstateNumericParam('longitude') || DEFAULT_VIEWPORT.longitude,
  latitude: getUrlViewstateNumericParam('latitude') || DEFAULT_VIEWPORT.latitude,
  zoom: getUrlViewstateNumericParam('zoom') || DEFAULT_VIEWPORT.zoom,
})

export function useViewport() {
  const [viewport, setViewport] = useAtom(viewportAtom)

  const onViewportChange = useCallback(
    (ev: ViewStateChangeEvent) => {
      const { latitude, longitude, zoom } = ev.viewState
      if (latitude && longitude && zoom) {
        setViewport({ latitude, longitude, zoom })

        // Update URL params
        const params = new URLSearchParams(window.location.search)
        params.set('latitude', latitude.toString())
        params.set('longitude', longitude.toString())
        params.set('zoom', zoom.toString())
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
      }
    },
    [setViewport]
  )

  return useMemo(() => [viewport, onViewportChange] as const, [viewport, onViewportChange])
}
