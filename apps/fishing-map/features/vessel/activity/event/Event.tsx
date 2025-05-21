import React, { useCallback } from 'react'
import cx from 'classnames'

import type { ApiEvent, RegionType } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import EventDetail from 'features/vessel/activity/event/EventDetail'
import EventIcon from 'features/vessel/activity/event/EventIcon'
import type { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'

import ActivityDate from './ActivityDate'
import { useActivityEventTranslations } from './event.hook'

import styles from './Event.module.css'

export type VesselEvent = ActivityEvent | ApiEvent

interface EventProps {
  className?: string
  event: VesselEvent
  eventsRef?: Map<string, HTMLElement>
  children?: React.ReactNode
  onInfoClick?: (event: VesselEvent) => void
  onMapClick?: (event: VesselEvent, e: React.MouseEvent) => void
  onMapHover?: (event?: VesselEvent) => void
  regionsPriority?: RegionType[]
  testId?: string
  expanded?: boolean
}

export const EVENT_HEIGHT = 126

const Event: React.FC<EventProps> = (props): React.ReactElement<any> => {
  const {
    event,
    className = '',
    onInfoClick,
    onMapHover,
    onMapClick,
    testId,
    regionsPriority,
    eventsRef,
    expanded,
  } = props
  const { getEventDescription } = useActivityEventTranslations()
  const hasInteraction =
    onInfoClick !== undefined || onMapClick !== undefined || onMapHover !== undefined

  const handleClick = useCallback(() => {
    onInfoClick?.(event)
  }, [onInfoClick, event])

  const handleMouseEnter = useCallback(() => {
    onMapHover?.(event)
  }, [onMapHover, event])

  const handleMouseLeave = useCallback(() => {
    onMapHover?.(undefined)
  }, [onMapHover])

  return (
    <li
      ref={(inst) => {
        if (!eventsRef) return
        if (inst === null) {
          eventsRef.delete(event.id)
        } else {
          eventsRef.set(event.id, inst)
        }
      }}
      className={cx(
        styles.event,
        className,
        { [styles.pointer]: hasInteraction },
        { [styles.expanded]: expanded }
      )}
      {...(testId && { 'data-test': testId })}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      role="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
    >
      <div className={cx(styles.header)}>
        <EventIcon type={event.type} />
        <div className={styles.eventData}>
          <ActivityDate event={event as ActivityEvent} />
          <p className={cx(styles.description, { [styles.interactive]: expanded })}>
            {getEventDescription(event as ActivityEvent, regionsPriority) as string}
          </p>
        </div>
        <div className={cx(styles.actions, 'print-hidden')}>
          {onMapClick && (
            <IconButton
              icon="target"
              size="small"
              onClick={(e) => {
                onMapClick(event, e)
              }}
            ></IconButton>
          )}
        </div>
      </div>
      {expanded && <EventDetail event={event} />}
    </li>
  )
}

export default Event
