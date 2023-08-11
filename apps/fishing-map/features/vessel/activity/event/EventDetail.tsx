import React, { useMemo } from 'react'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { EventType, EventTypes } from '@globalfishingwatch/api-types'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { useActivityEventTranslations } from 'features/vessel/activity/event/event.hook'
import { VesselRenderField } from 'features/vessel/vessel.config'
import { formatInfoField } from 'utils/info'
import styles from './Event.module.css'

interface ActivityContentProps {
  event: ActivityEvent
}

const BASE_FIELDS = [
  { key: 'start', label: 'start' },
  { key: 'end', label: 'end' },
  { key: 'duration', label: 'duration' },
]
const DISTANCES_FIELDS = [
  { key: 'distances.startDistanceFromShoreKm', label: 'distanceFromShoreKm' },
  { key: 'distances.startDistanceFromPortKm', label: 'distanceFromPortKm' },
]

const FIELDS_BY_TYPE: Record<EventType, VesselRenderField[]> = {
  [EventTypes.Fishing]: [
    ...BASE_FIELDS,
    ...DISTANCES_FIELDS,
    { key: 'fishing.averageSpeedKnots', label: 'averageSpeedKnots' },
  ],
  [EventTypes.Port]: BASE_FIELDS,
  [EventTypes.Encounter]: [
    { key: 'encounter.vessel.name', label: 'encounteredVesselName' },
    { key: 'encounter.vessel.flag', label: 'flag' },
    { key: 'encounter.vessel.ssvid', label: 'ssvid' },
    { key: 'encounter.vessel.type', label: 'type' },
    ...BASE_FIELDS,
    { key: 'encounter.medianSpeedKnots', label: 'medianSpeedKnots' },
  ],
  [EventTypes.Loitering]: [
    ...BASE_FIELDS,
    { key: 'loitering.totalDistanceKm', label: 'totalDistanceKm' },
    { key: 'loitering.averageSpeedKnots', label: 'averageSpeedKnots' },
  ],
  [EventTypes.Gap]: BASE_FIELDS,
}

const ActivityContent = ({ event }: ActivityContentProps) => {
  const { t } = useTranslation()
  const { getEventDurationDescription } = useActivityEventTranslations()
  const fields = useMemo(() => {
    return FIELDS_BY_TYPE[event.type] || []
  }, [event])
  if (!fields?.length) {
    return null
  }

  const getEventFieldValue = (event: ActivityEvent, field: VesselRenderField) => {
    const value = get(event, field.key, '')
    if (!value) {
      return value
    }
    if (field.key === 'start' || field.key === 'end') {
      return formatI18nDate(value, { format: DateTime.DATETIME_FULL })
    } else if (field.key === 'duration') {
      return getEventDurationDescription(event)
    } else if (
      field.key.toLowerCase().includes('distance') ||
      field.key.toLowerCase().includes('speed')
    ) {
      return parseFloat(value).toFixed(2)
    } else if (field.key.includes('vessel.type')) {
      return t(`vessel.vesselTypes.${value}` as string, value)
    } else if (field.key.includes('name')) {
      return formatInfoField(value, 'name')
    } else if (field.key.includes('flag')) {
      return formatInfoField(value, 'flag')
    }
    return value
  }

  return (
    <ul className={styles.detailContainer}>
      {fields.map((field) => {
        const value = getEventFieldValue(event, field)
        if (!value) return null
        return (
          <li key={field.key} className={styles.detail}>
            <label>{t(`eventInfo.${field.label}` as string, field.label)}</label>
            <span>{value}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default ActivityContent
