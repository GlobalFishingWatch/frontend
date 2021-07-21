import React, { Fragment, useMemo } from 'react'
import { DateTime, DurationUnit } from 'luxon'
import { useTranslation } from 'react-i18next'
import { EventTypes } from '@globalfishingwatch/api-types'
import { ActivityEvent } from 'types/activity'
import I18nDate from 'features/i18n/i18nDate'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.slice'
import ActivityModalContentDetailsFishing from './ActivityModalContentDetailsFishing'
import ActivityModalContentDetailsLoitering from './ActivityModalContentDetailsLoitering'
import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: RenderedEvent
}

const ActivityModalContent: React.FC<ActivityModalContentProps> = (props): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()
  const start = DateTime.fromMillis(event.start as number)
  const end = DateTime.fromMillis(event.end as number)
  const unit: DurationUnit = 'hours'
  const diff = Math.round(end.diff(start).as(unit) * 10) / 10

  const detailsPerType = useMemo(() => {
    switch (event.type) {
      case EventTypes.Fishing:
        return (
          <ActivityModalContentDetailsFishing event={event}></ActivityModalContentDetailsFishing>
        )
      case EventTypes.Loitering:
        return (
          <ActivityModalContentDetailsLoitering
            event={event}
          ></ActivityModalContentDetailsLoitering>
        )
      default:
        return <Fragment />
    }
  }, [event])

  const [minLon, minLat, maxLon, maxLat] = useMemo(() => event.boundingBox, [event.boundingBox])

  return (
    <Fragment>
      <div className={styles.modalContainer}>
        <p>
          <span>{t('event.start', 'Start date')}:</span>{' '}
          <I18nDate date={event.start} format={DateTime.DATETIME_FULL} />
        </p>
        <p>
          <span>{t('event.end', 'End date')}:</span>{' '}
          <I18nDate date={event.end} format={DateTime.DATETIME_FULL} />
        </p>
        <p>
          <span>{t('event.avgDuration', 'Avg Duration')}:</span> {event.durationDescription}
        </p>
        <p>
          <span>{t('event.minCoords', 'Min coordinates')}:</span> {`${minLat}, ${minLon}`}
        </p>
        <p>
          <span>{t('event.maxCoords', 'Max coordinates')}:</span> {`${maxLat}, ${maxLon}`}
        </p>
        {detailsPerType}
        <p>
          <span>{t('event.startDistanceShore', 'Start distance from shore')}:</span>{' '}
          {event.distances.startDistanceFromShoreKm?.toFixed(2)}km
        </p>
        <p>
          <span>{t('event.endDistanceShore', 'End distance from shore')}:</span>{' '}
          {event.distances.endDistanceFromShoreKm.toFixed(2)}km
        </p>
        <p>
          <span>{t('event.startDistancePort', 'Start distance from port')}:</span>{' '}
          {event.distances.startDistanceFromPortKm?.toFixed(2)}km
        </p>
        <p>
          <span>{t('event.endDistancePort', 'End distance from port')}:</span>{' '}
          {event.distances.endDistanceFromPortKm.toFixed(2)}km
        </p>
      </div>
    </Fragment>
  )
}

export default ActivityModalContent
