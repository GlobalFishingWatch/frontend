import { useCallback, useEffect } from 'react'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
// import { urlSyncEffect } from 'recoil-sync'
// import { object, number } from '@recoiljs/refine'
import { ViewStateChangeParameters } from '@deck.gl/core/typed/controllers/controller'
import { MapCoordinates } from 'types'
import { DEFAULT_VIEWPORT } from 'data/config'

type ViewportKeys = 'latitude' | 'longitude' | 'zoom'
type ViewportProps = Record<ViewportKeys, number>
type UseViewport = {
  viewState: MapCoordinates
  onViewportStateChange: (e: ViewStateChangeParameters) => void
  setMapCoordinates: (viewport: ViewportProps) => void
}

// const viewportChecker = object({
//   latitude: number(),
//   longitude: number(),
//   zoom: number(),
// })

const viewportAtom = atom<MapCoordinates>({
  key: 'localViewport',
  default: DEFAULT_VIEWPORT,
  // effects: [urlSyncEffect({ refine: viewportChecker, history: 'replace' })],
})

export function useViewport(): UseViewport {
  const [viewState, setViewportState] = useRecoilState(viewportAtom)

  const setMapCoordinates = useCallback((coordinates: ViewportProps) => {
    setViewportState((viewport) => ({ ...viewport, ...coordinates }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onViewportStateChange = useCallback((ev: ViewStateChangeParameters) => {
    const { latitude, longitude, zoom } = ev.viewState
    if (latitude && longitude && zoom) {
      setViewportState({ zoom, latitude, longitude })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { viewState, onViewportStateChange, setMapCoordinates }
}
