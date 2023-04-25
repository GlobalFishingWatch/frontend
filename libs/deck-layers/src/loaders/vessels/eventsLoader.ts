import { LoaderWithParser } from '@loaders.gl/loader-utils'
import { ApiEvent, EventTypes } from '@globalfishingwatch/api-types'
import { START_TIMESTAMP } from '../constants'

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

function parseEvents(events: ApiEvent[]) {
  const shapeIndex: { [key in EventTypes]: number } = {
    port_visit: 0,
    encounter: 1,
    fishing: 2,
    gap: 3,
    loitering: 4,
  }

  return events?.map((event) => {
    const { position, start, end, type, ...attributes } = event
    return {
      ...attributes,
      type,
      coordinates: [event.position.lon, event.position.lat],
      start: Math.fround(new Date(start).getTime() - START_TIMESTAMP),
      endTime: Math.fround(new Date(end).getTime() - START_TIMESTAMP),
      shapeIndex: shapeIndex[type] || 0,
    }
  })
}
