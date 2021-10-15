import { Fragment } from 'react'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { EventTypeVoyage, RenderedVoyage, Voyage } from 'types/voyage'
import ActivityEvent from './ActivityEvent'
import ActivityVoyage from './ActivityVoyage'
import styles from './Activity.module.css'
interface EventProps {
  event: RenderedEvent | RenderedVoyage
  highlighted?: boolean
  onInfoClick?: (event: RenderedEvent) => void
  onMapClick?: (event: RenderedEvent | Voyage) => void
  onToggleClick?: (event: RenderedVoyage) => void
}

const ActivityItem: React.FC<EventProps> = ({
  event,
  highlighted = false,
  onInfoClick = () => {},
  onMapClick = () => {},
  onToggleClick = () => {},
}): React.ReactElement => {
  return (
    <Fragment>
      {event.type === EventTypeVoyage.Voyage && (
        <ActivityVoyage
          event={event}
          onMapClick={onMapClick}
          onToggleClick={onToggleClick}
        ></ActivityVoyage>
      )}
      {event.type !== EventTypeVoyage.Voyage && (
        <div  className={styles.ppp}>
          <ActivityEvent
            event={event}
            highlighted={highlighted}
            onMapClick={onMapClick}
            onInfoClick={onInfoClick}
            ></ActivityEvent>
        </div>
      )}
    </Fragment>
  )
}

export default ActivityItem
