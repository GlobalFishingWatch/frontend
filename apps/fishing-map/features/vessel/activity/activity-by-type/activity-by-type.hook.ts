import { useCallback, useState } from 'react'
import { EventType, EventTypes } from '@globalfishingwatch/api-types'

export const useActivityByType = () => {
  const [expandedGroup, setExpandedGroup] = useState<EventType | null>(null)

  const toggleEventType = useCallback(
    (type: EventType) => {
      expandedGroup === type ? setExpandedGroup(null) : setExpandedGroup(type)
    },
    [expandedGroup]
  )

  return {
    expandedGroup,
    toggleEventType,
  }
}
