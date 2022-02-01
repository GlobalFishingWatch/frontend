import React, { memo } from 'react'
import cx from 'classnames'
import { stringify } from 'qs'
import Tooltip from 'components/tooltip/tooltip'
import { formatUTCDate } from 'utils'
import { Event } from 'types/api/models'
import useAbortableFetch from 'hooks/fetch.hooks'
import { EventsFilter } from 'types/app.types'
import { EVENT_TYPES } from 'data/constants'
import styles from './encounter-graph.module.css'

const paths = [
  {
    transform: 'translate(0 1105)',
    d1: 'M0 895V76.36a25 25 0 0 1 7.32-17.68L60 6',
    d2: 'M60 .75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5z',
  },
  {
    transform: 'translate(20 1181)',
    d1: 'M0 819V56.2a25 25 0 0 1 7.36-17.72L40 6',
    d2: 'M40 .75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5z',
  },
  {
    transform: 'translate(40 1257)',
    d1: 'M0 743V36.23a25 25 0 0 1 7.4-17.76L20 6',
    d2: 'M20 .75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5z',
  },
]

function getButtonTooltip(event: Event) {
  if (!event || !event.encounter) return ''
  return `${event.vessel.name} had an encounter with ${
    event.encounter.vessel.name
  } on ${formatUTCDate(event.start)}. Click to see more`
}

interface EncounterGraphProps {
  encounterVesselId: string | null
  timestamp: number | null
  filters: EventsFilter
  goToEncounteredVessel: (event: Event) => void
}

const EncounterGraph: React.FC<EncounterGraphProps> = (props) => {
  const { encounterVesselId, timestamp, filters, goToEncounteredVessel } = props
  const { rfmos, ports, flags, dateRange } = filters

  const params = stringify(
    {
      vessels: encounterVesselId,
      startDate: new Date(dateRange.start).toISOString(),
      timeFormat: 'timestamp',
      sortOrder: 'desc',
      types: [EVENT_TYPES.encounter],
      limit: 3,
      ...(timestamp && { endDate: new Date(timestamp).toISOString() }),
      ...(rfmos && { rfmos }),
      ...(flags && { flags }),
      ...(ports && { nextPorts: ports }),
    },
    { arrayFormat: 'comma' }
  )
  const url = `/events?${params}`
  const { data: encounterEvents } = useAbortableFetch<Event[]>(url)

  return (
    <div
      className={cx(styles.encounterGraph, {
        [styles.encounterGraphHighlighted]: encounterVesselId,
      })}
    >
      {encounterEvents && (
        <svg width="102" height="2002">
          <g transform="translate(1 1)">
            <path
              className={styles.pastLine}
              d="M60 2000v-949.65a25 25 0 0 1 7.32-17.68L100 1000"
            />
            {paths.map((path, index) => {
              const event = encounterEvents[index]
              if (!event) return null

              return (
                <g key={index} transform={path.transform}>
                  <path className={styles.encounterLine} d={path.d1} />
                  <Tooltip content={getButtonTooltip(event)}>
                    <path
                      className={cx(styles.encounterCircle, {
                        [styles.encounterCirclePartially]:
                          event.encounter && event.encounter.authorizationStatus === 'partially',
                        [styles.encounterCircleUnmatched]:
                          event.encounter && event.encounter.authorizationStatus === 'unmatched',
                      })}
                      d={path.d2}
                      onClick={() => goToEncounteredVessel(event)}
                    />
                  </Tooltip>
                </g>
              )
            })}
            <path
              className={styles.futureLine}
              d="M60 1000V50.35a25 25 0 0 1 7.32-17.68L100 0"
              transform="matrix(1 0 0 -1 0 1000)"
            />
          </g>
        </svg>
      )}
    </div>
  )
}

function areEqual(prevProps: EncounterGraphProps, nextProps: EncounterGraphProps) {
  return prevProps.encounterVesselId === nextProps.encounterVesselId
}

export default memo(EncounterGraph, areEqual)
