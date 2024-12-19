import React, { Fragment, useMemo } from 'react'
import { EventTypes } from '@globalfishingwatch/api-types'
import type { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import ActivityModalContentDetailsFishing from './ActivityModalContentDetailsFishing'
import ActivityModalContentDetailsLoitering from './ActivityModalContentDetailsLoitering'
import ActivityModalContentDetailsEncounter from './ActivityModalContentDetailsEncounter'
import styles from './ActivityModalDetails.module.css'
import ActivityModalContentDetailsPortVisit from './ActivityModalContentDetailsPortVisit'
import ActivityModalContentDetailsGap from './ActivityModalContentDetailsGap'

interface ActivityModalContentProps {
  event: RenderedEvent
}

const ActivityModalContent: React.FC<ActivityModalContentProps> = (props): React.ReactElement<any> => {
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
      case EventTypes.Port:
        return (
          <ActivityModalContentDetailsPortVisit
            event={event}
          ></ActivityModalContentDetailsPortVisit>
        )
      case EventTypes.Gap:
        return (
          <ActivityModalContentDetailsGap
            event={event}
          ></ActivityModalContentDetailsGap>
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
