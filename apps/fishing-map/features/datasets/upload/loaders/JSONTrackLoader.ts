import { LoaderOptions, LoaderWithParser } from '@loaders.gl/loader-utils'
import { csvToTrackSegments, segmentsToGeoJSON } from '@globalfishingwatch/data-transforms'

export const JSONTrackLoader: LoaderWithParser = {
  name: 'Tracks',
  module: 'tracks',
  options: {},
  id: 'JSONTrackLoader',
  version: 'latest',
  extensions: [],
  mimeTypes: ['application/json'],
  worker: false,
  parse: async (arrayBuffer, options) => parseTrack(arrayBuffer, options as LoaderOptions),
}

const parseTrack = (arrayBuffer: ArrayBuffer, options: LoaderOptions) => {
  const fileStr = new TextDecoder().decode(arrayBuffer)
  const fileData = JSON.parse(fileStr)
  const { latField, lonField, timeField, segmentIdField } = options
  const segments = csvToTrackSegments({
    records: fileData,
    latitude: latField as string,
    longitude: lonField as string,
    timestamp: timeField as string,
    id: segmentIdField as string,
  })
  const geoJSON = segmentsToGeoJSON(segments)
  return geoJSON
}
