import { load } from '@loaders.gl/core'
import { CSVLoader } from '@loaders.gl/csv'
import { JSONLoader } from '@loaders.gl/json'
import { csvToTrackSegments, segmentsToGeoJSON } from '@globalfishingwatch/data-transforms'

export function getDatasetParsed(file: File) {
  const isZip =
    file.type === 'application/zip' ||
    file.type === 'application/x-zip-compressed' ||
    file.type === 'application/octet-stream' ||
    file.type === 'multipart/x-zip'
  const isCSV = file.name.includes('.csv')
  if (isZip) {
    console.log('TODO: handle shpfile with sphjs library')
  } else if (isCSV) {
    return load(file, CSVLoader)
  }
  return load(file, JSONLoader)
}

type ParseTrackOptions = {
  latField?: string
  lonField?: string
  timeField?: string
  segmentIdField?: string
}
const parseTrack = (data: any, options: ParseTrackOptions) => {
  const { latField, lonField, timeField, segmentIdField } = options
  const segments = csvToTrackSegments({
    records: data,
    latitude: latField as string,
    longitude: lonField as string,
    timestamp: timeField as string,
    id: segmentIdField as string,
  })
  const geoJSON = segmentsToGeoJSON(segments)
  return geoJSON
}
