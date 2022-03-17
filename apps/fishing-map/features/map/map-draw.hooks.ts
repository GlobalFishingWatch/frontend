import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectDrawMode, setDrawMode, DrawMode } from './map.slice'

export const useMapDrawConnect = () => {
  const dispatch = useAppDispatch()
  const drawMode = useSelector(selectDrawMode)

  const dispatchSetDrawMode = useCallback(
    (mode: DrawMode) => {
      dispatch(setDrawMode(mode))
    },
    [dispatch]
  )

  return { drawMode, dispatchSetDrawMode }
}
