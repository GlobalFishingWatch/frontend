import { useSelector } from 'react-redux'
import { useCallback, useEffect, useLayoutEffect } from 'react'
import { fitBounds } from 'viewport-mercator-project'
import { atom, useRecoilState } from 'recoil'
import { ViewportProps } from '@globalfishingwatch/react-map-gl'
import useDebounce from '@globalfishingwatch/react-hooks/dist/use-debounce'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { MapCoordinates } from 'types'
import { selectViewport } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { DEFAULT_VIEWPORT } from 'data/config'
import { useMapboxInstance, useMapboxRef } from './map.context'

type SetMapCoordinatesArgs = Pick<ViewportProps, 'latitude' | 'longitude' | 'zoom'>
type UseViewport = {
  viewport: MapCoordinates
  onViewportChange: (viewport: ViewportProps) => void
  setMapCoordinates: (viewport: SetMapCoordinatesArgs) => void
}

const viewportState = atom<MapCoordinates>({
  key: 'mapViewport',
  default: DEFAULT_VIEWPORT,
})

export function useDebouncedViewport(
  urlViewport: MapCoordinates,
  callback: (viewport: MapCoordinates) => void
): UseViewport {
  const [viewport, setViewport] = useRecoilState(viewportState)
  const debouncedViewport = useDebounce<MapCoordinates>(viewport, 1000)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => setViewport(urlViewport), [])

  const setMapCoordinates = useCallback(
    (viewport: SetMapCoordinatesArgs) => {
      setViewport({ ...viewport })
    },
    [setViewport]
  )

  const onViewportChange = useCallback(
    (viewport: ViewportProps) => {
      const { latitude, longitude, zoom } = viewport
      setViewport({ latitude, longitude, zoom })
    },
    [setViewport]
  )

  // Sync the url with the local state debounced
  useEffect(() => {
    if (debouncedViewport && typeof callback === 'function') {
      callback({
        latitude: debouncedViewport.latitude,
        longitude: debouncedViewport.longitude,
        zoom: debouncedViewport.zoom,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedViewport])

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
      const { latitude, longitude, zoom } = fitBounds({
        bounds: [
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]],
        ],
        width: (mapInstance as any)._canvas.width,
        height: (mapInstance as any)._canvas.height,
        padding,
      })
      setMapCoordinates({ latitude, longitude, zoom })
    },
    [mapInstance, setMapCoordinates]
  )
  return fitMapBounds
}

export default function useViewport(): UseViewport {
  const { dispatchQueryParams } = useLocationConnect()
  const urlViewport = useSelector(selectViewport)
  const callback = useCallback((viewport) => dispatchQueryParams(viewport), [dispatchQueryParams])
  return useDebouncedViewport(urlViewport, callback)
}
