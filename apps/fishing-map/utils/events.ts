import { DateTime } from 'luxon'
import { EventTypes } from '@globalfishingwatch/api-types'
import { t } from 'features/i18n/i18n'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { EVENTS_COLORS } from 'data/config'

type EventProps = {
  start: string
  end: string
  type: EventTypes
  encounterVesselName?: string
  portName?: string
}

export const getEventDescription = ({
  start,
  end,
  type,
  encounterVesselName,
  portName,
}: EventProps) => {
  const startDT = DateTime.fromISO(start).toUTC()
  const endDT = DateTime.fromISO(end).toUTC()
  const durationRaw = endDT.diff(startDT, ['days', 'hours', 'minutes'])
  const duration = durationRaw.toObject()

  const startLabel = formatI18nDate(start, { format: DateTime.DATETIME_MED, showUTCLabel: true })

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
  switch (type) {
    case EventTypes.Encounter:
      description = t(
        'event.encounterActionWith',
        'had an encounter with {{vessel}} starting at {{start}} for {{duration}}',
        {
          ...time,
          vessel: encounterVesselName
            ? encounterVesselName
            : t('event.encounterAnotherVessel', 'another vessel'),
        }
      )

      descriptionGeneric = t('event.encounter')
      break
    case EventTypes.Port:
      if (portName) {
        description = t(
          'event.portAt',
          'Docked at {{port}} started at {{start}} for {{duration}}',
          { ...time, port: portName }
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

  const colorKey = type
  // TODO not supporting authorization status yet
  // if (event.type === 'encounter' && showAuthorizationStatus) {
  //   colorKey = `${colorKey}${event.encounter?.authorizationStatus}`
  // }
  const color = EVENTS_COLORS[colorKey]
  const colorLabels = EVENTS_COLORS[`${colorKey}Labels`]

  return {
    color,
    colorLabels,
    description,
    descriptionGeneric,
  }
}
