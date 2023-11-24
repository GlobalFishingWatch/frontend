import { load } from '@loaders.gl/core'
import { JSONLoader } from '@loaders.gl/json'
import { CSVLoader } from '@loaders.gl/csv'
import { GeojsonSchemaLoader } from '@globalfishingwatch/loaders'

export function getDatasetParse(file: File) {
  const isZip =
    file.type === 'application/zip' ||
    file.type === 'application/x-zip-compressed' ||
    file.type === 'application/octet-stream' ||
    file.type === 'multipart/x-zip'
  const isCSV = file.name.includes('.csv')
  debugger
  if (isZip) {
    console.log('TODO: handle shpfile with sphjs library')
  } else if (isCSV) {
    return load(file, CSVLoader)
  }
  return load(file, JSONLoader)
}

export function getDatasetSchema(geojson: any) {
  return load(geojson, GeojsonSchemaLoader)
}
