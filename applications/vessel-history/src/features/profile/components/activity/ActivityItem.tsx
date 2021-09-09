import { Fragment } from 'react'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { RenderedVoyage, Voyage } from 'types/voyage'
import ActivityEvent from './ActivityEvent'
import ActivityVoyage from './ActivityVoyage'

interface EventProps {
  event: RenderedEvent | RenderedVoyage
  onInfoClick?: (event: RenderedEvent) => void
  onMapClick?: (event: RenderedEvent | Voyage) => void
  onToggleClick?: (event: RenderedVoyage) => void
}

const ActivityItem: React.FC<EventProps> = ({
  event,
  onInfoClick = () => {},
  onMapClick = () => {},
  onToggleClick = () => {},
}): React.ReactElement => {
  return (
    <Fragment>
      {event.type === 'voyage' && (
        <ActivityVoyage
          event={event}
          onMapClick={onMapClick}
          onToggleClick={onToggleClick}
        ></ActivityVoyage>
      )}
      {event.type !== 'voyage' && (
        <ActivityEvent
          event={event}
          onMapClick={onMapClick}
          onInfoClick={onInfoClick}
        ></ActivityEvent>
      )}
    </Fragment>
  )
}

export default ActivityItem
