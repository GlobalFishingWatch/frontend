import React, { Fragment, useMemo } from 'react'
import { EventTypes } from '@globalfishingwatch/api-types'
import { ActivityEvent } from 'types/activity'
import ActivityModalContentDetailsFishing from './ActivityModalContentDetailsFishing'
import ActivityModalContentDetailsLoitering from './ActivityModalContentDetailsLoitering'
import ActivityModalContentDetailsEncounter from './ActivityModalContentDetailsEncounter'
import styles from './ActivityModalDetails.module.css'
import ActivityModalContentDetailsPortVisit from './ActivityModalContentDetailsPortVisit'
import ActivityModalContentDetailsGap from './ActivityModalContentDetailsGap'
import ActivityModalContentDetails from './ActivityModalContentDetails'

interface ActivityModalContentProps {
  event: ActivityEvent
}

const ActivityModalContent: React.FC<ActivityModalContentProps> = (props): React.ReactElement => {
  const event = props.event
  const detailsPerType = useMemo(() => {
    switch (event.type) {
      /*case EventTypes.Fishing:
        return (
          <ActivityModalContentDetailsFishing event={event}></ActivityModalContentDetailsFishing>
        )
      case EventTypes.Loitering:
        return (
          <ActivityModalContentDetailsLoitering
            event={event}
          ></ActivityModalContentDetailsLoitering>
        )
        */
      case EventTypes.Encounter:
        return (
          <ActivityModalContentDetailsEncounter
            event={event}
          ></ActivityModalContentDetailsEncounter>
        )
      case EventTypes.Gap:
        return <ActivityModalContentDetailsGap event={event}></ActivityModalContentDetailsGap>

      case EventTypes.Port:
        return (
          <ActivityModalContentDetailsPortVisit
            event={event}
          ></ActivityModalContentDetailsPortVisit>
        )
      default:
        return <ActivityModalContentDetails event={event} />
    }
  }, [event])

  // TODO: the events don't have detailed info for the moment
  return (
    <Fragment>
      <div className={styles.modalContainer}>{detailsPerType}</div>
    </Fragment>
  )
}

export default ActivityModalContent
