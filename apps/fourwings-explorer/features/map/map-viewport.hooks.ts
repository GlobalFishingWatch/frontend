import { useCallback, useEffect } from 'react'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { urlSyncEffect } from 'recoil-sync'
import { object, number } from '@recoiljs/refine'
import type { ViewStateChangeEvent } from 'react-map-gl'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import type { MapCoordinates } from 'types'
import { DEFAULT_URL_DEBOUNCE, DEFAULT_VIEWPORT } from 'data/config'

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

const URLViewportAtom = atom<MapCoordinates>({
  key: 'viewport',
  default: DEFAULT_VIEWPORT as MapCoordinates,
  effects: [urlSyncEffect({ refine: viewportChecker, history: 'replace' })],
})

const viewportAtom = atom<MapCoordinates>({
  key: 'localViewport',
  default: URLViewportAtom,
  effects: [],
})

export function useViewport(): UseViewport {
  const [viewport, setViewport] = useRecoilState(viewportAtom)

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

/**
 * It sets the URLViewportAtom to the debounced viewport in the URL
 * USED IT ONLY ONCE!
 */
export const useURLViewport = () => {
  const viewport = useRecoilValue(viewportAtom)
  const setURLViewport = useSetRecoilState(URLViewportAtom)
  const debouncedViewport = useDebounce(viewport, DEFAULT_URL_DEBOUNCE)

  useEffect(() => {
    setURLViewport(debouncedViewport)
  }, [debouncedViewport, setURLViewport])
}

export const useDebouncedViewport = () => {
  return useRecoilValue(URLViewportAtom)
}
