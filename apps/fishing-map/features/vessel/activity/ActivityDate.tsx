import React, { Fragment, useMemo } from 'react'
import { DateTime } from 'luxon'
import I18nDate from 'features/i18n/i18nDate'
import { ActivityEvent } from 'types/activity'
import styles from './ActivityDate.module.css'
import useActivityEventConnect from './event/event.hook'

interface ActivityDateProps {
  event: ActivityEvent
  className?: any
}

const ActivityDate: React.FC<ActivityDateProps> = (props): React.ReactElement => {
  const event = props.event
  const { getEventDurationDescription } = useActivityEventConnect()
  const durationDescription = useMemo(() => getEventDurationDescription(event), [event])

  const showduration: boolean = useMemo(() => {
    if (!durationDescription) {
      return false
    }
    return !isNaN(event.end as number)
  }, [event])

  return (
    <Fragment>
      {event.timestamp && (
        <label className={props.className ? props.className : styles.date}>
          <I18nDate date={event.timestamp as number} format={DateTime.DATETIME_SHORT} />
          {showduration && <span> - {durationDescription}</span>}
        </label>
      )}
    </Fragment>
  )
}

export default ActivityDate
