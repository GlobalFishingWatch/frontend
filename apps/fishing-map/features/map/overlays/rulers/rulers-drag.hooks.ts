import { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { throttle } from 'lodash'
import { MapGeoJSONFeature, MapMouseEvent } from '@globalfishingwatch/maplibre-gl'
import { RulerPointProperties } from '@globalfishingwatch/layer-composer'
import useMapInstance from 'features/map/map-context.hooks'
import { RULERS_LAYER_ID } from 'features/map/map.config'
import { selectMapRulersVisible } from 'features/app/selectors/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'

export function useMapRulersDrag() {
  const map = useMapInstance()
  const rulers = useSelector(selectMapRulersVisible)
  const { dispatchQueryParams } = useLocationConnect()

  const currentRuler = useRef<{ index: number; position: RulerPointProperties['position'] } | null>(
    null
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    throttle((mapRulers) => {
      dispatchQueryParams({ mapRulers })
    }, 200),
    [dispatchQueryParams]
  )

  const onMove = useCallback(
    (e: MapMouseEvent) => {
      if (rulers?.length) {
        const { lat, lng } = e.lngLat
        const newRulers = rulers.map((r, index) => {
          if (index !== currentRuler.current?.index) {
            return r
          }
          return currentRuler.current?.position === 'start'
            ? { ...r, start: { longitude: lng, latitude: lat } }
            : { ...r, end: { longitude: lng, latitude: lat } }
        })
        debouncedUpdate(newRulers)
      }
    },
    [debouncedUpdate, rulers]
  )

  const onUp = useCallback(() => {
    currentRuler.current = null
    // Unbind mouse/touch events
    map.off('mousemove', onMove)
    map.off('touchmove', onMove)
  }, [map, onMove])

  const onDown = useCallback(
    (
      e: MapMouseEvent & {
        features?: MapGeoJSONFeature[] | undefined
      }
    ) => {
      const { id, position } = e.features?.[0]?.properties as RulerPointProperties
      const rulerIndex = rulers.findIndex((ruler) => ruler.id === id)
      if (position) {
        currentRuler.current = { index: rulerIndex, position }
        // Prevent the default map drag behavior.
        e.preventDefault()

        map.on('mousemove', onMove)
        map.once('mouseup', onUp)
      }
    },
    [map, onMove, onUp, rulers]
  )

  useEffect(() => {
    if (map) {
      map.on('mousedown', RULERS_LAYER_ID, onDown)
    }
    return () => {
      if (map) {
        map.off('mousedown', RULERS_LAYER_ID, onDown)
      }
    }
  }, [map, onDown])
}
