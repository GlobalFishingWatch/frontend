import { useCallback, useMemo } from 'react'
import type { Position } from '@deck.gl/core'

import { useMapControl } from 'features/map/controls/map-controls.hooks'
import { MAP_CONTROL_ERROR_NOTIFICATIONS } from 'features/map/controls/map-controls.slice'

import type { MapAnnotation } from '../annotations/annotations.types'

/**
 * Hook used only for the temporal annotation stored into the slice before confirming
 */
export const useMapErrorNotification = () => {
  const {
    value,
    isEditing,
    setMapControl,
    setMapControlValue,
    toggleMapControl,
    resetMapControlValue,
  } = useMapControl(MAP_CONTROL_ERROR_NOTIFICATIONS)

  const addErrorNotification = useCallback(
    (coords: Position) => {
      setMapControlValue({
        lon: coords[0],
        lat: coords[1],
      } as Partial<MapAnnotation>)
    },
    [setMapControlValue]
  )

  return useMemo(
    () => ({
      addErrorNotification,
      errorNotification: value as MapAnnotation,
      isErrorNotificationEditing: isEditing,
      resetErrorNotification: resetMapControlValue,
      toggleErrorNotification: toggleMapControl,
      setErrorNotification: setMapControlValue,
      setNotifyingErrorEdit: setMapControl,
    }),
    [
      addErrorNotification,
      isEditing,
      resetMapControlValue,
      setMapControl,
      setMapControlValue,
      toggleMapControl,
      value,
    ]
  )
}
