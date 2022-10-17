import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { EventType, EventTypes } from '@globalfishingwatch/api-types'
import { selectEventResourcesLoading } from 'features/resources/resources.selectors'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { EventGroup } from 'types/activity'
import { selectFilteredEventsWithMainPortVisit } from './activity-by-type.selectors'

const calculateQuantity = {
  [EventTypes.Encounter]: (events: RenderedEvent[]) => events.length ?? 0,
  [EventTypes.Fishing]: (events: RenderedEvent[]) =>
    events?.reduce((p, c) => p + c.duration ?? 0, 0) ?? 0,
  [EventTypes.Loitering]: (events: RenderedEvent[]) => events.length ?? 0,
  [EventTypes.Port]: (events: RenderedEvent[]) => Math.ceil((events.length ?? 0) / 3),
  [EventTypes.Gap]: (events: RenderedEvent[]) => events.length ?? 0,
}

export const useActivityByType = () => {
  const eventsLoading = useSelector(selectEventResourcesLoading)
  const eventsList = useSelector(selectFilteredEventsWithMainPortVisit)
  const [expandedGroups, setExpandedGroups] = useState<EventType[]>([])

  const eventsByType = useMemo(
    (): EventGroup[] =>
      [
        EventTypes.Encounter,
        EventTypes.Fishing,
        EventTypes.Loitering,
        EventTypes.Port,
        EventTypes.Gap,
      ]
        .map((type) => ({ type, events: eventsList.filter((e) => e.type === type) }))
        .map(({ type, events }) => ({
          group: true,
          type,
          events: events,
          quantity: calculateQuantity[type](events),
          loading: eventsLoading.includes(type),
          status: expandedGroups.includes(type) ? 'expanded' : 'collapsed',
        })),
    [eventsList, eventsLoading, expandedGroups]
  )

  const events = useMemo(
    () =>
      eventsByType.reduce(
        (p, c) => p.concat(c).concat(c.status === 'expanded' ? c.events : []),
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
