import { Fragment } from 'react'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { EventTypeVoyage, RenderedVoyage, Voyage } from 'types/voyage'
import ActivityEvent from './ActivityEvent'
import ActivityVoyage from './ActivityVoyage'
interface EventProps {
  event: RenderedEvent | RenderedVoyage
  highlighted?: boolean
  printView?: boolean
  onInfoClick?: (event: RenderedEvent) => void
  onMapClick?: (event: RenderedEvent | Voyage) => void
  onToggleClick?: (event: RenderedVoyage) => void
}

const ActivityItem: React.FC<EventProps> = ({
  event,
  highlighted = false,
  printView = false,
  onInfoClick = () => { },
  onMapClick = () => { },
  onToggleClick = () => { },
}): React.ReactElement => {
  return (
    <Fragment>
      {event.type === EventTypeVoyage.Voyage && (
        <ActivityVoyage
          event={event}
          onMapClick={onMapClick}
          onToggleClick={onToggleClick}
          printView={printView}
        ></ActivityVoyage>
      )}
      {event.type !== EventTypeVoyage.Voyage && (
        <ActivityEvent
          event={event}
          highlighted={highlighted}
          onMapClick={onMapClick}
          onInfoClick={onInfoClick}
          printView={printView}
        ></ActivityEvent>
      )}
    </Fragment>
  )
}

export default ActivityItem
