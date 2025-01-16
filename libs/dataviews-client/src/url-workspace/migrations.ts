import { EndpointId } from '@globalfishingwatch/api-types'

import {
  ALL_LEGACY_EVENTS_DATASETS_DICT,
  ALL_LEGACY_VESSELS_DATASETS_DICT,
  FULL_VMS_VESSELS_DATASETS,
  PUBLIC_VMS_TRACK_DATASETS,
} from './migrations.config'

export const removeLegacyEndpointPrefix = (endpointId: string) => {
  if (endpointId === 'user-context-tiles') {
    return EndpointId.ContextTiles
  }
  return endpointId?.replace('carriers-', '')
}

export const migrateLegacyVMSPublicDataset = (datasetId: string) => {
  return PUBLIC_VMS_TRACK_DATASETS.some((legacyDataset) => datasetId?.includes(legacyDataset))
    ? datasetId.replace('public-', 'full-')
    : datasetId
}

export const migrateLegacyVMSFullDataset = (datasetId: string) => {
  return FULL_VMS_VESSELS_DATASETS.some((legacyDataset) => datasetId?.includes(legacyDataset))
    ? datasetId.replace('full-', 'public-')
    : datasetId
}

export const migrateLegacyVMSDatasets = (datasetId: string) => {
  return migrateLegacyVMSFullDataset(migrateLegacyVMSPublicDataset(datasetId))
}

export const migrateVesselLegacyDatasets = (datasetId: string) => {
  return ALL_LEGACY_VESSELS_DATASETS_DICT[datasetId] || datasetId
}

export const runDatasetMigrations = (datasetId: string) => {
  return migrateVesselLegacyDatasets(migrateLegacyVMSDatasets(datasetId))
}

export const migrateEventsLegacyDatasets = (datasetId: string) => {
  return ALL_LEGACY_EVENTS_DATASETS_DICT[datasetId] || datasetId
}
