import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { DateTime, DurationUnit } from 'luxon'
import { EventTypes } from '@globalfishingwatch/api-types'
import I18nDate from 'features/i18n/i18nDate'
import { ActivityEvent } from 'types/activity'
import styles from './Activity.module.css'

interface ActivityDateProps {
  event: ActivityEvent
}

const ActivityDate: React.FC<ActivityDateProps> = (props): React.ReactElement => {
  const event = props.event
  const { t } = useTranslation()
  const start = DateTime.fromMillis(event.start as number)
  const end = DateTime.fromMillis(event.end as number)
  const unit: DurationUnit = 'hours'
  const diff = Math.round(end.diff(start).as(unit) * 10) / 10
  if (event.type === EventTypes.Fishing) {
    return (
      <Fragment>
        {event.start && event.end && (
          <div className={styles.date}>
            <I18nDate date={event.start as number} format={DateTime.DATETIME_SHORT} /> -{' '}
            {t('event.diffHours', '{{ diff }} hours', { diff: diff })}
          </div>
        )}
      </Fragment>
    )
  }

  return <Fragment></Fragment>
}

export default ActivityDate
