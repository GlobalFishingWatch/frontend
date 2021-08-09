import React, { Fragment, useMemo } from 'react'
import { EventTypes } from '@globalfishingwatch/api-types'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.slice'
import ActivityModalContentDetailsFishing from './ActivityModalContentDetailsFishing'
import ActivityModalContentDetailsLoitering from './ActivityModalContentDetailsLoitering'
import ActivityModalContentDetailsEncounter from './ActivityModalContentDetailsEncounter'
import styles from './ActivityModalDetails.module.css'

interface ActivityModalContentProps {
  event: RenderedEvent
}

const ActivityModalContent: React.FC<ActivityModalContentProps> = (props): React.ReactElement => {
  const event = props.event
  const detailsPerType = useMemo(() => {
    switch (event.type) {
      case EventTypes.Fishing:
        return (
          <ActivityModalContentDetailsFishing event={event}></ActivityModalContentDetailsFishing>
        )
      case EventTypes.Loitering:
        return (
          <ActivityModalContentDetailsLoitering
            event={event}
          ></ActivityModalContentDetailsLoitering>
        )
      case EventTypes.Encounter:
        return (
          <ActivityModalContentDetailsEncounter
            event={event}
          ></ActivityModalContentDetailsEncounter>
        )
      default:
        return <Fragment />
    }
  }, [event])

  return (
    <Fragment>
      <div className={styles.modalContainer}>{detailsPerType}</div>
    </Fragment>
  )
}

export default ActivityModalContent
