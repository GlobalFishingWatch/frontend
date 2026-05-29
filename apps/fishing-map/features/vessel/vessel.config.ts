import { RegionType, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { PIPE_DATASET_ID, PIPE_DATASET_VERSION } from '@globalfishingwatch/datasets-client'

import type { VesselProfileState } from './vessel.types'

export const DEFAULT_VESSEL_IDENTITY_DATASET = 'public-global-vessel-identity' as const
export const DEFAULT_VESSEL_IDENTITY_ID =
  `${DEFAULT_VESSEL_IDENTITY_DATASET}:${PIPE_DATASET_ID}` as const
export const RF_VESSEL_IDENTITY_DATASET = 'public-global-vessel-identity-vi-653'
export const RF_VESSEL_IDENTITY_ID = `${RF_VESSEL_IDENTITY_DATASET}:v1.0` as const
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

// TODO review private datasets to ensure there are no missing fields
export const IS_PIPE_4 = PIPE_DATASET_VERSION === ('4' as const)

export const REGIONS_PRIORITY: RegionType[] = [
  RegionType.mpa,
  RegionType.eez,
  RegionType.fao,
  RegionType.rfmo,
]
