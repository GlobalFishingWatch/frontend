import { DateTime } from 'luxon'
import { ApiEvent, EventTypes } from '@globalfishingwatch/api-types'
import { TrackEventChunkProps } from '@globalfishingwatch/timebar'
import { EVENTS_COLORS } from 'data/config'
import { t } from 'features/i18n/i18n'

export const parseTrackEventChunkProps = (
  event: ApiEvent,
  eventKey: string
): ApiEvent & { props: TrackEventChunkProps } => {
  let description
  let descriptionGeneric
  switch (event.type) {
    case EventTypes.Encounter:
      if (event.encounter) {
        description = `${t('event.encounterActionWith', 'had an encounter with')} ${
          event.encounter.vessel.name
            ? event.encounter.vessel.name
            : t('event.encounterAnotherVessel', 'another vessel')
        } `
      }
      descriptionGeneric = `${t('event.encounter')}`
      break
    case EventTypes.Port:
      if (event.port && event.port.name) {
        description = `${t('event.portAt', { port: event.port.name })} `
      } else {
        description = `${t('event.portAction')}`
      }
      descriptionGeneric = `${t('event.port')}`
      break
    case EventTypes.Loitering:
      description = `${t('event.loiteringAction')}`
      descriptionGeneric = `${t('event.loitering')}`
      break
    case EventTypes.Fishing:
      description = `${t('event.fishingAction')}`
      descriptionGeneric = `${t('event.fishing')}`
      break
    default:
      description = t('event.unknown', 'Unknown event')
      descriptionGeneric = t('event.unknown', 'Unknown event')
  }
  const start = DateTime.fromISO(event.start as string)
  const end = DateTime.fromISO(event.end as string)
  const duration = start.diff(end, ['days', 'hours', 'minutes']).toObject()

  description = [
    description,
    duration.days && duration.days > 0
      ? t('event.dayAbbreviated', '{{count}}d', { count: duration.days })
      : '',
    duration.hours && duration.hours > 0
      ? t('event.hourAbbreviated', '{{count}}h', { count: duration.hours })
      : '',
    duration.minutes && duration.minutes > 0
      ? t('event.minuteAbbreviated', '{{count}}m', {
          count: Math.round(duration.minutes as number),
        })
      : '',
  ].join(' ')

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
