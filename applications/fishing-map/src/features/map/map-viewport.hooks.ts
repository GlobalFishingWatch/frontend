import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { fitBounds } from 'viewport-mercator-project'
import { atom, useRecoilState } from 'recoil'
import debounce from 'lodash/debounce'
import { ViewportProps } from '@globalfishingwatch/react-map-gl'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { MapCoordinates } from 'types'
import { DEFAULT_VIEWPORT } from 'data/config'
import { updateUrlViewport } from 'routes/routes.actions'
import { useMapboxInstance, useMapboxRef } from './map.context'

type SetMapCoordinatesArgs = Pick<ViewportProps, 'latitude' | 'longitude' | 'zoom'>
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
    ({ onSet }) => {
      const dispatch = useDispatch()
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

  const setMapCoordinates = useCallback((viewport: SetMapCoordinatesArgs) => {
    setViewport({ ...viewport })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onViewportChange = useCallback((viewport: ViewportProps) => {
    const { latitude, longitude, zoom } = viewport
    setViewport({ latitude, longitude, zoom })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { viewport, onViewportChange, setMapCoordinates }
}

const boundsState = atom<MiniglobeBounds | undefined>({
  key: 'mapBounds',
  default: undefined,
})

export function useMapBounds() {
  const mapRef = useMapboxRef()
  const [bounds, setBounds] = useRecoilState(boundsState)
  const setMapBounds = useCallback(() => {
    const mapboxRef = mapRef?.current?.getMap()
    if (mapboxRef) {
      const rawBounds = mapboxRef.getBounds()
      if (rawBounds) {
        setBounds({
          north: rawBounds.getNorth() as number,
          south: rawBounds.getSouth() as number,
          west: rawBounds.getWest() as number,
          east: rawBounds.getEast() as number,
        })
      }
    }
  }, [mapRef, setBounds])
  return { bounds, setMapBounds }
}

export function useMapFitBounds() {
  const mapInstance = useMapboxInstance()
  const { setMapCoordinates } = useViewport()

  const fitMapBounds = useCallback(
    (bounds: [number, number, number, number], padding = 60) => {
      const width = mapInstance
        ? parseInt(mapInstance.getCanvas().style.width)
        : window.innerWidth / 2
      const height = mapInstance
        ? parseInt(mapInstance.getCanvas().style.height)
        : window.innerHeight / 2
      const { latitude, longitude, zoom } = fitBounds({
        bounds: [
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]],
        ],
        width,
        height,
        padding,
      })
      setMapCoordinates({ latitude, longitude, zoom })
    },
    [mapInstance, setMapCoordinates]
  )
  return fitMapBounds
}
