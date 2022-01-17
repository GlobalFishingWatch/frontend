import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { atom, useRecoilState } from 'recoil'
import { debounce } from 'lodash'
import type { ViewportProps } from 'react-map-gl'
import { MapCoordinates } from 'types'
import { DEFAULT_VIEWPORT } from 'data/config'
import { updateUrlViewport } from 'routes/routes.actions'
import { selectUrlViewport } from 'routes/routes.selectors'
import store, { RootState } from '../../store'

type SetMapCoordinatesArgs = Partial<Pick<ViewportProps, 'latitude' | 'longitude' | 'zoom'>>
type UseViewport = {
  viewport: MapCoordinates
  onViewportChange: (viewport: ViewportProps) => void
  setMapCoordinates: (viewport: SetMapCoordinatesArgs) => void
}

const URL_VIEWPORT_DEBOUNCED_TIME = 1000

const viewportState = atom<MapCoordinates>({
  key: 'mapViewport',
  default: DEFAULT_VIEWPORT as MapCoordinates,
  effects_UNSTABLE: [
    ({ trigger, setSelf, onSet }) => {
      const dispatch = useDispatch()
      const viewport = selectUrlViewport(store.getState() as RootState)

      if (trigger === 'get' && viewport) {
        setSelf(viewport)
      }

      const updateUrlViewportDebounced = debounce(
        dispatch(updateUrlViewport),
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

  const setMapCoordinates = useCallback((coordinates: SetMapCoordinatesArgs) => {
    setViewport((viewport) => ({ ...viewport, ...coordinates }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onViewportChange = useCallback((viewport: ViewportProps) => {
    const { latitude, longitude, zoom } = viewport
    if (latitude && longitude && zoom) {
      setViewport({ latitude, longitude, zoom })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { viewport, onViewportChange, setMapCoordinates }
}
