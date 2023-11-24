import { load } from '@loaders.gl/core'
import { JSONLoader } from '@loaders.gl/json'
import { CSVLoader } from '@loaders.gl/csv'
import { GeojsonSchemaLoader } from '@globalfishingwatch/loaders'
import { Dataset } from '@globalfishingwatch/api-types'

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

export function getDatasetSchema(geojson: any): Promise<Dataset['schema']> {
  return load(geojson, GeojsonSchemaLoader)
}
