import { Fragment } from 'react'
import cx from 'classnames'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'
import { EventTypes } from '@globalfishingwatch/api-types'
import { getEncounterStatus } from 'features/vessel/activity/vessels-activity.utils'
import { ActivityEvent } from 'types/activity'
import ActivityDate from '../ActivityDate'
import ActivityEventPortVisit from './EventPortVisit'
import useActivityEventConnect from './event.hook'
import styles from './Event.module.css'

interface EventProps {
  classname?: string
  event: ActivityEvent
  highlighted?: boolean
  onInfoClick?: (event: ActivityEvent) => void
  onMapClick?: (event: ActivityEvent) => void
  options?: {
    displayPortVisitsAsOneEvent: boolean
  }
}

const EventItem: React.FC<EventProps> = ({
  classname = '',
  event,
  highlighted = false,
  onInfoClick = () => {},
  onMapClick = () => {},
  options = { displayPortVisitsAsOneEvent: false },
}): React.ReactElement => {
  const { getEventDescription } = useActivityEventConnect()
  return event.type !== EventTypes.Port ? (
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
          {event.type === EventTypes.Encounter && <Icon icon="event-encounter" type="default" />}
          {event.type === EventTypes.Loitering && <Icon icon="event-loitering" type="default" />}
          {event.type === EventTypes.Fishing && <Icon icon="event-fishing" type="default" />}
          {event.type === EventTypes.Gap && <Icon icon="transmissions-off" type="default" />}
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
      <div className={styles.divider}></div>
    </Fragment>
  ) : (
    <ActivityEventPortVisit
      {...{ classname, event, highlighted, onInfoClick, onMapClick, options }}
    />
  )
}

export default EventItem
