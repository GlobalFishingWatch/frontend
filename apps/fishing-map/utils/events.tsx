import { getTimezoneAtSea } from 'browser-geo-tz'
import type { Duration } from 'luxon'
import { DateTime } from 'luxon'

import type { ApiEvent, Locale } from '@globalfishingwatch/api-types'
import { EventTypes } from '@globalfishingwatch/api-types'
import type { SupportedDateType } from '@globalfishingwatch/data-transforms'

import { EVENTS_COLORS } from 'data/config'
import i18n, { t } from 'features/i18n/i18n'
import { formatI18nDate } from 'features/i18n/i18nDate'

import { getUTCDateTime } from './dates'
import { formatInfoField } from './info'

export const getEventColors = ({ type }: { type: ApiEvent['type'] }) => {
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
  }
}

const getEventDurationLabel = ({ durationRaw }: { durationRaw: Duration }): string => {
  const duration = durationRaw.toObject()
  return [
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
}

type TimeLabels = {
  start: string
  duration: string
}
export const getTimeLabels = ({
  start,
  end,
  longitude,
}: {
  start: SupportedDateType
  end: SupportedDateType
  longitude?: number
}): TimeLabels => {
  const startDT = getUTCDateTime(start)
  const endDT = getUTCDateTime(end)
  const durationRaw = endDT.diff(startDT, ['days', 'hours', 'minutes'])

  let startLabel = formatI18nDate(start, { format: DateTime.DATETIME_MED, showUTCLabel: true })

  const durationLabel = getEventDurationLabel({ durationRaw })
  if (longitude) {
    const timezone = longitude ? getTimezoneAtSea(longitude)[0] : undefined
    const hoursOffset = timezone ? Number(timezone.split('GMT')[1]) : undefined
    const startLocalTime = startDT.plus({ hours: hoursOffset })
    startLabel = `${startLabel} (${startLocalTime.toLocaleString(DateTime.TIME_SIMPLE, { locale: i18n.language as Locale })} ${t('common.localTime', 'local time')})`
  }

  return {
    start: startLabel,
    duration: durationLabel,
  }
}

export const getEventDescription = ({
  start,
  end,
  type,
  vessel,
  encounter,
  port_visit,
  coordinates,
}: ApiEvent) => {
  const time = getTimeLabels({ start, end, longitude: coordinates?.[0] })
  let description: string
  let descriptionGeneric: string
  switch (type) {
    case EventTypes.Encounter: {
      const mainVesselName = vessel?.name
      const encounterVesselName = encounter?.vessel?.name
      if (mainVesselName && encounterVesselName) {
        description = t(
          'event.encounterActionWithVessels',
          'had an encounter with {{encounterVessel}} starting at {{start}} for {{duration}}',
          {
            ...time,
            mainVessel: mainVesselName,
            encounterVessel: encounterVesselName,
          }
        )
      } else {
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
      }

      descriptionGeneric = t('event.encounter')
      break
    }
    case EventTypes.Port: {
      const portName =
        port_visit?.intermediateAnchorage?.name || port_visit?.intermediateAnchorage?.id
      const portFlag = port_visit?.intermediateAnchorage.flag
      if (portName && portFlag) {
        const portLabel = [
          formatInfoField(portName, 'port'),
          formatInfoField(portFlag, 'flag'),
        ].join(', ')
        description = t(
          'event.portAt',
          'Docked at {{port}} started at {{start}} for {{duration}}',
          { ...time, port: portLabel }
        )
      } else {
        description = t('event.portAction', 'Docked started at {{start}} for {{duration}}', time)
      }
      descriptionGeneric = t('event.port')
      break
    }
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

  return {
    description,
    descriptionGeneric,
  }
}
