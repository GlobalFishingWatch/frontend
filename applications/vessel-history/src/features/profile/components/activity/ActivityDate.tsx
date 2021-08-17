import React, { Fragment } from 'react'
import { DateTime } from 'luxon'
import I18nDate from 'features/i18n/i18nDate'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import styles from './Activity.module.css'

interface ActivityDateProps {
  event: RenderedEvent
}

const ActivityDate: React.FC<ActivityDateProps> = (props): React.ReactElement => {
  const event = props.event
  return (
    <Fragment>
      {event.start && event.end && (
        <label className={styles.date}>
          <I18nDate date={event.start as number} format={DateTime.DATETIME_SHORT} /> -{' '}
          {event.durationDescription}
        </label>
      )}
    </Fragment>
  )
}

export default ActivityDate
