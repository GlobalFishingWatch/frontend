import { createSelector } from '@reduxjs/toolkit'
import { DateTime, Duration } from 'luxon'

import { EventTypes } from '@globalfishingwatch/api-types'

import { t } from 'features/i18n/i18n'
import type {
  RenderedEvent} from 'features/vessels/activity/vessels-activity.selectors';
import {
  selectFilteredEvents,
} from 'features/vessels/activity/vessels-activity.selectors'
import { PortVisitSubEvent } from 'types/activity'

export const getEventsWithMainPortVisit = (events: RenderedEvent[]): RenderedEvent[] =>
  // Get unique list of event ids
  (Array.from(new Set(events.map((event) => event.id.split('-').shift()))) as string[]).reduce(
    (previous, id) => {
      const event = events.find((ev) => ev.id === id)
      // when an event exists with the same exact id and it's not a
      // port visit, then we'll just add it to the array
      if (event && event.type !== EventTypes.Port) {
        previous.push(event)
        return previous
      }

      const portExit = events.find(
        (ev) => ev.id === `${id}-${PortVisitSubEvent.Exit}`
      ) as RenderedEvent
      const portEntry = events.find(
        (ev) => ev.id === `${id}-${PortVisitSubEvent.Entry}`
      ) as RenderedEvent
      const portVisitEvent: RenderedEvent = { ...(portExit ?? portEntry) }

      const { name, flag } = [
        portVisitEvent.port_visit?.intermediateAnchorage,
        portVisitEvent.port_visit?.startAnchorage,
        portVisitEvent.port_visit?.endAnchorage,
      ].reduce(
        (prev, curr) => {
          if (prev.name && prev.flag) return prev
          if (curr?.name && curr?.flag) return { name: curr.name, flag: curr.flag }
          return prev
        },
        { name: undefined, flag: undefined }
      )

      const portLabel = name
        ? [name, ...(flag ? [t(`flags:${flag}` as any, flag.toLocaleUpperCase())] : [])].join(', ')
        : undefined

      const duration = portVisitEvent.port_visit?.durationHrs
        ? Duration.fromMillis(portVisitEvent.port_visit?.durationHrs * 60 * 60 * 1000)
            .shiftTo('hours', 'minutes')
            .toObject()
        : portExit?.end > portEntry?.start
        ? DateTime.fromMillis(portExit?.end as number)
            .diff(DateTime.fromMillis(portEntry?.start as number), ['hours', 'minutes'])
            .toObject()
        : null

      // Include main port visit event
      previous.push({
        ...portVisitEvent,
        description: `${t('event.port', 'Port')} ${portLabel ?? t('event.unknown', 'Unknown')}`,
        durationDescription:
          portEntry?.durationDescription ?? portExit?.durationDescription ?? duration
            ? [
                duration?.hours && duration?.hours > 0
                  ? t('event.hourAbbreviated', '{{count}}h', { count: duration?.hours })
                  : '',
                duration?.minutes && duration?.minutes > 0
                  ? t('event.minuteAbbreviated', '{{count}}m', {
                      count: Math.round(duration?.minutes as number),
                    })
                  : '',
              ].join(' ')
            : null,
        id,
        start: portEntry?.start ?? portExit?.start,
        timestamp: portEntry?.timestamp ?? portExit?.timestamp,
        end: portExit?.end ?? portEntry?.end,
        subEvent: null,
      })

      // Include exit port visit event only if exists
      portExit && previous.push({ ...portExit, durationDescription: null })

      // Include entry port visit event only if exists
      portEntry && previous.push({ ...portEntry, durationDescription: null })

      return previous
    },
    [] as any[]
  )

export const selectFilteredEventsWithMainPortVisit = createSelector(
  [selectFilteredEvents],
  getEventsWithMainPortVisit
)
