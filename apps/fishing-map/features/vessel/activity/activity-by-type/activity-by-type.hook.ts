import { useCallback, useMemo, useState } from 'react'
import { EventType } from '@globalfishingwatch/api-types'

export const useActivityByType = (): [EventType | null, (eventType: EventType) => void] => {
  const [expandedGroup, setExpandedGroup] = useState<EventType | null>(null)

  const toggleEventType = useCallback(
    (type: EventType) => {
      expandedGroup === type ? setExpandedGroup(null) : setExpandedGroup(type)
    },
    [expandedGroup]
  )

  return useMemo(() => [expandedGroup, toggleEventType], [expandedGroup, toggleEventType])
}
