import { flatten } from '@turf/flatten'
import union from '@turf/union'
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  GeometryCollection,
  LineString,
  Point,
  Polygon,
} from 'geojson'

import type {
  Dataset,
  DatasetConfiguration,
  DatasetGeometryType,
} from '@globalfishingwatch/api-types'
import { DatasetCategory, DatasetSubCategory, DatasetTypes } from '@globalfishingwatch/api-types'
import {
  cleanProperties,
  getDatasetConfigurationClean,
  getDatasetFilters,
  getDatasetFiltersClean,
  getFilterIdClean,
  getUTCDate,
  guessColumnsFromFilters,
} from '@globalfishingwatch/data-transforms'
import type { DatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import {
  getDatasetConfiguration,
  getDatasetConfigurationProperty,
  getFlattenDatasetFilters,
} from '@globalfishingwatch/datasets-client'

import type { AreaGeometry } from 'features/areas/areas.slice'
import { isPrivateDataset } from 'features/datasets/datasets.utils'
import type { DatasetMetadata } from 'features/datasets/upload/NewDataset'
import { t } from 'features/i18n/i18n'
import { getUTCDateTime } from 'utils/dates'
import type { FileType } from 'utils/files'

export const MIN_NAME_LENGTH = 3

export function getDatasetMetadataValidations(datasetMetadata: DatasetMetadata) {
  const errors = {
    name:
      datasetMetadata.name && datasetMetadata.name.length < MIN_NAME_LENGTH
        ? t((t) => t.datasetUpload.errors.name, {
            min: MIN_NAME_LENGTH,
          })
        : null,
  }
  const isValid = Object.values(errors).every((error) => !error)
  return { isValid, errors }
}

type ExtractMetadataProps = { name: string; sourceFormat?: FileType; data: any }

export const getMetadataFromDataset = (dataset: Dataset): DatasetMetadata => {
  return {
    id: dataset.id,
    name: dataset.name,
    public: !isPrivateDataset(dataset),
    description: dataset.description,
    type: dataset.type,
    filters: dataset.filters,
    category: dataset.category,
    configuration: dataset.configuration,
  }
}

const getBaseDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
  const schema = getDatasetFilters(data, { includeEnum: true })
  return {
    name,
    public: true,
    category: DatasetCategory.Context,
    type: DatasetTypes.UserContext,
    schema,
    configuration: {
      frontend: {
        sourceFormat,
      },
    } as DatasetConfiguration,
  } as Partial<Dataset>
}

export const getTracksDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
  const baseMetadata = getBaseDatasetMetadata({ name, data, sourceFormat })
  const guessedColumns = guessColumnsFromFilters(baseMetadata.filters)
  return {
    ...baseMetadata,
    type: DatasetTypes.UserTracks,
    configuration: {
      frontend: {
        sourceFormat,
        latitude: guessedColumns.latitude,
        longitude: guessedColumns.longitude,
        timestamp: guessedColumns.timestamp,
        timeFilterType: guessedColumns.timestamp ? 'date' : null,
        startTime: guessedColumns.timestamp || null,
        geometryType: 'tracks' as DatasetGeometryType,
      },
    } as DatasetConfiguration,
  }
}

export const getPointsDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
  const baseMetadata = getBaseDatasetMetadata({ name, data, sourceFormat })
  const guessedColumns = guessColumnsFromFilters(baseMetadata.filters)
  const isNotGeoStandard = data.type !== 'FeatureCollection'
  const baseFrontendConfig = getDatasetConfiguration(baseMetadata)
  return {
    ...baseMetadata,
    configuration: {
      format: 'geojson',
      frontend: {
        ...(baseFrontendConfig && baseFrontendConfig),
        ...(isNotGeoStandard && { longitude: guessedColumns.longitude }),
        ...(isNotGeoStandard && { latitude: guessedColumns.latitude }),
        sourceFormat,
        timestamp: guessedColumns.timestamp,
        timeFilterType: guessedColumns.timestamp ? 'date' : null,
        startTime: guessedColumns.timestamp || null,
        geometryType: 'points' as DatasetGeometryType,
      },
    } as DatasetConfiguration,
  }
}

export const getPolygonsDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
  const baseMetadata = getBaseDatasetMetadata({ name, data, sourceFormat })
  const guessedColumns = guessColumnsFromFilters(baseMetadata.filters)
  const baseFrontendConfig = getDatasetConfiguration(baseMetadata)
  const timestampGuessedValid =
    guessedColumns.timestamp &&
    data?.features?.some((f: any) => {
      const value = f.properties?.[guessedColumns.timestamp]
      return getUTCDate(value)?.toString() !== 'Invalid Date'
    })
  return {
    ...baseMetadata,
    configuration: {
      format: 'geojson',
      frontend: {
        ...(baseFrontendConfig && baseFrontendConfig),
        sourceFormat,
        timeFilterType: timestampGuessedValid ? 'date' : null,
        timestamp: (timestampGuessedValid && guessedColumns.timestamp) || null,
        startTime: (timestampGuessedValid && guessedColumns.timestamp) || null,
        geometryType: 'polygons' as DatasetGeometryType,
      },
    } as DatasetConfiguration,
  }
}

export const getFinalDatasetFromMetadata = (datasetMetadata: DatasetMetadata) => {
  const baseDataset: Partial<Dataset> = {
    ...datasetMetadata,
    unit: 'TBD',
    subcategory: DatasetSubCategory.Info,
    filters: getDatasetFiltersClean(datasetMetadata.filters),
    configuration: getDatasetConfigurationClean(datasetMetadata.configuration),
  }
  const timestampProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'startTime',
  })
  const timestampSchema = getFlattenDatasetFilters(datasetMetadata.filters).find(
    (filter) => filter.id === timestampProperty
  )
  if (timestampSchema) {
    const startDate = getUTCDateTime(timestampSchema.enum?.[0] as string)?.toISO()
    if (startDate) {
      baseDataset.startDate = startDate
    }
    const endDate = getUTCDateTime(timestampSchema.enum?.[1] as string)?.toISO()
    if (endDate) {
      baseDataset.endDate = endDate
    }
  }
  return baseDataset
}

export const parseGeoJsonProperties = <T extends Polygon | Point | LineString>(
  geojson: FeatureCollection<T, GeoJsonProperties>,
  datasetMetadata: DatasetMetadata
): FeatureCollection<T, GeoJsonProperties> => {
  return {
    ...geojson,
    features: geojson.features.map((feature) => {
      const cleanedProperties = cleanProperties(feature.properties, datasetMetadata.filters)
      const propertiesToDateMillis: DatasetConfigurationProperty[] = [
        'timestamp',
        'startTime',
        'endTime',
      ]
      propertiesToDateMillis.forEach((property: DatasetConfigurationProperty) => {
        const propertyKey = getDatasetConfigurationProperty({
          dataset: { configuration: datasetMetadata.configuration } as Dataset,
          property,
        }) as string
        if (cleanedProperties[propertyKey]) {
          const value = cleanedProperties[propertyKey]
          cleanedProperties[propertyKey] = getUTCDateTime(value).toMillis()
        }
      })
      const properties = getDatasetFiltersClean(cleanedProperties)
      return {
        ...feature,
        properties,
        geometry:
          (feature.geometry as unknown as GeometryCollection)?.type === 'GeometryCollection'
            ? (union(flatten(feature.geometry))?.geometry as AreaGeometry)
            : (feature.geometry as AreaGeometry),
      }
    }) as Feature<T, GeoJsonProperties>[],
  }
}
