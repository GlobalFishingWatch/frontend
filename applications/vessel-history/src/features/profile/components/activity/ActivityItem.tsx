import { Fragment } from 'react'
import cx from 'classnames'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.slice'
import { getEncounterStatus } from 'features/vessels/activity/vessels-activity.utils'
import ActivityDate from './ActivityDate'
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
        <div
          className={cx(styles.eventIcon, styles[event.type], styles[getEncounterStatus(event)])}
        >
          {event.type === 'encounter' && <Icon icon="event-encounter" type="default" />}
          {event.type === 'loitering' && <Icon icon="event-loitering" type="default" />}
          {event.type === 'fishing' && <Icon icon="event-fishing" type="default" />}
          {event.type === 'port_visit' && <Icon icon="event-port-visit" type="default" />}
        </div>
        <div className={styles.eventData}>
          <ActivityDate event={event} />
          <div className={styles.description}>{event.description}</div>
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
      <div className={styles.divider}></div>
    </Fragment>
  )
}

export default ActivityItem
