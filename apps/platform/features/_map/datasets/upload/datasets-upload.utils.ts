import { flatten } from '@turf/turf'
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
  DatasetFilters,
  DatasetGeometryType,
} from '@globalfishingwatch/api-types'
import {
  DatasetCategory,
  DatasetSubCategory,
  DatasetTypes,
  USER_FOURWINGS_VALUE_COLUMN,
} from '@globalfishingwatch/api-types'
import type { Bbox, PolygonGeomCoords } from '@globalfishingwatch/data-transforms'
import {
  cleanProperties,
  getDatasetConfigurationClean,
  getDatasetFilters,
  getDatasetFiltersClean,
  getFilterIdClean,
  getPolygonsUnion,
  getUTCDate,
  guessColumnsFromFilters,
} from '@globalfishingwatch/data-transforms'
import {
  getGriddedMaxZoom,
  getGriddedTileEncoding,
} from '@globalfishingwatch/data-transforms/files'
import type { DatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import {
  getDatasetConfiguration,
  getDatasetConfigurationProperty,
  getFlattenDatasetFilters,
} from '@globalfishingwatch/datasets-client'

import { isPrivateDataset } from 'features/_map/datasets/datasets.utils'
import type { DatasetMetadata } from 'features/_map/datasets/upload/NewDataset'
import type { AreaGeometry } from 'features/data/areas/areas.slice'
import { t } from 'features/i18n/i18n'
import { getUTCDateTime } from 'utils/dates'
import type { FileType } from 'utils/files'

export const MIN_NAME_LENGTH = 3

export const GRIDDED_RESERVED_COLUMNS = ['lat', 'lon', USER_FOURWINGS_VALUE_COLUMN, 'band']

export const getReservedBandName = (bandNames?: (string | number | boolean)[]) =>
  bandNames?.find((band) => GRIDDED_RESERVED_COLUMNS.includes(String(band).trim().toLowerCase()))

export function getDatasetMetadataValidations(datasetMetadata: DatasetMetadata) {
  const reservedBandName = getReservedBandName(datasetMetadata.filters?.fourwings?.[0]?.enum)
  const errors = {
    name:
      datasetMetadata.name && datasetMetadata.name.length < MIN_NAME_LENGTH
        ? t((t) => t.datasetUpload.errors.name, {
            min: String(MIN_NAME_LENGTH),
          })
        : null,
    bands: reservedBandName
      ? t((t) => t.datasetUpload.errors.reservedBandName, {
          band: String(reservedBandName),
          reserved: GRIDDED_RESERVED_COLUMNS.join(', '),
        })
      : null,
  }
  const isValid = Object.values(errors).every((error) => !error)
  return { isValid, errors }
}

type ExtractMetadataProps = {
  name: string
  sourceFormat?: FileType
  data: any
}

export const getMetadataFromDataset = (dataset: Dataset): DatasetMetadata => {
  return {
    id: dataset.id,
    name: dataset.name,
    public: !isPrivateDataset(dataset),
    // description: dataset.description,
    type: dataset.type,
    filters: dataset.filters,
    category: dataset.category,
    configuration: dataset.configuration,
  }
}

const getBaseDatasetMetadata = ({
  name,
  data,
  sourceFormat,
}: ExtractMetadataProps): Partial<Dataset> & { public: boolean } => {
  const userContextLayers = getDatasetFilters(data, { includeEnum: true })
  return {
    name,
    public: true,
    category: DatasetCategory.Context,
    type: DatasetTypes.UserContext,
    filters: { userContextLayers },
    configuration: {
      frontend: {
        sourceFormat,
      },
    } as DatasetConfiguration,
  }
}

export const getTracksDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
  const baseMetadata = getBaseDatasetMetadata({ name, data, sourceFormat })
  const guessedColumns = guessColumnsFromFilters(baseMetadata.filters)
  const configuration: DatasetConfiguration = {
    frontend: {
      sourceFormat,
      latitude: guessedColumns.latitude || undefined,
      longitude: guessedColumns.longitude || undefined,
      timestamp: guessedColumns.timestamp || undefined,
      timeFilterType: guessedColumns.timestamp ? 'date' : undefined,
      startTime: guessedColumns.timestamp || undefined,
      geometryType: 'tracks' as DatasetGeometryType,
    },
  }
  return {
    ...baseMetadata,
    type: DatasetTypes.UserTracks,
    configuration,
  }
}

export const getPointsDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
  const baseMetadata = getBaseDatasetMetadata({ name, data, sourceFormat })
  const guessedColumns = guessColumnsFromFilters(baseMetadata.filters)
  const isNotGeoStandard = data.type !== 'FeatureCollection'
  const baseFrontendConfig = getDatasetConfiguration(baseMetadata)
  const configuration: DatasetConfiguration = {
    ...(baseMetadata.type === DatasetTypes.UserContext && {
      userContextLayerV1: {
        format: 'GEOJSON',
      },
    }),
    frontend: {
      ...(baseFrontendConfig && baseFrontendConfig),
      ...(isNotGeoStandard && { longitude: guessedColumns.longitude || undefined }),
      ...(isNotGeoStandard && { latitude: guessedColumns.latitude || undefined }),
      sourceFormat,
      timestamp: guessedColumns.timestamp as string,
      timeFilterType: guessedColumns.timestamp ? 'date' : undefined,
      startTime: guessedColumns.timestamp as string,
      geometryType: 'points' as DatasetGeometryType,
    },
  }
  return {
    ...baseMetadata,
    configuration,
  }
}

export const GRIDDED_BAND_FILTER_ID = 'band'

export const getGriddedBandFilters = (bandNames: string[]): DatasetFilters => ({
  fourwings: [
    {
      id: GRIDDED_BAND_FILTER_ID,
      label: GRIDDED_BAND_FILTER_ID,
      type: 'string',
      enum: bandNames,
    },
  ],
})

export const getGriddedDatasetMetadata = ({
  name,
  bands,
  resolution,
  stats,
  bbox,
}: {
  name: string
  bands: string[]
  resolution?: number
  stats?: { min: number; max: number }
  bbox?: Bbox
}): DatasetMetadata => {
  return {
    name,
    public: true,
    category: DatasetCategory.Activity,
    type: DatasetTypes.UserFourwings,
    filters: getGriddedBandFilters(bands),
    configuration: {
      userFourwingsV1: {
        agregationMode: 'AVG',
        agregationColumn: USER_FOURWINGS_VALUE_COLUMN,
        latColumn: 'lat',
        lonColumn: 'lon',
        maxZoom: getGriddedMaxZoom(resolution),
        ...(bbox?.every(Number.isFinite) && { bbox }),
        ...getGriddedTileEncoding(stats),
      },
      frontend: {
        sourceFormat: 'GeoTIFF',
        geometryType: 'gridded',
      },
    },
  }
}

export const getPolygonsDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
  const baseMetadata = getBaseDatasetMetadata({ name, data, sourceFormat })
  const guessedColumns = guessColumnsFromFilters(baseMetadata.filters)
  const baseFrontendConfig = getDatasetConfiguration(baseMetadata)
  const timestampGuessedValid =
    guessedColumns.timestamp &&
    data?.features?.some((f: any) => {
      const value = f.properties?.[guessedColumns.timestamp as string]
      return getUTCDate(value)?.toString() !== 'Invalid Date'
    })
  const configuration: DatasetConfiguration = {
    ...(baseMetadata.type === DatasetTypes.UserContext && {
      userContextLayerV1: {
        format: 'GEOJSON',
      },
    }),
    frontend: {
      ...(baseFrontendConfig && baseFrontendConfig),
      sourceFormat,
      timeFilterType: timestampGuessedValid ? 'date' : undefined,
      timestamp: (timestampGuessedValid && guessedColumns.timestamp) || null,
      startTime: (timestampGuessedValid && guessedColumns.timestamp) || null,
      geometryType: 'polygons' as DatasetGeometryType,
    },
  }
  return {
    ...baseMetadata,
    configuration,
  }
}

export const getFinalDatasetFromMetadata = (datasetMetadata: DatasetMetadata) => {
  const { userContextLayers, ...otherFilters } = datasetMetadata.filters ?? {}
  const userContextLayersClean = getDatasetFiltersClean(userContextLayers)
  const baseDataset: Partial<Dataset> = {
    ...datasetMetadata,
    unit: 'TBD',
    subcategory: DatasetSubCategory.Info,
    filters: {
      ...otherFilters,
      ...(userContextLayersClean.length > 0 && { userContextLayers: userContextLayersClean }),
    },
    configuration: getDatasetConfigurationClean(datasetMetadata.configuration),
  }
  const timestampProperty = getDatasetConfigurationProperty({
    dataset: datasetMetadata,
    property: 'startTime',
  })
  const timestampFilter = getFlattenDatasetFilters(datasetMetadata.filters).find(
    (filter) => filter.id === timestampProperty
  )
  if (timestampFilter) {
    const startDate = getUTCDateTime(timestampFilter.enum?.[0] as string)?.toISO()
    if (startDate) {
      baseDataset.startDate = startDate
    }
    const endDate = getUTCDateTime(timestampFilter.enum?.[1] as string)?.toISO()
    if (endDate) {
      baseDataset.endDate = endDate
    }
  }
  return baseDataset
}

export const getPropertiesIdClean = (properties?: Record<string, any>) => {
  if (!properties || Object.keys(properties).length === 0) {
    return {}
  }
  return Object.entries(properties).reduce(
    (acc, value) => {
      const cleanKey = getFilterIdClean(value[0]) as string
      return { ...acc, [cleanKey]: value[1] }
    },
    {} as Record<string, any>
  )
}
export const parseGeoJsonProperties = <T extends Polygon | Point | LineString>(
  geojson: FeatureCollection<T, GeoJsonProperties>,
  datasetMetadata: DatasetMetadata
): FeatureCollection<T, GeoJsonProperties> => {
  return {
    ...geojson,
    features: (geojson.features ?? []).map((feature) => {
      const cleanedProperties = cleanProperties(feature.properties, datasetMetadata.filters)
      const propertiesToDateMillis = (
        ['timestamp', 'startTime', 'endTime'] as DatasetConfigurationProperty[]
      ).flatMap((property) => {
        const propertyKey = getDatasetConfigurationProperty({
          dataset: { configuration: datasetMetadata.configuration } as Dataset,
          property,
        }) as string
        return propertyKey ? propertyKey : []
      })

      const filters = getFlattenDatasetFilters(datasetMetadata.filters)
      const timestampFilters = filters.flatMap((filter) =>
        filter.type === 'timestamp' ? (filter.id as DatasetConfigurationProperty) : []
      )
      if (timestampFilters.length > 0) {
        propertiesToDateMillis.push(...timestampFilters)
      }
      propertiesToDateMillis.forEach((propertyKey) => {
        if (cleanedProperties[propertyKey]) {
          const value = cleanedProperties[propertyKey]
          cleanedProperties[propertyKey] = getUTCDateTime(value).toMillis()
        }
      })
      return {
        ...feature,
        properties: getPropertiesIdClean(cleanedProperties),
        geometry:
          (feature.geometry as unknown as GeometryCollection)?.type === 'GeometryCollection'
            ? ({
                type: 'MultiPolygon' as const,
                coordinates: getPolygonsUnion(
                  flatten(feature.geometry).features.flatMap((f) =>
                    f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
                      ? [f.geometry.coordinates as PolygonGeomCoords]
                      : []
                  )
                ),
              } as AreaGeometry)
            : (feature.geometry as AreaGeometry),
      }
    }) as Feature<T, GeoJsonProperties>[],
  }
}
