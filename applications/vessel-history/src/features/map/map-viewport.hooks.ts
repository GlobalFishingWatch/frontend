import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { fitBounds } from 'viewport-mercator-project'
import { atom, useRecoilState } from 'recoil'
import debounce from 'lodash/debounce'
import { ViewportProps } from '@globalfishingwatch/react-map-gl'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components/dist/miniglobe'
import { Bbox, MapCoordinates } from 'types'
import { DEFAULT_VIEWPORT } from 'data/config'
import { updateUrlViewport } from 'routes/routes.actions'
import { selectViewport } from 'features/app/app.selectors'
import store, { RootState } from '../../store'
import useMapInstance from './map-context.hooks'

type SetMapCoordinatesArgs = Pick<ViewportProps, 'latitude' | 'longitude' | 'zoom' | 'pitch' | 'bearing'>
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
      const viewport = selectViewport(store.getState() as RootState)

      if (trigger === 'get') {
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

export default function useViewport(): UseViewport {
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
