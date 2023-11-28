import { load } from '@loaders.gl/core'
import { CSVLoader } from '@loaders.gl/csv'
import { JSONLoader } from '@loaders.gl/json'
import type { FeatureCollection, Feature, Point } from 'geojson'
import { t } from 'i18next'
import { parse } from 'papaparse'
import { listToTrackSegments, segmentsToGeoJSON } from '@globalfishingwatch/data-transforms'
import { DatasetMetadata } from 'features/datasets/upload/NewDataset'
import { getDatasetConfigurationProperty } from 'features/datasets/upload/datasets-upload.utils'
import { FileType, readBlobAs } from 'utils/files'
// interface FeatureCollectionWithMetadata extends FeatureCollectionWithFilename {
//   extensions?: string[]
// }

export function getFileType(file: File): FileType {
  const isZip =
    file.type === 'application/zip' ||
    file.type === 'application/x-zip-compressed' ||
    file.type === 'application/octet-stream' ||
    file.type === 'multipart/x-zip'
  const isCSV = file.name.includes('.csv')
  if (isZip) return 'shapefile'
  if (isCSV) return 'csv'
  return 'geojson'
}

export async function getDatasetParsed(file: File) {
  const fileType: FileType = getFileType(file)
  if (fileType === 'shapefile') {
    try {
      const shpjs = await import('shpjs').then((module) => module.default)

      const fileData = await readBlobAs(file, 'arrayBuffer')
      // TODO support multiple files in shapefile
      const expandedShp = await shpjs(fileData)
      if (Array.isArray(expandedShp)) {
        // geojson = expandedShp[0]
        // return t(
        //   'errors.datasetShapefileMultiple',
        //   'Shapefiles containing multiple components (multiple file names) are not supported yet'
        // )
      } else {
        // if (
        //   expandedShp.extensions &&
        //   (!expandedShp.extensions.includes('.shp') ||
        //     !expandedShp.extensions.includes('.shx') ||
        //     !expandedShp.extensions.includes('.prj') ||
        //     !expandedShp.extensions.includes('.dbf'))
        // ) {
        //   return t(
        //     'errors.uploadShapefileComponents',
        //     'Error reading shapefile: must contain files with *.shp, *.shx, *.dbf and *.prj extensions.'
        //   )
        // } else {
        // }
        return expandedShp
      }
    } catch (e: any) {
      return t('errors.uploadShapefile', 'Error reading shapefile: {{error}}', { error: e })
    }
  } else if (fileType === 'csv') {
    // return load(file, CSVLoader)
    const fileText = await file.text()
    // TODO: CHECK IF CSV CONTAINS HEADERS ?
    const { data } = parse(fileText, {
      download: false,
      dynamicTyping: true,
      header: true,
    })
    return data.slice(1)
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

export const getFeatureCollectionFromPointsList = (
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
