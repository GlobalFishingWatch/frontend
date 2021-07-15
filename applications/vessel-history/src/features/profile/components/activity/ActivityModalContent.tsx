import React, { Fragment } from 'react'
import { DateTime, DurationUnit } from 'luxon'
import { useTranslation } from 'react-i18next'
import { ActivityEvent } from 'types/activity'
import I18nDate from 'features/i18n/i18nDate'
import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: ActivityEvent
}

const ActivityModalContent: React.FC<ActivityModalContentProps> = (props): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()
  const start = DateTime.fromMillis(event.start as number)
  const end = DateTime.fromMillis(event.end as number)
  const unit: DurationUnit = 'hours'
  const diff = Math.round(end.diff(start).as(unit) * 10) / 10

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
          <span>{t('event.avgDuration', 'Avg Duration')}:</span> {diff}hrs
        </p>
        <p>
          <span>{t('event.minCoords', 'Min coordinates')}:</span> {event.boundingBox[1]},{' '}
          {event.boundingBox[0]}
        </p>
        <p>
          <span>{t('event.maxCoords', 'Max coordinates')}:</span> {event.boundingBox[3]},{' '}
          {event.boundingBox[2]}
        </p>
        <p>
          <span>{t('event.distance', 'Distance')}:</span> {event.fishing.totalDistanceKm.toFixed(2)}
          km
        </p>
        <p>
          <span>{t('event.avgSpeed', 'Avg Speed')}:</span>{' '}
          {event.fishing.averageSpeedKnots.toFixed(2)}knots
        </p>
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
