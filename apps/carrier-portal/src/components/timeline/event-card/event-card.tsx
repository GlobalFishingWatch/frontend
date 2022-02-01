import React, { Fragment, memo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { stringify, parse } from 'qs'
import cx from 'classnames'
import { differenceInMinutes } from 'date-fns'
import formatCoords from 'formatcoords'
import CountryFlag from '@globalfishingwatch/ui-components/dist/countryflag'
import { formatUTCDate, parseVesselType } from 'utils'
import { getAuthorizationsByVesselType } from 'utils/events'
import Tooltip from 'components/tooltip/tooltip'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import { Event } from 'types/api/models'
import { TEXT_DATE_FORMAT, EVENT_TYPES } from 'data/constants'
import AuthorizationsList from 'components/map/popups/event-popup/authorizations-list/authorizations-list'
import EncounterGraph from '../encounter-graph/encounter-graph.container'
import styles from './event-card.module.css'

interface EventCardProps {
  event: Event
  eventRefs: any
  past: boolean
  highlighted: boolean
  onClick: (event: Event) => void
}

const EventCard: React.FC<EventCardProps> = memo(function EventCard({
  event,
  eventRefs,
  past,
  highlighted,
  onClick,
}) {
  const start = formatUTCDate(event.start, `${TEXT_DATE_FORMAT} HH:mm`)
  const end = formatUTCDate(event.end, `${TEXT_DATE_FORMAT} HH:mm`)
  let duration = event.start !== event.end ? differenceInMinutes(event.end, event.start) : null
  let durationUnit = duration === null ? '' : duration > 1 ? 'minutes' : 'minute'
  if (duration !== null && duration >= 60) {
    if (duration >= 60 * 24) {
      duration = Math.floor(duration / (60 * 24))
      durationUnit = duration > 1 ? 'days' : 'day'
    } else {
      duration = Math.floor(duration / 60)
      durationUnit = duration > 1 ? 'hours' : 'hour'
    }
  }
  const dispatch = useDispatch()
  const handleEventClick = useCallback(
    (clickEvent: React.MouseEvent) => {
      clickEvent.preventDefault()
      if (event.encounter) {
        const { id } = event.encounter.vessel
        dispatch(updateQueryParams({ vessel: id }))
      } else if (event.port && highlighted) {
        const { id } = event.port
        dispatch(updateQueryParams({ port: [id] }))
      }
    },
    [dispatch, event.encounter, event.port, highlighted]
  )
  const linkPath = stringify(
    {
      ...parse(window.location.search.replace('?', '')),
      vessel: event.encounter && event.encounter.vessel.id,
    },
    { encode: false }
  )
  const type = parseVesselType(event?.encounter?.vessel?.type || '', false)
  const carrierAuthorizations = getAuthorizationsByVesselType(event, 'carrier')
  const fishingAuthorizations = getAuthorizationsByVesselType(event, 'fishing')
  return (
    <li
      ref={(inst) =>
        inst === null ? eventRefs.delete(event.start) : eventRefs.set(event.start, inst)
      }
      className={cx(styles.eventCard, styles[event.type], {
        [styles.past]: past,
        [styles.partially]: event.encounter && event.encounter.authorizationStatus === 'partially',
        [styles.unmatched]: event.encounter && event.encounter.authorizationStatus === 'unmatched',
        [styles.highlighted]: highlighted,
      })}
      onClick={() => onClick(event)}
    >
      <div className={styles.content}>
        <div className={styles.primaryInfoField}>
          <label>{event.type}</label>
          {event.type === EVENT_TYPES.encounter && (
            <Tooltip
              placement="bottom"
              content={highlighted ? `Click to see this ${type || 'vessel'} history` : ''}
            >
              <a
                href={`?${linkPath}`}
                onClick={handleEventClick}
                className={cx(styles.encounteredVessel, {
                  [styles.encounteredVesselHighlight]: highlighted,
                })}
              >
                {event.encounter !== undefined && (
                  <Fragment>
                    <span style={{ pointerEvents: 'none' }}>
                      <CountryFlag iso={event.encounter.vessel.flag} />
                    </span>
                    {event.encounter.vessel.name || event.encounter.vessel.ssvid}
                  </Fragment>
                )}
              </a>
            </Tooltip>
          )}
          {event.type === 'port' && (
            <Tooltip
              placement="bottom"
              content={highlighted ? 'Click to add this port to the current filters' : ''}
            >
              <span
                onClick={handleEventClick}
                className={cx(styles.portEvent, {
                  [styles.portEventHighlight]: highlighted,
                })}
              >
                {event.port !== undefined && (event.port as any).name}
              </span>
            </Tooltip>
          )}
          {event.type === EVENT_TYPES.loitering && <span>{`${duration} ${durationUnit}`}</span>}
        </div>
        {highlighted === true && (
          <Fragment>
            {(event.type === EVENT_TYPES.encounter || event.type === EVENT_TYPES.loitering) &&
              event[event.type] && (
                <div>
                  <label>Avg Speed</label>
                  <span>{(event as any)[event.type].medianSpeedKnots} knots</span>
                </div>
              )}
            {duration !== null && (
              <Fragment>
                {event.type !== EVENT_TYPES.loitering && (
                  <div>
                    <label>Duration</label>
                    <span>{`${duration} ${durationUnit}`}</span>
                  </div>
                )}
                <div>
                  <label>Start</label>
                  <span>{start} UTC</span>
                </div>
                <div>
                  <label>End</label>
                  <span>{end} UTC</span>
                </div>
              </Fragment>
            )}
            <div>
              <label>Position</label>
              <span>
                {formatCoords({ lat: event.position.lat, lng: event.position.lon }).format('FFf', {
                  decimalPlaces: 2,
                })}
              </span>
            </div>
            {event.type === 'encounter' && (
              <Fragment>
                {carrierAuthorizations && (
                  <div>
                    <label>Carrier Authorization</label>
                    <AuthorizationsList authorizationsList={carrierAuthorizations} />
                  </div>
                )}
                {fishingAuthorizations && (
                  <div>
                    <label>Donor vessel Authorization</label>
                    <AuthorizationsList authorizationsList={fishingAuthorizations} />
                  </div>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
      {highlighted === true && event.type === EVENT_TYPES.encounter && <EncounterGraph />}
    </li>
  )
})

export default EventCard
