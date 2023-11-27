import { load } from '@loaders.gl/core'
import { CSVLoader } from '@loaders.gl/csv'
import { JSONLoader } from '@loaders.gl/json'
import { listToTrackSegments, segmentsToGeoJSON } from '@globalfishingwatch/data-transforms'
import { DatasetMetadata } from 'features/datasets/upload/NewDataset'
import { getDatasetConfigurationProperty } from 'features/datasets/upload/datasets-upload.utils'

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

export const getTrackFromList = (data: any, datasetMetadata: DatasetMetadata) => {
  const segments = listToTrackSegments({
    records: data,
    latitude: getDatasetConfigurationProperty({ datasetMetadata, property: 'latitude' }),
    longitude: getDatasetConfigurationProperty({ datasetMetadata, property: 'longitude' }),
    timestamp: getDatasetConfigurationProperty({ datasetMetadata, property: 'timestamp' }),
    id: getDatasetConfigurationProperty({ datasetMetadata, property: 'idProperty' }),
  })
  return segmentsToGeoJSON(segments)
}
