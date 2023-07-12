import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import ActivityContentDetails from './ActivityContentDetails'
import ActivityContentField from './ActivityContentField'
import styles from './ActivityDetails.module.css'

interface ActivityContentProps {
  event: ActivityEvent
}

const ActivityContentDetailsLoitering: React.FC<ActivityContentProps> = (
  props
): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()

  return (
    <Fragment>
      <div className={styles.row}>
        <ActivityContentField
          label={t('event.distance', 'Distance')}
          value={
            event.loitering?.totalDistanceKm
              ? t('event.formatDistanceKm', '{{value}} km', {
                  value: event.loitering?.totalDistanceKm.toFixed(2),
                })
              : EMPTY_FIELD_PLACEHOLDER
          }
        />
        <ActivityContentField
          label={t('event.avgSpeed', 'Avg Speed')}
          value={
            event.loitering?.averageSpeedKnots
              ? t('event.formatSpeedKnots', '{{value}} knots', {
                  value: event.loitering?.averageSpeedKnots.toFixed(2),
                })
              : EMPTY_FIELD_PLACEHOLDER
          }
        />
      </div>

      <ActivityContentDetails event={event} />
    </Fragment>
  )
}

export default ActivityContentDetailsLoitering
