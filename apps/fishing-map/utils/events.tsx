import { Fragment, ReactElement } from 'react'
import { DateTime, Duration } from 'luxon'
import { Trans } from 'react-i18next'
import { EventTypes } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'
import { t } from 'features/i18n/i18n'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { EVENTS_COLORS } from 'data/config'
import { formatInfoField } from 'utils/info'
import VesselLink from 'features/vessel/VesselLink'
import { VesselPin } from 'features/vessel/VesselPin'
import { SupportedDateType, TimeLabels, getUTCDateTime } from './dates'
// const vessels = useSelector(selectActiveTrackDataviews)

type EventProps = {
  start: string
  end: string
  type: EventTypes
  mainVesselName?: string
  encounterVesselName?: string
  encounterVesselId?: string
  portName?: string
  portFlag?: string
}

const getTimeLabels = ({
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

  const durationLabel = getDurationLabel({ durationRaw })
  return {
    start: startLabel,
    duration: durationLabel,
  }
}

const getDurationLabel = ({ durationRaw }: { durationRaw: Duration }): string => {
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

export const getEventDescription = ({
  start,
  end,
  type,
  mainVesselName,
  encounterVesselName,
  portName,
  portFlag,
}: EventProps) => {
  const time = getTimeLabels({ start, end })
  let description: string
  let descriptionGeneric
  switch (type) {
    case EventTypes.Encounter: {
      if (mainVesselName && encounterVesselName) {
        description = t(
          'event.encounterActionWithVessels',
          '{{mainVessel}} had an encounter with {{encounterVessel}} starting at {{start}} for {{duration}}',
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
    case EventTypes.Port:
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

export const getEventDescriptionComponent = ({
  start,
  end,
  type,
  mainVesselName,
  encounterVesselName,
  encounterVesselId,
  portName,
  portFlag,
}: EventProps) => {
  let DescriptionComponent
  const { color, colorLabels, descriptionGeneric, description } = getEventDescription({
    start,
    end,
    type,
    mainVesselName,
    encounterVesselName,
    portName,
    portFlag,
  })
  if (type === EventTypes.Encounter && mainVesselName && encounterVesselName) {
    const time = getTimeLabels({ start, end })
    DescriptionComponent = () => {
      return (
        <div>
          <span>
            {t('', '{{mainVessel}} had an encounter with ', {
              mainVessel: mainVesselName,
            })}
          </span>
          <Trans i18nKey="">
            <VesselPin vesselId={encounterVesselId} />
            <VesselLink
              vesselId={encounterVesselId}
              datasetId={''}
              style={{ textDecoration: 'underline' }}
            >
              {formatInfoField(encounterVesselName, 'name')}
            </VesselLink>
          </Trans>
          <span>{t('', ' starting at {{start}} for {{duration}}', time)}</span>
        </div>
      )
    }
  } else {
    DescriptionComponent = () => <Fragment>{description}</Fragment>
  }
  return {
    color,
    colorLabels,
    DescriptionComponent,
    descriptionGeneric,
  }
}
