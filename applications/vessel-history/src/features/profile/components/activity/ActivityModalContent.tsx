import React, { Fragment } from 'react'
import { DateTime, DurationUnit } from 'luxon'
import { useTranslation } from 'react-i18next'
import { ActivityEventType } from 'types/activity'
import I18nDate from 'features/i18n/i18nDate'
import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: ActivityEventType
}

const ActivityModalContent: React.FC<ActivityModalContentProps> = (props): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()
  const start = DateTime.fromISO(event.start)
  const end = DateTime.fromISO(event.end)
  const unit: DurationUnit = 'hours' 
  const diff = Math.round(end.diff(start).as(unit) * 10) /10

  return (
    <Fragment>
      <div className={styles.modalContainer}>
        <p><span>{t('event.start', 'Start date')}:</span> <I18nDate date={event.start} format={DateTime.DATETIME_FULL} /></p>
        <p><span>{t('event.end', 'End date')}:</span> <I18nDate date={event.end} format={DateTime.DATETIME_FULL} /></p>
        <p><span>{t('event.avgDuration', 'Duration')}:</span> {diff}hrs</p>
        <p><span>{t('event.minCoords', 'Min coordinates')}:</span> {event.boundingBox[1]}, {event.boundingBox[0]}</p>
        <p><span>{t('event.maxCoords', 'Max coordinates')}:</span> {event.boundingBox[3]}, {event.boundingBox[2]}</p>
        {event.fishing && <p><span>{t('event.distance', 'Distance')}:</span> {event.fishing.totalDistanceKm.toFixed(2)}km</p>}
        {event.fishing && <p><span>{t('event.avgSpeed', 'Avg Speed')}:</span> {event.fishing.averageSpeedKnots.toFixed(2)}knots</p>}
        {event.encounter && <p><span>{t('event.medianSpeed', 'Median Speed')}:</span> {event.encounter.medianSpeedKnots.toFixed(2)}knots</p>}
        <p><span>{t('event.startDistanceShore', 'Start distance from shore')}:</span> {event.distances.startDistanceFromShoreKm?.toFixed(2)}km</p>
        <p><span>{t('event.endDistanceShore', 'End distance from shore')}:</span> {event.distances.endDistanceFromShoreKm.toFixed(2)}km</p>
        <p><span>{t('event.startDistancePort', 'Start distance from port')}:</span> {event.distances.startDistanceFromPortKm?.toFixed(2)}km</p>
        <p><span>{t('event.endDistancePort', 'End distance from port')}:</span> {event.distances.endDistanceFromPortKm.toFixed(2)}km</p>
        <p><span>{t('event.position', 'Position in coordinate system')}:</span> {event.position.lat}, {event.position.lon}</p>
        {event.encounter && <p><span>{t('event.authStatus', 'Authorization status')}:</span> {event.encounter.authorizationStatus}</p>}
        {event.encounter && 
          <div>
            <h3>{t('event.vesselInvolved', 'Vessel involved in the event')}:</h3>
            <p><span>{t('vessel.name', 'Name')}:</span> {event.encounter.vessel.name}</p>
            <p><span>{t('vessel.flag', 'Flag')}:</span> {event.encounter.vessel.flag}</p>
            <p><span>{t('event.nextPort', 'Next port traveled')}:</span> {event.encounter.vessel.nextPort?.label}</p>
          </div>
        }
      </div>
    </Fragment>
  )
}

export default ActivityModalContent
