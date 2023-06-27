import { ActivityEvent } from 'types/activity'
import EventItem from '../event/Event'

interface EventProps {
  event: ActivityEvent
  highlighted?: boolean
  onInfoClick?: (event: ActivityEvent) => void
  onMapClick?: (event: ActivityEvent) => void
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
    <EventItem
      event={event}
      highlighted={highlighted}
      onMapClick={onMapClick}
      onInfoClick={onInfoClick}
      options={options}
    ></EventItem>
  )
}

export default ActivityItem
