import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { DateTime, DurationUnit } from 'luxon'
import { ActivityEvent, EventType } from 'types/activity'
import I18nDate from 'features/i18n/i18nDate'
import styles from './Activity.module.css'

interface ActivityDateProps {
  event: ActivityEvent
}

const ActivityDate: React.FC<ActivityDateProps> = (props): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()
  const start = DateTime.fromISO(event.start)
  const end = DateTime.fromISO(event.end)
  const unit: DurationUnit = 'hours' 
  const diff = Math.round(end.diff(start).as(unit) * 10) /10
  if (event.type === EventType.Fishing) {
    return (
      <Fragment>
        {event.start && event.end && (
          <div className={styles.date}>
            <I18nDate date={event.start} format={DateTime.DATETIME_SHORT} /> - {diff} hours
          </div>
        )}
      </Fragment>
    )
  }

  return (
    <Fragment></Fragment>
  )
}

export default ActivityDate
