import {
  DatasetCategory,
  DatasetConfiguration,
  DatasetGeometryType,
  DatasetTypes,
} from '@globalfishingwatch/api-types'
import { getDatasetSchema, guessColumnsFromSchema } from '@globalfishingwatch/data-transforms'
import { FileType } from 'utils/files'

export type ExtractMetadataProps = { name: string; sourceFormat?: FileType; data: any }

export const getTracksDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
  const schema = getDatasetSchema(data, { includeEnum: true })
  const guessedColumns = guessColumnsFromSchema(schema)
  return {
    name,
    public: true,
    type: DatasetTypes.UserTracks,
    category: DatasetCategory.Environment,
    schema,
    configuration: {
      configurationUI: {
        sourceFormat,
        latitude: guessedColumns.latitude,
        longitude: guessedColumns.longitude,
        timestamp: guessedColumns.timestamp,
        geometryType: 'tracks' as DatasetGeometryType,
      },
    } as DatasetConfiguration,
  }
}

export const getPointsDatasetMetadata = ({ name, data }: ExtractMetadataProps) => {
  const schema = getDatasetSchema(data, { includeEnum: true })
  const isNotGeoStandard = data.type !== 'FeatureCollection'
  const guessedColumns = guessColumnsFromSchema(schema)
  return {
    name,
    public: true,
    type: DatasetTypes.UserContext,
    category: DatasetCategory.Context,
    schema,
    configuration: {
      format: 'geojson',
      configurationUI: {
        ...(isNotGeoStandard && { longitude: guessedColumns.longitude }),
        ...(isNotGeoStandard && { latitude: guessedColumns.latitude }),
        timestamp: guessedColumns.timestamp,
        geometryType: 'points' as DatasetGeometryType,
      },
    } as DatasetConfiguration,
  }
}
