import { LoaderWithParser } from '@loaders.gl/loader-utils'
import { MVTLoader } from '@loaders.gl/mvt'
import { load } from '@loaders.gl/core'

export const mvtloader: LoaderWithParser = {
  name: 'Events',
  module: 'events',
  options: {},
  id: 'events-parser',
  version: 'latest',
  extensions: ['mvt'],
  mimeTypes: ['application/vnd.mapbox-vector-tile'],
  worker: false,
  parse: parse,
  parseSync: parse,
}

async function parse(arrayBuffer: ArrayBuffer) {
  const data = await load(arrayBuffer, MVTLoader)
  const parsed = data.length
    ? data.map((f) => ({
        ...f,
        value: f.properties?.value,
        id: f.properties?.gfw_id,
        properties: { ...f.properties, id: f.properties?.gfw_id },
      }))
    : []
  console.log('🚀 ~ file: contextLoader.ts:20 ~ parse ~ data', parsed)
  return parsed
}
