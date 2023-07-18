import React from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import EventIcon from 'features/vessel/activity/event/EventIcon'
import ActivityDate from './ActivityDate'
import useActivityEventConnect from './event.hook'
import styles from './Event.module.css'

interface EventProps {
  style?: React.CSSProperties
  event: ActivityEvent
  children?: React.ReactNode
  onInfoClick?: (event: ActivityEvent) => void
  onMapClick?: (event: ActivityEvent) => void
  onMapHover?: (event?: ActivityEvent) => void
}

const ActivityEvent: React.FC<EventProps> = (props): React.ReactElement => {
  const {
    event,
    style,
    children,
    onInfoClick = () => {},
    onMapHover = () => {},
    onMapClick = () => {},
  } = props
  const { getEventDescription } = useActivityEventConnect()
  return (
    <li className={styles.event} style={style}>
      <div className={styles.header}>
        <EventIcon type={event.type} />
        <div className={styles.eventData}>
          <ActivityDate event={event} />
          <p className={styles.description}>{getEventDescription(event)}</p>
        </div>
        <div className={styles.actions}>
          <IconButton icon="info" size="small" onClick={() => onInfoClick(event)}></IconButton>
          <IconButton
            icon="target"
            size="small"
            onMouseEnter={() => onMapHover(event)}
            onMouseLeave={() => onMapHover(undefined)}
            onClick={() => onMapClick(event)}
          ></IconButton>
        </div>
      </div>
      {children && <div className={styles.content}>{children}</div>}
    </li>
  )
}

export default ActivityEvent
