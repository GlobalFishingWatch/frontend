import { Fragment } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { capitalize } from 'lodash'
import { EventTypes } from '@globalfishingwatch/api-types'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { ActivityEvent, PortVisitSubEvent } from 'types/activity'
import ActivityDate from '../ActivityDate'
import styles from './Event.module.css'
import useActivityEventConnect from './event.hook'

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

const EventPortVisit: React.FC<EventProps> = ({
  classname = '',
  event,
  highlighted = false,
  onInfoClick = () => {},
  onMapClick = () => {},
  options: { displayPortVisitsAsOneEvent } = { displayPortVisitsAsOneEvent: false },
}): React.ReactElement => {
  const { t } = useTranslation()
  const { getEventDescription } = useActivityEventConnect()

  const isPortEntry = event?.subEvent === PortVisitSubEvent.Entry
  const isPortExit = event?.subEvent === PortVisitSubEvent.Exit
  const isPortVisit = !event?.subEvent
  const portType = isPortVisit ? undefined : isPortExit ? 'exited' : 'entered'

  return (
    <Fragment>
      {isPortVisit && displayPortVisitsAsOneEvent && (
        <Fragment>
          <div className={styles.displayPortVisitsAsOneEvent}>
            <div className={cx(styles.event, classname)}>
              <div className={cx(styles.eventIcon, 'port_visit')}>
                <Icon icon="event-port-visit" type="default" />
              </div>
              <div className={styles.eventData}>
                <ActivityDate event={event} />
                <div className={styles.description}>{getEventDescription(event)}</div>
              </div>
              <div className={styles.actions}>
                <IconButton
                  icon="info"
                  size="small"
                  onClick={() => onInfoClick(event)}
                ></IconButton>
              </div>
            </div>
            <div className={styles.divider}></div>
          </div>
        </Fragment>
      )}
      {(isPortExit || isPortEntry) && (
        <Fragment>
          <div
            className={cx(
              displayPortVisitsAsOneEvent && styles.displayPortVisitsAsOneEvent,
              styles[`${event.type}_${[portType]}`]
            )}
          >
            <div className={cx(styles.event, classname)}>
              <div
                className={cx(
                  styles.eventIcon,
                  styles[event.type],
                  styles[`${event.type}_${[portType]}`],
                  highlighted ? styles.highlighted : ''
                )}
              >
                {event.type === EventTypes.Port && <Icon icon="event-port-visit" type="default" />}
              </div>
              <div className={styles.eventData}>
                {displayPortVisitsAsOneEvent && (
                  <div className={styles.description}>
                    {t(`event.${portType}PortOn`, `${capitalize(portType)} on {{date}}`, {
                      date: formatI18nDate(event.timestamp ?? 0, {
                        format: DateTime.DATETIME_SHORT,
                      }),
                    })}
                  </div>
                )}
                {!displayPortVisitsAsOneEvent && (
                  <Fragment>
                    <ActivityDate event={event} />
                    <div className={styles.description}>{getEventDescription(event)}</div>
                  </Fragment>
                )}
              </div>
              <div className={styles.actions}>
                {!displayPortVisitsAsOneEvent && (
                  <IconButton
                    icon="info"
                    size="small"
                    onClick={() => onInfoClick(event)}
                  ></IconButton>
                )}
                <IconButton
                  icon="view-on-map"
                  size="small"
                  onClick={() => onMapClick(event)}
                ></IconButton>
              </div>
            </div>
            <div className={styles.divider}></div>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default EventPortVisit

// t('event.enteredPortOn', 'Entered on {{date}}')
// t('event.exitedPortOn', 'Exited on {{date}}')
