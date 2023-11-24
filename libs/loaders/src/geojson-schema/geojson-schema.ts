import { LoaderWithParser } from '@loaders.gl/loader-utils'
import { Dataset, DatasetSchemaItem } from '@globalfishingwatch/api-types'

export const GeojsonSchemaLoader: LoaderWithParser = {
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
  return getDatasetSchemaFromGeojson(data)
}

export const getDatasetSchemaFromGeojson = (data: Record<string, any>[]) => {
  const fields = Object.keys(data[0])
  return fields.reduce((acc: Dataset['schema'], field: string): Dataset['schema'] => {
    return {
      ...acc,
      [field]: {
        type: typeof data[0][field],
        // TODO
        // enum:
        //   typeof geojson.features[0].properties[field] === 'string'
        //     ? uniq(geojson.features.map((f: any) => f.properties[field]))
        //     : [],
      } as DatasetSchemaItem,
    }
  }, {})
}
