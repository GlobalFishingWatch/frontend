import { flatten } from '@turf/flatten'
import union from '@turf/union'
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  GeometryCollection,
  Point,
  Polygon,
} from 'geojson'

import type {
  Dataset,
  DatasetConfiguration,
  DatasetGeometryType,
} from '@globalfishingwatch/api-types'
import { DatasetCategory, DatasetTypes } from '@globalfishingwatch/api-types'
import {
  cleanProperties,
  getDatasetConfigurationClean,
  getDatasetSchema,
  getDatasetSchemaClean,
  getSchemaIdClean,
  getUTCDate,
  guessColumnsFromSchema,
} from '@globalfishingwatch/data-transforms'
import type { DatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'

import type { AreaGeometry } from 'features/areas/areas.slice'
import { isPrivateDataset } from 'features/datasets/datasets.utils'
import type { DatasetMetadata } from 'features/datasets/upload/NewDataset'
import { getUTCDateTime } from 'utils/dates'
import type { FileType } from 'utils/files'

type ExtractMetadataProps = { name: string; sourceFormat?: FileType; data: any }

export const getMetadataFromDataset = (dataset: Dataset): DatasetMetadata => {
  return {
    id: dataset.id,
    name: dataset.name,
    public: !isPrivateDataset(dataset),
    description: dataset.description,
    type: dataset.type,
    schema: dataset.schema,
    category: dataset.category,
    configuration: dataset.configuration,
    fieldsAllowed: dataset.fieldsAllowed,
  }
}

const getBaseDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
  const schema = getDatasetSchema(data, { includeEnum: true })
  return {
    name,
    public: true,
    category: DatasetCategory.Context,
    type: DatasetTypes.UserContext,
    schema,
    configuration: {
      configurationUI: {
        sourceFormat,
      },
    } as DatasetConfiguration,
  } as Partial<Dataset>
}

export const getTracksDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
  const baseMetadata = getBaseDatasetMetadata({ name, data, sourceFormat })
  const guessedColumns = guessColumnsFromSchema(baseMetadata.schema)
  return {
    ...baseMetadata,
    type: DatasetTypes.UserTracks,
    configuration: {
      configurationUI: {
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
  const guessedColumns = guessColumnsFromSchema(baseMetadata.schema)
  const isNotGeoStandard = data.type !== 'FeatureCollection'
  const baseConfig = baseMetadata?.configuration
  const baseConfigUI = baseMetadata?.configuration?.configurationUI
  return {
    ...baseMetadata,
    configuration: {
      ...(baseConfig && baseConfig),
      format: 'geojson',
      configurationUI: {
        ...(baseConfigUI && baseConfigUI),
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
  const guessedColumns = guessColumnsFromSchema(baseMetadata.schema)
  const baseConfig = baseMetadata?.configuration
  const baseConfigUI = baseMetadata?.configuration?.configurationUI
  const timestampGuessedValid =
    guessedColumns.timestamp &&
    data?.features?.some((f: any) => {
      const value = f.properties?.[guessedColumns.timestamp]
      return getUTCDate(value)?.toString() !== 'Invalid Date'
    })
  return {
    ...baseMetadata,
    configuration: {
      ...(baseConfig && baseConfig),
      format: 'geojson',
      configurationUI: {
        ...(baseConfigUI && baseConfigUI),
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
    subcategory: 'info',
    schema: getDatasetSchemaClean(datasetMetadata.schema),
    configuration: getDatasetConfigurationClean(datasetMetadata.configuration),
    fieldsAllowed:
      datasetMetadata.fieldsAllowed?.map((field) => getSchemaIdClean(field) as string) || [],
  }
  const timestampProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'startTime',
  })
  const timestampSchema = datasetMetadata.schema?.[timestampProperty]
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

export const parseGeoJsonProperties = <T extends Polygon | Point>(
  geojson: FeatureCollection<T, GeoJsonProperties>,
  datasetMetadata: DatasetMetadata
): FeatureCollection<T, GeoJsonProperties> => {
  return {
    ...geojson,
    features: geojson.features.map((feature) => {
      const cleanedProperties = cleanProperties(feature.properties, datasetMetadata.schema)
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
      const properties = getDatasetSchemaClean(cleanedProperties)
      return {
        ...feature,
        properties,
        geometry:
          (feature.geometry as unknown as GeometryCollection).type === 'GeometryCollection'
            ? (union(flatten(feature.geometry))?.geometry as AreaGeometry)
            : (feature.geometry as AreaGeometry),
      }
    }) as Feature<T, GeoJsonProperties>[],
  }
}
