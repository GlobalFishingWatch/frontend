import React from 'react'
import cx from 'classnames'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'
import { getEncounterStatus } from 'features/vessel/activity/vessels-activity.utils'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import ActivityDate from './ActivityDate'
import useActivityEventConnect from './event.hook'
import styles from './Event.module.css'

interface EventProps {
  classname?: string
  style?: React.CSSProperties
  event: ActivityEvent
  children?: React.ReactNode
  onInfoClick?: (event: ActivityEvent) => void
  onMapClick?: (event: ActivityEvent) => void
}

const ActivityEvent: React.FC<EventProps> = (props): React.ReactElement => {
  const {
    classname = '',
    event,
    style,
    children,
    onInfoClick = () => {},
    onMapClick = () => {},
  } = props
  const { getEventDescription } = useActivityEventConnect()
  return (
    <li className={cx(classname)} style={style}>
      <div className={styles.event}>
        <div
          className={cx(styles.eventIcon, styles[event.type], styles[getEncounterStatus(event)])}
        >
          <Icon icon={`event-${event.type}`} />
        </div>
        <div className={styles.eventData}>
          <ActivityDate event={event} />
          <div className={styles.description}>{getEventDescription(event)}</div>
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
      {children && <div className={styles.content}>{children}</div>}
    </li>
  )
}

export default ActivityEvent
