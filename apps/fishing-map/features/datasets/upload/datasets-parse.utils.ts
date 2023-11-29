import { parse } from 'papaparse'
import { t } from 'i18next'
import {
  pointsListToGeojson,
  listToTrackSegments,
  segmentsToGeoJSON,
  kmlToGeoJSON,
} from '@globalfishingwatch/data-transforms'
import { DatasetGeometryType } from '@globalfishingwatch/api-types'
import { DatasetMetadata } from 'features/datasets/upload/NewDataset'
import { getDatasetConfigurationProperty } from 'features/datasets/upload/datasets-upload.utils'
import { FileType, getFileType, readBlobAs } from 'utils/files'
// interface FeatureCollectionWithMetadata extends FeatureCollectionWithFilename {
//   extensions?: string[]
// }

export async function getDatasetParsed(file: File, type?: DatasetGeometryType) {
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
  } else if (fileType === 'kml') {
    return await kmlToGeoJSON(file, type as DatasetGeometryType)
  }
  const fileText = await file.text()
  return JSON.parse(fileText)
}

export type DataList = Record<string, any>[]
export const getTrackFromList = (data: DataList, datasetMetadata: DatasetMetadata) => {
  const segments = listToTrackSegments({
    records: data,
    latitude: getDatasetConfigurationProperty({ datasetMetadata, property: 'latitude' }),
    longitude: getDatasetConfigurationProperty({ datasetMetadata, property: 'longitude' }),
    timestamp: getDatasetConfigurationProperty({ datasetMetadata, property: 'timestamp' }),
    id: getDatasetConfigurationProperty({ datasetMetadata, property: 'idProperty' }),
  })
  return segmentsToGeoJSON(segments)
}

export const getGeojsonFromPointsList = (
  data: Record<string, any>[],
  datasetMetadata: DatasetMetadata
) => {
  return pointsListToGeojson(data, {
    latitude: getDatasetConfigurationProperty({ datasetMetadata, property: 'latitude' }),
    longitude: getDatasetConfigurationProperty({ datasetMetadata, property: 'longitude' }),
    timestamp: getDatasetConfigurationProperty({ datasetMetadata, property: 'timestamp' }),
    id: getDatasetConfigurationProperty({ datasetMetadata, property: 'idProperty' }),
  })
}
