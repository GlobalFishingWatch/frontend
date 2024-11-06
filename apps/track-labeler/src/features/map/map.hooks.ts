import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
// import { ViewportProps } from 'react-map-gl'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components/miniglobe'
import { selectViewport } from '../../routes/routes.selectors'
import { updateQueryParams } from '../../routes/routes.actions'
import { MapCoordinates } from '../../types'
import { selectEditing } from '../../features/rulers/rulers.selectors'
import { moveCurrentRuler } from '../../features/rulers/rulers.slice'
import {
  selectGeneratorsConfig,
  updateGenerator,
  UpdateGeneratorPayload,
  selectGlobalGeneratorsConfig,
} from './map.slice'

export const useMapMove = () => {
  const dispatch = useDispatch()
  const rulersEditing = useSelector(selectEditing)
  const [hoverCenter, setHoverCenter] = useState<LatLon | null>(null)
  const onMapMove = useCallback(
    (event: any) => {
      const center = {
        longitude: event.lngLat[0],
        latitude: event.lngLat[1],
      }
      setHoverCenter(center)
      if (rulersEditing === true) {
        dispatch(moveCurrentRuler(center))
      }
    },
    [dispatch, rulersEditing]
  )
  return { onMapMove, hoverCenter }
}
// This is a convenience hook that returns at the same time the portions of the store we interested in
// as well as the functions we need to update the same portions
export const useGeneratorsConnect = () => {
  const dispatch = useDispatch()
  return {
    globalConfig: useSelector(selectGlobalGeneratorsConfig),
    generatorsConfig: useSelector(selectGeneratorsConfig),
    updateGenerator: (payload: UpdateGeneratorPayload) => dispatch(updateGenerator(payload)),
  }
}
type SetMapCoordinatesArgs = Pick<any, 'latitude' | 'longitude' | 'zoom'>
type UseViewport = {
  viewport: MapCoordinates
  onViewportChange: (viewport: any) => void
  setMapCoordinates: (viewport: SetMapCoordinatesArgs) => void
}

export type LatLon = {
  latitude: number
  longitude: number
}
export interface Viewport extends LatLon {
  latitude: number
  longitude: number
  zoom: number
}
export const useViewportConnect = () => {
  const dispatch = useDispatch()
  const { zoom, latitude, longitude } = useSelector(selectViewport)
  const dispatchViewport = (newViewport: Partial<Viewport>) =>
    dispatch(updateQueryParams(newViewport))
  return { zoom, latitude, longitude, dispatchViewport }
}

export function useDebouncedViewport(
  urlViewport: MapCoordinates,
  callback: (viewport: MapCoordinates) => void
): UseViewport {
  const [viewport, setViewport] = useState<MapCoordinates>(urlViewport)
  const debouncedViewport = useDebounce<MapCoordinates>(viewport, 400)

  const setMapCoordinates = useCallback((viewport: SetMapCoordinatesArgs) => {
    setViewport({ ...viewport })
  }, [])

  const onViewportChange = useCallback((viewport: any) => {
    const { latitude, longitude, zoom } = viewport
    setViewport({ latitude, longitude, zoom })
  }, [])

  // Updates local state when url changes
  useEffect(() => {
    const { latitude, longitude, zoom } = viewport
    if (
      urlViewport &&
      (urlViewport?.latitude !== latitude ||
        urlViewport?.longitude !== longitude ||
        urlViewport?.zoom !== zoom)
    ) {
      setViewport({ ...urlViewport })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlViewport])

  // Sync the url with the local state debounced
  useEffect(() => {
    if (debouncedViewport && callback) {
      callback(debouncedViewport)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedViewport])

  return { viewport, onViewportChange, setMapCoordinates }
}

export function useViewport(): UseViewport {
  const dispatch = useDispatch()
  const urlViewport = useSelector(selectViewport)
  const callback = useCallback((viewport: any) => dispatch(updateQueryParams(viewport)), [dispatch])
  return useDebouncedViewport(urlViewport, callback)
}

export const useMapBounds = (mapRef: any) => {
  const { zoom, latitude, longitude } = useViewportConnect()
  const [bounds, setBounds] = useState<MiniglobeBounds | any>(null)
  useEffect(() => {
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
  }, [zoom, latitude, longitude, mapRef])
  return bounds
}
