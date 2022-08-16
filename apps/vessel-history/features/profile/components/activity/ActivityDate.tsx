import React, { Fragment } from 'react'
import { DateTime } from 'luxon'
import I18nDate from 'features/i18n/i18nDate'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import styles from './Activity.module.css'

interface ActivityDateProps {
  event: RenderedEvent
  className?: any
  displayEnd?: boolean
}

const ActivityDate: React.FC<ActivityDateProps> = (props): React.ReactElement => {
  const event = props.event
  console.log(event)
  return (
    <Fragment>
      {event.timestamp && event.end && (
        <label className={props.className ? props.className : styles.date}>
          <I18nDate date={event.timestamp as number} format={DateTime.DATETIME_SHORT} /> -{' '}
          {props.displayEnd &&
            <Fragment>
              <I18nDate date={event.end as number} format={DateTime.DATETIME_SHORT} />{' '}-
            </Fragment>}
          {event.durationDescription}
        </label>
      )}
    </Fragment>
  )
}

export default ActivityDate
