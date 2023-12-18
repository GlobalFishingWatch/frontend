import { useCallback } from 'react'
import { batch, useSelector } from 'react-redux'
import { throttle } from 'lodash'
import type { MapLayerMouseEvent } from '@globalfishingwatch/maplibre-gl'
import { useAppDispatch } from 'features/app/app.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { selectAreMapRulersVisible, selectMapRulers } from 'features/app/app.selectors'
import {
  selectEditing,
  selectEditingRuler,
  setRuleEnd,
  setRuleStart,
  setRulersEditing,
  resetEditingRule as resetEditingRuleAction,
} from './rulers.slice'

const useRulers = () => {
  const rulers = useSelector(selectMapRulers)
  const editingRuler = useSelector(selectEditingRuler)
  const rulersEditing = useSelector(selectEditing)
  const rulersVisible = useSelector(selectAreMapRulersVisible)
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledSetRuleEnd = useCallback(
    throttle((event: MapLayerMouseEvent) => {
      dispatch(
        setRuleEnd({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
        })
      )
    }, 16),
    [dispatch]
  )

  const onRulerMapHover = useCallback(
    (event: MapLayerMouseEvent) => {
      throttledSetRuleEnd(event)
      return event
    },
    [throttledSetRuleEnd]
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
      if (!editingRuler) {
        dispatch(setRuleStart(point))
      } else {
        dispatchQueryParams({
          mapRulers: [...rulers, { ...editingRuler }],
          mapRulersVisible: true,
        })
        dispatch(resetEditingRuleAction())
      }
    },
    [dispatch, dispatchQueryParams, editingRuler, rulers]
  )

  const toggleRulersVisibility = useCallback(() => {
    dispatchQueryParams({ mapRulersVisible: !rulersVisible })
  }, [rulersVisible, dispatchQueryParams])

  const resetRulers = useCallback(() => {
    batch(() => {
      dispatch(resetEditingRuleAction())
      dispatch(setRulersEditing(false))
    })
    dispatchQueryParams({ mapRulers: undefined })
  }, [dispatch, dispatchQueryParams])

  return {
    rulers,
    editingRuler,
    onRulerMapHover,
    onRulerMapClick,
    rulersEditing,
    rulersVisible,
    deleteMapRuler,
    resetRulers,
    toggleRulersVisibility,
  }
}

export default useRulers
