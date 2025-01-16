import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { DEFAULT_EMPTY_VALUE } from 'data/config'
import type { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'

import ActivityModalContentDetails from './ActivityModalContentDetails'
import ActivityModalContentField from './ActivityModalContentField'

import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: RenderedEvent
}

const ActivityModalContentDetailsLoitering: React.FC<ActivityModalContentProps> = (
  props
): React.ReactElement<any> => {
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
              : DEFAULT_EMPTY_VALUE
          }
        />
        <ActivityModalContentField
          label={t('event.avgSpeed', 'Avg Speed')}
          value={
            event.loitering?.averageSpeedKnots
              ? t('event.formatSpeedKnots', '{{value}} knots', {
                  value: event.loitering?.averageSpeedKnots.toFixed(2),
                })
              : DEFAULT_EMPTY_VALUE
          }
        />
      </div>

      <ActivityModalContentDetails event={event} />
    </Fragment>
  )
}

export default ActivityModalContentDetailsLoitering
