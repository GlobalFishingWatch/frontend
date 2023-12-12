import { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { throttle } from 'lodash'
import { MapAnnotation } from '@globalfishingwatch/layer-composer'
import { MapMouseEvent } from '@globalfishingwatch/maplibre-gl'
import useMapInstance from 'features/map/map-context.hooks'
import { ANNOTATIONS_GENERATOR_ID } from 'features/map/map.config'
import { selectMapAnnotations } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'

const ANNOTATIONS_LAYER_ID = `${ANNOTATIONS_GENERATOR_ID}-labels`

export function useMapAnnotationDrag() {
  const map = useMapInstance()
  const annotations = useSelector(selectMapAnnotations)
  const { dispatchQueryParams } = useLocationConnect()

  const currentAnnotationRef = useRef<MapAnnotation | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    throttle((mapAnnotations) => {
      dispatchQueryParams({ mapAnnotations })
    }, 150),
    [dispatchQueryParams]
  )

  const onMove = useCallback(
    (e: MapMouseEvent) => {
      const { lat, lng } = e.lngLat
      const mapAnnotations = annotations.map((a) => {
        return a.id === currentAnnotationRef.current?.id ? { ...a, lat, lon: lng } : a
      })
      debouncedUpdate(mapAnnotations)
    },
    [annotations, debouncedUpdate]
  )

  const onUp = useCallback(() => {
    currentAnnotationRef.current = null
    // Unbind mouse/touch events
    map.off('mousemove', onMove)
    map.off('touchmove', onMove)
  }, [map, onMove])

  useEffect(() => {
    if (map) {
      map.on('mousedown', ANNOTATIONS_LAYER_ID, (e) => {
        const annotationId = e.features?.[0]?.properties?.id
        const currentAnnotation = annotations.find((a) => a.id === annotationId)
        if (currentAnnotation) {
          currentAnnotationRef.current = currentAnnotation
        }
        // Prevent the default map drag behavior.
        e.preventDefault()

        map.on('mousemove', onMove)
        map.once('mouseup', onUp)
      })
      return () => {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])
}
