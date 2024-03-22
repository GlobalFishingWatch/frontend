import { useCallback } from 'react'
import { Position } from '@deck.gl/core'
import { useMapControl } from 'features/map/controls/map-controls.hooks'
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
  } = useMapControl('errorNotification')

  const addErrorNotification = useCallback(
    (coords: Position) => {
      setMapControlValue({
        lon: coords[0],
        lat: coords[1],
      } as Partial<MapAnnotation>)
    },
    [setMapControlValue]
  )

  return {
    addErrorNotification,
    errorNotification: value as MapAnnotation,
    isErrorNotificationEditing: isEditing,
    resetErrorNotification: resetMapControlValue,
    toggleErrorNotification: toggleMapControl,
    setErrorNotification: setMapControlValue,
    setNotifyingErrorEdit: setMapControl,
  }
}
