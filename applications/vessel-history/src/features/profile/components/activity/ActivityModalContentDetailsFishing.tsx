import React, { Fragment, useMemo } from 'react'
import { DateTime, DurationUnit } from 'luxon'
import { useTranslation } from 'react-i18next'
import { ActivityEvent } from 'types/activity'
import I18nDate from 'features/i18n/i18nDate'
import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: ActivityEvent
}

const ActivityModalContentDetailsFishing: React.FC<ActivityModalContentProps> = (
  props
): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()

  return (
    <Fragment>
      <p>
        <span>{t('event.distance', 'Distance')}:</span>{' '}
        {event.fishing?.totalDistanceKm.toFixed(2) ?? '-'}
        km
      </p>
      <p>
        <span>{t('event.avgSpeed', 'Avg Speed')}:</span>{' '}
        {event.fishing?.averageSpeedKnots.toFixed(2)}
        {t('event.knots', 'knots')}
      </p>
    </Fragment>
  )
}

export default ActivityModalContentDetailsFishing
