import { load } from '@loaders.gl/core'
import { CSVLoader } from '@loaders.gl/csv'
import { JSONLoader } from '@loaders.gl/json'
import type { FeatureCollection, Feature, Point } from 'geojson'
import { listToTrackSegments, segmentsToGeoJSON } from '@globalfishingwatch/data-transforms'
import { DatasetMetadata } from 'features/datasets/upload/NewDataset'
import { getDatasetConfigurationProperty } from 'features/datasets/upload/datasets-upload.utils'

export function getDatasetParsed(file: File) {
  console.log('🚀 ~ file: datasets-parse.utils.ts:10 ~ getDatasetParsed ~ file:', file)
  const isZip =
    file.type === 'application/zip' ||
    file.type === 'application/x-zip-compressed' ||
    file.type === 'application/octet-stream' ||
    file.type === 'multipart/x-zip'
  const isCSV = file.name.includes('.csv') || file.name.includes('.xlsx')
  if (isZip) {
    console.log('TODO: handle shpfile with sphjs library')
  } else if (isCSV) {
    return load(file, CSVLoader)
  }
  return load(file, JSONLoader)
}

export const getTrackFromList = (data: Record<string, any>[], datasetMetadata: DatasetMetadata) => {
  const segments = listToTrackSegments({
    records: data,
    latitude: getDatasetConfigurationProperty({ datasetMetadata, property: 'latitude' }),
    longitude: getDatasetConfigurationProperty({ datasetMetadata, property: 'longitude' }),
    timestamp: getDatasetConfigurationProperty({ datasetMetadata, property: 'timestamp' }),
    id: getDatasetConfigurationProperty({ datasetMetadata, property: 'idProperty' }),
  })
  return segmentsToGeoJSON(segments)
}

export const getPointsFromList = (
  data: Record<string, any>[],
  datasetMetadata: DatasetMetadata
) => {
  const latitude = getDatasetConfigurationProperty({ datasetMetadata, property: 'latitude' })
  const longitude = getDatasetConfigurationProperty({ datasetMetadata, property: 'longitude' })
  const timestamp = getDatasetConfigurationProperty({ datasetMetadata, property: 'timestamp' })
  const id = getDatasetConfigurationProperty({ datasetMetadata, property: 'idProperty' })
  const features: Feature<Point>[] = data.map((point) => ({
    type: 'Feature',
    properties: {
      timestamp: timestamp && point[timestamp],
      id: id && point[id],
      ...point,
    },
    geometry: {
      type: 'Point',
      coordinates: [point[latitude] as number, point[longitude] as number],
    },
  }))
  return {
    type: 'FeatureCollection',
    features,
  } as FeatureCollection
}
