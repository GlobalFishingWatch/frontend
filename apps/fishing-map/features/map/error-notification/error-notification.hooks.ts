import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import type { MapLayerMouseEvent } from '@globalfishingwatch/maplibre-gl'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectIsNotifyingError,
  setIsNotifyingError,
  setErrorNotification as setMapErrorNotificationAction,
  resetErrorNotification as resetMapErrorNotificationAction,
  ErrorNotification,
} from './error-notification.slice'

/**
 * Hook used only for the temporal annotation stored into the slice before confirming
 */
export const useMapErrorNotification = () => {
  const dispatch = useAppDispatch()
  const isNotifyingError = useSelector(selectIsNotifyingError)

  const resetErrorNotification = useCallback(() => {
    dispatch(resetMapErrorNotificationAction())
  }, [dispatch])

  const setNotifyingError = useCallback(
    (notifying: boolean) => {
      dispatch(setIsNotifyingError(notifying))
    },
    [dispatch]
  )

  const setErrorNotification = useCallback(
    (error: Partial<ErrorNotification>) => {
      dispatch(setMapErrorNotificationAction(error))
    },
    [dispatch]
  )

  const addErrorNotification = useCallback(
    (event: MapLayerMouseEvent) => {
      setErrorNotification({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        label: '',
      })
    },
    [setErrorNotification]
  )

  return {
    addErrorNotification,
    resetErrorNotification,
    setErrorNotification,
    isNotifyingError,
    setNotifyingError,
  }
}
