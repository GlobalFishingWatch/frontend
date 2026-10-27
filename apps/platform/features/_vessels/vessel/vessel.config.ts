import type { Dataset, DatasetsMigration } from '@globalfishingwatch/api-types'
import { RegionType, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getDatasetVersion } from '@globalfishingwatch/datasets-client'
import { PIPE_DATASET_ID } from '@globalfishingwatch/datasets-client/constants'

import type { VesselProfileState } from './vessel.types'

export const DEFAULT_VESSEL_IDENTITY_DATASET = 'public-global-vessel-identity' as const
export const DEFAULT_VESSEL_IDENTITY_ID =
  `${DEFAULT_VESSEL_IDENTITY_DATASET}:${PIPE_DATASET_ID}` as const
export const VESSEL_IDENTITY_ID_V4 = `${DEFAULT_VESSEL_IDENTITY_DATASET}:v4.0` as const
export const VESSEL_IDENTITY_ID_V5 = `${DEFAULT_VESSEL_IDENTITY_DATASET}:v5.0` as const

export const getIsPipe5VesselDataset = (datasetId: string) =>
  getDatasetVersion(datasetId) === 'v5.0'

// Vessel datasets deprecated by the API whose vessel ids are kept in the new version,
// so they can be switched in place (true for pipe 4 → 5).
// Returns the latest dataset id, or undefined when the dataset is already the latest one:
// aliased as `:latest` in the dataview datasets, otherwise not reported as deprecated by the API
// (ie: vessel groups only have the ids). VMS datasets are still in v4.0 and are the latest ones.
export const getVesselLatestDatasetId = (
  datasetId: string,
  deprecatedDatasets: DatasetsMigration,
  datasets: Dataset[] = []
) => {
  if (!datasetId) {
    return
  }
  const dataset = datasets.find((d) => d.id === datasetId)
  if (dataset?.alias?.some((alias) => alias.endsWith(':latest'))) {
    return
  }
  return deprecatedDatasets[datasetId]
}

export const INCLUDES_RELATED_SELF_REPORTED_INFO_ID =
  'POTENTIAL_RELATED_SELF_REPORTED_INFO' as const

export const DEFAULT_VESSEL_STATE: VesselProfileState = {
  vesselDatasetId: DEFAULT_VESSEL_IDENTITY_ID,
  vesselRegistryId: undefined,
  vesselSelfReportedId: undefined,
  vesselIdentitySource: VesselIdentitySourceEnum.Registry,
  vesselActivityMode: 'type',
  vesselSection: 'activity',
  vesselArea: 'eez',
  vesselRelated: 'encounters',
  includeRelatedIdentities: true,
}

export const REGIONS_PRIORITY: RegionType[] = [
  RegionType.mpa,
  RegionType.eez,
  RegionType.fao,
  RegionType.rfmo,
]
