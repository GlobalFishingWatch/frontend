import { useCallback } from 'react'
import type { ViewStateChangeEvent } from 'react-map-gl'
import { debounce } from 'lodash'
import { atom, useRecoilState } from 'recoil'
import type { MapCoordinates } from 'types'

import { DEFAULT_VIEWPORT } from 'data/config'
import { updateUrlViewport } from 'routes/routes.actions'
import { selectUrlViewport } from 'routes/routes.selectors'

import type { RootState } from '../../store';
import store from '../../store'

type ViewportKeys = 'latitude' | 'longitude' | 'zoom'
type ViewportProps = Record<ViewportKeys, number>
type UseViewport = {
  viewport: MapCoordinates
  onViewportChange: (e: ViewStateChangeEvent) => void
  setMapCoordinates: (viewport: ViewportProps) => void
}

const URL_VIEWPORT_DEBOUNCED_TIME = 1000

const viewportState = atom<MapCoordinates>({
  key: 'mapViewport',
  default: DEFAULT_VIEWPORT as MapCoordinates,
  effects: [
    ({ trigger, setSelf, onSet }) => {
      const viewport = selectUrlViewport(store.getState() as RootState)

      if (trigger === 'get' && viewport) {
        setSelf(viewport)
      }

      const updateUrlViewportDebounced = debounce(
        store.dispatch(updateUrlViewport),
        URL_VIEWPORT_DEBOUNCED_TIME
      )

      onSet((viewport) => {
        const { latitude, longitude, zoom } = viewport as MapCoordinates
        updateUrlViewportDebounced({ latitude, longitude, zoom })
      })
    },
  ],
})

export function useViewport(): UseViewport {
  const [viewport, setViewport] = useRecoilState(viewportState)

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
