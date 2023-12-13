import { useCallback } from 'react'
import { batch, useSelector } from 'react-redux'
import type { MapLayerMouseEvent } from '@globalfishingwatch/maplibre-gl'
import { useAppDispatch } from 'features/app/app.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { selectAreMapRulersVisible } from 'features/app/app.selectors'
import {
  editRuler,
  moveCurrentRuler,
  selectEditing,
  selectRulers,
  setRulersEditing,
  resetRulers as resetRulersAction,
} from './rulers.slice'

const useRulers = () => {
  const rulers = useSelector(selectRulers)
  const rulersEditing = useSelector(selectEditing)
  const rulersVisible = useSelector(selectAreMapRulersVisible)
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()

  const onRulerMapHover = useCallback(
    (event: MapLayerMouseEvent) => {
      dispatch(
        moveCurrentRuler({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
        })
      )
    },
    [dispatch]
  )

  const onRulerMapClick = useCallback(
    (event: MapLayerMouseEvent) => {
      dispatch(
        editRuler({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
        })
      )
    },
    [dispatch]
  )

  const toggleRulersVisibility = useCallback(() => {
    dispatchQueryParams({ mapRulersVisible: !rulersVisible })
  }, [rulersVisible, dispatchQueryParams])

  const resetRulers = useCallback(() => {
    batch(() => {
      dispatch(resetRulersAction())
      dispatch(setRulersEditing(false))
    })
  }, [dispatch])

  return {
    rulers,
    onRulerMapHover,
    onRulerMapClick,
    rulersEditing,
    rulersVisible,
    resetRulers,
    toggleRulersVisibility,
  }
}

export default useRulers
