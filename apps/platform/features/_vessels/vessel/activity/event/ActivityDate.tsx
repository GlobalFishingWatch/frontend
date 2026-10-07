import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'

import { useActivityEventTranslations } from 'features/_vessels/vessel/activity/event/event.hook'
import { type ActivityEvent } from 'features/_vessels/vessel/activity/vessels-activity.selectors'
import { ActivityEventSubType } from 'features/_vessels/vessel/vessel.types'
import I18nDate from 'features/i18n/i18nDate'
import { getSolarTimeZone } from 'utils/dates'

import styles from './Event.module.css'

interface ActivityDateProps {
  event: ActivityEvent
  localTime?: boolean
}

const ActivityDate: React.FC<ActivityDateProps> = ({
  event,
  localTime,
}): React.ReactElement<any> => {
  const { t } = useTranslation()
  const { getEventDurationDescription } = useActivityEventTranslations()

  const durationDescription = event.subType ? '' : getEventDurationDescription(event)
  const date = event.subType === ActivityEventSubType.Exit ? event.end : event.start

  // fishing.localStartHours is only an hour of day, so the offset is rebuilt from the
  // longitude to get the local date too (it can differ from the UTC one)
  const lon = event.position?.lon
  const timeZone = localTime && lon !== undefined ? getSolarTimeZone(lon) : undefined

  return (
    <Fragment>
      {event.start && (
        <label className={styles.date}>
          <I18nDate date={date as number} format={DateTime.DATETIME_SHORT} timeZone={timeZone} />
          {durationDescription && (
            <span>
              {' - '}
              <I18nDate
                date={event.end as number}
                format={DateTime.DATETIME_SHORT}
                showUTCLabel={!timeZone}
                timeZone={timeZone}
              />
              {timeZone && ` ${t((t) => t.event.localSolarTime)}`}
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
