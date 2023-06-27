import { RenderedEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { RenderedVoyage, Voyage } from 'types/voyage'
import ActivityEvent from '../ActivityEvent'
interface EventProps {
  event: RenderedEvent
  highlighted?: boolean
  onInfoClick?: (event: RenderedEvent) => void
  onMapClick?: (event: RenderedEvent | Voyage) => void
  options?: {
    displayPortVisitsAsOneEvent: boolean
  }
}

const ActivityItem: React.FC<EventProps> = ({
  event,
  highlighted = false,
  onInfoClick = () => {},
  onMapClick = () => {},
  options = { displayPortVisitsAsOneEvent: false },
}): React.ReactElement => {
  return (
    <ActivityEvent
      event={event}
      highlighted={highlighted}
      onMapClick={onMapClick}
      onInfoClick={onInfoClick}
      options={options}
    ></ActivityEvent>
  )
}

export default ActivityItem
