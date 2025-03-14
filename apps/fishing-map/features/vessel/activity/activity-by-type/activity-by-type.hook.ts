import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import type { EventType } from '@globalfishingwatch/api-types'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectVesselEventType, setVesselEventType } from 'features/vessel/vessel.slice'

export const useActivityByType = (): [EventType | null, (eventType: EventType) => void] => {
  const dispatch = useAppDispatch()
  const vesselEventType = useSelector(selectVesselEventType)

  const toggleEventType = useCallback(
    (type: EventType) => {
      if (vesselEventType === type) {
        dispatch(setVesselEventType(null))
      } else {
        dispatch(setVesselEventType(type))
      }
    },
    [dispatch, vesselEventType]
  )

  return useMemo(() => [vesselEventType, toggleEventType], [vesselEventType, toggleEventType])
}
