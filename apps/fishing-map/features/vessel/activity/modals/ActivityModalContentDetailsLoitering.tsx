import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { ActivityEvent } from 'types/activity'
import ActivityModalContentDetails from './ActivityModalContentDetails'
import ActivityModalContentField from './ActivityModalContentField'
import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: ActivityEvent
}

const ActivityModalContentDetailsLoitering: React.FC<ActivityModalContentProps> = (
  props
): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()

  return (
    <Fragment>
      <div className={styles.row}>
        <ActivityModalContentField
          label={t('event.distance', 'Distance')}
          value={
            event.loitering?.totalDistanceKm
              ? t('event.formatDistanceKm', '{{value}} km', {
                  value: event.loitering?.totalDistanceKm.toFixed(2),
                })
              : EMPTY_FIELD_PLACEHOLDER
          }
        />
        <ActivityModalContentField
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

      <ActivityModalContentDetails event={event} />
    </Fragment>
  )
}

export default ActivityModalContentDetailsLoitering
