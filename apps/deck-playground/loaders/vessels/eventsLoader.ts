import { LoaderWithParser } from '@loaders.gl/loader-utils'

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

function parseEvents(events) {
  const shapeIndex = {
    port_visit: 0,
    encounter: 1,
    fishing: 2,
  }
  return events?.map((event) => {
    const { position, start, end, type, ...attributes } = event
    return {
      ...attributes,
      type,
      coordinates: [event.position.lon, event.position.lat],
      start: new Date(start).getTime(),
      endTime: new Date(end).getTime(),
      shapeIndex: shapeIndex[type] || 0,
    }
  })
}
