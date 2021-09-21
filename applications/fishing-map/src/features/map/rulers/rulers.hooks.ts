import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { MapEvent } from 'react-map-gl'
import { editRuler, moveCurrentRuler, selectEditing } from './rulers.slice'

const useRulers = () => {
  const rulersEditing = useSelector(selectEditing)
  const dispatch = useDispatch()
  const onMapHoverWithRuler = useCallback(
    (event: MapEvent) => {
      dispatch(
        moveCurrentRuler({
          longitude: event.lngLat[0],
          latitude: event.lngLat[1],
        })
      )
    },
    [dispatch]
  )

  const onMapClickWithRuler = useCallback(
    (event: MapEvent) => {
      dispatch(
        editRuler({
          longitude: event.lngLat[0],
          latitude: event.lngLat[1],
        })
      )
    },
    [dispatch]
  )

  const getRulersCursor = useCallback(() => {
    return 'crosshair'
  }, [])

  return { onMapHoverWithRuler, onMapClickWithRuler, getRulersCursor, rulersEditing }
}

export default useRulers
