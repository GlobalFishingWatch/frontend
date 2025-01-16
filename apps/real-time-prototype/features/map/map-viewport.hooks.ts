import { useCallback, useEffect } from 'react'
import type { ViewStateChangeParameters } from '@deck.gl/core/dist/controllers/controller'
import { number,object } from '@recoiljs/refine'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { urlSyncEffect } from 'recoil-sync'
import type { MapCoordinates } from 'types'

import { useDebounce } from '@globalfishingwatch/react-hooks'

import { DEFAULT_URL_DEBOUNCE, DEFAULT_VIEWPORT } from 'data/config'

type ViewportKeys = 'latitude' | 'longitude' | 'zoom'
type ViewportProps = Record<ViewportKeys, number>
type UseViewport = {
  viewState: MapCoordinates
  onViewportStateChange: (e: ViewStateChangeParameters) => void
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
  const [viewState, setViewportState] = useRecoilState(viewportAtom)

  const setMapCoordinates = useCallback((coordinates: ViewportProps) => {
    setViewportState((viewport) => ({ ...viewport, ...coordinates }))
     
  }, [])

  const onViewportStateChange = useCallback((ev: ViewStateChangeParameters) => {
    const { latitude, longitude, zoom } = ev.viewState
    if (latitude && longitude && zoom) {
      setViewportState({ zoom, latitude, longitude })
    }
     
  }, [])

  return { viewState, onViewportStateChange, setMapCoordinates }
}

/**
 * It sets the URLViewportAtom to the debounced viewport in the URL
 * USE IT ONLY ONCE!
 */
export const useURLViewport = () => {
  const viewport = useRecoilValue(viewportAtom)
  const setURLViewport = useSetRecoilState(URLViewportAtom)
  const debouncedViewport = useDebounce(viewport, DEFAULT_URL_DEBOUNCE)

  useEffect(() => {
    setURLViewport(debouncedViewport)
  }, [debouncedViewport, setURLViewport])
}
