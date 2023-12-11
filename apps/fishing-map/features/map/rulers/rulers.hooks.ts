import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import type { MapLayerMouseEvent } from '@globalfishingwatch/maplibre-gl'
import { useAppDispatch } from 'features/app/app.hooks'
import { editRuler, moveCurrentRuler, selectEditing } from './rulers.slice'

const useRulers = () => {
  const rulersEditing = useSelector(selectEditing)
  const dispatch = useAppDispatch()

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

  return { onRulerMapHover, onRulerMapClick, rulersEditing }
}

export default useRulers
