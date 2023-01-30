import { useCallback, useEffect } from 'react'
import { fitBounds } from '@math.gl/web-mercator'
import { atom, useRecoilState } from 'recoil'
import { debounce } from 'lodash'
import { ViewStateChangeEvent } from 'react-map-gl'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { LngLatBounds, Map } from '@globalfishingwatch/maplibre-gl'
import { Bbox, MapCoordinates } from 'types'
import { DEFAULT_VIEWPORT } from 'data/config'
import { updateUrlViewport } from 'routes/routes.actions'
import { FOOTER_HEIGHT } from 'features/footer/Footer'
import { selectViewport } from 'features/app/app.selectors'
import { TIMEBAR_HEIGHT } from 'features/timebar/timebar.config'
import { useMapReady } from 'features/map/map-state.hooks'
import { store, RootState } from '../../store'
import useMapInstance from './map-context.hooks'

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
      const viewport = (selectViewport as any)(store.getState() as RootState)

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

const boundsState = atom<MiniglobeBounds | undefined>({
  key: 'mapBounds',
  default: undefined,
})

export function checkEqualBounds(bounds1: MiniglobeBounds, bounds2: MiniglobeBounds) {
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

export function useMapBounds() {
  const map = useMapInstance()
  const mapReady = useMapReady()
  const [bounds, setBounds] = useRecoilState(boundsState)

  const setMapBounds = useCallback(() => {
    if (map) {
      const rawBounds = map.getBounds()
      if (rawBounds) {
        setBounds(mglToMiniGlobeBounds(rawBounds))
      }
    }
  }, [map, setBounds])

  useEffect(() => {
    if (mapReady) {
      setMapBounds()
    }
  }, [mapReady, setMapBounds])

  return { bounds, setMapBounds }
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
      const { latitude, longitude, zoom } = getMapCoordinatesFromBounds(map, bounds, params)
      setMapCoordinates({ latitude, longitude, zoom: Math.max(0, zoom) })
    },
    [map, setMapCoordinates]
  )
  return fitMapBounds
}
