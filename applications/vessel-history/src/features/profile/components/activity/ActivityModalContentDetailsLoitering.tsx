import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.slice'
import { toFixed } from 'utils/shared'
import ActivityModalContentDetails from './ActivityModalContentDetails'
import ActivityModalContentField from './ActivityModalContentField'
import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: RenderedEvent
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
            event.loitering?.totalDistanceKilometers
              ? t('event.formatDistanceKm', '{{value}} km', {
                  value: event.loitering?.totalDistanceKilometers.toFixed(2),
                })
              : DEFAULT_EMPTY_VALUE
          }
        />
        <ActivityModalContentField
          label={t('event.medianSpeed', 'Median Speed')}
          value={
            event.loitering?.medianSpeedKnots
              ? t('event.formatSpeedKnots', '{{value}} knots', {
                  value: event.loitering?.medianSpeedKnots.toFixed(2),
                })
              : DEFAULT_EMPTY_VALUE
          }
        />
        <ActivityModalContentField
          label={t('event.position', 'Position')}
          value={`${toFixed(event.position.lat, 4)}, ${toFixed(event.position.lon, 4)}`}
        />
      </div>

      <ActivityModalContentDetails event={event} />
    </Fragment>
  )
}

export default ActivityModalContentDetailsLoitering
