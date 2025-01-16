import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import type { MapMouseEvent } from 'maplibre-gl'

import { useDebounce } from '@globalfishingwatch/react-hooks'
import type { MiniglobeBounds } from '@globalfishingwatch/ui-components/miniglobe'

import { selectEditing } from '../../features/rulers/rulers.selectors'
import { editRuler, moveCurrentRuler } from '../../features/rulers/rulers.slice'
import { updateQueryParams } from '../../routes/routes.actions'
import { selectHiddenLabels, selectViewport } from '../../routes/routes.selectors'
import { useAppDispatch } from '../../store.hooks'
import type { CoordinatePosition, Label,MapCoordinates } from '../../types'
import { useSegmentsLabeledConnect } from '../timebar/timebar.hooks'
import { selectedtracks } from '../vessels/selectedTracks.slice'

import type { UpdateGeneratorPayload } from './map.slice'
import { selectGeneratorsConfig, selectGlobalGeneratorsConfig,updateGenerator } from './map.slice'

export const useMapMove = () => {
  const dispatch = useAppDispatch()
  const rulersEditing = useSelector(selectEditing)
  const [hoverCenter, setHoverCenter] = useState<LatLon | null>(null)
  const onMapMove = useCallback(
    (event: any) => {
      const center = {
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
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

export const useMapClick = () => {
  const dispatch = useAppDispatch()
  const rulersEditing = useSelector(selectEditing)
  const { onEventPointClick } = useSegmentsLabeledConnect()
  const segments = useSelector(selectedtracks)
  const onEventClick = useCallback(
    (feature: any, position: CoordinatePosition) => {
      const event = feature.properties
      onEventPointClick(segments, event.timestamp, position)
      return true
    },
    [onEventPointClick, segments]
  )
  const layerMapClickHandlers: any = useMemo(
    () => ({
      'vessel-positions': onEventClick,
    }),
    [onEventClick]
  )
  const onMapClick = useCallback(
    (e: MapMouseEvent) => {
      const features = e.target.queryRenderedFeatures(e.point)
      if (!rulersEditing && features && features.length) {
        const position = { latitude: e.lngLat.lat, longitude: e.lngLat.lng }
        // .some() returns true as soon as any of the callbacks return true, short-circuiting the execution of the rest
        features.some((feature: any) => {
          const eventHandler = layerMapClickHandlers[feature.source]
          // returns true when is a single event so won't run the following ones
          return eventHandler ? eventHandler(feature, position) : false
        })
      } else {
        if (rulersEditing === true) {
          dispatch(
            editRuler({
              longitude: e.lngLat.lng,
              latitude: e.lngLat.lat,
            })
          )
          return
        }
      }
    },
    [rulersEditing, layerMapClickHandlers, dispatch]
  )
  return { onMapClick }
}
// This is a convenience hook that returns at the same time the portions of the store we interested in
// as well as the functions we need to update the same portions
export const useGeneratorsConnect = () => {
  const dispatch = useAppDispatch()
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
  const dispatch = useAppDispatch()
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

  const onViewportChange = useCallback(({ viewState }: { viewState: Viewport }) => {
    const { latitude, longitude, zoom } = viewState
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
  }, [urlViewport])

  // Sync the url with the local state debounced
  useEffect(() => {
    if (debouncedViewport && callback) {
      callback(debouncedViewport)
    }
  }, [debouncedViewport])

  return { viewport, onViewportChange, setMapCoordinates }
}

export function useViewport(): UseViewport {
  const dispatch = useAppDispatch()
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

export const useHiddenLabelsConnect = () => {
  const dispatch = useAppDispatch()
  const hiddenLabels = useSelector(selectHiddenLabels)

  const dispatchHiddenLabels = (labelName: Label['name']) => {
    const newLabels = hiddenLabels.includes(labelName)
      ? hiddenLabels.filter((label: Label['name']) => label !== labelName)
      : [...hiddenLabels, labelName]

    dispatch(
      updateQueryParams({
        hiddenLabels: newLabels.length ? newLabels.join(',') : undefined,
      })
    )
  }

  return { dispatchHiddenLabels, hiddenLabels }
}
