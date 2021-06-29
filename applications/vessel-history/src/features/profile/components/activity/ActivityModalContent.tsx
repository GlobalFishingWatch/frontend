import { DateTime, DurationUnit } from 'luxon'
import React, { Fragment } from 'react'
import { ActivityEvent } from 'types/activity'
import I18nDate from 'features/i18n/i18nDate'
import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: ActivityEvent
}

const ActivityModalContent: React.FC<ActivityModalContentProps> = (props): React.ReactElement => {
  const event = props.event

  const start = DateTime.fromISO(event.start)
  const end = DateTime.fromISO(event.end)
  const unit: DurationUnit = 'hours' 
  const diff = Math.round(end.diff(start).as(unit) * 10) /10

  return (
    <Fragment>
      <div className={styles.modalContainer}>
        <p><span>Start date:</span> <I18nDate date={event.start} format={DateTime.DATETIME_FULL} /></p>
        <p><span>End date:</span> <I18nDate date={event.end} format={DateTime.DATETIME_FULL} /></p>
        <p><span>Avg Duration:</span> {diff}hrs</p>
        <p><span>Avg Duration:</span> {event.fishing.averageDurationHours.toFixed(2)}hrs</p>
        <p><span>Min coordinates:</span> {event.boundingBox[1]}, {event.boundingBox[0]}</p>
        <p><span>Max coordinates:</span> {event.boundingBox[3]}, {event.boundingBox[2]}</p>
        <p><span>Distance:</span> {event.fishing.totalDistanceKm.toFixed(2)}km</p>
        <p><span>Avg Speed:</span> {event.fishing.averageSpeedKnots.toFixed(2)}knots</p>
        <p><span>Start distance from shore:</span> {event.distances.startDistanceFromShoreKm?.toFixed(2)}km</p>
        <p><span>End distance from shore:</span> {event.distances.endDistanceFromShoreKm.toFixed(2)}km</p>
        <p><span>Start distance from port:</span> {event.distances.startDistanceFromPortKm?.toFixed(2)}km</p>
        <p><span>End distance from port:</span> {event.distances.endDistanceFromPortKm.toFixed(2)}km</p>
      </div>
    </Fragment>
  )
}

export default ActivityModalContent
