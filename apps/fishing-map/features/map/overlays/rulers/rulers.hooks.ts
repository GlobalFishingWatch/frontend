import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { PickingInfo, Position } from '@deck.gl/core'
import { throttle } from 'es-toolkit'

import type { RulerData } from '@globalfishingwatch/deck-layers'
import { RulersLayer } from '@globalfishingwatch/deck-layers'

import { selectAreMapRulersVisible, selectMapRulers } from 'features/app/selectors/app.selectors'
import { useMapControl } from 'features/map/controls/map-controls.hooks'
import { MAP_CONTROL_RULERS } from 'features/map/controls/map-controls.slice'
import { useLocationConnect } from 'routes/routes.hook'

const useRulers = () => {
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
  } = useMapControl(MAP_CONTROL_RULERS)

  const setRuleStart = useCallback(
    (start: RulerData['start']) => {
      setMapControlValue({ id: new Date().getTime(), start })
    },
    [setMapControlValue]
  )

  const setRulerEnd = useCallback(
    (rulerData: RulerData) => {
      setMapControlValue(rulerData)
    },
    [setMapControlValue]
  )

  const throttledSetRuleEnd = useMemo(() => throttle(setRulerEnd, 16), [setRulerEnd])

  const onRulerMapHover = useCallback(
    (info: PickingInfo) => {
      if (isEditing && value) {
        const [longitude, latitude] = info.coordinate as number[]
        const end = {
          longitude,
          latitude,
        }
        throttledSetRuleEnd({ ...(value as RulerData), end })
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
    (position: Position) => {
      const point = {
        longitude: position[0],
        latitude: position[1],
      }
      if (!value) {
        setRuleStart(point)
      } else {
        dispatchQueryParams({
          mapRulers: [...(rulers || []), { ...value, end: point } as RulerData],
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

  return useMemo(
    () => ({
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
    }),
    [
      deleteMapRuler,
      isEditing,
      onRulerMapClick,
      onRulerMapHover,
      resetMapControlValue,
      resetRulers,
      rulers,
      rulersVisible,
      setMapControl,
      toggleMapControl,
      toggleRulersVisibility,
      value,
    ]
  )
}

export const useMapRulerInstance = () => {
  const { rulers, editingRuler, rulersVisible } = useRulers()
  return useMemo(() => {
    const currentRuler = editingRuler ? [editingRuler] : []
    if (editingRuler || rulers) {
      return new RulersLayer({
        rulers: [...(rulers || []), ...currentRuler],
        visible: rulersVisible,
      })
    }
  }, [editingRuler, rulers, rulersVisible])
}

export default useRulers
