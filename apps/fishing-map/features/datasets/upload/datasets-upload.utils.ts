import {
  Dataset,
  DatasetCategory,
  DatasetConfiguration,
  DatasetGeometryType,
  DatasetTypes,
} from '@globalfishingwatch/api-types'
import { getDatasetSchema, guessColumnsFromSchema } from '@globalfishingwatch/data-transforms'
import { isPrivateDataset } from 'features/datasets/datasets.utils'
import { DatasetMetadata } from 'features/datasets/upload/NewDataset'
import { FileType } from 'utils/files'

export type ExtractMetadataProps = { name: string; sourceFormat?: FileType; data: any }

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

export const getBaseDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
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
  }
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
        geometryType: 'tracks' as DatasetGeometryType,
      },
    } as DatasetConfiguration,
  }
}

export const getPointsDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
  const baseMetadata = getBaseDatasetMetadata({ name, data, sourceFormat })
  const guessedColumns = guessColumnsFromSchema(baseMetadata.schema)
  const isNotGeoStandard = data.type !== 'FeatureCollection'
  return {
    ...baseMetadata,
    configuration: {
      format: 'geojson',
      configurationUI: {
        sourceFormat,
        ...(isNotGeoStandard && { longitude: guessedColumns.longitude }),
        ...(isNotGeoStandard && { latitude: guessedColumns.latitude }),
        timestamp: guessedColumns.timestamp,
        geometryType: 'points' as DatasetGeometryType,
      },
    } as DatasetConfiguration,
  }
}

export const getPolygonsDatasetMetadata = ({ name, data, sourceFormat }: ExtractMetadataProps) => {
  const baseMetadata = getBaseDatasetMetadata({ name, data, sourceFormat })
  const guessedColumns = guessColumnsFromSchema(baseMetadata.schema)
  return {
    ...baseMetadata,
    configuration: {
      format: 'geojson',
      configurationUI: {
        sourceFormat,
        timestamp: guessedColumns.timestamp,
        geometryType: 'polygons' as DatasetGeometryType,
      },
    } as DatasetConfiguration,
  }
}
