import { Fragment, useMemo } from 'react'
import { groupBy } from 'lodash'
import { ApiEvent } from '@globalfishingwatch/api-types'

export type VesselEventsProps = {
  events: ApiEvent[]
}

export const VesselEventsList = ({ events }: VesselEventsProps) => {
  if (!events?.length) return null
  return (
    <ul>
      {events.map((event) => (
        <li key={event.id}>{event.id}</li>
      ))}
    </ul>
  )
}

export const VesselEventsSummary = ({ events }: VesselEventsProps) => {
  const eventsByType = useMemo(() => {
    if (!events?.length) return {}
    return groupBy(events, 'type')
  }, [events])
  return (
    <ul>
      {Object.keys(eventsByType).map((event) => (
        <li key={event}>{event}</li>
      ))}
    </ul>
  )
}

const VesselEvents = ({ events }: VesselEventsProps) => {
  return (
    <Fragment>
      <VesselEventsSummary events={events} />
      <VesselEventsList events={events} />
    </Fragment>
  )
}

export default VesselEvents
