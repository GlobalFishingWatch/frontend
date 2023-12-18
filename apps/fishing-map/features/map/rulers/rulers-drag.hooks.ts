import { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { throttle } from 'lodash'
import { MapGeoJSONFeature, MapMouseEvent } from '@globalfishingwatch/maplibre-gl'
import { RULER_INTERACTIVE_LAYER, RulerPointPosition } from '@globalfishingwatch/layer-composer'
import useMapInstance from 'features/map/map-context.hooks'
import { RULERS_GENERATOR_ID } from 'features/map/map.config'
import { selectMapRulersVisible } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'

const RULERS_LAYER_ID = `${RULERS_GENERATOR_ID}-${RULER_INTERACTIVE_LAYER}`

export function useMapRulersDrag() {
  const map = useMapInstance()
  const rulers = useSelector(selectMapRulersVisible)
  const { dispatchQueryParams } = useLocationConnect()

  const currentRuler = useRef<{ index: number; position: RulerPointPosition } | null>(null)

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
        console.log('🚀 ~ newRulers ~ newRulers:', newRulers)

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
      const position = e.features?.[0]?.properties?.position as CurrentRulerPosition
      console.log('TODO: GET INDEX BY ID')
      const rulerIndex = 0
      if (position) {
        currentRuler.current = { index: rulerIndex, position }
        // Prevent the default map drag behavior.
        e.preventDefault()

        map.on('mousemove', onMove)
        map.once('mouseup', onUp)
      }
    },
    [map, onMove, onUp]
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
