import { useCallback, useState } from 'react'
import { EventType, EventTypes } from '@globalfishingwatch/api-types'

export const useActivityByType = () => {
  const [expandedGroup, setExpandedGroup] = useState<EventType | null>(null)
  const eventTypes = [
    EventTypes.Encounter,
    EventTypes.Fishing,
    EventTypes.Loitering,
    EventTypes.Port,
    EventTypes.Gap,
  ]

  const toggleEventType = useCallback(
    (type: EventType) => {
      expandedGroup === type ? setExpandedGroup(null) : setExpandedGroup(type)
    },
    [expandedGroup]
  )

  return {
    eventTypes,
    expandedGroup,
    expandedGroups: ['asdsad'],
    toggleEventType,
  }
}
