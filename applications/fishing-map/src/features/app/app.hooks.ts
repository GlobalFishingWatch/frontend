import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import {
  selectScreenshotLoading,
  selectScreenshotMode,
  setScreenshotLoading,
  setScreenshotMode,
} from './app.slice'

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

export const useScreenshotLoadingConnect = () => {
  const screenshotLoading = useSelector(selectScreenshotLoading)
  const dispatch = useDispatch()

  const setScreenshotLoadingDispatch = useCallback(
    (loading: boolean) => {
      dispatch(setScreenshotLoading(loading))
    },
    [dispatch]
  )

  return {
    screenshotLoading,
    setScreenshotLoading: setScreenshotLoadingDispatch,
  }
}
