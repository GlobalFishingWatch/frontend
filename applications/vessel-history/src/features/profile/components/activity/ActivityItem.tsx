import { Fragment } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.slice'
import ActivityDate from './ActivityDate'
import ActivityDescription from './description/ActivityDescription'
import styles from './Activity.module.css'

interface EventProps {
  event: RenderedEvent
  onInfoClick?: (event: RenderedEvent) => void
  onMapClick?: (event: RenderedEvent) => void
}

const ActivityItem: React.FC<EventProps> = ({
  event,
  onInfoClick = () => {},
  onMapClick = () => {},
}): React.ReactElement => {
  return (
    <Fragment>
      <div className={styles.event}>
        <div className={styles.eventIcon}>
          <i></i>
        </div>
        <div className={styles.eventData}>
          <ActivityDate event={event} />
          <div className={styles.description}>
            <ActivityDescription event={event}></ActivityDescription>
          </div>
        </div>
        <div className={styles.actions}>
          <IconButton icon="info" size="small" onClick={() => onInfoClick(event)}></IconButton>
          <IconButton
            icon="view-on-map"
            size="small"
            onClick={() => onMapClick(event)}
          ></IconButton>
        </div>
      </div>
    </Fragment>
  )
}

export default ActivityItem
