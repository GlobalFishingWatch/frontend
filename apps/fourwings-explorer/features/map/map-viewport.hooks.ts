import { useCallback } from 'react'
import { atom, useRecoilState } from 'recoil'
import { urlSyncEffect } from 'recoil-sync'
import { object, number } from '@recoiljs/refine'
import { ViewStateChangeEvent } from 'react-map-gl'
import { MapCoordinates } from 'types'
import { DEFAULT_VIEWPORT } from 'data/config'

type ViewportKeys = 'latitude' | 'longitude' | 'zoom'
type ViewportProps = Record<ViewportKeys, number>
type UseViewport = {
  viewport: MapCoordinates
  onViewportChange: (e: ViewStateChangeEvent) => void
  setMapCoordinates: (viewport: ViewportProps) => void
}

const viewportChecker = object({
  latitude: number(),
  longitude: number(),
  zoom: number(),
})

const viewportState = atom<MapCoordinates>({
  key: 'mapViewport',
  default: DEFAULT_VIEWPORT as MapCoordinates,
  effects: [urlSyncEffect({ refine: viewportChecker, history: 'replace' })],
})

export function useViewport(): UseViewport {
  const [viewport, setViewport] = useRecoilState(viewportState)

  const setMapCoordinates = useCallback((coordinates: ViewportProps) => {
    setViewport((viewport) => ({ ...viewport, ...coordinates }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onViewportChange = useCallback((ev: ViewStateChangeEvent) => {
    const { latitude, longitude, zoom } = ev.viewState
    if (latitude && longitude && zoom) {
      setViewport({ latitude, longitude, zoom })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { viewport, onViewportChange, setMapCoordinates }
}
