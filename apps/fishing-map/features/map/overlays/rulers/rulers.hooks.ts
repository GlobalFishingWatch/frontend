import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { throttle } from 'lodash'
import { PickingInfo } from '@deck.gl/core/typed'
import { RulerData } from '@globalfishingwatch/deck-layers'
import { useAppDispatch } from 'features/app/app.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { selectAreMapRulersVisible, selectMapRulers } from 'features/app/selectors/app.selectors'
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
    (start: RulerData['start']) => {
      setMapControlValue({ id: new Date().getTime(), start })
    },
    [setMapControlValue]
  )

  const setRulerEnd = useCallback(
    (end: RulerData['end']) => {
      setMapControlValue({ ...(value as RulerData), end })
    },
    [setMapControlValue, value]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledSetRuleEnd = useCallback(
    throttle((info: PickingInfo) => {
      if (!info.coordinate) return
      const [longitude, latitude] = info.coordinate as number[]
      const point = {
        longitude,
        latitude,
      }
      setRulerEnd(point)
    }, 16),
    [dispatch]
  )

  const onRulerMapHover = useCallback(
    (info: PickingInfo) => {
      if (isEditing && value) {
        throttledSetRuleEnd(info)
      }
      return info
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
    (info: PickingInfo) => {
      const [longitude, latitude] = info.coordinate as number[]
      const point = {
        longitude,
        latitude,
      }
      if (!value) {
        setRuleStart(point)
      } else {
        dispatchQueryParams({
          mapRulers: [...(rulers || []), { ...(value as RulerData) }],
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
    editingRuler: value as RulerData,
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
