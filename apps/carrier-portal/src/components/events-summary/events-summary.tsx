import React, { Fragment, useMemo } from 'react'
import cx from 'classnames'
import { CountryFlag } from '@globalfishingwatch/ui-components'
import Tooltip from 'components/tooltip/tooltip'
import { formatUTCDate } from 'utils'
import { EVENT_TYPES, TOOLTIPS } from 'data/constants'
import { EventType } from 'types/app.types'
import styles from './events-summary.module.css'

interface EventsByType {
  [key: string]: number
}

interface EventsInfo {
  endDate: string
  startDate: string
  rfmo: string
  vessel: {
    name: string
    type: string
    flag: string
  }
  totalCarriers: string
  totalPorts: string | number
  eventsByType: EventsByType
  totalFlags: string
  numberOfFlags: number
  totalEvents: string | undefined
}

interface EventsSummaryProps {
  loading: boolean
  eventType: EventType | 'events'
  eventsInfo: EventsInfo
  vesselTooltip?: string
}

const getEventsTooltip = (eventsByType: EventsByType) => {
  if (!eventsByType) return ''
  const eventEntries = Object.entries(eventsByType)
  return eventEntries.reduce((acc, event, index) => {
    const isLastElement = eventEntries.length - 1 === index
    const separator = isLastElement ? '' : eventEntries.length - 2 === index ? ' and ' : ', '
    const eventText = event[0] === 'port' ? 'port visit' : event[0]
    return acc + `${event[1]} ${eventText}${event[1] > 1 ? 's' : ''}${separator}`
  }, '')
}

const EventsSummary: React.FC<EventsSummaryProps> = ({
  loading,
  eventsInfo,
  eventType,
  vesselTooltip,
}): React.ReactElement | null => {
  const {
    startDate,
    endDate,
    eventsByType,
    vessel,
    totalCarriers,
    totalPorts,
    totalFlags,
    numberOfFlags,
    totalEvents,
    rfmo,
  }: EventsInfo = eventsInfo

  const tooltip = useMemo(() => {
    return eventType === EVENT_TYPES.encounter || eventType === EVENT_TYPES.loitering
      ? TOOLTIPS[eventType]
      : getEventsTooltip(eventsByType)
  }, [eventType, eventsByType])

  if (loading) return null

  return (
    <Fragment>
      {totalEvents !== undefined ? (
        <span>
          Between <strong>{formatUTCDate(startDate)}</strong> and{' '}
          <strong>{formatUTCDate(endDate)}</strong>,{' '}
          {vessel && vessel.type && vessel.flag && vessel.name ? (
            <Fragment>
              the <span className={styles.lowercase}>{vessel.type}</span>
              <Tooltip content={vesselTooltip}>
                <span className={cx('vesselHighlight', styles.cursorHelp)}>
                  {' '}
                  <CountryFlag iso={vessel.flag} /> {vessel.name}
                </span>
              </Tooltip>{' '}
            </Fragment>
          ) : (
            <Fragment>
              {totalCarriers} from{' '}
              <Tooltip content={numberOfFlags > 1 ? TOOLTIPS.flagStates : ''}>
                <strong>{totalFlags}</strong>
              </Tooltip>{' '}
            </Fragment>
          )}
          had{' '}
          <Tooltip content={tooltip}>
            <span className={cx(styles.highlight, styles.cursorHelp)}>{totalEvents}</span>
          </Tooltip>{' '}
          {rfmo && 'in '}
          <strong>{rfmo}</strong>
          {totalPorts ? ' ' : '.'}
          {totalPorts ? (
            typeof totalPorts === 'number' ? (
              <span>
                before visiting one of the <strong>{totalPorts} ports</strong> selected.
              </span>
            ) : (
              <span>
                before visiting <strong>{totalPorts}</strong>.
              </span>
            )
          ) : null}
        </span>
      ) : (
        <span>{`There are no ${eventType} events matching your filters.`}</span>
      )}
    </Fragment>
  )
}

export default EventsSummary
