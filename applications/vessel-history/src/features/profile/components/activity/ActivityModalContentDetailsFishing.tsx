import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { ActivityEvent } from 'types/activity'
import ActivityModalContentField from './ActivityModalContentField'

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
      <ActivityModalContentField
        label={t('event.distance', 'Distance')}
        value={
          event.fishing?.totalDistanceKm
            ? t('event.formatDistanceKm', '{{value}} km', {
                value: event.fishing?.totalDistanceKm.toFixed(2),
              })
            : DEFAULT_EMPTY_VALUE
        }
      />
      <ActivityModalContentField
        label={t('event.avgSpeed', 'Avg Speed')}
        value={
          event.fishing?.averageSpeedKnots
            ? t('event.formatSpeedKnots', '{{value}} knots', {
                value: event.fishing?.averageSpeedKnots.toFixed(2),
              })
            : DEFAULT_EMPTY_VALUE
        }
      />
    </Fragment>
  )
}

export default ActivityModalContentDetailsFishing
