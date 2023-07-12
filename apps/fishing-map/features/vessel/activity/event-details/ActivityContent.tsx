import React, { Fragment, useMemo } from 'react'
import { EventTypes } from '@globalfishingwatch/api-types'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import ActivityContentDetailsFishing from './ActivityContentDetailsFishing'
import ActivityContentDetailsLoitering from './ActivityContentDetailsLoitering'
import ActivityContentDetailsEncounter from './ActivityContentDetailsEncounter'
import styles from './ActivityDetails.module.css'
import ActivityContentDetailsPortVisit from './ActivityContentDetailsPortVisit'
import ActivityContentDetailsGap from './ActivityContentDetailsGap'
import ActivityContentDetails from './ActivityContentDetails'

interface ActivityContentProps {
  event: ActivityEvent
}

const ActivityContent: React.FC<ActivityContentProps> = (props): React.ReactElement => {
  const event = props.event
  const detailsPerType = useMemo(() => {
    switch (event.type) {
      /*case EventTypes.Fishing:
        return (
          <ActivityContentDetailsFishing event={event}></ActivityContentDetailsFishing>
        )
      case EventTypes.Loitering:
        return (
          <ActivityContentDetailsLoitering
            event={event}
          ></ActivityContentDetailsLoitering>
        )
        */
      case EventTypes.Encounter:
        return <ActivityContentDetailsEncounter event={event}></ActivityContentDetailsEncounter>
      case EventTypes.Gap:
        return <ActivityContentDetailsGap event={event}></ActivityContentDetailsGap>

      case EventTypes.Port:
        return <ActivityContentDetailsPortVisit event={event}></ActivityContentDetailsPortVisit>
      default:
        return <ActivityContentDetails event={event} />
    }
  }, [event])

  // TODO: the events don't have detailed info for the moment
  return (
    <Fragment>
      <div className={styles.modalContainer}>{detailsPerType}</div>
    </Fragment>
  )
}

export default ActivityContent
