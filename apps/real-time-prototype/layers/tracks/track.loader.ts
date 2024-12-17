import type { LoaderWithParser } from '@loaders.gl/loader-utils'

export const trackLoader: LoaderWithParser = {
  name: 'Events',
  module: 'events',
  options: {},
  id: 'tracks-parser',
  version: 'latest',
  extensions: ['json'],
  mimeTypes: ['application/json'],
  worker: false,
  parse: parse,
  parseSync: parse,
}

async function parse(arrayBuffer: ArrayBuffer) {
  const data = JSON.parse(new TextDecoder().decode(arrayBuffer))
  return parseEvents(data)
}

function parseEvents(data) {
  return [
    (data.features || []).map((f) => ({
      coordinates: f.geometry.coordinates,
      timestamp: f.properties.timestamp,
    })),
  ]
}
