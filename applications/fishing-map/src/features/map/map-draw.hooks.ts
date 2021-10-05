import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectDrawMode, setDrawMode, DrawMode } from './map.slice'

export const useMapDrawConnect = () => {
  const dispatch = useDispatch()
  const drawMode = useSelector(selectDrawMode)

  const dispatchSetDrawMode = useCallback(
    (mode: DrawMode) => {
      dispatch(setDrawMode(mode))
    },
    [dispatch]
  )

  return { drawMode, dispatchSetDrawMode }
}
