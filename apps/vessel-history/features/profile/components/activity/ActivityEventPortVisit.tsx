import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { capitalize } from 'lodash'
import { DateTime } from 'luxon'

import { EventTypes } from '@globalfishingwatch/api-types'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'

import { formatI18nDate } from 'features/i18n/i18nDate'
import type { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { PortVisitSubEvent } from 'types/activity'

import ActivityDate from './ActivityDate'

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

const ActivityEventPortVisit: React.FC<EventProps> = ({
  classname = '',
  event,
  highlighted = false,
  onInfoClick = () => {},
  onMapClick = () => {},
  options: { displayPortVisitsAsOneEvent } = { displayPortVisitsAsOneEvent: false },
}): React.ReactElement<any> => {
  const { t } = useTranslation()
  if (event.type !== EventTypes.Port) return

  const isPortEntry = event?.subEvent === PortVisitSubEvent.Entry
  const isPortExit = event?.subEvent === PortVisitSubEvent.Exit
  const isPortVisit = !event?.subEvent
  const portType = isPortVisit ? null : isPortExit ? 'exited' : 'entered'

  return (
    <Fragment>
      {isPortVisit && displayPortVisitsAsOneEvent && (
        <Fragment>
          <div className={styles.displayPortVisitsAsOneEvent}>
            <div className={cx(styles.event, classname)}>
              <div
                className={cx(
                  styles.eventIcon,
                  styles[event.type],
                  highlighted ? styles.highlighted : ''
                )}
              >
                <Icon icon="event-port_visit" type="default" />
              </div>
              <div className={styles.eventData}>
                <label className={styles.date}>{event.durationDescription}</label>
                <div className={styles.description}>{event.description}</div>
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
                {event.type === 'port_visit' && <Icon icon="event-port_visit" type="default" />}
              </div>
              <div className={styles.eventData}>
                {displayPortVisitsAsOneEvent && (
                  <div className={styles.description}>
                    {t(`event.${portType}PortOn`, `${capitalize(portType)} on {{date}}`, {
                      date: formatI18nDate(event.timestamp, { format: DateTime.DATETIME_SHORT }),
                    })}
                  </div>
                )}
                {!displayPortVisitsAsOneEvent && (
                  <Fragment>
                    <ActivityDate event={event} />
                    <div className={styles.description}>{event.description}</div>
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

export default ActivityEventPortVisit

// t('event.enteredPortOn', 'Entered on {{date}}')
// t('event.exitedPortOn', 'Exited on {{date}}')
