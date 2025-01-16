import { useCallback } from 'react'
import type { ViewStateChangeEvent } from 'react-map-gl'
import { fitBounds } from '@math.gl/web-mercator'
import { debounce } from 'lodash'
import { atom, useRecoilState } from 'recoil'
import type { Bbox, MapCoordinates } from 'types'

import type { MiniglobeBounds } from '@globalfishingwatch/ui-components'

import { DEFAULT_VIEWPORT } from 'data/config'
import { selectViewport } from 'features/app/app.selectors'
import { updateUrlViewport } from 'routes/routes.actions'

import type { RootState } from '../../store';
import store from '../../store'

import useMapInstance from './map-context.hooks'

type ViewportKeys = 'latitude' | 'longitude' | 'zoom' | 'pitch' | 'bearing'
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
      const viewport = selectViewport(store.getState() as RootState)

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
     
  }, [])

  const onViewportChange = useCallback((ev: ViewStateChangeEvent) => {
    const { latitude, longitude, zoom } = ev.viewState
    if (latitude && longitude && zoom) {
      setViewport({ latitude, longitude, zoom })
    }
     
  }, [])

  return { viewport, onViewportChange, setMapCoordinates }
}

const boundsState = atom<MiniglobeBounds | undefined>({
  key: 'mapBounds',
  default: undefined,
})

export function useMapBounds() {
  const map = useMapInstance()
  const [bounds, setBounds] = useRecoilState(boundsState)
  const setMapBounds = useCallback(() => {
    if (map) {
      const rawBounds = map.getBounds()
      if (rawBounds) {
        setBounds({
          north: rawBounds.getNorth() as number,
          south: rawBounds.getSouth() as number,
          west: rawBounds.getWest() as number,
          east: rawBounds.getEast() as number,
        })
      }
    }
  }, [map, setBounds])
  return { bounds, setMapBounds }
}

// TBD when timebar is implemented
const TIMEBAR_HEIGHT = 0
const FOOTER_HEIGHT = 0

type FitBoundsParams = {
  mapWidth?: number
  mapHeight?: number
  padding?: number
}
export function useMapFitBounds() {
  const map = useMapInstance()
  const { setMapCoordinates } = useViewport()

  const fitMapBounds = useCallback(
    (bounds: Bbox, params: FitBoundsParams = {}) => {
      const { mapWidth, mapHeight, padding = 60 } = params
      const width =
        mapWidth || (map ? parseInt(map.getCanvas().style.width) : window.innerWidth / 2)
      const height =
        mapHeight ||
        (map
          ? parseInt(map.getCanvas().style.height)
          : window.innerHeight - TIMEBAR_HEIGHT - FOOTER_HEIGHT)

      const targetSize = [width - padding - padding, height - padding - padding]
      const { latitude, longitude, zoom } = fitBounds({
        bounds: [
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]],
        ],
        width,
        height,
        padding: {
          // Adjust padding to not exceed width and height
          top: targetSize[1] > 0 ? padding : targetSize[1] + padding,
          bottom: targetSize[1] > 0 ? padding : targetSize[1] + padding,
          left: targetSize[0] > 0 ? padding : targetSize[0] + padding,
          right: targetSize[0] > 0 ? padding : targetSize[0] + padding,
        },
      })
      setMapCoordinates({ latitude, longitude, zoom, pitch: 0, bearing: 0 })
    },
    [map, setMapCoordinates]
  )
  return fitMapBounds
}
