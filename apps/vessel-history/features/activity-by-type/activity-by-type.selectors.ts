import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { EventTypes } from '@globalfishingwatch/api-types'
import { t } from 'features/i18n/i18n'
import { selectFilteredEvents } from 'features/vessels/activity/vessels-activity.selectors'
import { PortVisitSubEvent } from 'types/activity'

export const selectFilteredEventsWithMainPortVisit = createSelector(
  [selectFilteredEvents],
  (events) =>
    events.reduce((previous, event) => {
      const isPortExit = event.type === EventTypes.Port && event.subEvent === PortVisitSubEvent.Exit
      const isPortEntry =
        event.type === EventTypes.Port && event.subEvent === PortVisitSubEvent.Entry

      if (isPortExit) {
        // If it's a port exit then build the single port visit event from it
        const id = event.id.split('-').shift()
        const portEntry =
          (isPortEntry && event) ||
          events.find((ev) => ev.id === `${id}-${PortVisitSubEvent.Entry}`)
        const portExit = event

        const durationDiff = DateTime.fromMillis(portExit.end as number).diff(
          DateTime.fromMillis(portEntry.start as number),
          ['hours', 'minutes']
        )
        const duration = durationDiff.toObject()

        const { name, flag } = event.port_visit?.intermediateAnchorage ??
          event.port_visit?.startAnchorage ??
          event.port_visit?.endAnchorage ?? { name: undefined, flag: undefined }

        const portLabel = name
          ? [name, ...(flag ? [t(`flags:${flag}` as any, flag.toLocaleUpperCase())] : [])].join(
              ', '
            )
          : undefined

        previous.push({
          ...event,
          description: `${t('event.port', 'Port')} ${portLabel ?? t('event.unknown', 'Unknown')}`,
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
          subEvent: null,
        })
      }

      if (isPortEntry || isPortExit) {
        event.durationDescription = null
      }

      previous.push(event)

      return previous
    }, [])
)
