import { RegionType, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getDatasetVersion } from '@globalfishingwatch/datasets-client'
import {
  PIPE_DATASET_ID,
  PIPE_DATASET_VERSION,
} from '@globalfishingwatch/datasets-client/constants'

import type { VesselProfileState } from './vessel.types'

export const DEFAULT_VESSEL_IDENTITY_DATASET = 'public-global-vessel-identity' as const
export const DEFAULT_VESSEL_IDENTITY_ID =
  `${DEFAULT_VESSEL_IDENTITY_DATASET}:${PIPE_DATASET_ID}` as const
export const VESSEL_IDENTITY_ID_V4 = `${DEFAULT_VESSEL_IDENTITY_DATASET}:v4.0` as const
export const VESSEL_IDENTITY_ID_V5 = `${DEFAULT_VESSEL_IDENTITY_DATASET}:v5.0` as const

export const getIsPipe5VesselDataset = (datasetId: string) =>
  getDatasetVersion(datasetId) === 'v5.0'

export const INCLUDES_RELATED_SELF_REPORTED_INFO_ID =
  'POTENTIAL_RELATED_SELF_REPORTED_INFO' as const
export const CACHE_FALSE_PARAM = { id: 'cache', value: 'false' }

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
