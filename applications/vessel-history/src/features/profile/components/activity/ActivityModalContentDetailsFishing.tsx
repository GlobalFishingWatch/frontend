import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { EMPTY_DEFAULT_VALUE } from 'data/config'
import { ActivityEvent } from 'types/activity'

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
        {event.fishing?.totalDistanceKm
          ? t('event.formatDistanceKm', '{{value}} km', {
              value: event.fishing?.totalDistanceKm.toFixed(2),
            })
          : EMPTY_DEFAULT_VALUE}
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
