import { Fragment } from 'react'
import { RenderedVoyage, Voyage } from 'types/voyage'
import { ActivityEvent } from 'types/activity'
import EventItem from '../event/Event'
import VoyageGroup from './VoyageGroup'

interface EventProps {
  event: RenderedVoyage
  onInfoClick?: (event: ActivityEvent) => void
  onMapClick?: (event: ActivityEvent | Voyage) => void
  onToggleClick?: (event: RenderedVoyage) => void
  options?: {
    displayPortVisitsAsOneEvent: boolean
  }
}

const ActivityItem: React.FC<EventProps> = ({
  event,
  onInfoClick = () => {},
  onMapClick = () => {},
  onToggleClick = () => {},
  options = { displayPortVisitsAsOneEvent: false },
}): React.ReactElement => {
  return (
    <Fragment>
      <VoyageGroup
        event={event}
        onMapClick={onMapClick}
        onToggleClick={onToggleClick}
      ></VoyageGroup>
      {event.events &&
        event.status !== 'collapsed' &&
        event.events.length > 0 &&
        event.events.map((voyageEvent) => (
          <EventItem
            key={voyageEvent.id}
            event={voyageEvent}
            onMapClick={onMapClick}
            onInfoClick={onInfoClick}
            options={options}
          ></EventItem>
        ))}
    </Fragment>
  )
}

export default ActivityItem
