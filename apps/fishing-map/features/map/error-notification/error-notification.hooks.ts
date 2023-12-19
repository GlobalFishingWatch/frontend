import { useCallback } from 'react'
import type { MapLayerMouseEvent } from '@globalfishingwatch/maplibre-gl'
import { MapAnnotation } from '@globalfishingwatch/layer-composer'
import { useMapControl } from 'features/map/controls/map-controls.hooks'

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
    (event: MapLayerMouseEvent) => {
      setMapControlValue({
        lon: event.lngLat.lng,
        lat: event.lngLat.lat,
        label: '',
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
