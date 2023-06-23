import { Fragment } from 'react'
import { RenderedEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { EventTypeVoyage, RenderedVoyage, Voyage } from 'types/voyage'
import ActivityEvent from './ActivityEvent'
import ActivityVoyage from './activity-by-voyage/ActivityVoyage'
interface EventProps {
  event: RenderedEvent | RenderedVoyage
  highlighted?: boolean
  onInfoClick?: (event: RenderedEvent) => void
  onMapClick?: (event: RenderedEvent | Voyage) => void
  onToggleClick?: (event: RenderedVoyage) => void
  options?: {
    displayPortVisitsAsOneEvent: boolean
  }
}

const ActivityItem: React.FC<EventProps> = ({
  event,
  highlighted = false,
  onInfoClick = () => {},
  onMapClick = () => {},
  onToggleClick = () => {},
  options = { displayPortVisitsAsOneEvent: false },
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
        <ActivityEvent
          event={event}
          highlighted={highlighted}
          onMapClick={onMapClick}
          onInfoClick={onInfoClick}
          options={options}
        ></ActivityEvent>
      )}
    </Fragment>
  )
}

export default ActivityItem
