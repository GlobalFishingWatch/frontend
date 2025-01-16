import React, { Fragment, useMemo } from 'react'
import { DateTime } from 'luxon'

import I18nDate from 'features/i18n/i18nDate'
import type { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'

import styles from './Activity.module.css'

interface ActivityDateProps {
  event: RenderedEvent
  className?: any
}

const ActivityDate: React.FC<ActivityDateProps> = (props): React.ReactElement<any> => {
  const event = props.event

  const showduration: boolean = useMemo(() => {
    if (!event.durationDescription) {
      return false
    }
    return !isNaN(event.end as number)
  }, [event])

  return (
    <Fragment>
      {event.timestamp && (
        <label className={props.className ? props.className : styles.date}>
          <I18nDate date={event.timestamp as number} format={DateTime.DATETIME_SHORT} />
          {showduration && <span> -{' '}{event.durationDescription}</span>}
        </label>

      )}
    </Fragment>
  )
}

export default ActivityDate
