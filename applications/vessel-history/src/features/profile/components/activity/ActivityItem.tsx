import { Fragment } from 'react'
import cx from 'classnames'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { getEncounterStatus } from 'features/vessels/activity/vessels-activity.utils'
import { Voyage } from 'features/vessels/voyages/voyages.selectors'
import ActivityDate from './ActivityDate'
import ActivityEvent from './ActivityEvent'
import ActivityVoyage, { RenderedVoyage } from './ActivityVoyage'
import styles from './Activity.module.css'

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
