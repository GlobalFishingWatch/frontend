import { useCallback, useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import { useSelector } from 'react-redux'
import { Namespace, TFunction, useTranslation } from 'react-i18next'
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
  [EventTypes.Port]: (events: RenderedEvent[]) => Math.ceil((events.length ?? 0) / 2),
  [EventTypes.Gap]: (events: RenderedEvent[]) => events.length ?? 0,
}

const buildEventsListByType = {
  [EventTypes.Encounter]: (events: RenderedEvent[]) => events,
  [EventTypes.Fishing]: (events: RenderedEvent[]) => events,
  [EventTypes.Loitering]: (events: RenderedEvent[]) => events,
  [EventTypes.Port]: (events: RenderedEvent[], t: TFunction<Namespace, undefined>) =>
    events.reduce((previous, event) => {
      const isPortExit = event.id.endsWith('-exit')
      const isPortEntry = !isPortExit
      const id = event.id.replace('-exit', '')
      const portEntry = (isPortEntry && event) || events.find((ev) => ev.id === id)
      const portExit = (isPortExit && event) || events.find((ev) => ev.id === `${id}-exit`)

      const durationDiff = DateTime.fromMillis(portExit.end as number).diff(
        DateTime.fromMillis(portEntry.start as number),
        ['hours', 'minutes']
      )

      const duration = durationDiff.toObject()

      const { name, flag } = event.port_visit?.intermediateAnchorage ??
        event.port_visit?.startAnchorage ??
        event.port_visit?.endAnchorage ?? { name: undefined, flag: undefined }

      const portLabel = name
        ? [name, ...(flag ? [t(`flags:${flag}` as any, flag.toLocaleUpperCase())] : [])].join(', ')
        : undefined

      const portVisitEvent = isPortExit
        ? [
            {
              ...event,
              description: `${t('event.port', 'Port')} ${
                portLabel ?? t('event.unknown', 'Unknown')
              }`,
              durationDescription:
                portExit.end > portEntry.start
                  ? [
                      duration.hours && duration.hours > 0
                        ? t('event.hourAbbreviated', '{{count}}h', { count: duration.hours })
                        : '',
                      duration.minutes && duration.minutes > 0
                        ? t('event.minuteAbbreviated', '{{count}}m', {
                            count: Math.round(duration.minutes as number),
                          })
                        : '',
                    ].join(' ')
                  : null,
              id,
              start: portEntry.start,
              timestamp: portEntry.timestamp,
              end: portExit.end,
            },
          ]
        : []
      const portVisitSubEvent = {
        ...event,
        id: isPortEntry ? `${id}-entry` : event.id,
        durationDescription: null,
      }

      return [...previous, ...portVisitEvent, portVisitSubEvent]
    }, []),
  [EventTypes.Gap]: (events: RenderedEvent[]) => events,
}

export const useActivityByType = () => {
  const { t } = useTranslation()

  const eventsLoading = useSelector(selectEventResourcesLoading)
  const eventsList = useSelector(selectFilteredEvents)
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
          events: buildEventsListByType[type](events, t),
          quantity: calculateQuantity[type](events),
          loading: eventsLoading.includes(type),
          status: expandedGroups.includes(type) ? 'expanded' : 'collapsed',
        })),
    [eventsList, eventsLoading, expandedGroups, t]
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
