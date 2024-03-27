import React from 'react'
import cx from 'classnames'
import { IconButton } from '@globalfishingwatch/ui-components'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import EventIcon from 'features/vessel/activity/event/EventIcon'
import ActivityDate from './ActivityDate'
import { useActivityEventTranslations } from './event.hook'
import styles from './Event.module.css'

interface EventProps {
  className?: string
  event: ActivityEvent
  children?: React.ReactNode
  onInfoClick?: (event: ActivityEvent) => void
  onMapClick?: (event: ActivityEvent) => void
  onMapHover?: (event?: ActivityEvent) => void
  testId?: string
}

export const EVENT_HEIGHT = 56

const Event: React.FC<EventProps> = (props): React.ReactElement => {
  const { event, children, className = '', onInfoClick, onMapHover, onMapClick, testId } = props
  const { getEventDescription } = useActivityEventTranslations()
  return (
    <li className={cx(styles.event, className)} {...(testId && { 'data-test': testId })}>
      <div
        className={styles.header}
        onMouseEnter={() => onMapHover && onMapHover(event)}
        onMouseLeave={() => onMapHover && onMapHover(undefined)}
        onClick={() => onInfoClick && onInfoClick(event)}
      >
        <EventIcon type={event.type} />
        <div className={styles.eventData}>
          <ActivityDate event={event} />
          <p className={styles.description}>{getEventDescription(event) as string}</p>
        </div>
        <div className={cx(styles.actions, 'print-hidden')}>
          {onInfoClick && <IconButton icon="info" size="small"></IconButton>}
          {onMapClick && (
            <IconButton icon="target" size="small" onClick={() => onMapClick(event)}></IconButton>
          )}
        </div>
      </div>
      {children && <div className={styles.content}>{children}</div>}
    </li>
  )
}

export default Event
