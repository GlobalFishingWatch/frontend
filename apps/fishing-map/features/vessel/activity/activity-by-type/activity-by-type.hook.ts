import { useCallback, useMemo, useState } from 'react'

import type { EventType } from '@globalfishingwatch/api-types'

export const useActivityByType = (): [EventType | null, (eventType: EventType) => void] => {
  const [expandedGroup, setExpandedGroup] = useState<EventType | null>(null)

  const toggleEventType = useCallback(
    (type: EventType) => {
      if (expandedGroup === type) {
        setExpandedGroup(null)
      } else {
        setExpandedGroup(type)
      }
    },
    [expandedGroup]
  )

  return useMemo(() => [expandedGroup, toggleEventType], [expandedGroup, toggleEventType])
}
