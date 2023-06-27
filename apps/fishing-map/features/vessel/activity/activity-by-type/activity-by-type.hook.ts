import { useCallback, useState } from 'react'
import { EventType, EventTypes } from '@globalfishingwatch/api-types'
//import { selectEventResourcesLoading } from 'features/resources/resources.selectors'

export const useActivityByType = () => {
  //const eventsLoading = useSelector(selectEventResourcesLoading)
  const [expandedGroups, setExpandedGroups] = useState<EventType[]>([])
  const eventTypes = [
    EventTypes.Encounter,
    EventTypes.Fishing,
    EventTypes.Loitering,
    EventTypes.Port,
    EventTypes.Gap,
  ]

  const toggleEventType = useCallback(
    (type: EventType) => {
      expandedGroups.includes(type) ? setExpandedGroups([]) : setExpandedGroups([type])
    },
    [expandedGroups]
  )

  return {
    eventTypes,
    expandedGroups,
    toggleEventType,
  }
}
