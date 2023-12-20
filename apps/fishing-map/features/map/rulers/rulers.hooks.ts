import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { throttle } from 'lodash'
import type { MapLayerMouseEvent } from '@globalfishingwatch/maplibre-gl'
import { Ruler } from '@globalfishingwatch/layer-composer'
import { useAppDispatch } from 'features/app/app.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { selectAreMapRulersVisible, selectMapRulers } from 'features/app/app.selectors'
import { useMapControl } from 'features/map/controls/map-controls.hooks'

const useRulers = () => {
  const dispatch = useAppDispatch()
  const rulers = useSelector(selectMapRulers)
  const rulersVisible = useSelector(selectAreMapRulersVisible)
  const { dispatchQueryParams } = useLocationConnect()
  const {
    value,
    isEditing,
    setMapControl,
    toggleMapControl,
    setMapControlValue,
    resetMapControlValue,
  } = useMapControl('rulers')

  const setRuleStart = useCallback(
    (start: Ruler['start']) => {
      setMapControlValue({ id: new Date().getTime(), start })
    },
    [setMapControlValue]
  )

  const setRulerEnd = useCallback(
    (end: Ruler['end']) => {
      setMapControlValue({ ...(value as Ruler), end })
    },
    [setMapControlValue, value]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledSetRuleEnd = useCallback(
    throttle((event: MapLayerMouseEvent) => {
      setRulerEnd({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
      })
    }, 16),
    [dispatch]
  )

  const onRulerMapHover = useCallback(
    (event: MapLayerMouseEvent) => {
      if (isEditing && value) {
        throttledSetRuleEnd(event)
      }
      return event
    },
    [isEditing, throttledSetRuleEnd, value]
  )

  const deleteMapRuler = useCallback(
    (id: string | number) => {
      const mapRulers = rulers.filter((a) => {
        return a.id !== id
      })
      dispatchQueryParams({ mapRulers })
    },
    [dispatchQueryParams, rulers]
  )

  const onRulerMapClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const point = {
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
      }
      if (!value) {
        setRuleStart(point)
      } else {
        dispatchQueryParams({
          mapRulers: [...rulers, { ...(value as Ruler) }],
          mapRulersVisible: true,
        })
        resetMapControlValue()
      }
    },
    [dispatchQueryParams, resetMapControlValue, rulers, setRuleStart, value]
  )

  const toggleRulersVisibility = useCallback(() => {
    dispatchQueryParams({ mapRulersVisible: !rulersVisible })
  }, [rulersVisible, dispatchQueryParams])

  const resetRulers = useCallback(() => {
    setMapControl(false)
    resetMapControlValue()
    dispatchQueryParams({ mapRulers: undefined })
  }, [dispatchQueryParams, resetMapControlValue, setMapControl])

  return {
    rulers,
    resetRulers,
    editingRuler: value as Ruler,
    rulersEditing: isEditing,
    rulersVisible,
    deleteMapRuler,
    onRulerMapHover,
    onRulerMapClick,
    toggleRulersEditing: toggleMapControl,
    resetEditingRule: resetMapControlValue,
    setRulersEditing: setMapControl,
    toggleRulersVisibility,
  }
}

export default useRulers
