import { parse } from 'papaparse'
import { FeatureCollection } from 'geojson'
import {
  pointsListToGeojson,
  pointsGeojsonToNormalizedGeojson,
  listToTrackSegments,
  segmentsToGeoJSON,
  kmlToGeoJSON,
  shpToGeoJSON,
} from '@globalfishingwatch/data-transforms'
import { DatasetGeometryType } from '@globalfishingwatch/api-types'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import { DatasetMetadata } from 'features/datasets/upload/NewDataset'
import { getFileType, readBlobAs } from 'utils/files'

// interface FeatureCollectionWithMetadata extends FeatureCollectionWithFilename {
//   extensions?: string[]
// }

export type DataList = Record<string, any>[]
export type DataParsed = FeatureCollection | DataList

export async function getDatasetParsed(file: File, type: DatasetGeometryType): Promise<DataParsed> {
  const fileType = getFileType(file)
  if (!fileType) {
    throw new Error('File type not supported')
  }
  if (fileType === 'Shapefile') {
    try {
      const fileData = await readBlobAs(file, 'arrayBuffer')
      return shpToGeoJSON(fileData, type)
    } catch (e: any) {
      throw new Error(e)
    }
  } else if (fileType === 'CSV') {
    const fileText = await file.text()
    // TODO: CHECK IF CSV CONTAINS HEADERS ?
    const { data } = parse(fileText, {
      download: false,
      dynamicTyping: true,
      header: true,
    })
    return data.slice(1) as DataList
  } else if (fileType === 'KML') {
    return kmlToGeoJSON(file, type)
  }
  const fileText = await file.text()
  return JSON.parse(fileText)
}

export const getTrackFromList = (data: DataList, dataset: DatasetMetadata) => {
  const segments = listToTrackSegments({
    records: data,
    latitude: getDatasetConfigurationProperty({ dataset, property: 'latitude' }),
    longitude: getDatasetConfigurationProperty({ dataset, property: 'longitude' }),
    startTime: getDatasetConfigurationProperty({ dataset, property: 'startTime' }),
    endTime: getDatasetConfigurationProperty({ dataset, property: 'endTime' }),
    segmentId: getDatasetConfigurationProperty({ dataset, property: 'segmentId' }),
    lineId: getDatasetConfigurationProperty({ dataset, property: 'lineId' }),
  })
  return segmentsToGeoJSON(segments)
}

export const getGeojsonFromPointsList = (data: Record<string, any>[], dataset: DatasetMetadata) => {
  return pointsListToGeojson(data, {
    latitude: getDatasetConfigurationProperty({ dataset, property: 'latitude' }),
    longitude: getDatasetConfigurationProperty({ dataset, property: 'longitude' }),
    startTime: getDatasetConfigurationProperty({ dataset, property: 'startTime' }),
    endTime: getDatasetConfigurationProperty({ dataset, property: 'endTime' }),
    id: getDatasetConfigurationProperty({ dataset, property: 'idProperty' }),
  })
}

export const getNormalizedGeojsonFromPointsGeojson = (
  data: FeatureCollection,
  dataset: DatasetMetadata
) => {
  return pointsGeojsonToNormalizedGeojson(data, {
    startTime: getDatasetConfigurationProperty({ dataset, property: 'startTime' }),
    endTime: getDatasetConfigurationProperty({ dataset, property: 'endTime' }),
  })
}
