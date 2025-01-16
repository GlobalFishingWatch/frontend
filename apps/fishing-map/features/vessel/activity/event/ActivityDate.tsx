import React, { Fragment } from 'react'
import { DateTime } from 'luxon'

import I18nDate from 'features/i18n/i18nDate'
import { useActivityEventTranslations } from 'features/vessel/activity/event/event.hook'
import type { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { ActivityEventSubType } from 'features/vessel/activity/vessels-activity.selectors'

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
          <I18nDate date={date as number} format={DateTime.DATETIME_SHORT} showUTCLabel />
          {durationDescription && <span> - {durationDescription}</span>}
        </label>
      )}
    </Fragment>
  )
}

export default ActivityDate
