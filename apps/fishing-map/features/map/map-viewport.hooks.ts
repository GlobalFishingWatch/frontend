import { useCallback, useEffect } from 'react'
import { debounce } from 'lodash'
import { atom, useAtomValue, Atom, useSetAtom } from 'jotai'
import { MapView } from '@deck.gl/core/typed'
import WebMercatorViewport from '@math.gl/web-mercator'
import { MapCoordinates } from 'types'
import { DEFAULT_VIEWPORT } from 'data/config'
import { updateUrlViewport } from 'routes/routes.actions'
import { getUrlViewstateNumericParam } from 'utils/url'
import store from '../../store'

export const viewStateAtom = atom<MapCoordinates>({
  longitude: getUrlViewstateNumericParam('longitude') || DEFAULT_VIEWPORT.longitude,
  latitude: getUrlViewstateNumericParam('latitude') || DEFAULT_VIEWPORT.latitude,
  zoom: getUrlViewstateNumericParam('zoom') || DEFAULT_VIEWPORT.zoom,
})

export const viewportAtom: Atom<WebMercatorViewport> = atom(
  (get) => new WebMercatorViewport(get(viewStateAtom))
)

export const useViewState = () => useAtomValue(viewStateAtom)
export const useSetViewState = () => {
  const setViewState = useSetAtom(viewStateAtom)
  return useCallback(
    (coordinates: Partial<MapCoordinates>) => {
      setViewState((prev) => ({ ...prev, ...coordinates }))
    },
    [setViewState]
  )
}

export function useViewStateAtom() {
  const viewState = useViewState()
  const setViewState = useSetViewState()
  return { viewState, setViewState }
}

export const MAP_VIEW = new MapView({ repeat: true, controller: true })
const URL_VIEWPORT_DEBOUNCED_TIME = 1000

export const useUpdateViewStateUrlParams = () => {
  const viewState = useAtomValue(viewStateAtom)
  const updateUrlViewportDebounced = debounce(
    store.dispatch(updateUrlViewport),
    URL_VIEWPORT_DEBOUNCED_TIME
  )
  useEffect(() => {
    const { longitude, latitude, zoom } = viewState
    updateUrlViewportDebounced({ longitude, latitude, zoom })
    return () => {
      updateUrlViewportDebounced.cancel()
    }
  }, [viewState, updateUrlViewportDebounced])
}
