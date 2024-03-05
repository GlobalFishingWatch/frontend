import { parse } from 'papaparse'
import { Feature, FeatureCollection } from 'geojson'
import {
  pointsListToGeojson,
  pointsGeojsonToNormalizedGeojson,
  listToTrackSegments,
  segmentsToGeoJSON,
  kmlToGeoJSON,
  shpToGeoJSON,
} from '@globalfishingwatch/data-transforms'
import {
  DatasetGeometryToGeoJSONGeometry,
  DatasetGeometryType,
} from '@globalfishingwatch/api-types'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import { LineColorBarOptions } from '@globalfishingwatch/ui-components'
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
  try {
    if (fileType === 'Shapefile') {
      const fileData = await readBlobAs(file, 'arrayBuffer')
      return shpToGeoJSON(fileData, type)
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
    return validatedGeoJSON(fileText, type)
  } catch (e: any) {
    if (e.message === NOT_VALID_GEOJSON_FEATURES_ERROR) {
      throw new Error('datasetUpload.errors.geoJSON.noValidFeatures')
    }
    throw new Error('datasetUpload.errors.default')
  }
}

const NOT_VALID_GEOJSON_FEATURES_ERROR = 'Not valid geojson features'
export const validatedGeoJSON = (fileText: string, type: DatasetGeometryType) => {
  const normalizedTypes: Partial<DatasetGeometryToGeoJSONGeometry> = {
    points: ['Point'],
    tracks: ['LineString'],
    polygons: ['Polygon'],
  }
  const geoJSON = JSON.parse(fileText)
  const validFeatures = geoJSON.features.filter((feature: Feature) => {
    return normalizedTypes[type]?.includes(feature.geometry.type)
  })
  if (!validFeatures.length) {
    throw new Error(NOT_VALID_GEOJSON_FEATURES_ERROR)
  }
  return {
    ...geoJSON,
    features: validFeatures,
  }
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
    lineColorBarOptions: LineColorBarOptions,
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
    schema: dataset.schema,
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
