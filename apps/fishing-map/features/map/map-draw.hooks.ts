import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectIsMapDrawing, setMapDrawing } from './map.slice'

export const useMapDrawConnect = () => {
  const dispatch = useAppDispatch()
  const isMapDrawing = useSelector(selectIsMapDrawing)

  const dispatchSetMapDrawing = useCallback(
    (mode: boolean) => {
      dispatch(setMapDrawing(mode))
    },
    [dispatch]
  )

  return { isMapDrawing, dispatchSetMapDrawing }
}
