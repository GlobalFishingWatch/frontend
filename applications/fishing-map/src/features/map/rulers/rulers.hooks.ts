import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PointerEvent } from '@globalfishingwatch/react-map-gl'
import { editRuler, moveCurrentRuler, selectEditing } from './rulers.slice'

const useRulers = () => {
  const rulersEditing = useSelector(selectEditing)
  const dispatch = useDispatch()
  const onMapHoverWithRuler = useCallback(
    (event: PointerEvent) => {
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
    (event: PointerEvent) => {
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
