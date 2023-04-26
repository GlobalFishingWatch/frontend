import { Fragment, useMemo, useState } from 'react'
import { groupBy } from 'lodash'
import { ApiEvent, Dataset } from '@globalfishingwatch/api-types'
import { Tab, Tabs } from '@globalfishingwatch/ui-components'

export type VesselEventsProps = {
  events: ApiEvent[]
}

export const VesselEventsList = ({ events }: VesselEventsProps) => {
  return (
    <ul>
      {events.map((event) => (
        <li>{event.id}</li>
      ))}
    </ul>
  )
}

export const VesselEventsSummary = ({ events }: VesselEventsProps) => {
  const eventsByType = useMemo(() => {
    return groupBy(events, 'type')
  }, [events])
  return (
    <ul>
      {Object.keys(eventsByType).map((event) => (
        <li>{event}</li>
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
