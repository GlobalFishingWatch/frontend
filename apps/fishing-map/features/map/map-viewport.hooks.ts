import { useCallback, useEffect } from 'react'
import { fitBounds } from '@math.gl/web-mercator'
import { atom, useRecoilState } from 'recoil'
import { debounce } from 'lodash'
import { ViewStateChangeEvent } from 'react-map-gl'
import { useAtom, atom as jotaiAtom, useAtomValue, Atom, useSetAtom } from 'jotai'
import { MapView, WebMercatorViewport } from '@deck.gl/core/typed'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { LngLatBounds, Map } from '@globalfishingwatch/maplibre-gl'
import { Bbox, MapCoordinates } from 'types'
import { DEFAULT_VIEWPORT } from 'data/config'
import { updateUrlViewport } from 'routes/routes.actions'
import { FOOTER_HEIGHT } from 'features/footer/Footer'
import { selectViewport } from 'features/app/app.selectors'
import { TIMEBAR_HEIGHT } from 'features/timebar/timebar.config'
import store from '../../store'

export type ViewState = {
  longitude: number
  latitude: number
  zoom: number
}
const getUrlViewstateNumericParam = (key: string) => {
  if (typeof window === 'undefined') return null
  const urlParam = new URLSearchParams(window.location.search).get(key)
  return urlParam ? parseFloat(urlParam) : null
}
const viewStateAtom = jotaiAtom<ViewState>({
  longitude: getUrlViewstateNumericParam('longitude') || DEFAULT_VIEWPORT.longitude,
  latitude: getUrlViewstateNumericParam('latitude') || DEFAULT_VIEWPORT.latitude,
  zoom: getUrlViewstateNumericParam('zoom') || DEFAULT_VIEWPORT.zoom,
})

export const miniGlobeBoundsAtom: Atom<MiniglobeBounds | undefined> = jotaiAtom(undefined)

const viewportAtom: Atom<WebMercatorViewport> = jotaiAtom(
  (get) => new WebMercatorViewport(get(viewStateAtom))
)
export const boundsAtom: Atom<MiniglobeBounds> = jotaiAtom((get): MiniglobeBounds => {
  const viewport = get(viewportAtom)
  const wn = viewport.unproject([0, 0])
  const es = viewport.unproject([viewport.width, viewport.height])
  return {
    north: wn[1],
    south: es[1],
    west: wn[0],
    east: es[0],
  }
})

export const useMapBounds = (): { bounds: MiniglobeBounds } => ({
  bounds: useAtomValue(boundsAtom),
})
export const useViewstateValue = () => useAtomValue(viewStateAtom)
export const useSetViewstate = () => useSetAtom(viewStateAtom)

export function useViewStateAtom() {
  const [viewState, _setViewState] = useAtom(viewStateAtom)
  const setViewState = useCallback(
    (newViewSate: Partial<ViewState>) => {
      _setViewState(() => ({ ...viewState, ...newViewSate }))
    },
    [viewState, _setViewState]
  )
  return { viewState, setViewState }
}

const mapViewAtom: Atom<MapView> = jotaiAtom(new MapView({ repeat: true, controller: true }))
export function useMapViewAtom(): MapView {
  return useAtomValue(mapViewAtom)
}
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

export function checkEqualBounds(bounds1?: MiniglobeBounds, bounds2?: MiniglobeBounds) {
  if (!bounds1 || !bounds2) return false
  return (
    bounds1.north === bounds2.north &&
    bounds1.south === bounds2.south &&
    bounds1.west === bounds2.west &&
    bounds1.east === bounds2.east
  )
}

export function mglToMiniGlobeBounds(mglBounds: LngLatBounds) {
  return {
    north: mglBounds.getNorth() as number,
    south: mglBounds.getSouth() as number,
    west: mglBounds.getWest() as number,
    east: mglBounds.getEast() as number,
  }
}

type FitBoundsParams = {
  mapWidth?: number
  mapHeight?: number
  padding?: number
}

export const getMapCoordinatesFromBounds = (
  map: Map,
  bounds: Bbox,
  params: FitBoundsParams = {}
) => {
  const { mapWidth, mapHeight, padding = 60 } = params
  const width = mapWidth || (map ? parseInt(map.getCanvas().style.width) : window.innerWidth / 2)
  const height =
    mapHeight ||
    (map
      ? parseInt(map.getCanvas().style.height)
      : window.innerHeight - TIMEBAR_HEIGHT - FOOTER_HEIGHT)
  const { latitude, longitude, zoom } = fitBounds({
    bounds: [
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    ],
    width,
    height,
    padding,
  })
  return { latitude, longitude, zoom }
}

function convertToTupleBoundingBox(flatBoundingBox: Bbox): [[number, number], [number, number]] {
  if (flatBoundingBox.length !== 4) {
    throw new Error('Invalid flat bounding box')
  }

  const topLeft: [number, number] = [flatBoundingBox[0], flatBoundingBox[1]]
  const bottomRight: [number, number] = [flatBoundingBox[2], flatBoundingBox[3]]

  return [topLeft, bottomRight]
}

export function useMapFitBounds() {
  const Viewport = useAtomValue(viewportAtom)
  const [viewState, setViewState] = useViewStateAtom()
  const fitBounds = useCallback(
    (bounds: Bbox, params: FitBoundsParams = {}) => {
      const newViewport = Viewport.fitBounds(convertToTupleBoundingBox(bounds), params)
      setViewState({
        ...viewState,
        latitude: newViewport.latitude,
        longitude: newViewport.longitude,
        zoom: newViewport.zoom,
      })
    },
    [Viewport, viewState, setViewState]
  )
  return fitBounds
}
