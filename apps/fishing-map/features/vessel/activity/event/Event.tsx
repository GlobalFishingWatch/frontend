import React from 'react'
import cx from 'classnames'
import { IconButton } from '@globalfishingwatch/ui-components'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import EventIcon from 'features/vessel/activity/event/EventIcon'
import ActivityDate from './ActivityDate'
import useActivityEventConnect from './event.hook'
import styles from './Event.module.css'

interface EventProps {
  className?: string
  event: ActivityEvent
  children?: React.ReactNode
  onInfoClick?: (event: ActivityEvent) => void
  onMapClick?: (event: ActivityEvent) => void
  onMapHover?: (event?: ActivityEvent) => void
}

const Event: React.FC<EventProps> = (props): React.ReactElement => {
  const {
    event,
    children,
    className = '',
    onInfoClick = () => {},
    onMapHover = () => {},
    onMapClick = () => {},
  } = props
  const { getEventDescription } = useActivityEventConnect()
  return (
    <li className={cx(styles.event, className)}>
      <div
        className={styles.header}
        onMouseEnter={() => onMapHover(event)}
        onMouseLeave={() => onMapHover(undefined)}
        onClick={() => onInfoClick(event)}
      >
        <EventIcon type={event.type} />
        <div className={styles.eventData}>
          <ActivityDate event={event} />
          <p className={styles.description}>{getEventDescription(event)}</p>
        </div>
        <div className={styles.actions}>
          <IconButton icon="info" size="small"></IconButton>
          <IconButton icon="target" size="small" onClick={() => onMapClick(event)}></IconButton>
        </div>
      </div>
      {children && <div className={styles.content}>{children}</div>}
    </li>
  )
}

export default Event
