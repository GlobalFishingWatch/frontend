import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { useAppDispatch } from 'features/app/app.hooks'

import type { MapControl, MapControlValue } from './map-controls.slice'
import {
  resetMapControlValue as resetMapControlValueAction,
  selectMapControlEditing,
  selectMapControlValue,
  setMapControlEditing as setMapControlEditingAction,
  setMapControlValue as setMapControlValueAction,
} from './map-controls.slice'

export const useMapControl = (control: MapControl) => {
  const dispatch = useAppDispatch()
  const isEditing = useSelector(selectMapControlEditing(control))
  const value = useSelector(selectMapControlValue(control))

  const setMapControl = useCallback(
    (editing: boolean) => {
      dispatch(setMapControlEditingAction({ control, editing }))
    },
    [control, dispatch]
  )

  const toggleMapControl = useCallback(() => {
    setMapControl(!isEditing)
  }, [isEditing, setMapControl])

  const setMapControlValue = useCallback(
    (value: MapControlValue) => {
      dispatch(setMapControlValueAction({ control, value }))
    },
    [control, dispatch]
  )
  const resetMapControlValue = useCallback(() => {
    dispatch(resetMapControlValueAction(control))
  }, [control, dispatch])

  return useMemo(
    () => ({
      isEditing,
      value,
      setMapControl,
      toggleMapControl,
      setMapControlValue,
      resetMapControlValue,
    }),
    [isEditing, resetMapControlValue, setMapControl, setMapControlValue, toggleMapControl, value]
  )
}
