import { DateTime } from 'luxon'
import { LoaderWithParser } from '@loaders.gl/loader-utils'
import { ApiEvent, EventTypes } from '@globalfishingwatch/api-types'
// import { START_TIMESTAMP } from '../constants'

export const vesselEventsLoader: LoaderWithParser = {
  name: 'Events',
  module: 'events',
  options: {},
  id: 'events-parser',
  version: 'latest',
  extensions: ['json'],
  mimeTypes: ['application/json'],
  worker: false,
  parse: parse,
  parseSync: parse,
}

async function parse(arrayBuffer: ArrayBuffer) {
  const data = JSON.parse(new TextDecoder().decode(arrayBuffer))
  return parseEvents(data.entries)
}

export type VesselDeckLayersEventData = Partial<ApiEvent> & {
  type: EventTypes
  coordinates: [number, number]
  start: number
  end: number
}

export function parseEvents(events: ApiEvent[]): VesselDeckLayersEventData[] {
  return events?.map((event) => {
    const { position, start, end, type, ...attributes } = event
    return {
      ...attributes,
      type,
      coordinates: [event.position.lon, event.position.lat],
      start: DateTime.fromISO(start as string, { zone: 'utc' }).toMillis(),
      end: DateTime.fromISO(end as string, { zone: 'utc' }).toMillis(),
    }
  })
}