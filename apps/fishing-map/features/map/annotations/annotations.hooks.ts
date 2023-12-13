import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import type { MapLayerMouseEvent } from '@globalfishingwatch/maplibre-gl'
import { MapAnnotation } from '@globalfishingwatch/layer-composer'
import { useAppDispatch } from 'features/app/app.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { selectAreMapAnnotationsVisible, selectMapAnnotations } from 'features/app/app.selectors'
import { resetMapAnnotation, selectIsMapAnnotating, setMapAnnotation } from './annotations.slice'

export const DEFAUL_ANNOTATION_COLOR = '#ffffff'

/**
 * Hook used only for the temporal annotation stored into the slice before confirming
 */
export const useMapAnnotation = () => {
  const dispatch = useAppDispatch()
  const isMapAnnotating = useSelector(selectIsMapAnnotating)

  const dispatchResetMapAnnotation = useCallback(() => {
    dispatch(resetMapAnnotation())
  }, [dispatch])

  const dispatchSetMapAnnotation = useCallback(
    (annotation: Partial<MapAnnotation>) => {
      dispatch(setMapAnnotation(annotation))
    },
    [dispatch]
  )

  const addMapAnnotation = useCallback(
    (event: MapLayerMouseEvent) => {
      dispatchSetMapAnnotation({
        lon: event.lngLat.lng,
        lat: event.lngLat.lat,
        color: DEFAUL_ANNOTATION_COLOR,
      })
    },
    [dispatchSetMapAnnotation]
  )

  return {
    addMapAnnotation,
    resetMapAnnotation: dispatchResetMapAnnotation,
    setMapAnnotation: dispatchSetMapAnnotation,
    isMapAnnotating,
  }
}

/**
 * Hook used only for the confirmed annotations into the url
 */
export const useMapAnnotations = () => {
  const mapAnnotations = useSelector(selectMapAnnotations)
  const areMapAnnotationsVisible = useSelector(selectAreMapAnnotationsVisible)
  const { dispatchQueryParams } = useLocationConnect()

  const toggleMapAnnotationsVisibility = useCallback(() => {
    dispatchQueryParams({ mapAnnotationsVisible: !areMapAnnotationsVisible })
  }, [areMapAnnotationsVisible, dispatchQueryParams])

  const cleanMapAnnotations = useCallback(() => {
    dispatchQueryParams({ mapAnnotations: undefined })
  }, [dispatchQueryParams])

  const upsertMapAnnotations = useCallback(
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
    areMapAnnotationsVisible,
    upsertMapAnnotations,
    deleteMapAnnotation,
    cleanMapAnnotations,
    toggleMapAnnotationsVisibility,
  }
}
