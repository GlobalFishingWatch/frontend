import { DateTime } from 'luxon'
import { ApiEvent, EventTypes } from '@globalfishingwatch/api-types'
import { TrackEventChunkProps } from '@globalfishingwatch/timebar'
import { EVENTS_COLORS } from 'data/config'
import { t } from 'features/i18n/i18n'

export const parseTrackEventChunkProps = (
  event: ApiEvent,
  eventKey: string
): ApiEvent & { props: TrackEventChunkProps } => {
  const start = DateTime.fromISO(event.start as string)
  const end = DateTime.fromISO(event.end as string)
  const durationRaw = end.diff(start, ['days', 'hours', 'minutes'])
  const duration = durationRaw.toObject()

  const startLabel = start.toLocaleString(DateTime.DATETIME_MED)

  const durationLabel = [
    duration.days && duration.days > 0
      ? t('event.dayAbbreviated', '{{count}}d', { count: duration.days })
      : '',
    duration.hours && duration.hours > 0 && durationRaw.as('days') < 10
      ? t('event.hourAbbreviated', '{{count}}h', { count: duration.hours })
      : '',
    duration.minutes && duration.minutes > 0 && durationRaw.as('hours') < 10
      ? t('event.minuteAbbreviated', '{{count}}m', {
          count: Math.round(duration.minutes as number),
        })
      : '',
  ].join(' ')

  const time = {
    start: startLabel,
    duration: durationLabel,
  }

  let description
  let descriptionGeneric
  switch (event.type) {
    case EventTypes.Encounter:
      if (event.encounter) {
        description = t(
          'event.encounterActionWith',
          'had an encounter with {{vessel}} starting at {{start}} for {{duration}}',
          {
            ...time,
            vessel: event.encounter.vessel.name
              ? event.encounter.vessel.name
              : t('event.encounterAnotherVessel', 'another vessel'),
          }
        )
      }
      descriptionGeneric = t('event.encounter')
      break
    case EventTypes.Port:
      if (event.port && event.port.name) {
        description = t(
          'event.portAt',
          'Docked at {{port}} started at {{start}} for {{duration}}',
          { ...time, port: event.port.name }
        )
      } else {
        description = t('event.portAction', 'Docked started at {{start}} for {{duration}}', time)
      }
      descriptionGeneric = t('event.port')
      break
    case EventTypes.Loitering:
      description = t(
        'event.loiteringAction',
        'Loitering started at {{start}} for {{duration}}',
        time
      )
      descriptionGeneric = t('event.loitering')
      break
    case EventTypes.Fishing:
      description = t('event.fishingAction', 'Fishing started at {{start}} for {{duration}}', time)
      descriptionGeneric = t('event.fishing')
      break
    default:
      description = t('event.unknown', 'Unknown event')
      descriptionGeneric = t('event.unknown', 'Unknown event')
  }

  const colorKey = event.type
  // TODO not supporting authorization status yet
  // if (event.type === 'encounter' && showAuthorizationStatus) {
  //   colorKey = `${colorKey}${event.encounter?.authorizationStatus}`
  // }
  const color = EVENTS_COLORS[colorKey]
  const colorLabels = EVENTS_COLORS[`${colorKey}Labels`]

  return {
    ...event,
    id: eventKey,
    start: start.toMillis(),
    end: end.toMillis(),
    props: {
      color,
      colorLabels,
      description,
      descriptionGeneric,
      latitude: event.position.lat,
      longitude: event.position.lon,
    },
  }
}
