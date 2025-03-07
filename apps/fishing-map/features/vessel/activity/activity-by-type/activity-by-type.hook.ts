import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import type { EventType } from '@globalfishingwatch/api-types'

import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselEventType } from 'routes/routes.selectors'

export const useActivityByType = (): [EventType | null, (eventType: EventType) => void] => {
  const vesselEventType = useSelector(selectVesselEventType)
  const { dispatchQueryParams } = useLocationConnect()

  const toggleEventType = useCallback(
    (type: EventType) => {
      if (vesselEventType === type) {
        dispatchQueryParams({ vesselEventType: undefined })
      } else {
        dispatchQueryParams({ vesselEventType: type })
      }
    },
    [dispatchQueryParams, vesselEventType]
  )

  return useMemo(() => [vesselEventType, toggleEventType], [vesselEventType, toggleEventType])
}
