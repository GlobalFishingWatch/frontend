import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import type { MapLayerMouseEvent } from '@globalfishingwatch/maplibre-gl'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectIsMapAnnotating, setMapAnnotationPosition } from './annotations.slice'

const useMapAnnotations = () => {
  const isMapAnnotating = useSelector(selectIsMapAnnotating)
  const dispatch = useAppDispatch()
  const rulesCursor = 'crosshair'

  const onMapClickWithAnnotation = useCallback(
    (event: MapLayerMouseEvent) => {
      dispatch(
        setMapAnnotationPosition({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
        })
      )
    },
    [dispatch]
  )

  return { rulesCursor, onMapClickWithAnnotation, isMapAnnotating }
}

export default useMapAnnotations
