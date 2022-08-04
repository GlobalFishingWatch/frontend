import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { EventType, EventTypes } from '@globalfishingwatch/api-types'
import { selectEventResourcesLoading } from 'features/resources/resources.selectors'
import {
  RenderedEvent,
  selectFilteredEvents,
} from 'features/vessels/activity/vessels-activity.selectors'
import { EventGroup } from 'types/activity'

const calculateQuantity = {
  [EventTypes.Encounter]: (events: RenderedEvent[]) => events.length ?? 0,
  [EventTypes.Fishing]: (events: RenderedEvent[]) =>
    events?.reduce((p, c) => p + c.duration ?? 0, 0) ?? 0,
  [EventTypes.Loitering]: (events: RenderedEvent[]) => events.length ?? 0,
  [EventTypes.Port]: (events: RenderedEvent[]) => events.length ?? 0,
}

export const useActivityByType = () => {
  const eventsLoading = useSelector(selectEventResourcesLoading)
  const eventsList = useSelector(selectFilteredEvents)
  const [expandedGroups, setExpandedGroups] = useState<EventType[]>([])

  const eventsByType = useMemo(
    (): EventGroup[] =>
      [EventTypes.Encounter, EventTypes.Fishing, EventTypes.Loitering, EventTypes.Port]
        .map((type) => ({ type, events: eventsList.filter((e) => e.type === type) }))
        .map(({ type, events }) => ({
          group: true,
          type,
          events,
          quantity: calculateQuantity[type](events),
          loading: eventsLoading.includes(type),
          status: expandedGroups.includes(type) ? 'expanded' : 'collapsed',
        })),
    [eventsList, eventsLoading, expandedGroups]
  )

  const events = useMemo(
    () =>
      eventsByType.reduce(
        (p, c) => [...p, c, ...((c.status === 'expanded' && c.events) || [])],
        []
      ),
    [eventsByType]
  )

  const toggleEventType = useCallback(
    (type: EventType) => {
      expandedGroups.includes(type)
        ? setExpandedGroups(expandedGroups.filter((g) => g !== type))
        : setExpandedGroups(expandedGroups.concat([type]))
    },
    [expandedGroups]
  )

  return {
    events,
    eventsByType,
    eventsLoading,
    toggleEventType,
  }
}
