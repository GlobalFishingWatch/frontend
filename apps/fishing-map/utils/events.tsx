import type { Duration } from 'luxon'
import { DateTime } from 'luxon'

import type { ApiEvent } from '@globalfishingwatch/api-types'
import { EventTypes } from '@globalfishingwatch/api-types'
import type { SupportedDateType } from '@globalfishingwatch/data-transforms'
import type { DatasetEventSource } from '@globalfishingwatch/datasets-client'

import { EVENTS_COLORS } from 'data/config'
import { t } from 'features/i18n/i18n'
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
  const labelsKey = `${colorKey}Labels` as keyof typeof EVENTS_COLORS
  const colorLabels = EVENTS_COLORS[labelsKey]
  return {
    color,
    colorLabels,
  }
}

const getEventDurationLabel = ({ durationRaw }: { durationRaw: Duration }): string => {
  const duration = durationRaw.toObject()
  return [
    duration.days && duration.days > 0
      ? t((t) => t.event.dayAbbreviated, { count: duration.days })
      : '',
    duration.hours && duration.hours > 0 && durationRaw.as('days') < 10
      ? t((t) => t.event.hourAbbreviated, { count: duration.hours })
      : '',
    duration.minutes && duration.minutes > 0 && durationRaw.as('hours') < 10
      ? t((t) => t.event.minuteAbbreviated, {
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
}: {
  start: SupportedDateType
  end: SupportedDateType
}): TimeLabels => {
  const startDT = getUTCDateTime(start)
  const endDT = getUTCDateTime(end)
  const durationRaw = endDT.diff(startDT, ['days', 'hours', 'minutes'])

  const startLabel = formatI18nDate(start, { format: DateTime.DATETIME_MED, showUTCLabel: true })

  const durationLabel = getEventDurationLabel({ durationRaw })
  return {
    start: startLabel,
    duration: durationLabel,
  }
}

export const getEventDescription = (
  { start, end, type, vessel, encounter, port_visit }: ApiEvent,
  { source }: { source?: DatasetEventSource } = {}
) => {
  const time = getTimeLabels({ start, end })
  let description: string
  let descriptionGeneric: string
  switch (type) {
    case EventTypes.Encounter: {
      const mainVesselName = vessel?.name
      const encounterVesselName = encounter?.vessel?.name
      if (mainVesselName && encounterVesselName) {
        description = t((t) => t.event.encounterActionWithVessels, {
          ...time,
          mainVessel: mainVesselName,
          encounterVessel: encounterVesselName,
        })
      } else {
        description = t((t) => t.event.encounterActionWith, {
          ...time,
          vessel: encounterVesselName
            ? encounterVesselName
            : t((t) => t.event.encounterAnotherVessel),
        })
      }

      descriptionGeneric = t((t) => t.event.encounter)
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
        description = t((t) => t.event.portAt, { ...time, port: portLabel })
      } else {
        description = t((t) => t.event.portAction, time)
      }
      descriptionGeneric = t((t) => t.event.port)
      break
    }
    case EventTypes.Loitering:
      description = t((t) => t.event.loiteringAction, time)
      descriptionGeneric = t((t) => t.event.loitering)
      break
    case EventTypes.Fishing:
      description = t((t) => t.event.fishingAction, time)
      descriptionGeneric = t((t) => t.event.fishing)
      break
    case EventTypes.Gap:
    case EventTypes.Gaps:
      description = t((t) => t.event.gapAction, {
        ...time,
        source: source === 'VMS' ? t((t) => t.common.vms) : t((t) => t.common.ais),
      })
      descriptionGeneric = t((t) => t.event.gap, {
        source: source === 'VMS' ? t((t) => t.common.vms) : t((t) => t.common.ais),
      })
      break
    default:
      description = t((t) => t.event.unknown)
      descriptionGeneric = t((t) => t.event.unknown)
  }

  return {
    description,
    descriptionGeneric,
  }
}
