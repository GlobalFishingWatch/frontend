import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { t } from 'features/i18n/i18n'
import { selectFilteredEvents } from 'features/vessels/activity/vessels-activity.selectors'
import { PortVisitSubEvent } from 'types/activity'
import { EventTypes } from '../../../../libs/api-types/src/events'

export const selectFilteredEventsWithMainPortVisit = createSelector(
  [selectFilteredEvents],
  (events) =>
    events.reduce((previous, event) => {
      if (event.type !== EventTypes.Port) return [...previous, event]

      const isPortExit = event.portVisitSubEvent === PortVisitSubEvent.Exit
      const isPortEntry = event.portVisitSubEvent === PortVisitSubEvent.Entry
      const id = event.id.split('-').shift()
      const portEntry =
        (isPortEntry && event) || events.find((ev) => ev.id === `${id}-${PortVisitSubEvent.Entry}`)
      const portExit =
        (isPortExit && event) || events.find((ev) => ev.id === `${id}-${PortVisitSubEvent.Exit}`)

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
              // id: `${id}-port-visit`,
              id,
              start: portEntry.start,
              timestamp: portEntry.timestamp,
              end: portExit.end,
              portVisitSubEvent: null,
            },
          ]
        : []
      const portVisitSubEvent = {
        ...event,
        durationDescription: null,
      }

      return [...previous, ...portVisitEvent, portVisitSubEvent]
    }, [])
)
