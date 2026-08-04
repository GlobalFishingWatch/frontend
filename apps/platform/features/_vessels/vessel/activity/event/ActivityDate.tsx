import React, { Fragment } from 'react'
import { DateTime } from 'luxon'

import { useActivityEventTranslations } from 'features/_vessels/vessel/activity/event/event.hook'
import { type ActivityEvent } from 'features/_vessels/vessel/activity/vessels-activity.selectors'
import { ActivityEventSubType } from 'features/_vessels/vessel/vessel.types'
import I18nDate from 'features/i18n/i18nDate'

import styles from './Event.module.css'

interface ActivityDateProps {
  event: ActivityEvent
}

const ActivityDate: React.FC<ActivityDateProps> = ({ event }): React.ReactElement<any> => {
  const { getEventDurationDescription } = useActivityEventTranslations()

  const durationDescription = event.subType ? '' : getEventDurationDescription(event)
  const date = event.subType === ActivityEventSubType.Exit ? event.end : event.start

  return (
    <Fragment>
      {event.start && (
        <label className={styles.date}>
          <I18nDate date={date as number} format={DateTime.DATETIME_SHORT} />
          {durationDescription && (
            <span>
              {' - '}
              <I18nDate date={event.end as number} format={DateTime.DATETIME_SHORT} showUTCLabel />
              {' - '}
              {durationDescription}
            </span>
          )}
        </label>
      )}
    </Fragment>
  )
}

export default ActivityDate
