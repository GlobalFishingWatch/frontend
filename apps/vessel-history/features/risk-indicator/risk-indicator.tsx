import { useCallback, useState } from 'react'
import cx from 'classnames'
import { IconButton } from '@globalfishingwatch/ui-components'
import ActivityEvent from 'features/profile/components/activity/ActivityEvent'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { Voyage } from 'types/voyage'
import styles from './risk-indicator.module.css'

export interface RiskIndicatorProps {
  events?: RenderedEvent[]
  onEventInfoClick?: (event: RenderedEvent) => void
  onEventMapClick?: (event: RenderedEvent | Voyage) => void
  title: string
  subtitle?: string
}

export function RiskIndicator({
  events,
  onEventInfoClick,
  onEventMapClick,
  title,
  subtitle,
}: RiskIndicatorProps) {
  const [expanded, setExpanded] = useState(false)
  const hasEvents = events && events.length > 0
  const onToggle = useCallback(() => setExpanded(!expanded), [expanded])
  const displayOptions = { displayPortVisitsAsOneEvent: true }

  return (
    <div className={styles['container']}>
      <div
        className={cx(styles.title, { [styles.expandable]: hasEvents })}
        {...(hasEvents ? { onClick: onToggle } : {})}
      >
        <div>
          {title}
          {!!subtitle && <span className={styles.subtitle}> {subtitle}</span>}
        </div>
        {hasEvents ? (
          <IconButton
            icon={expanded ? 'arrow-top' : 'arrow-down'}
            size="small"
            className={styles.toggle}
          ></IconButton>
        ) : (
          ''
        )}
      </div>
      {hasEvents &&
        expanded &&
        events.map((event, index) => (
          <ActivityEvent
            classname={cx(styles.event, styles[`${event.type}_${event.subEvent}`])}
            key={index}
            event={event}
            onMapClick={onEventMapClick}
            onInfoClick={onEventInfoClick}
            options={displayOptions}
          />
        ))}
    </div>
  )
}

export default RiskIndicator
