import { Fragment } from 'react'
import { Trans } from 'react-i18next'
import type { Duration } from 'luxon'
import { DateTime } from 'luxon'

import type { ApiEvent } from '@globalfishingwatch/api-types'
import { EventTypes } from '@globalfishingwatch/api-types'
import type { SupportedDateType } from '@globalfishingwatch/data-transforms'

import { EVENTS_COLORS } from 'data/config'
import { t } from 'features/i18n/i18n'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { DEFAULT_VESSEL_IDENTITY_ID } from 'features/vessel/vessel.config'
import VesselPin from 'features/vessel/VesselPin'

import { getUTCDateTime } from './dates'
import { formatInfoField } from './info'

const getEventColors = ({ type }: { type: ApiEvent['type'] }) => {
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

export const getEventDescription = ({
  start,
  end,
  type,
  vessel,
  encounter,
  port_visit,
}: ApiEvent) => {
  const time = getTimeLabels({ start, end })
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
      const portName = port_visit?.intermediateAnchorage.name
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

export const getEventDescriptionComponent = (
  event: ApiEvent,
  className = '',
  onVesselPinClick?: () => void
) => {
  const { start, end, type, encounter } = event
  const { color, colorLabels } = getEventColors({ type })
  let DescriptionComponent
  const encounterVesselName = encounter?.vessel?.name
  const encounterVesselId = encounter?.vessel?.id
  const { descriptionGeneric, description } = getEventDescription(event)
  if (type === EventTypes.Encounter && encounterVesselName && encounterVesselId) {
    const time = getTimeLabels({ start, end })
    DescriptionComponent = (
      <p className={className}>
        <Trans
          i18nKey="event.encounterActionWithVesselsPin"
          defaults="had an encounter with <pin></pin>{{encounterVessel}} starting at {{start}} for {{duration}}"
          values={{
            encounterVessel: formatInfoField(encounterVesselName, 'shipname'),
            ...time,
          }}
          components={{
            pin: (
              <VesselPin
                vesselToResolve={{ id: encounterVesselId, datasetId: DEFAULT_VESSEL_IDENTITY_ID }}
                size="tiny"
                onClick={onVesselPinClick}
              />
            ),
          }}
        ></Trans>
      </p>
    )
  } else {
    DescriptionComponent = <Fragment>{description}</Fragment>
  }
  return {
    color,
    colorLabels,
    description,
    descriptionGeneric,
    DescriptionComponent,
  }
}
