import { useCallback, useRef, useEffect } from 'react'
import { fitBounds } from '@math.gl/web-mercator'
import { atom, useRecoilState } from 'recoil'
import { debounce } from 'lodash'
import { ViewStateChangeEvent } from 'react-map-gl'
import { useAtom, atom as jotaiAtom, useAtomValue, Atom } from 'jotai'
import { MapView, WebMercatorViewport } from '@deck.gl/core/typed'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { LngLatBounds, Map } from '@globalfishingwatch/maplibre-gl'
import { wrapBBoxLongitudes } from '@globalfishingwatch/data-transforms'
import { Bbox, MapCoordinates } from 'types'
import { DEFAULT_VIEWPORT } from 'data/config'
import { updateUrlViewport } from 'routes/routes.actions'
import { FOOTER_HEIGHT } from 'features/footer/Footer'
import { selectViewport } from 'features/app/app.selectors'
import { TIMEBAR_HEIGHT } from 'features/timebar/timebar.config'
import store from '../../store'
import useMapInstance from './map-context.hooks'

export type ViewState = {
  longitude: number
  latitude: number
  zoom: number
  pitch: number
  bearing: number
  minZoom: number
  maxZoom: number
  minPitch: number
  maxPitch: number
  transitionDuration?: number
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
  pitch: 0,
  bearing: 0,
  minZoom: 0,
  maxZoom: 20,
  minPitch: 0,
  maxPitch: 60,
  transitionDuration: 1000,
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

export const useViewstate = () => useAtomValue(viewStateAtom)

export function useViewStateAtom() {
  const [viewstate, setViewstate] = useAtom(viewStateAtom)
  return [viewstate, setViewstate] as const
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

type ViewportKeys = 'latitude' | 'longitude' | 'zoom'
type ViewportProps = Record<ViewportKeys, number>
type UseViewport = {
  viewport: MapCoordinates
  onViewportChange: (e: ViewStateChangeEvent) => void
  setMapCoordinates: (viewport: ViewportProps) => void
}

const viewportState = atom<MapCoordinates>({
  key: 'mapViewport',
  default: DEFAULT_VIEWPORT as MapCoordinates,
  effects: [
    ({ trigger, setSelf, onSet }) => {
      const viewport = (selectViewport as any)(store.getState() as any)

      if (trigger === 'get') {
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

export default function useViewport(): UseViewport {
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
export function useMapFitBounds() {
  const map = useMapInstance()
  const { setMapCoordinates } = useViewport()

  const fitMapBounds = useCallback(
    (bounds: Bbox, params: FitBoundsParams = {}) => {
      const wrapBbox = wrapBBoxLongitudes(bounds)
      const { latitude, longitude, zoom } = getMapCoordinatesFromBounds(map, wrapBbox, params)
      setMapCoordinates({ latitude, longitude, zoom: Math.max(0, zoom) })
    },
    [map, setMapCoordinates]
  )

  return fitMapBounds
}
