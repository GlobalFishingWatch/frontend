import { Fragment, useCallback, useMemo, useState } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import ActivityEvent from 'features/profile/components/activity/ActivityEvent'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { Voyage } from 'types/voyage'
import styles from './risk-indicator.module.css'

/* eslint-disable-next-line */
export interface RiskIndicatorProps {
  events: RenderedEvent[]
  onEventInfoClick: (event: RenderedEvent) => void
  onEventMapClick: (event: RenderedEvent | Voyage) => void
  title: string
}

export function RiskIndicator({
  events,
  onEventInfoClick,
  onEventMapClick,
  title,
}: RiskIndicatorProps) {
  const [expanded, setExpanded] = useState(false)
  const hasEvents = useMemo(() => events.length > 0, [events.length])
  const onToggle = useCallback(() => setExpanded(!expanded), [expanded])

  if (!hasEvents) return <Fragment></Fragment>
  return (
    <div className={styles['container']}>
      <div className={styles.title} onClick={onToggle}>
        <div>{`${events.length} ${title}`}</div>
        <IconButton
          icon={expanded ? 'arrow-top' : 'arrow-down'}
          size="small"
          className={styles.toggle}
        ></IconButton>
      </div>
      {expanded &&
        events.map((event, index) => (
          <Fragment>
            <div>
              <ActivityEvent
                classname={styles.event}
                key={index}
                event={event}
                onMapClick={onEventMapClick}
                onInfoClick={onEventInfoClick}
              />
            </div>
          </Fragment>
        ))}
    </div>
  )
}

export default RiskIndicator
