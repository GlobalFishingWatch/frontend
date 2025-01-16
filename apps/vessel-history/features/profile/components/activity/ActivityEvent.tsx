import { Fragment } from 'react'
import cx from 'classnames'

import { Icon, IconButton } from '@globalfishingwatch/ui-components'

import type { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { getEncounterStatus } from 'features/vessels/activity/vessels-activity.utils'

import ActivityDate from './ActivityDate'
import ActivityEventPortVisit from './ActivityEventPortVisit'

import styles from './Activity.module.css'

interface EventProps {
  classname?: string
  event: RenderedEvent
  highlighted?: boolean
  onInfoClick?: (event: RenderedEvent) => void
  onMapClick?: (event: RenderedEvent) => void
  options?: {
    displayPortVisitsAsOneEvent: boolean
  }
}

const ActivityEvent: React.FC<EventProps> = ({
  classname = '',
  event,
  highlighted = false,
  onInfoClick = () => {},
  onMapClick = () => {},
  options = { displayPortVisitsAsOneEvent: false },
}): React.ReactElement<any> => {
  return (
    <Fragment>
      <ActivityEventPortVisit
        {...{ classname, event, highlighted, onInfoClick, onMapClick, options }}
      />
      {event.type !== 'port_visit' && (
        <Fragment>
          <div className={cx(styles.event, classname)}>
            <div
              className={cx(
                styles.eventIcon,
                styles[event.type],
                styles[getEncounterStatus(event)],
                highlighted ? styles.highlighted : ''
              )}
            >
              {event.type === 'encounter' && <Icon icon="event-encounter" type="default" />}
              {event.type === 'loitering' && <Icon icon="event-loitering" type="default" />}
              {event.type === 'fishing' && <Icon icon="event-fishing" type="default" />}
              {event.type === 'gap' && <Icon icon="event-gap" type="default" />}
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
      )}
    </Fragment>
  )
}

export default ActivityEvent
