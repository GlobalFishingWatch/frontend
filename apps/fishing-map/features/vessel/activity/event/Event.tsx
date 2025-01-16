import React from 'react'
import cx from 'classnames'

import type { ApiEvent, RegionType } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import EventIcon from 'features/vessel/activity/event/EventIcon'
import type { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'

import ActivityDate from './ActivityDate'
import { useActivityEventTranslations } from './event.hook'

import styles from './Event.module.css'

type VesselEvent = ActivityEvent | ApiEvent

interface EventProps {
  className?: string
  event: VesselEvent
  children?: React.ReactNode
  onInfoClick?: (event: VesselEvent) => void
  onMapClick?: (event: VesselEvent) => void
  onMapHover?: (event?: VesselEvent) => void
  regionsPriority?: RegionType[]
  testId?: string
}

export const EVENT_HEIGHT = 56

const VesselEvent: React.FC<EventProps> = (props): React.ReactElement<any> => {
  const {
    event,
    children,
    className = '',
    onInfoClick,
    onMapHover,
    onMapClick,
    testId,
    regionsPriority,
  } = props
  const { getEventDescription } = useActivityEventTranslations()
  const hasInteraction =
    onInfoClick !== undefined || onMapClick !== undefined || onMapHover !== undefined
  return (
    <li className={cx(styles.event, className)} {...(testId && { 'data-test': testId })}>
      <div
        className={cx(styles.header, { [styles.pointer]: hasInteraction })}
        onMouseEnter={() => onMapHover && onMapHover(event)}
        onMouseLeave={() => onMapHover && onMapHover(undefined)}
        onClick={() => onInfoClick && onInfoClick(event)}
        role="button"
        tabIndex={0}
      >
        <EventIcon type={event.type} />
        <div className={styles.eventData}>
          <ActivityDate event={event as ActivityEvent} />
          <p className={styles.description}>
            {getEventDescription(event as ActivityEvent, regionsPriority) as string}
          </p>
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

export default VesselEvent
