import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import type { MapLayerMouseEvent } from '@globalfishingwatch/maplibre-gl'
import { MapAnnotation } from '@globalfishingwatch/layer-composer'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectMapAnnotations } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { resetMapAnnotation, selectIsMapAnnotating, setMapAnnotation } from './annotations.slice'
export const DEFAUL_ANNOTATION_COLOR = '#ffffff'
const useMapAnnotations = () => {
  const dispatch = useAppDispatch()
  const mapAnnotations = useSelector(selectMapAnnotations)
  const isMapAnnotating = useSelector(selectIsMapAnnotating)
  const { dispatchQueryParams } = useLocationConnect()

  const cleanMapAnnotations = useCallback(() => {
    dispatchQueryParams({ mapAnnotations: undefined })
  }, [dispatchQueryParams])

  const dispatchResetMapAnnotation = useCallback(() => {
    dispatch(resetMapAnnotation())
  }, [dispatch])

  const dispatchSetMapAnnotation = useCallback(
    (annotation: Partial<MapAnnotation>) => {
      dispatch(setMapAnnotation(annotation))
    },
    [dispatch]
  )

  const onAnnotationMapClick = useCallback(
    (event: MapLayerMouseEvent) => {
      dispatchSetMapAnnotation({
        lon: event.lngLat.lng,
        lat: event.lngLat.lat,
        color: DEFAUL_ANNOTATION_COLOR,
      })
    },
    [dispatchSetMapAnnotation]
  )

  const upsertMapAnnotation = useCallback(
    (annotation: MapAnnotation) => {
      if (mapAnnotations?.length && mapAnnotations?.some((a) => a.id === annotation.id)) {
        const annotations = mapAnnotations.map((a) => {
          return a.id === annotation.id ? { ...a, ...annotation } : a
        })
        dispatchQueryParams({ mapAnnotations: annotations })
      } else {
        dispatchQueryParams({ mapAnnotations: [...(mapAnnotations || []), annotation] })
      }
    },
    [dispatchQueryParams, mapAnnotations]
  )

  const deleteMapAnnotation = useCallback(
    (id: MapAnnotation['id']) => {
      const annotations = mapAnnotations.filter((a) => {
        return a.id !== id
      })
      dispatchQueryParams({ mapAnnotations: annotations })
    },
    [dispatchQueryParams, mapAnnotations]
  )

  return {
    mapAnnotations,
    upsertMapAnnotation,
    deleteMapAnnotation,
    onAnnotationMapClick,
    cleanMapAnnotations,
    resetMapAnnotation: dispatchResetMapAnnotation,
    setMapAnnotation: dispatchSetMapAnnotation,
    isMapAnnotating,
  }
}

export default useMapAnnotations
