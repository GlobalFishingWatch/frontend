import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { selectScreenshotMode, setScreenshotMode } from './app.slice'

export const useScreenshotConnect = () => {
  const screenshotMode = useSelector(selectScreenshotMode)
  const dispatch = useDispatch()

  const setScreenshotModeDispatch = useCallback(
    (mode: boolean) => {
      dispatch(setScreenshotMode(mode))
    },
    [dispatch]
  )

  return {
    screenshotMode,
    setScreenshotMode: setScreenshotModeDispatch,
  }
}
