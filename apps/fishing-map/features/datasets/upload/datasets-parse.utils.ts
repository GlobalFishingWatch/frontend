import { lineToPolygon } from '@turf/line-to-polygon'
import type { Feature, FeatureCollection, Position } from 'geojson'
import { parse } from 'papaparse'

import type {
  DatasetGeometryToGeoJSONGeometry,
  DatasetGeometryType,
} from '@globalfishingwatch/api-types'
import {
  isZipFile,
  kmlToGeoJSON,
  listToTrackSegments,
  pointsGeojsonToNormalizedGeojson,
  pointsListToGeojson,
  segmentsToGeoJSON,
  shpToGeoJSON,
  zipToFiles,
} from '@globalfishingwatch/data-transforms'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import { LineColorBarOptions } from '@globalfishingwatch/ui-components'

import type { DatasetMetadata } from 'features/datasets/upload/NewDataset'
import type { DatasetGeometryTypesSupported } from 'utils/files'
import { getFileType, readBlobAs } from 'utils/files'

// interface FeatureCollectionWithMetadata extends FeatureCollectionWithFilename {
//   extensions?: string[]
// }

export type DataList = Record<string, any>[]
export type DataParsed = FeatureCollection | DataList

export async function getDatasetParsed(
  file: File,
  type: DatasetGeometryTypesSupported
): Promise<DataParsed> {
  const fileType = getFileType(file, type)
  if (!fileType) {
    throw new Error('File type not supported')
  }
  try {
    if (fileType === 'Shapefile') {
      const fileData = await readBlobAs(file, 'arrayBuffer')
      return shpToGeoJSON(fileData, type)
    } else if (fileType === 'CSV') {
      let fileText: string | undefined
      try {
        if (isZipFile(file)) {
          const files = await zipToFiles(file, /\.csv$/)
          const csvFile = files?.find((f) => f.name.endsWith('.csv'))
          if (!csvFile) {
            throw new Error('No .csv found in .zip file')
          }
          fileText = await csvFile.async('string')
        } else {
          fileText = await file.text()
        }
      } catch (e) {
        throw new Error('datasetUpload.errors.csv.invalidData')
      }
      if (!fileText) {
        throw new Error('datasetUpload.errors.csv.invalidData')
      }
      const { data } = parse(fileText, {
        download: false,
        dynamicTyping: true,
        header: true,
      })
      return data as DataList
    } else if (fileType === 'KML') {
      const geoJson = await kmlToGeoJSON(file, type)
      return validateFeatures(geoJson, type)
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

const validateFeatures = (geoJSON: any, type: DatasetGeometryType) => {
  const normalizedTypes: Partial<DatasetGeometryToGeoJSONGeometry> = {
    points: ['Point', 'MultiPoint'],
    tracks: ['LineString', 'MultiLineString'],
    polygons: ['Polygon', 'MultiPolygon'],
  }
  const validFeatures = geoJSON.features
    .map((feature: Feature) => {
      if (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString') {
        let firstCoord: Position
        let lastCoord: Position
        if (feature.geometry.type === 'LineString') {
          const coords = feature.geometry.coordinates
          firstCoord = coords[0]
          lastCoord = coords[coords.length - 1]
        } else {
          const coords = feature.geometry.coordinates
          firstCoord = coords[0][0]
          lastCoord = coords[coords.length - 1][coords[coords.length - 1].length - 1]
        }
        if (
          type === 'polygons' &&
          firstCoord &&
          lastCoord &&
          firstCoord[0] === lastCoord[0] &&
          firstCoord[1] === lastCoord[1]
        ) {
          const polygon = lineToPolygon(feature.geometry, {
            properties: feature.properties,
          })
          return polygon
        }
      }
      return feature
    })
    .filter((feature: Feature) => {
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

const NOT_VALID_GEOJSON_FEATURES_ERROR = 'Not valid geojson features'
const validatedGeoJSON = (fileText: string, type: DatasetGeometryType) => {
  const geoJSON = JSON.parse(fileText)
  return validateFeatures(geoJSON, type)
}

export const getTrackFromList = (data: DataList, dataset: DatasetMetadata) => {
  const timeFilterType = getDatasetConfigurationProperty({ dataset, property: 'timeFilterType' })
  const segments = listToTrackSegments({
    records: data,
    latitude: getDatasetConfigurationProperty({ dataset, property: 'latitude' }),
    longitude: getDatasetConfigurationProperty({ dataset, property: 'longitude' }),
    startTime: timeFilterType
      ? getDatasetConfigurationProperty({ dataset, property: 'startTime' })
      : undefined,
    segmentId: getDatasetConfigurationProperty({ dataset, property: 'segmentId' }),
    lineId: getDatasetConfigurationProperty({ dataset, property: 'lineId' }),
    lineColorBarOptions: LineColorBarOptions,
  })
  const geojson = segmentsToGeoJSON(segments.segments, segments.metadata)
  return geojson
}

export const getGeojsonFromPointsList = (data: Record<string, any>[], dataset: DatasetMetadata) => {
  const timeFilterType = getDatasetConfigurationProperty({ dataset, property: 'timeFilterType' })
  return pointsListToGeojson(data, {
    latitude: getDatasetConfigurationProperty({ dataset, property: 'latitude' }),
    longitude: getDatasetConfigurationProperty({ dataset, property: 'longitude' }),
    startTime: timeFilterType
      ? getDatasetConfigurationProperty({ dataset, property: 'startTime' })
      : undefined,
    endTime: timeFilterType
      ? getDatasetConfigurationProperty({ dataset, property: 'endTime' })
      : undefined,
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
